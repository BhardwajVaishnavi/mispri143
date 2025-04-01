'use client';

import { useState } from 'react';
import { DateTime } from 'luxon';
import { DataTable } from '@/components/admin/common/DataTable';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from '@heroicons/react/24/outline';
import { exportToCSV } from '@/utils/exportData';

interface StockMovement {
  id: string;
  type: string;
  quantity: number;
  date: string;
  productName: string;
  storeName: string;
  performedBy: string;
  notes?: string;
}

export default function StockMovementHistory() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
  const [movementType, setMovementType] = useState<string>('');
  const [store, setStore] = useState<string>('');

  const columns = [
    { 
      key: 'date',
      label: 'Date',
      render: (movement: StockMovement) => 
        DateTime.fromISO(movement.date).toFormat('dd LLL yyyy HH:mm')
    },
    { key: 'type', label: 'Type' },
    { key: 'productName', label: 'Product' },
    { key: 'storeName', label: 'Store' },
    { 
      key: 'quantity',
      label: 'Quantity',
      render: (movement: StockMovement) => (
        <span className={movement.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
        </span>
      )
    },
    { key: 'performedBy', label: 'Performed By' },
    { key: 'notes', label: 'Notes' },
  ];

  const handleExport = () => {
    // Add your export logic here
    exportToCSV([], 'stock-movements.csv');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <h2 className="text-xl font-semibold">Stock Movement History</h2>
        <Button
          onClick={handleExport}
          variant="outline"
          className="flex items-center gap-2"
        >
          <DownloadIcon className="h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
          placeholder="Select date range"
        />
        
        <Select
          value={movementType}
          onChange={(e) => setMovementType(e.target.value)}
        >
          <option value="">All Movement Types</option>
          <option value="PURCHASE">Purchase</option>
          <option value="SALE">Sale</option>
          <option value="TRANSFER_IN">Transfer In</option>
          <option value="TRANSFER_OUT">Transfer Out</option>
          <option value="ADJUSTMENT">Adjustment</option>
        </Select>

        <Select
          value={store}
          onChange={(e) => setStore(e.target.value)}
        >
          <option value="">All Stores</option>
          {/* Add your store options here */}
        </Select>
      </div>

      <DataTable
        data={[]} // Add your filtered movement data here
        columns={columns}
        itemsPerPage={10}
      />
    </div>
  );
}