'use client';

import { useState } from 'react';
import PageHeader from '@/components/admin/common/PageHeader';
import DataTable, { Column } from '@/components/DataTable';
import {
  PlusIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  status: 'ACTIVE' | 'INACTIVE' | 'VIP' | 'BLOCKED';
  [key: string]: string | number; // Index signature for dynamic access
}

const customerColumns: readonly Column[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'orders', label: 'Orders', sortable: true },
  { key: 'spent', label: 'Total Spent', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions' },
];

const statusColors = {
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  VIP: 'bg-purple-100 text-purple-800',
  BLOCKED: 'bg-red-100 text-red-800',
} as const;

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const headerActions = (
    <>
      <button className="btn-secondary">
        <FunnelIcon className="h-5 w-5 mr-2" />
        Filter
      </button>
      <button className="btn-secondary">
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        Export
      </button>
      <button className="btn-primary">
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Customer
      </button>
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle="Manage your customer base"
        actions={headerActions}
      />

      <div className="admin-card">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full select-input"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="select-input w-48"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="VIP">VIP</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        <DataTable<CustomerRow>
          columns={customerColumns}
          data={[]}
          isLoading={false}
          onSort={(key: string, direction: 'asc' | 'desc') => {
            console.log('Sorting by', key, direction);
          }}
          renderCell={(row: CustomerRow, column: Column) => {
            if (column.key === 'status') {
              return (
                <span className={`px-2 py-1 rounded-full text-xs ${statusColors[row.status]}`}>
                  {row.status}
                </span>
              );
            }
            if (column.key === 'actions') {
              return (
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800">View</button>
                  <button className="text-gray-600 hover:text-gray-800">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              );
            }
            return row[column.key];
          }}
        />
      </div>
    </div>
  );
}

