import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week'; // week, month, year
    
    const date = new Date();
    let startDate = new Date();
    
    switch(period) {
      case 'week':
        startDate.setDate(date.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(date.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(date.getFullYear() - 1);
        break;
    }

    const [
      totalRevenue,
      orderCount,
      customerCount,
      topProducts,
      salesByDate
    ] = await Promise.all([
      // Total revenue
      prisma.order.aggregate({
        where: {
          createdAt: { gte: startDate },
          status: OrderStatus.DELIVERED
        },
        _sum: { totalAmount: true }
      }),

      // Order count
      prisma.order.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),

      // Customer count
      prisma.customer.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),

      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            createdAt: { gte: startDate },
            status: OrderStatus.DELIVERED
          }
        },
        _sum: {
          quantity: true,
          price: true
        },
        take: 5,
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        }
      }),

      // Sales by date
      prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: { gte: startDate },
          status: OrderStatus.DELIVERED
        },
        _sum: {
          totalAmount: true
        }
      })
    ]);

    return NextResponse.json({
      revenue: totalRevenue._sum.totalAmount ?? 0,
      orders: orderCount,
      customers: customerCount,
      topProducts,
      salesTrend: salesByDate
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

