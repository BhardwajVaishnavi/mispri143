'use client';

import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/DataTable';
import StoreFormModal from './StoreFormModal';
import StoreDetailsModal from './StoreDetailsModal';
import { Store } from '@/types/store';

interface StoreManagementProps {
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
}

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

const columns: Column[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Store Name', sortable: true },
  { key: 'storeRole', label: 'Store Type', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'managerName', label: 'Manager', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions' },
];

// Add this type assertion to make Store compatible with Record<string, unknown>
type StoreRecord = Store & Record<string, unknown>;

export default function StoreManagement({
  isCreateModalOpen,
  setIsCreateModalOpen
}: StoreManagementProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchStores = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleStoreSubmit = async (data: Partial<Store>) => {
    try {
      const response = await fetch('/api/stores', {
        method: data.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to save store');

      await fetchStores();
      setIsCreateModalOpen(false);
      setIsEditModalOpen(false);
      toast({
        title: 'Success',
        description: `Store ${data.id ? 'updated' : 'created'} successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save store',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    if (!confirm('Are you sure you want to delete this store?')) return;

    try {
      const response = await fetch(`/api/stores/${storeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete store');

      await fetchStores();
      toast({
        title: 'Success',
        description: 'Store deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete store',
        variant: 'destructive',
      });
    }
  };

  // Format location for display
  const formatLocation = (store: Store) => {
    return `${store.city}, ${store.state}`;
  };

  const renderCell = (row: Store, column: Column) => {
    if (column.key === 'location') {
      return formatLocation(row);
    }
    if (column.key === 'storeRole') {
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.storeRole === 'MAIN' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {row.storeRole}
        </span>
      );
    }
    if (column.key === 'status') {
      return (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      );
    }
    if (column.key === 'actions') {
      return (
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedStore(row);
              setIsDetailsModalOpen(true);
            }}
          >
            View
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedStore(row);
              setIsEditModalOpen(true);
            }}
          >
            Edit
          </Button>
          {row.storeRole === 'MAIN' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                // Handle transfer products
                setSelectedStore(row);
                // You would open a transfer modal here
              }}
            >
              Transfer
            </Button>
          )}
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDeleteStore(row.id)}
          >
            Delete
          </Button>
        </div>
      );
    }
    return row[column.key as keyof Store];
  };

  return (
    <div className="space-y-6">
      <DataTable<StoreRecord>
        columns={columns}
        data={stores as StoreRecord[]}
        isLoading={loading}
        renderCell={renderCell as (row: StoreRecord, column: Column) => React.ReactNode}
      />

      <StoreFormModal
        isOpen={isCreateModalOpen || isEditModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedStore(null);
        }}
        onSubmit={handleStoreSubmit}
        store={selectedStore}
      />

      {selectedStore && (
        <StoreDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedStore(null);
          }}
          store={selectedStore}
        />
      )}
    </div>
  );
}

