import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from '@/components/ui/toast';

export function InitialInventorySetup({ storeId }: { storeId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        await importInventory(content);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to process inventory file',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const importInventory = async (content: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/inventory/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          content
        }),
      });

      if (!response.ok) throw new Error('Import failed');

      toast({
        title: 'Success',
        description: 'Inventory imported successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to import inventory',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addSingleItem = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          productId: data.productId,
          quantity: parseInt(data.quantity),
          minimumStock: parseInt(data.minimumStock),
          reorderPoint: parseInt(data.reorderPoint)
        }),
      });

      if (!response.ok) throw new Error('Failed to add item');

      toast({
        title: 'Success',
        description: 'Item added successfully',
      });
      reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add item',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Bulk Import</h3>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="block w-full"
        />
        <p className="text-sm text-gray-500 mt-2">
          Upload a CSV file with columns: productId, quantity, minimumStock, reorderPoint
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Add Single Item</h3>
        <form onSubmit={handleSubmit(addSingleItem)} className="space-y-4">
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
          <input
            {...register('minimumStock')}
            type="number"
            placeholder="Minimum Stock"
            className="input"
            required
          />
          <input
            {...register('reorderPoint')}
            type="number"
            placeholder="Reorder Point"
            className="input"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full"
          >
            {isLoading ? 'Adding...' : 'Add Item'}
          </button>
        </form>
      </div>
    </div>
  );
}

// For single item addition
const inventoryItem = {
  productId: "PROD001",
  quantity: 100,
  minimumStock: 20,
  reorderPoint: 30
};

// For CSV bulk import format
const csvFormat = `productId,quantity,minimumStock,reorderPoint
PROD001,100,20,30
PROD002,150,30,45
PROD003,200,40,60`;
