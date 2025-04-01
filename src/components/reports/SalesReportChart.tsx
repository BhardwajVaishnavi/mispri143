'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface SalesReportChartProps {
  dateRange: { from: Date | null; to: Date | null };
  storeId: string;
  isLoading: boolean;
}

interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

export default function SalesReportChart({ dateRange, storeId, isLoading }: SalesReportChartProps) {
  const [data, setData] = useState<SalesData[]>([]);

  useEffect(() => {
    // In a real application, you would fetch data from your API
    // For this example, we'll generate mock data
    const generateMockData = () => {
      const mockData: SalesData[] = [];
      const startDate = dateRange.from || new Date(new Date().setDate(new Date().getDate() - 30));
      const endDate = dateRange.to || new Date();
      
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        // Generate random sales data
        const sales = Math.floor(Math.random() * 10000) + 1000;
        const orders = Math.floor(Math.random() * 50) + 10;
        
        mockData.push({
          date: currentDate.toISOString().split('T')[0],
          sales,
          orders
        });
        
        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      return mockData;
    };
    
    setData(generateMockData());
  }, [dateRange, storeId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="h-96">
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
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
          />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip 
            formatter={(value, name) => {
              if (name === 'sales') return [`₹${value}`, 'Sales'];
              return [value, 'Orders'];
            }}
          />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="sales"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name="Sales (₹)"
          />
          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="orders" 
            stroke="#82ca9d" 
            name="Orders"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
