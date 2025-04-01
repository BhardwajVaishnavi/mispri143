import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';

interface StoreStats {
  revenue: number;
  orders: number;
  customers: number;
  inventory: number;
}

export const StoreView = () => {
  const [timeRange, setTimeRange] = useState('today');
  const [storeStats, setStoreStats] = useState<StoreStats>({
    revenue: 0,
    orders: 0,
    customers: 0,
    inventory: 0
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Store Dashboard</h1>
        <div className="flex gap-4">
          <Select
            value={timeRange}
            onValueChange={(value) => setTimeRange(value)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </Select>
          <Button>Export Data</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold">₹{storeStats.revenue}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Orders</h3>
          <p className="text-2xl font-bold">{storeStats.orders}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Customers</h3>
          <p className="text-2xl font-bold">{storeStats.customers}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Inventory Items</h3>
          <p className="text-2xl font-bold">{storeStats.inventory}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Order ID</th>
                <th className="text-left p-2">Customer</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {/* Add order rows here */}
            </tbody>
          </table>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Low Stock Items</h3>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Product</th>
                <th className="text-left p-2">Current Stock</th>
                <th className="text-left p-2">Reorder Point</th>
                <th className="text-left p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Add inventory rows here */}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};