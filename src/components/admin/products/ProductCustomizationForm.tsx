'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { ProductCustomizationOption } from '@/types/product';

interface ProductCustomizationFormProps {
  customizationOptions: ProductCustomizationOption[];
  onChange: (options: ProductCustomizationOption[]) => void;
  productCategory: string;
}

export default function ProductCustomizationForm({
  customizationOptions,
  onChange,
  productCategory
}: ProductCustomizationFormProps) {
  const [expandedOptions, setExpandedOptions] = useState<string[]>([]);

  const toggleOptionExpand = (optionId: string) => {
    setExpandedOptions(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId) 
        : [...prev, optionId]
    );
  };

  const addCustomizationOption = () => {
    const newOption: ProductCustomizationOption = {
      id: `temp-${Date.now()}`,
      name: '',
      type: 'TEXT',
      required: false,
      additionalPrice: 0,
      options: []
    };
    
    onChange([...customizationOptions, newOption]);
    setExpandedOptions(prev => [...prev, newOption.id]);
  };

  const removeCustomizationOption = (index: number) => {
    const newOptions = [...customizationOptions];
    const removedId = newOptions[index].id;
    newOptions.splice(index, 1);
    onChange(newOptions);
    setExpandedOptions(prev => prev.filter(id => id !== removedId));
  };

  const updateCustomizationOption = (index: number, field: keyof ProductCustomizationOption, value: any) => {
    const newOptions = [...customizationOptions];
    newOptions[index] = {
      ...newOptions[index],
      [field]: value
    };
    onChange(newOptions);
  };

  const addSubOption = (optionIndex: number) => {
    const newOptions = [...customizationOptions];
    const currentSubOptions = newOptions[optionIndex].options || [];
    
    newOptions[optionIndex] = {
      ...newOptions[optionIndex],
      options: [
        ...currentSubOptions,
        {
          id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          name: '',
          price: 0
        }
      ]
    };
    
    onChange(newOptions);
  };

  const removeSubOption = (optionIndex: number, subOptionIndex: number) => {
    const newOptions = [...customizationOptions];
    const currentSubOptions = [...(newOptions[optionIndex].options || [])];
    currentSubOptions.splice(subOptionIndex, 1);
    
    newOptions[optionIndex] = {
      ...newOptions[optionIndex],
      options: currentSubOptions
    };
    
    onChange(newOptions);
  };

  const updateSubOption = (optionIndex: number, subOptionIndex: number, field: string, value: any) => {
    const newOptions = [...customizationOptions];
    const currentSubOptions = [...(newOptions[optionIndex].options || [])];
    
    currentSubOptions[subOptionIndex] = {
      ...currentSubOptions[subOptionIndex],
      [field]: field === 'price' ? parseFloat(value) : value
    };
    
    newOptions[optionIndex] = {
      ...newOptions[optionIndex],
      options: currentSubOptions
    };
    
    onChange(newOptions);
  };

  // Determine which customization types to show based on product category
  const getCustomizationTypes = () => {
    const baseTypes = [
      { value: 'TEXT', label: 'Text Input' },
      { value: 'MESSAGE', label: 'Message' }
    ];
    
    const categorySpecificTypes: Record<string, { value: string, label: string }[]> = {
      'FLOWER': [
        { value: 'COLOR', label: 'Color Selection' },
        { value: 'ADDON', label: 'Add-on Item' },
        { value: 'CARD', label: 'Greeting Card' },
        { value: 'RIBBON', label: 'Ribbon' }
      ],
      'CAKE': [
        { value: 'FLAVOR', label: 'Flavor Selection' },
        { value: 'TOPPING', label: 'Topping' },
        { value: 'ADDON', label: 'Add-on Item' }
      ],
      'GIFT_BASKET': [
        { value: 'ADDON', label: 'Add-on Item' },
        { value: 'CARD', label: 'Greeting Card' },
        { value: 'RIBBON', label: 'Ribbon' }
      ],
      'CHOCOLATE': [
        { value: 'FLAVOR', label: 'Flavor Selection' },
        { value: 'ADDON', label: 'Add-on Item' }
      ]
    };
    
    return [
      ...baseTypes,
      ...(categorySpecificTypes[productCategory] || [])
    ];
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Customization Options</h3>
        <Button 
          type="button" 
          onClick={addCustomizationOption}
          size="sm"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Option
        </Button>
      </div>

      {customizationOptions.length === 0 ? (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="text-gray-500">No customization options added yet. Click "Add Option" to create customization options.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {customizationOptions.map((option, index) => (
            <Card key={option.id} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">
                  {option.name || `Customization Option ${index + 1}`}
                </h4>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeCustomizationOption(index)}
                >
                  <TrashIcon className="h-4 w-4 text-red-500" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor={`option-name-${index}`}>Option Name</Label>
                  <Input
                    id={`option-name-${index}`}
                    value={option.name}
                    onChange={(e) => updateCustomizationOption(index, 'name', e.target.value)}
                    placeholder="e.g., Message on Card"
                  />
                </div>

                <div>
                  <Label htmlFor={`option-type-${index}`}>Option Type</Label>
                  <Select
                    value={option.type}
                    onValueChange={(value) => updateCustomizationOption(index, 'type', value)}
                  >
                    <SelectTrigger id={`option-type-${index}`}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {getCustomizationTypes().map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id={`option-required-${index}`}
                    checked={option.required}
                    onCheckedChange={(checked) => updateCustomizationOption(index, 'required', checked)}
                  />
                  <Label htmlFor={`option-required-${index}`}>Required</Label>
                </div>

                {option.type === 'TEXT' || option.type === 'MESSAGE' ? (
                  <div>
                    <Label htmlFor={`option-max-length-${index}`}>Maximum Length</Label>
                    <Input
                      id={`option-max-length-${index}`}
                      type="number"
                      min="1"
                      value={option.maxLength || ''}
                      onChange={(e) => updateCustomizationOption(index, 'maxLength', parseInt(e.target.value))}
                      placeholder="e.g., 100"
                    />
                  </div>
                ) : null}

                <div>
                  <Label htmlFor={`option-price-${index}`}>Additional Price</Label>
                  <Input
                    id={`option-price-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    value={option.additionalPrice}
                    onChange={(e) => updateCustomizationOption(index, 'additionalPrice', parseFloat(e.target.value))}
                  />
                </div>
              </div>

              {/* Sub-options for selection types */}
              {['COLOR', 'FLAVOR', 'TOPPING', 'ADDON', 'CARD', 'RIBBON'].includes(option.type) && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleOptionExpand(option.id)}
                    >
                      {expandedOptions.includes(option.id) ? 'Hide Choices' : 'Show Choices'}
                    </Button>
                    
                    {expandedOptions.includes(option.id) && (
                      <Button 
                        type="button" 
                        size="sm"
                        onClick={() => addSubOption(index)}
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Choice
                      </Button>
                    )}
                  </div>

                  {expandedOptions.includes(option.id) && (
                    <div className="space-y-2 mt-2">
                      {(option.options || []).length === 0 ? (
                        <p className="text-sm text-gray-500">No choices added yet. Click "Add Choice" to add options.</p>
                      ) : (
                        <div className="space-y-2">
                          {(option.options || []).map((subOption, subIndex) => (
                            <div key={subOption.id} className="flex items-center space-x-2">
                              <Input
                                value={subOption.name}
                                onChange={(e) => updateSubOption(index, subIndex, 'name', e.target.value)}
                                placeholder="Option name"
                                className="flex-1"
                              />
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={subOption.price}
                                onChange={(e) => updateSubOption(index, subIndex, 'price', e.target.value)}
                                placeholder="Price"
                                className="w-24"
                              />
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="sm"
                                onClick={() => removeSubOption(index, subIndex)}
                              >
                                <TrashIcon className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
