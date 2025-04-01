import React from 'react';
import { IconType } from 'react-icons';

interface StatItem {
  title: string;
  value: string | number;
  trend?: {
    value: string;
    isUpward: boolean;
  };
  icon: IconType;
  color?: string;
}

interface StatsGridProps {
  items: StatItem[];
}

const StatsGrid: React.FC<StatsGridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <item.icon
                className={`h-6 w-6 ${item.color || 'text-blue-500'}`}
                aria-hidden="true"
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {item.title}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {item.value}
              </p>
              {item.trend && (
                <p className={`text-sm ${
                  item.trend.isUpward 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {item.trend.isUpward ? '↑' : '↓'} {item.trend.value}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;