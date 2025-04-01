'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WebSocketService } from '@/lib/services/websocket.service';
import { Card } from '@/components/ui/card';
import { LineChart, BarChart } from '@/components/ui/charts';

interface RealTimeMetrics {
  activeUsers: number;
  salesToday: number;
  conversionRate: number;
  averageOrderValue: number;
  realtimeSales: Array<{ timestamp: string; value: number }>;
}

export const RealTimeAnalytics = () => {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeUsers: 0,
    salesToday: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    realtimeSales: [],
  });

  useEffect(() => {
    const handleUpdate = (data: RealTimeMetrics) => {
      setMetrics(prev => ({
        ...prev,
        ...data,
        realtimeSales: [
          ...prev.realtimeSales,
          ...(data.realtimeSales || []),
        ].slice(-30), // Keep last 30 data points
      }));
    };

    WebSocketService.subscribe('analytics', handleUpdate);
    return () => {
      WebSocketService.unsubscribe('analytics', handleUpdate);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-4">
              <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
              <p className="text-2xl font-bold">{metrics.activeUsers}</p>
            </Card>
          </motion.div>
          {/* Similar cards for other metrics */}
        </AnimatePresence>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Real-time Sales</h3>
        <div className="h-[300px]">
          <LineChart
            data={metrics.realtimeSales}
            xAxis="timestamp"
            yAxis="value"
            animate={true}
          />
        </div>
      </Card>
    </div>
  );
};