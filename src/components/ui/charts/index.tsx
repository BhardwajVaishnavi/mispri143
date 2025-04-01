'use client';

import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartProps {
  data: Array<any>;
  xAxis: string;
  yAxis: string;
  categories?: string[];
  animate?: boolean;
  height?: number;
}

export const LineChart: React.FC<ChartProps> = ({
  data,
  xAxis,
  yAxis,
  categories,
  animate = true,
  height = 300
}) => {
  const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxis}
          tick={{ fill: '#6b7280' }}
          tickLine={{ stroke: '#6b7280' }}
        />
        <YAxis
          tick={{ fill: '#6b7280' }}
          tickLine={{ stroke: '#6b7280' }}
        />
        <Tooltip />
        <Legend />
        {categories ? (
          categories.map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={colors[index % colors.length]}
              strokeWidth={2}
              dot={{ r: 4 }}
              animationDuration={animate ? 1500 : 0}
            />
          ))
        ) : (
          <Line
            type="monotone"
            dataKey={yAxis}
            stroke={colors[0]}
            strokeWidth={2}
            dot={{ r: 4 }}
            animationDuration={animate ? 1500 : 0}
          />
        )}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export const BarChart: React.FC<ChartProps> = ({
  data,
  xAxis,
  yAxis,
  categories,
  animate = true,
  height = 300
}) => {
  const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxis}
          tick={{ fill: '#6b7280' }}
          tickLine={{ stroke: '#6b7280' }}
        />
        <YAxis
          tick={{ fill: '#6b7280' }}
          tickLine={{ stroke: '#6b7280' }}
        />
        <Tooltip />
        <Legend />
        {categories ? (
          categories.map((category, index) => (
            <Bar
              key={category}
              dataKey={category}
              fill={colors[index % colors.length]}
              animationDuration={animate ? 1500 : 0}
            />
          ))
        ) : (
          <Bar
            dataKey={yAxis}
            fill={colors[0]}
            animationDuration={animate ? 1500 : 0}
          />
        )}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};