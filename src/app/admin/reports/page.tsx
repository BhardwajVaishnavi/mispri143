'use client';

import { useState } from 'react';
import PageHeader from '@/components/admin/common/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  ArrowDownTrayIcon,
  PrinterIcon,
  ChartBarIcon,
  ChartPieIcon,
  TableCellsIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import SalesReportChart from '@/components/reports/SalesReportChart';
import InventoryReportTable from '@/components/reports/InventoryReportTable';
import ProductionReportChart from '@/components/reports/ProductionReportChart';
import StoreComparisonChart from '@/components/reports/StoreComparisonChart';
import TopProductsChart from '@/components/reports/TopProductsChart';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState('all');

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = (format: 'pdf' | 'csv' | 'excel') => {
    console.log(`Exporting ${activeTab} report as ${format}`);
    // Implement export functionality
  };

  const headerActions = (
    <>
      <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
        Export Excel
      </Button>
      <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
        <PrinterIcon className="h-4 w-4 mr-2" />
        Print PDF
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        subtitle="View detailed reports and analytics for your business"
        actions={headerActions}
      />

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
        <div className="flex gap-4">
          <select
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            className="flex h-10 w-48 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">All Stores</option>
            <option value="store1">Store 1</option>
            <option value="store2">Store 2</option>
            <option value="store3">Store 3</option>
          </select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="sales" className="flex items-center">
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center">
            <TableCellsIcon className="h-4 w-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="production" className="flex items-center">
            <ChartPieIcon className="h-4 w-4 mr-2" />
            Production
          </TabsTrigger>
          <TabsTrigger value="stores" className="flex items-center">
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Store Comparison
          </TabsTrigger>
        </TabsList>

        {/* Sales Report Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Total Sales</h3>
              <p className="text-3xl font-bold">₹125,430</p>
              <p className="text-sm text-green-600">+12.5% from last period</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Orders</h3>
              <p className="text-3xl font-bold">243</p>
              <p className="text-sm text-green-600">+8.2% from last period</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Average Order Value</h3>
              <p className="text-3xl font-bold">₹516</p>
              <p className="text-sm text-green-600">+4.3% from last period</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
            <SalesReportChart
              dateRange={dateRange}
              storeId={selectedStore}
              isLoading={isLoading}
            />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Top Products</h3>
            <TopProductsChart
              dateRange={dateRange}
              storeId={selectedStore}
              isLoading={isLoading}
            />
          </Card>
        </TabsContent>

        {/* Inventory Report Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Total Products</h3>
              <p className="text-3xl font-bold">1,245</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Low Stock Items</h3>
              <p className="text-3xl font-bold text-amber-500">24</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Out of Stock</h3>
              <p className="text-3xl font-bold text-red-500">8</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Inventory Status</h3>
            <InventoryReportTable
              storeId={selectedStore}
              isLoading={isLoading}
            />
          </Card>
        </TabsContent>

        {/* Production Report Tab */}
        <TabsContent value="production" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Total Production</h3>
              <p className="text-3xl font-bold">856 units</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">In Progress</h3>
              <p className="text-3xl font-bold text-blue-500">42 units</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Completed</h3>
              <p className="text-3xl font-bold text-green-500">814 units</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Production Trend</h3>
            <ProductionReportChart
              dateRange={dateRange}
              isLoading={isLoading}
            />
          </Card>
        </TabsContent>

        {/* Store Comparison Tab */}
        <TabsContent value="stores" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Store Performance Comparison</h3>
            <StoreComparisonChart
              dateRange={dateRange}
              isLoading={isLoading}
            />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Top Performing Store</h3>
              <p className="text-xl font-bold">Store 2</p>
              <p className="text-sm text-gray-500">₹45,230 in sales</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Most Improved</h3>
              <p className="text-xl font-bold">Store 3</p>
              <p className="text-sm text-green-600">+18.5% growth</p>
            </Card>
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-2">Needs Attention</h3>
              <p className="text-xl font-bold">Store 1</p>
              <p className="text-sm text-red-500">-5.2% decline</p>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
