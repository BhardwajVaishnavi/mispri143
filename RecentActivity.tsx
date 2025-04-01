'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import {
  ShoppingCartIcon,
  UserIcon,
  CurrencyDollarIcon,
  TruckIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

interface ActivityProps {
  className?: string;
}

interface ActivityUser {
  id: string;
  name: string;
  role: string;
}

interface ActivityItem {
  id: string;
  type: 'order' | 'user' | 'payment' | 'shipping' | 'inventory' | 'other';
  message: string;
  timestamp: string;
  user?: ActivityUser;
}

// Mock API call
const fetchRecentActivity = async (): Promise<ActivityItem[]> => {
  // In a real app, this would be an API call
  return [
    {
      id: '1',
      type: 'order',
      message: 'New order #12345 received',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      user: {
        id: 'u1',
        name: 'System',
        role: 'system',
      },
    },
    {
      id: '2',
      type: 'payment',
      message: 'Payment of ₹1,299 received for order #12345',
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 minutes ago
      user: {
        id: 'u2',
        name: 'Payment Gateway',
        role: 'system',
      },
    },
    {
      id: '3',
      type: 'shipping',
      message: 'Order #12340 marked as delivered',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      user: {
        id: 'u3',
        name: 'John Doe',
        role: 'admin',
      },
    },
    {
      id: '4',
      type: 'inventory',
      message: 'Inventory updated for "Red Roses Bouquet"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      user: {
        id: 'u4',
        name: 'Jane Smith',
        role: 'inventory',
      },
    },
    {
      id: '5',
      type: 'user',
      message: 'New user registered: customer@example.com',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
  ];
};

// Helper function to get icon based on activity type
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'order':
      return <ShoppingCartIcon className="h-5 w-5 text-blue-500" />;
    case 'user':
      return <UserIcon className="h-5 w-5 text-green-500" />;
    case 'payment':
      return <CurrencyDollarIcon className="h-5 w-5 text-yellow-500" />;
    case 'shipping':
      return <TruckIcon className="h-5 w-5 text-purple-500" />;
    case 'inventory':
      return <DocumentTextIcon className="h-5 w-5 text-pink-500" />;
    default:
      return <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />;
  }
};

// Format time ago
const formatTimeAgo = (timestamp: string) => {
  const activityTime = new Date(timestamp);
  const now = new Date();
  const diffInHours = (now.getTime() - activityTime.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return formatDistanceToNow(activityTime, { addSuffix: true });
  }

  return format(activityTime, 'MMM dd, h:mm a');
};

function RecentActivity({ className }: ActivityProps) {
  const { data, isLoading } = useQuery<ActivityItem[]>({
    queryKey: ['recent-activity'],
    queryFn: fetchRecentActivity,
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });

  return (
    <Card className={`p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-shrink-0 p-2 rounded-full bg-gray-100">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.message}
                </p>
                <div className="flex items-center mt-1">
                  {activity.user && (
                    <span className="text-xs text-gray-500 mr-2">
                      by {activity.user.name}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(activity.timestamp)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default RecentActivity;
