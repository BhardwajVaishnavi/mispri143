'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface TopProductsProps {
  className?: string;
}

interface ProductData {
  id: string;
  name: string;
  quantity: number;
  revenue: number;
}

const fetchTopProducts = async (): Promise<ProductData[]> => {
  const response = await fetch('/api/analytics/top-products');
  if (!response.ok) {
    throw new Error('Failed to fetch top products');
  }

  const data = await response.json();

  // For demo purposes, if the API isn't implemented yet, return mock data
  if (!data || data.length === 0) {
    return generateMockData();
  }

  return data;
};

// Generate mock data for demonstration
const generateMockData = (): ProductData[] => {
  return [
    { id: '1', name: 'Premium Gift Box', quantity: 124, revenue: 6200 },
    { id: '2', name: 'Birthday Special', quantity: 98, revenue: 4900 },
    { id: '3', name: 'Anniversary Bundle', quantity: 85, revenue: 5950 },
    { id: '4', name: 'Corporate Gift Set', quantity: 72, revenue: 7200 },
    { id: '5', name: 'Holiday Package', quantity: 65, revenue: 3250 },
  ];
};

const TopProducts = ({ className }: TopProductsProps) => {
  const { data, isLoading } = useQuery<ProductData[]>({
    queryKey: ['top-products'],
    queryFn: fetchTopProducts,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  // Format currency
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
      <h2 className="text-xl font-semibold mb-6">Top Selling Products</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="h-64">
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
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'revenue') return [formatCurrency(value), 'Revenue'];
                    return [value, 'Quantity Sold'];
                  }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="quantity" fill="#8884d8" name="Quantity Sold" />
                <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Product Details</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity Sold
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(product.revenue)}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TopProducts;
