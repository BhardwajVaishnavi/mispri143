'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface StoreComparisonChartProps {
  dateRange: { from: Date | null; to: Date | null };
  isLoading: boolean;
}

interface StoreData {
  name: string;
  sales: number;
  orders: number;
  target: number;
  growth: number;
}

export default function StoreComparisonChart({ dateRange, isLoading }: StoreComparisonChartProps) {
  const [data, setData] = useState<StoreData[]>([]);
  const [metric, setMetric] = useState<'sales' | 'orders' | 'growth'>('sales');

  useEffect(() => {
    // In a real application, you would fetch data from your API
    // For this example, we'll use mock data
    const mockData: StoreData[] = [
      {
        name: 'Store 1',
        sales: 35230,
        orders: 187,
        target: 40000,
        growth: -5.2,
      },
      {
        name: 'Store 2',
        sales: 45230,
        orders: 243,
        target: 42000,
        growth: 12.8,
      },
      {
        name: 'Store 3',
        sales: 38450,
        orders: 201,
        target: 35000,
        growth: 18.5,
      },
      {
        name: 'Store 4',
        sales: 28750,
        orders: 156,
        target: 30000,
        growth: 8.2,
      },
      {
        name: 'Store 5',
        sales: 32100,
        orders: 178,
        target: 32000,
        growth: 2.5,
      },
    ];
    
    setData(mockData);
  }, [dateRange]);

  const formatYAxis = (value: number) => {
    if (metric === 'sales') {
      return `₹${value / 1000}k`;
    } else if (metric === 'growth') {
      return `${value}%`;
    }
    return value;
  };

  const formatTooltip = (value: number, name: string) => {
    if (name === 'sales') {
      return [`₹${value.toLocaleString()}`, 'Sales'];
    } else if (name === 'growth') {
      return [`${value}%`, 'Growth'];
    } else if (name === 'target') {
      return [`₹${value.toLocaleString()}`, 'Target'];
    }
    return [value, name];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              metric === 'sales'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-200 rounded-l-lg`}
            onClick={() => setMetric('sales')}
          >
            Sales
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              metric === 'orders'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border-t border-b border-gray-200`}
            onClick={() => setMetric('orders')}
          >
            Orders
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              metric === 'growth'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-200 rounded-r-lg`}
            onClick={() => setMetric('growth')}
          >
            Growth
          </button>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={formatYAxis} />
            <Tooltip formatter={formatTooltip} />
            <Legend />
            {metric === 'sales' && (
              <>
                <Bar dataKey="sales" fill="#8884d8" name="Sales" />
                <ReferenceLine y={0} stroke="#000" />
                <Bar dataKey="target" fill="#82ca9d" name="Target" />
              </>
            )}
            {metric === 'orders' && (
              <Bar dataKey="orders" fill="#8884d8" name="Orders" />
            )}
            {metric === 'growth' && (
              <>
                <ReferenceLine y={0} stroke="#000" />
                <Bar 
                  dataKey="growth" 
                  fill={(entry) => (entry.growth >= 0 ? '#82ca9d' : '#ff8042')}
                  name="Growth %" 
                />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
