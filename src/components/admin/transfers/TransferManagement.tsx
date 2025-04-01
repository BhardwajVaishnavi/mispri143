import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/toast';
import { Store } from '@/types/store';
import { StoreTransfer } from '@/types/store-transfer';

interface TransferFormData {
  sourceStoreId: string;
  destinationStoreId: string;
  productId: string;
  quantity: string;
  notes?: string;
}

export function TransferManagement() {
  const [stores, setStores] = useState<Store[]>([]);
  const [transfers, setTransfers] = useState<StoreTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<TransferFormData>();

  useEffect(() => {
    fetchStores();
    fetchTransfers();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores');
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

  const fetchTransfers = async () => {
    try {
      const response = await fetch('/api/transfers');
      const data = await response.json();
      setTransfers(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch transfers',
        variant: 'destructive',
      });
    }
  };

  const createTransfer = async (data: TransferFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/inventory/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceStoreId: data.sourceStoreId,
          destinationStoreId: data.destinationStoreId,
          items: [{
            productId: data.productId,
            quantity: parseInt(data.quantity)
          }],
          notes: data.notes
        }),
      });

      if (!response.ok) throw new Error('Transfer failed');

      toast({
        title: 'Success',
        description: 'Transfer initiated successfully',
      });
      reset();
      fetchTransfers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to initiate transfer',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const approveTransfer = async (transferId: string) => {
    try {
      const response = await fetch(`/api/inventory/transfer/${transferId}/approve`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Approval failed');

      toast({
        title: 'Success',
        description: 'Transfer approved successfully',
      });
      fetchTransfers();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve transfer',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Create Transfer</h2>
        <form onSubmit={handleSubmit(createTransfer)} className="space-y-4">
          <select {...register('sourceStoreId')} className="select" required>
            <option value="">Select Source Store</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>

          <select {...register('destinationStoreId')} className="select" required>
            <option value="">Select Destination Store</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>

          <input
            {...register('productId')}
            placeholder="Product ID"
            className="input"
            required
          />

          <input
            {...register('quantity')}
            type="number"
            placeholder="Quantity"
            className="input"
            required
          />

          <textarea
            {...register('notes')}
            placeholder="Notes"
            className="textarea"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Creating...' : 'Create Transfer'}
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Recent Transfers</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th>To</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map(transfer => (
                <tr key={transfer.id}>
                  <td>{new Date(transfer.createdAt).toLocaleDateString()}</td>
                  <td>{transfer.sourceStore.name}</td>
                  <td>{transfer.destinationStore.name}</td>
                  <td>{transfer.product?.name}</td>
                  <td>{transfer.quantity}</td>
                  <td>{transfer.status}</td>
                  <td>
                    {transfer.status === 'PENDING' && (
                      <button
                        onClick={() => approveTransfer(transfer.id)}
                        className="btn-secondary"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Example transfer creation
const transferData = {
  sourceStoreId: "main_store_id",
  destinationStoreId: "branch_store_id",
  items: [{
    productId: "PROD001",
    quantity: 50
  }],
  notes: "Weekly stock replenishment"
};

