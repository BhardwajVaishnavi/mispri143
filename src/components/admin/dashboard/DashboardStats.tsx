'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon, ShoppingCartIcon,
  CurrencyDollarIcon, ChartBarIcon
} from '@heroicons/react/24/outline';
import { useQuery } from '@tanstack/react-query';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendDirection: 'up' | 'down';
  icon: React.ElementType;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title, value, trend, trendDirection, icon: Icon, delay
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
    >
      <div className="flex items-center">
        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-300" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <span className={`text-sm font-medium ${
          trendDirection === 'up'
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        }`}>
          {trend}
        </span>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {' vs last month'}
        </span>
      </div>
    </motion.div>
  );
};

interface DashboardData {
  revenue: number;
  orders: number;
  customers: number;
  topProducts: any[];
  salesTrend: any[];
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await fetch('/api/analytics?period=month');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return response.json();
};

export default function DashboardStats() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardData,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Calculate average order value
  const avgOrderValue = data && data.orders > 0
    ? (data.revenue / data.orders).toFixed(2)
    : '0';

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const stats = [
    {
      title: 'Total Customers',
      value: isLoading ? '...' : data?.customers.toLocaleString() || '0',
      trend: '+12.5%', // This would ideally be calculated from historical data
      trendDirection: 'up' as const,
      icon: UserGroupIcon,
    },
    {
      title: 'Total Orders',
      value: isLoading ? '...' : data?.orders.toLocaleString() || '0',
      trend: '+15.3%', // This would ideally be calculated from historical data
      trendDirection: 'up' as const,
      icon: ShoppingCartIcon,
    },
    {
      title: 'Total Revenue',
      value: isLoading ? '...' : formatCurrency(data?.revenue || 0),
      trend: '+8.2%', // This would ideally be calculated from historical data
      trendDirection: 'up' as const,
      icon: CurrencyDollarIcon,
    },
    {
      title: 'Avg. Order Value',
      value: isLoading ? '...' : formatCurrency(parseFloat(avgOrderValue)),
      trend: '-2.1%', // This would ideally be calculated from historical data
      trendDirection: 'down' as const,
      icon: ChartBarIcon,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={stat.title}
          {...stat}
          delay={index * 0.1}
        />
      ))}
    </div>
  );
};