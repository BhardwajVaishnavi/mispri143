'use client'

import { Suspense } from 'react';
import DashboardCharts from '@/components/DashboardCharts';
import DataTable from '@/components/DataTable';
import AnimatedWidget from '@/components/AnimatedWidget';
import ThemeToggle from '@/components/ThemeToggle';
import {
  UserGroupIcon, ShoppingCartIcon,
  CurrencyDollarIcon, ChartBarIcon
} from '@heroicons/react/24/outline';

const tableColumns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

const tableData = [
  { id: 1, date: '2023-01-01', customer: 'John Doe', amount: '$100', status: 'Completed' },
  { id: 2, date: '2023-01-02', customer: 'Jane Smith', amount: '$200', status: 'Pending' },
  // Add more data as needed
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatedWidget
              title="Total Customers"
              value="2,543"
              icon={UserGroupIcon}
              trend="+12.5%"
              trendDirection="up"
            />
            <AnimatedWidget
              title="Total Orders"
              value="1,234"
              icon={ShoppingCartIcon}
              trend="+15.3%"
              trendDirection="up"
            />
            <AnimatedWidget
              title="Total Revenue"
              value="$45,678"
              icon={CurrencyDollarIcon}
              trend="+8.2%"
              trendDirection="up"
            />
            <AnimatedWidget
              title="Avg. Order Value"
              value="$123"
              icon={ChartBarIcon}
              trend="-2.1%"
              trendDirection="down"
            />
          </div>

          <Suspense fallback={<div>Loading charts...</div>}>
            <DashboardCharts />
          </Suspense>

          <div className="admin-card">
            <h2 className="text-lg font-semibold mb-6">Recent Orders</h2>
            <DataTable
              columns={tableColumns}
              data={tableData}
              isLoading={false}
              renderCell={(row, column) => row[column.key]}
              onSort={(key, direction) => {
                console.log('Sorting by', key, direction);
              }}
            />
          </div>
        </div>
      </div>

      <ThemeToggle />
    </div>
  )
}


