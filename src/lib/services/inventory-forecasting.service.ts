import prisma from '@/lib/prisma';
import { DateTime } from 'luxon';

interface ForecastParams {
  productId: string;
  storeId: string;
  periodDays: number;
  confidenceLevel?: number;
}

interface ForecastResult {
  expectedDemand: number;
  upperBound: number;
  lowerBound: number;
  recommendedOrder: number;
  stockoutProbability: number;
}

export class InventoryForecastingService {
  static async generateForecast({
    productId,
    storeId,
    periodDays,
    confidenceLevel = 0.95
  }: ForecastParams): Promise<ForecastResult> {
    const movements = await prisma.stockMovement.findMany({
      where: {
        inventory: {
          productId,
          storeId,
        },
        type: 'SALE',
        date: {
          gte: DateTime.now().minus({ days: 90 }).toJSDate(),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    const dailyDemand = this.calculateDailyDemand(movements);
    const forecast = this.exponentialSmoothing(dailyDemand, periodDays);
    const standardError = this.calculateStandardError(dailyDemand);
    const zScore = this.getZScore(confidenceLevel);
    
    const upperBound = forecast.expectedDemand + (zScore * standardError);
    const lowerBound = Math.max(0, forecast.expectedDemand - (zScore * standardError));

    const recommendedOrder = await this.calculateRecommendedOrder(
      forecast.expectedDemand,
      upperBound,
      productId,
      storeId
    );

    return {
      ...forecast,
      upperBound,
      lowerBound,
      recommendedOrder: Math.ceil(recommendedOrder), // Ensure it's a whole number
      stockoutProbability: this.calculateStockoutProbability(forecast, standardError),
    };
  }

  private static calculateDailyDemand(movements: any[]): number[] {
    // Group movements by date and sum quantities
    const dailyTotals = new Map<string, number>();
    
    movements.forEach(movement => {
      // Ensure date is not null before converting to string
      if (movement.date) {
        const dateKey = DateTime.fromJSDate(movement.date).toISODate() || '';
        const current = dailyTotals.get(dateKey) || 0;
        dailyTotals.set(dateKey, current + Math.abs(movement.quantity));
      }
    });

    return Array.from(dailyTotals.values());
  }

  private static exponentialSmoothing(
    data: number[],
    forecastPeriod: number,
    alpha = 0.3
  ): { expectedDemand: number; trend: number } {
    if (data.length === 0) return { expectedDemand: 0, trend: 0 };

    let level = data[0];
    let trend = 0;

    // Calculate initial trend
    if (data.length > 1) {
      trend = (data[1] - data[0]);
    }

    // Apply exponential smoothing
    for (let i = 1; i < data.length; i++) {
      const oldLevel = level;
      level = alpha * data[i] + (1 - alpha) * (level + trend);
      trend = 0.1 * (level - oldLevel) + 0.9 * trend;
    }

    // Calculate forecast
    const expectedDemand = level + trend * forecastPeriod;
    return { expectedDemand: Math.max(0, expectedDemand), trend };
  }

  private static calculateStandardError(data: number[]): number {
    if (data.length < 2) return 0;
    const mean = this.calculateMean(data);
    const squaredDiffs = data.map(x => Math.pow(x - mean, 2));
    return Math.sqrt(this.calculateMean(squaredDiffs));
  }

  private static calculateMean(data: number[]): number {
    return data.length ? data.reduce((a, b) => a + b) / data.length : 0;
  }

  private static calculateStandardDeviation(data: number[]): number {
    return Math.sqrt(this.calculateStandardError(data));
  }

  private static getZScore(confidenceLevel: number): number {
    const zScores: Record<number, number> = {
      0.90: 1.645,
      0.95: 1.96,
      0.99: 2.576,
    };
    return zScores[confidenceLevel] || 1.96;
  }

  private static async calculateRecommendedOrder(
    expectedDemand: number,
    upperBound: number,
    productId: string,
    storeId: string,
  ): Promise<number> {
    const inventory = await prisma.inventory.findFirst({
      where: { productId, storeId },
      include: { product: true },
    });

    if (!inventory) return expectedDemand;

    const currentStock = inventory.quantity;
    const safetyStock = (upperBound - expectedDemand) * 0.5;
    
    return Math.max(0, expectedDemand + safetyStock - currentStock);
  }

  private static calculateStockoutProbability(
    forecast: { expectedDemand: number },
    standardError: number
  ): number {
    if (standardError === 0) return 0;
    const zScore = forecast.expectedDemand / standardError;
    // Using approximation of normal CDF
    return 1 / (1 + Math.exp(-(zScore * -0.07056 + zScore * zScore * -0.02041)));
  }

  static async optimizeStockLevels({
    productId,
    storeId,
    historicalPeriodDays = 180,
    targetServiceLevel = 0.95
  }: {
    productId: string;
    storeId: string;
    historicalPeriodDays?: number;
    targetServiceLevel?: number;
  }): Promise<{
    optimizedMinStock: number;
    optimizedMaxStock: number;
    optimizedReorderPoint: number;
    optimizedReorderQuantity: number;
    safetyStock: number;
  }> {
    const movements = await prisma.stockMovement.findMany({
      where: {
        inventory: { productId, storeId },
        type: 'SALE',
        date: {
          gte: DateTime.now().minus({ days: historicalPeriodDays }).toJSDate(),
        },
      },
      orderBy: { date: 'asc' },
    });

    const dailyDemand = this.calculateDailyDemand(movements);
    const avgDemand = this.calculateMean(dailyDemand);
    const stdDevDemand = this.calculateStandardDeviation(dailyDemand);
    
    const zScore = this.getZScore(targetServiceLevel);
    const safetyStock = Math.ceil(zScore * stdDevDemand);
    
    const inventory = await prisma.inventory.findFirst({
      where: { productId, storeId },
      select: {
        unitCost: true,
      },
    });
    
    // Default values for ordering and holding costs
    const orderingCost = 20; // default $20 per order
    const holdingCostRate = 0.2; // default 20% of unit cost per year
    const unitCost = Number(inventory?.unitCost || 0);
    
    const annualDemand = avgDemand * 365;
    const holdingCost = unitCost * holdingCostRate;
    
    const eoq = Math.ceil(Math.sqrt(
      (2 * annualDemand * orderingCost) / holdingCost
    ));

    return {
      optimizedMinStock: safetyStock,
      optimizedMaxStock: safetyStock + eoq,
      optimizedReorderPoint: Math.ceil(avgDemand * 7 + safetyStock), // 7-day lead time
      optimizedReorderQuantity: eoq,
      safetyStock
    };
  }
}