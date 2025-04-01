'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
}

interface Store {
  id: string;
  name: string;
  inventory: {
    product: Product;
    quantity: number;
  }[];
}

interface TransferFormData {
  productId: string;
  quantity: number;
  destinationStoreId: string;
}

interface StoreTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransferFormData) => void;
  sourceStore: Store;
  destinationStores: Store[];
}

export default function StoreTransferModal({
  isOpen,
  onClose,
  onSubmit,
  sourceStore,
  destinationStores
}: StoreTransferModalProps) {
  const [formData, setFormData] = useState<TransferFormData>({
    productId: '',
    quantity: 1,
    destinationStoreId: '',
  });
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        productId: '',
        quantity: 1,
        destinationStoreId: '',
      });
      setAvailableQuantity(0);
    }
  }, [isOpen]);

  // Update available quantity when product changes
  useEffect(() => {
    if (formData.productId) {
      const product = sourceStore.inventory.find(
        item => item.product.id === formData.productId
      );
      setAvailableQuantity(product ? product.quantity : 0);
    } else {
      setAvailableQuantity(0);
    }
  }, [formData.productId, sourceStore.inventory]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }));
  };

  const handleProductChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      productId: value,
      quantity: 1 // Reset quantity when product changes
    }));
  };

  const handleDestinationChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      destinationStoreId: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate quantity
    if (formData.quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }
    
    if (formData.quantity > availableQuantity) {
      toast.error(`Only ${availableQuantity} units available for transfer`);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transfer Products from {sourceStore.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="productId">Product</Label>
              <Select
                value={formData.productId}
                onValueChange={handleProductChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {sourceStore.inventory.map(item => (
                    <SelectItem key={item.product.id} value={item.product.id}>
                      {item.product.name} ({item.quantity} available)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity to Transfer</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                max={availableQuantity}
                value={formData.quantity}
                onChange={handleChange}
                required
              />
              {availableQuantity > 0 && (
                <p className="text-xs text-gray-500">
                  Available: {availableQuantity} units
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationStoreId">Destination Store</Label>
              <Select
                value={formData.destinationStoreId}
                onValueChange={handleDestinationChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select destination store" />
                </SelectTrigger>
                <SelectContent>
                  {destinationStores.map(store => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={
                !formData.productId || 
                !formData.destinationStoreId || 
                formData.quantity <= 0 ||
                formData.quantity > availableQuantity
              }
            >
              Transfer Products
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
