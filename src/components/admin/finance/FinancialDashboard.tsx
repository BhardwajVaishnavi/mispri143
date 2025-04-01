import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export const FinancialDashboard = () => {
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [reportType, setReportType] = useState('revenue');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold">₹1,234,567</p>
          <p className="text-sm text-green-600">+12.5% from last month</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Expenses</h3>
          <p className="text-3xl font-bold">₹234,567</p>
          <p className="text-sm text-red-600">+2.5% from last month</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Net Profit</h3>
          <p className="text-3xl font-bold">₹1,000,000</p>
          <p className="text-sm text-green-600">+15.5% from last month</p>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Financial Reports</h2>
          <div className="flex gap-4">
            <Select
              value={reportType}
              onValueChange={(value) => setReportType(value)}
            >
              <option value="revenue">Revenue</option>
              <option value="expenses">Expenses</option>
              <option value="profit">Profit</option>
            </Select>
            <Button>Download Report</Button>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={[/* Your data here */]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Expenses</h3>
          <div className="space-y-4">
            {/* Add expense items here */}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue by Category</h3>
          <div className="space-y-4">
            {/* Add revenue categories here */}
          </div>
        </Card>
      </div>
    </div>
  );
};