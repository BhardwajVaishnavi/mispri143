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
  ResponsiveContainer
} from 'recharts';

interface ProductionReportChartProps {
  dateRange: { from: Date | null; to: Date | null };
  isLoading: boolean;
}

interface ProductionData {
  date: string;
  planned: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export default function ProductionReportChart({ dateRange, isLoading }: ProductionReportChartProps) {
  const [data, setData] = useState<ProductionData[]>([]);

  useEffect(() => {
    // In a real application, you would fetch data from your API
    // For this example, we'll generate mock data
    const generateMockData = () => {
      const mockData: ProductionData[] = [];
      const startDate = dateRange.from || new Date(new Date().setDate(new Date().getDate() - 30));
      const endDate = dateRange.to || new Date();
      
      // For simplicity, we'll generate weekly data instead of daily
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        // Generate random production data
        const planned = Math.floor(Math.random() * 30) + 10;
        const inProgress = Math.floor(Math.random() * 20) + 5;
        const completed = Math.floor(Math.random() * 40) + 20;
        const cancelled = Math.floor(Math.random() * 5);
        
        mockData.push({
          date: currentDate.toISOString().split('T')[0],
          planned,
          inProgress,
          completed,
          cancelled
        });
        
        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7);
      }
      
      return mockData;
    };
    
    setData(generateMockData());
  }, [dateRange]);

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
        <BarChart
          data={data}
          margin={{
            top: 20,
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
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="planned" stackId="a" fill="#8884d8" name="Planned" />
          <Bar dataKey="inProgress" stackId="a" fill="#82ca9d" name="In Progress" />
          <Bar dataKey="completed" stackId="a" fill="#ffc658" name="Completed" />
          <Bar dataKey="cancelled" stackId="a" fill="#ff8042" name="Cancelled" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
