'use client';

import { Suspense } from 'react';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import RecentOrders from '@/components/admin/dashboard/RecentOrders';
import SalesTrends from '@/components/admin/dashboard/SalesTrends';
import TopProducts from '@/components/admin/dashboard/TopProducts';
import RecentActivity from '@/components/admin/dashboard/RecentActivity';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import InventoryDashboard from '@/components/admin/dashboard/InventoryDashboard';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Stats Cards */}
          <DashboardStats />

          {/* Main Content - First Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SalesTrends className="lg:col-span-2" />
            <QuickActions />
          </div>

          {/* Main Content - Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentOrders className="lg:col-span-2" />
            <RecentActivity />
          </div>

          {/* Main Content - Third Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopProducts />
            <Suspense fallback={<div>Loading inventory...</div>}>
              <InventoryDashboard />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
