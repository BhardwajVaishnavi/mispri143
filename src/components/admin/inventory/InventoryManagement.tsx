'use client';

import React, { useState, useEffect } from 'react';
import { FiMoreVertical, FiPlus, FiSearch } from 'react-icons/fi';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import InventoryFormModal from './InventoryFormModal';
import InventoryHistoryModal from './InventoryHistoryModal';
import { InventoryAlerts } from './InventoryAlerts';
import { InventoryItem } from '@/types/inventory';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [stores, setStores] = useState<{ id: string; name: string }[]>([]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory');
      if (!response.ok) throw new Error('Failed to fetch inventory');
      const data = await response.json();
      setInventory(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch inventory',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [searchQuery]);

  const handleItemSubmit = async (data: Partial<InventoryItem> & { id?: string }) => {
    try {
      const response = await fetch('/api/inventory', {
        method: formMode === 'add' ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save item');
      }

      await fetchInventory();
      setIsFormModalOpen(false);
      toast({
        title: 'Success',
        description: `Item ${formMode === 'add' ? 'added' : 'updated'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save item',
        variant: 'destructive',
      });
    }
  };

  const handleBatchDelete = async () => {
    if (!selectedItems.size) return;

    try {
      const response = await fetch('/api/inventory/batch', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: Array.from(selectedItems) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete items');
      }

      await fetchInventory();
      setSelectedItems(new Set());
      toast({
        title: 'Success',
        description: 'Selected items deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete items',
        variant: 'destructive',
      });
    }
  };

  const handleAdjustStock = async (id: string, newQuantity: number) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, quantity: newQuantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to adjust stock');
      }

      await fetchInventory();
      toast({
        title: 'Success',
        description: 'Stock adjusted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to adjust stock',
        variant: 'destructive',
      });
    }
  };

  const handleExport = async () => {
    const response = await fetch('/api/inventory/export?format=csv');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory-export.csv';
    a.click();
  };

  const handleImport = async (file: File) => {
    const content = await file.text();
    const rows = content.split('\n').slice(1); // Skip header
    const items = rows.map(row => {
      const [productId, storeId, quantity, minimumStock] = row.split(',');
      return {
        productId,
        storeId,
        quantity: parseInt(quantity),
        minimumStock: parseInt(minimumStock),
      };
    });

    const response = await fetch('/api/inventory/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    });

    if (!response.ok) {
      throw new Error('Import failed');
    }
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('/api/stores');
        if (!response.ok) throw new Error('Failed to fetch stores');
        const data = await response.json();
        setStores(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch stores',
          variant: 'destructive',
        });
      }
    };

    fetchStores();
  }, []);

  const getInitialData = (item: InventoryItem | null) => {
    if (!item) return null;
    const { product, updatedAt, ...rest } = item;
    return rest;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <div className="flex gap-2">
          {selectedItems.size > 0 && (
            <Button
              variant="destructive"
              onClick={handleBatchDelete}
            >
              Delete Selected ({selectedItems.size})
            </Button>
          )}
          <Button
            onClick={() => {
              setFormMode('add');
              setCurrentItem(null);
              setIsFormModalOpen(true);
            }}
          >
            <FiPlus className="mr-2" /> Add Item
          </Button>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          type="search"
          placeholder="Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table header */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedItems.size === inventory.length}
                    onChange={(e) => {
                      setSelectedItems(
                        e.target.checked
                          ? new Set(inventory.map(item => item.id))
                          : new Set()
                      );
                    }}
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            {/* Table body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {inventory.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={(e) => {
                        const newSelected = new Set(selectedItems);
                        if (e.target.checked) {
                          newSelected.add(item.id);
                        } else {
                          newSelected.delete(item.id);
                        }
                        setSelectedItems(newSelected);
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(item.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setCurrentItem(item);
                          setFormMode('edit');
                          setIsFormModalOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setCurrentItem(item);
                          setIsHistoryModalOpen(true);
                        }}
                      >
                        History
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <InventoryFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleItemSubmit}
        initialData={getInitialData(currentItem)}
        mode={formMode}
        stores={stores}
      />

      {currentItem && (
        <InventoryHistoryModal
          isOpen={isHistoryModalOpen}
          onClose={() => setIsHistoryModalOpen(false)}
          itemId={currentItem.id}
        />
      )}

      <InventoryAlerts />

      <Button onClick={handleExport}>Export Inventory</Button>
      <Input
        type="file"
        accept=".csv"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImport(file);
        }}
      />
    </div>
  );
};

export default InventoryManagement;







