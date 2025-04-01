'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface SalesTrendsProps {
  className?: string;
}

interface SalesTrendData {
  date: string;
  revenue: number;
}

const fetchSalesTrends = async (period: string): Promise<SalesTrendData[]> => {
  const response = await fetch(`/api/analytics/trends?period=${period}`);
  if (!response.ok) {
    throw new Error('Failed to fetch sales trends');
  }

  const data = await response.json();

  // For demo purposes, if the API isn't implemented yet, return mock data
  if (!data || data.length === 0) {
    return generateMockData(period);
  }

  return data;
};

// Generate mock data for demonstration
const generateMockData = (period: string): SalesTrendData[] => {
  const data: SalesTrendData[] = [];
  const now = new Date();
  let days = 7;

  switch (period) {
    case 'month':
      days = 30;
      break;
    case 'year':
      days = 12; // 12 months
      break;
    default:
      days = 7; // week
  }

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();

    if (period === 'year') {
      // For yearly data, go back by months
      date.setMonth(now.getMonth() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: Math.floor(Math.random() * 50000) + 10000,
      });
    } else {
      // For weekly or monthly data, go back by days
      date.setDate(now.getDate() - i);
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.floor(Math.random() * 5000) + 1000,
      });
    }
  }

  return data;
};

const SalesTrends = ({ className }: SalesTrendsProps) => {
  const [period, setPeriod] = useState<string>('week');

  const { data, isLoading } = useQuery<SalesTrendData[]>({
    queryKey: ['sales-trends', period],
    queryFn: () => fetchSalesTrends(period),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
  };

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Sales Trends</h2>
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="year">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default SalesTrends;
