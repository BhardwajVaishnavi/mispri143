'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface RawMaterial {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
}

interface MaterialConsumption {
  materialId: string;
  quantity: number;
}

interface ProductionFormData {
  productId: string;
  quantity: number;
  startDate: string;
  endDate?: string;
  materials: MaterialConsumption[];
}

interface ProductionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductionFormData) => void;
  products: Product[];
  rawMaterials: RawMaterial[];
}

export default function ProductionFormModal({
  isOpen,
  onClose,
  onSubmit,
  products,
  rawMaterials
}: ProductionFormModalProps) {
  const [formData, setFormData] = useState<ProductionFormData>({
    productId: '',
    quantity: 1,
    startDate: new Date().toISOString().split('T')[0],
    materials: []
  });

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
      productId: value
    }));
  };

  const handleAddMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { materialId: '', quantity: 0 }]
    }));
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const handleMaterialChange = (index: number, field: 'materialId' | 'quantity', value: string | number) => {
    setFormData(prev => {
      const updatedMaterials = [...prev.materials];
      updatedMaterials[index] = {
        ...updatedMaterials[index],
        [field]: field === 'quantity' ? parseFloat(value as string) : value
      };
      return {
        ...prev,
        materials: updatedMaterials
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getMaterialUnit = (materialId: string) => {
    const material = rawMaterials.find(m => m.id === materialId);
    return material ? material.unit : '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Production</DialogTitle>
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
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity to Produce</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Raw Materials</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={handleAddMaterial}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              </div>
              
              {formData.materials.length === 0 && (
                <p className="text-sm text-gray-500 italic">
                  No materials added yet. Click "Add Material" to add raw materials needed for production.
                </p>
              )}

              <div className="space-y-3 mt-2">
                {formData.materials.map((material, index) => (
                  <div key={index} className="flex items-end space-x-2">
                    <div className="flex-1">
                      <Label htmlFor={`material-${index}`} className="text-xs">Material</Label>
                      <Select
                        value={material.materialId}
                        onValueChange={(value) => handleMaterialChange(index, 'materialId', value)}
                      >
                        <SelectTrigger id={`material-${index}`}>
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          {rawMaterials.map(material => (
                            <SelectItem key={material.id} value={material.id}>
                              {material.name} ({material.currentStock} {material.unit} available)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="w-24">
                      <Label htmlFor={`quantity-${index}`} className="text-xs">Quantity</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={material.quantity || ''}
                        onChange={(e) => handleMaterialChange(index, 'quantity', e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="w-16 text-center">
                      <span className="text-xs text-gray-500">
                        {getMaterialUnit(material.materialId)}
                      </span>
                    </div>
                    
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveMaterial(index)}
                    >
                      <TrashIcon className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={formData.productId === '' || formData.quantity < 1 || formData.materials.length === 0}
            >
              Create Production
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
