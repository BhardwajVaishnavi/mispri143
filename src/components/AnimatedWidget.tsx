'use client';

import { motion } from 'framer-motion';

interface AnimatedWidgetProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: string;
  trendDirection?: 'up' | 'down';
}

export default function AnimatedWidget({
  title,
  value,
  icon: Icon,
  trend,
  trendDirection,
}: AnimatedWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="admin-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {title}
          </motion.h3>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15
            }}
            className="mt-2 flex items-baseline"
          >
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
            {trend && (
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className={`ml-2 text-sm ${
                  trendDirection === 'up'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {trend}
                <span className="sr-only">
                  {trendDirection === 'up' ? 'Increased by' : 'Decreased by'}
                </span>
              </motion.p>
            )}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, rotate: -180 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="bg-primary-100 dark:bg-primary-800 p-3 rounded-full"
        >
          <Icon className="h-6 w-6 text-primary-600 dark:text-primary-200" />
        </motion.div>
      </div>
    </motion.div>
  );
}
