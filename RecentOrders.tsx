'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

interface OrdersResponse {
  orders: Order[];
  total: number;
}

// Mock API call
const fetchRecentOrders = async (): Promise<OrdersResponse> => {
  // In a real app, this would be an API call
  return {
    orders: [
      {
        id: 'ORD123456789',
        customer: {
          id: 'CUST123',
          name: 'John Doe',
          email: 'john@example.com',
        },
        totalAmount: 1299,
        status: 'pending',
        createdAt: new Date().toISOString(),
        items: [
          {
            id: 'ITEM1',
            name: 'Red Roses Bouquet',
            quantity: 1,
            price: 1299,
          },
        ],
      },
      {
        id: 'ORD123456788',
        customer: {
          id: 'CUST124',
          name: 'Jane Smith',
          email: 'jane@example.com',
        },
        totalAmount: 899,
        status: 'processing',
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        items: [
          {
            id: 'ITEM2',
            name: 'Chocolate Cake',
            quantity: 1,
            price: 899,
          },
        ],
      },
      {
        id: 'ORD123456787',
        customer: {
          id: 'CUST125',
          name: 'Robert Johnson',
          email: 'robert@example.com',
        },
        totalAmount: 2499,
        status: 'shipped',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        items: [
          {
            id: 'ITEM3',
            name: 'Premium Gift Hamper',
            quantity: 1,
            price: 2499,
          },
        ],
      },
    ],
    total: 3,
  };
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

interface RecentOrdersProps {
  className?: string;
}

function RecentOrders({ className }: RecentOrdersProps) {
  const { data, isLoading, error } = useQuery<OrdersResponse>({
    queryKey: ['recent-orders'],
    queryFn: fetchRecentOrders,
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
    <Card className={`p-6 ${className || ''}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <Link href="/admin/orders">
          <Button variant="outline" size="sm">View All</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">Failed to load recent orders</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.customer.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export default RecentOrders;
