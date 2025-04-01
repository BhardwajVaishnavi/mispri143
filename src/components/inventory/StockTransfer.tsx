'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { toast } from 'react-hot-toast';

const transferSchema = z.object({
  sourceStoreId: z.string().min(1, "Source store is required"),
  destinationStoreId: z.string().min(1, "Destination store is required"),
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  notes: z.string().optional(),
});

type TransferFormData = z.infer<typeof transferSchema>;

export default function StockTransfer() {
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema)
  });

  const onSubmit = async (data: TransferFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/inventory/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Transfer failed');

      toast.success('Stock transfer initiated successfully');
      reset();
    } catch (error) {
      toast.error('Failed to initiate stock transfer');
      console.error('Transfer error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-6">Stock Transfer</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Source Store</label>
            <Select {...register("sourceStoreId")}>
              <option value="">Select Source Store</option>
              {/* Add your store options here */}
            </Select>
            {errors.sourceStoreId && (
              <p className="text-red-500 text-sm mt-1">{errors.sourceStoreId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Destination Store</label>
            <Select {...register("destinationStoreId")}>
              <option value="">Select Destination Store</option>
              {/* Add your store options here */}
            </Select>
            {errors.destinationStoreId && (
              <p className="text-red-500 text-sm mt-1">{errors.destinationStoreId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Product</label>
            <Select {...register("productId")}>
              <option value="">Select Product</option>
              {/* Add your product options here */}
            </Select>
            {errors.productId && (
              <p className="text-red-500 text-sm mt-1">{errors.productId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <Input
              type="number"
              {...register("quantity", { valueAsNumber: true })}
              min="1"
            />
            {errors.quantity && (
              <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            {...register("notes")}
            className="w-full p-2 border rounded-md"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Initiate Transfer'}
          </Button>
        </div>
      </form>
    </div>
  );
}