'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ProductVariant, ProductSize, ProductColor, ProductFlavor } from '@/types/product';

interface ProductVariantsFormProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  productCategory: string;
}

export default function ProductVariantsForm({
  variants,
  onChange,
  productCategory
}: ProductVariantsFormProps) {
  const [showDimensionsFor, setShowDimensionsFor] = useState<string[]>([]);

  const toggleDimensions = (variantId: string) => {
    setShowDimensionsFor(prev => 
      prev.includes(variantId) 
        ? prev.filter(id => id !== variantId) 
        : [...prev, variantId]
    );
  };

  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `temp-${Date.now()}`,
      name: '',
      sku: '',
      price: 0,
      salePrice: undefined,
      size: undefined,
      color: undefined,
      flavor: undefined,
      weight: undefined,
      dimensions: undefined,
      images: [],
      stockQuantity: 0
    };
    
    onChange([...variants, newVariant]);
  };

  const removeVariant = (index: number) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    onChange(newVariants);
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]: value
    };
    onChange(newVariants);
  };

  const updateDimension = (index: number, field: 'length' | 'width' | 'height', value: number) => {
    const newVariants = [...variants];
    const currentDimensions = newVariants[index].dimensions || { length: 0, width: 0, height: 0 };
    
    newVariants[index] = {
      ...newVariants[index],
      dimensions: {
        ...currentDimensions,
        [field]: value
      }
    };
    
    onChange(newVariants);
  };

  // Determine which fields to show based on product category
  const showSizeField = ['FLOWER', 'CAKE', 'GIFT_BASKET'].includes(productCategory);
  const showColorField = ['FLOWER', 'DECORATION', 'PLUSH_TOY'].includes(productCategory);
  const showFlavorField = ['CAKE', 'CHOCOLATE'].includes(productCategory);
  const showWeightField = ['CAKE', 'CHOCOLATE', 'GIFT_BASKET'].includes(productCategory);
  const showDimensionsField = ['GIFT_BASKET', 'DECORATION', 'FLOWER'].includes(productCategory);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Product Variants</h3>
        <Button 
          type="button" 
          onClick={addVariant}
          size="sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>

      {variants.length === 0 ? (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="text-gray-500">No variants added yet. Click "Add Variant" to create product variations.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {variants.map((variant, index) => (
            <Card key={variant.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">Variant {index + 1}</h4>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeVariant(index)}
                >
                  <TrashIcon className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`variant-name-${index}`}>Variant Name</Label>
                  <Input
                    id={`variant-name-${index}`}
                    value={variant.name}
                    onChange={(e) => updateVariant(index, 'name', e.target.value)}
                    placeholder="e.g., Small Red Rose Bouquet"
                  />
                </div>

                <div>
                  <Label htmlFor={`variant-sku-${index}`}>SKU</Label>
                  <Input
                    id={`variant-sku-${index}`}
                    value={variant.sku}
                    onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                    placeholder="e.g., ROSE-RED-SM"
                  />
                </div>

                <div>
                  <Label htmlFor={`variant-price-${index}`}>Price</Label>
                  <Input
                    id={`variant-price-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={variant.price}
                    onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value))}
                  />
                </div>

                <div>
                  <Label htmlFor={`variant-sale-price-${index}`}>Sale Price (Optional)</Label>
                  <Input
                    id={`variant-sale-price-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={variant.salePrice || ''}
                    onChange={(e) => updateVariant(index, 'salePrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>

                {showSizeField && (
                  <div>
                    <Label htmlFor={`variant-size-${index}`}>Size</Label>
                    <Select
                      value={variant.size}
                      onValueChange={(value) => updateVariant(index, 'size', value as ProductSize)}
                    >
                      <SelectTrigger id={`variant-size-${index}`}>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SMALL">Small</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LARGE">Large</SelectItem>
                        <SelectItem value="EXTRA_LARGE">Extra Large</SelectItem>
                        <SelectItem value="CUSTOM">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {showColorField && (
                  <div>
                    <Label htmlFor={`variant-color-${index}`}>Color</Label>
                    <Select
                      value={variant.color}
                      onValueChange={(value) => updateVariant(index, 'color', value as ProductColor)}
                    >
                      <SelectTrigger id={`variant-color-${index}`}>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="RED">Red</SelectItem>
                        <SelectItem value="PINK">Pink</SelectItem>
                        <SelectItem value="WHITE">White</SelectItem>
                        <SelectItem value="YELLOW">Yellow</SelectItem>
                        <SelectItem value="BLUE">Blue</SelectItem>
                        <SelectItem value="PURPLE">Purple</SelectItem>
                        <SelectItem value="ORANGE">Orange</SelectItem>
                        <SelectItem value="GREEN">Green</SelectItem>
                        <SelectItem value="MIXED">Mixed</SelectItem>
                        <SelectItem value="CUSTOM">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {showFlavorField && (
                  <div>
                    <Label htmlFor={`variant-flavor-${index}`}>Flavor</Label>
                    <Select
                      value={variant.flavor}
                      onValueChange={(value) => updateVariant(index, 'flavor', value as ProductFlavor)}
                    >
                      <SelectTrigger id={`variant-flavor-${index}`}>
                        <SelectValue placeholder="Select flavor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CHOCOLATE">Chocolate</SelectItem>
                        <SelectItem value="VANILLA">Vanilla</SelectItem>
                        <SelectItem value="STRAWBERRY">Strawberry</SelectItem>
                        <SelectItem value="RED_VELVET">Red Velvet</SelectItem>
                        <SelectItem value="BUTTERSCOTCH">Butterscotch</SelectItem>
                        <SelectItem value="COFFEE">Coffee</SelectItem>
                        <SelectItem value="LEMON">Lemon</SelectItem>
                        <SelectItem value="FRUIT">Fruit</SelectItem>
                        <SelectItem value="CUSTOM">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {showWeightField && (
                  <div>
                    <Label htmlFor={`variant-weight-${index}`}>Weight (grams)</Label>
                    <Input
                      id={`variant-weight-${index}`}
                      type="number"
                      min="0"
                      value={variant.weight || ''}
                      onChange={(e) => updateVariant(index, 'weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor={`variant-stock-${index}`}>Stock Quantity</Label>
                  <Input
                    id={`variant-stock-${index}`}
                    type="number"
                    min="0"
                    value={variant.stockQuantity}
                    onChange={(e) => updateVariant(index, 'stockQuantity', parseInt(e.target.value))}
                  />
                </div>

                {showDimensionsField && (
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleDimensions(variant.id)}
                      >
                        {showDimensionsFor.includes(variant.id) ? 'Hide Dimensions' : 'Add Dimensions'}
                      </Button>
                    </div>

                    {showDimensionsFor.includes(variant.id) && (
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div>
                          <Label htmlFor={`variant-length-${index}`}>Length (cm)</Label>
                          <Input
                            id={`variant-length-${index}`}
                            type="number"
                            min="0"
                            value={variant.dimensions?.length || ''}
                            onChange={(e) => updateDimension(index, 'length', parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`variant-width-${index}`}>Width (cm)</Label>
                          <Input
                            id={`variant-width-${index}`}
                            type="number"
                            min="0"
                            value={variant.dimensions?.width || ''}
                            onChange={(e) => updateDimension(index, 'width', parseFloat(e.target.value))}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`variant-height-${index}`}>Height (cm)</Label>
                          <Input
                            id={`variant-height-${index}`}
                            type="number"
                            min="0"
                            value={variant.dimensions?.height || ''}
                            onChange={(e) => updateDimension(index, 'height', parseFloat(e.target.value))}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
