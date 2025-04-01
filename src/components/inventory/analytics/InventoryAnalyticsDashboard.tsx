'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { LineChart, BarChart } from '@/components/ui/charts';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { StockValueMetric } from './StockValueMetric';
import { TurnoverRateCard } from './TurnoverRateCard';
import { StockoutAnalysis } from './StockoutAnalysis';

export default function InventoryAnalyticsDashboard() {
  const [timeframe, setTimeframe] = useState('30');
  const [storeId, setStoreId] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Analytics</h2>
        <div className="flex gap-4">
          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-40"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </Select>
          <Select
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            className="w-48"
          >
            <option value="all">All Stores</option>
            {/* Add store options */}
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4">
          <StockValueMetric timeframe={timeframe} storeId={storeId} />
        </Card>
        <Card className="p-4">
          <TurnoverRateCard timeframe={timeframe} storeId={storeId} />
        </Card>
        <Card className="p-4">
          <StockoutAnalysis timeframe={timeframe} storeId={storeId} />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Stock Level Trends</h3>
          <LineChart
            data={[]} // Add your stock level data
            xAxis="date"
            yAxis="quantity"
            categories={['Current Stock', 'Minimum Stock', 'Maximum Stock']}
          />
        </Card>
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Top Moving Products</h3>
          <BarChart
            data={[]} // Add your product movement data
            xAxis="product"
            yAxis="movements"
          />
        </Card>
      </div>
    </div>
  );
}