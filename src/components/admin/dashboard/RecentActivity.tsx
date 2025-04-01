'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import {
  ShoppingCartIcon, UserIcon, TruckIcon,
  CubeIcon, BanknotesIcon
} from '@heroicons/react/24/outline';

interface ActivityProps {
  className?: string;
}

interface ActivityItem {
  id: string;
  type: 'order' | 'customer' | 'inventory' | 'product' | 'payment';
  message: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

const fetchRecentActivity = async (): Promise<ActivityItem[]> => {
  try {
    const response = await fetch('/api/activity');
    if (!response.ok) {
      throw new Error('Failed to fetch activity');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching activity:', error);
    // Return mock data for demonstration
    return generateMockData();
  }
};

// Generate mock data for demonstration
const generateMockData = (): ActivityItem[] => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'order',
      message: 'New order #12345 received',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
      user: {
        name: 'John Smith',
      },
    },
    {
      id: '2',
      type: 'customer',
      message: 'New customer registered',
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
      user: {
        name: 'Emily Johnson',
      },
    },
    {
      id: '3',
      type: 'inventory',
      message: 'Inventory updated for Premium Gift Box',
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
      user: {
        name: 'Admin User',
      },
    },
    {
      id: '4',
      type: 'payment',
      message: 'Payment received for order #12340',
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
    },
    {
      id: '5',
      type: 'product',
      message: 'New product "Holiday Special" added',
      timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
      user: {
        name: 'Admin User',
      },
    },
  ];

  return activities;
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'order':
      return <ShoppingCartIcon className="h-5 w-5 text-blue-500" />;
    case 'customer':
      return <UserIcon className="h-5 w-5 text-green-500" />;
    case 'inventory':
      return <TruckIcon className="h-5 w-5 text-yellow-500" />;
    case 'product':
      return <CubeIcon className="h-5 w-5 text-purple-500" />;
    case 'payment':
      return <BanknotesIcon className="h-5 w-5 text-emerald-500" />;
    default:
      return <ShoppingCartIcon className="h-5 w-5 text-gray-500" />;
  }
};

const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / 60000);

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  return format(activityTime, 'MMM dd, h:mm a');
};

export default function RecentActivity({ className }: ActivityProps) {
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
};

export default RecentActivity;
