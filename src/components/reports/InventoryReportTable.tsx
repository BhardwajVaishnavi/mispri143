'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface InventoryReportTableProps {
  storeId: string;
  isLoading: boolean;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  lastRestocked: string;
}

export default function InventoryReportTable({ storeId, isLoading }: InventoryReportTableProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [sortField, setSortField] = useState<keyof InventoryItem>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    // In a real application, you would fetch data from your API
    // For this example, we'll use mock data
    const mockInventory: InventoryItem[] = [
      {
        id: '1',
        name: 'Red Roses',
        category: 'Flowers',
        currentStock: 45,
        minStock: 20,
        maxStock: 100,
        status: 'IN_STOCK',
        lastRestocked: '2023-04-01',
      },
      {
        id: '2',
        name: 'Chocolate Cake',
        category: 'Cakes',
        currentStock: 12,
        minStock: 15,
        maxStock: 50,
        status: 'LOW_STOCK',
        lastRestocked: '2023-04-02',
      },
      {
        id: '3',
        name: 'Birthday Card',
        category: 'Cards',
        currentStock: 0,
        minStock: 10,
        maxStock: 100,
        status: 'OUT_OF_STOCK',
        lastRestocked: '2023-03-15',
      },
      {
        id: '4',
        name: 'Gift Basket',
        category: 'Gifts',
        currentStock: 8,
        minStock: 5,
        maxStock: 20,
        status: 'IN_STOCK',
        lastRestocked: '2023-04-05',
      },
      {
        id: '5',
        name: 'White Lilies',
        category: 'Flowers',
        currentStock: 18,
        minStock: 20,
        maxStock: 80,
        status: 'LOW_STOCK',
        lastRestocked: '2023-04-03',
      },
    ];
    
    // Filter by store if needed
    let filteredInventory = mockInventory;
    if (storeId !== 'all') {
      // In a real app, you would filter based on store
      // For this example, we'll just return the mock data
    }
    
    // Sort the inventory
    const sortedInventory = [...filteredInventory].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setInventory(sortedInventory);
  }, [storeId, sortField, sortDirection]);

  const handleSort = (field: keyof InventoryItem) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: InventoryItem['status']) => {
    switch (status) {
      case 'IN_STOCK':
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
      case 'LOW_STOCK':
        return <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
      case 'OUT_OF_STOCK':
        return <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>;
      default:
        return null;
    }
  };

  const getSortIcon = (field: keyof InventoryItem) => {
    if (field !== sortField) return null;
    
    return sortDirection === 'asc' ? (
      <ArrowUpIcon className="h-4 w-4 ml-1" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 ml-1" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center">
                Product Name
                {getSortIcon('name')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('category')}
            >
              <div className="flex items-center">
                Category
                {getSortIcon('category')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('currentStock')}
            >
              <div className="flex items-center">
                Current Stock
                {getSortIcon('currentStock')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Min/Max
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center">
                Status
                {getSortIcon('status')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('lastRestocked')}
            >
              <div className="flex items-center">
                Last Restocked
                {getSortIcon('lastRestocked')}
              </div>
            </th>
            <th 
              scope="col" 
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {inventory.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{item.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{item.category}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{item.currentStock}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{item.minStock} / {item.maxStock}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(item.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">
                  {new Date(item.lastRestocked).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="outline" size="sm">Restock</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
