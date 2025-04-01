'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RawMaterialFormData {
  name: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  currentStock: number;
  warehouseId?: string;
}

interface RawMaterialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RawMaterialFormData) => void;
  initialData?: Partial<RawMaterialFormData>;
  warehouseName: string;
}

export default function RawMaterialFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  warehouseName
}: RawMaterialFormModalProps) {
  const [formData, setFormData] = useState<RawMaterialFormData>({
    name: initialData?.name || '',
    quantity: initialData?.quantity || 0,
    unit: initialData?.unit || 'kg',
    minimumStock: initialData?.minimumStock || 0,
    currentStock: initialData?.currentStock || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['quantity', 'minimumStock', 'currentStock'].includes(name) 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleUnitChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      unit: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const units = [
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'g', label: 'Grams (g)' },
    { value: 'l', label: 'Liters (l)' },
    { value: 'ml', label: 'Milliliters (ml)' },
    { value: 'pcs', label: 'Pieces (pcs)' },
    { value: 'stems', label: 'Stems' },
    { value: 'bunches', label: 'Bunches' },
    { value: 'boxes', label: 'Boxes' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Raw Material' : 'Add New Raw Material'}
          </DialogTitle>
          <p className="text-sm text-gray-500">
            Warehouse: {warehouseName}
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Material Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter material name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentStock">Current Stock</Label>
                <Input
                  id="currentStock"
                  name="currentStock"
                  type="number"
                  value={formData.currentStock}
                  onChange={handleChange}
                  placeholder="Enter current stock"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={formData.unit}
                  onValueChange={handleUnitChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map(unit => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumStock">Minimum Stock Level</Label>
              <Input
                id="minimumStock"
                name="minimumStock"
                type="number"
                value={formData.minimumStock}
                onChange={handleChange}
                placeholder="Enter minimum stock level"
                required
              />
              <p className="text-xs text-gray-500">
                System will alert when stock falls below this level
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update' : 'Add'} Material
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
