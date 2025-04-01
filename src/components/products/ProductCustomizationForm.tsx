'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductCustomizationOption } from '@/types/product';

interface ProductCustomizationFormProps {
  options: ProductCustomizationOption[];
  onChange: (optionId: string, value: any) => void;
  values: Record<string, any>;
}

export default function ProductCustomizationForm({
  options,
  onChange,
  values
}: ProductCustomizationFormProps) {
  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <Label className="text-base font-medium">
              {option.name} {option.required && <span className="text-red-500">*</span>}
            </Label>
            {option.additionalPrice > 0 && (
              <span className="text-sm text-gray-500">+₹{option.additionalPrice.toFixed(2)}</span>
            )}
          </div>

          {/* Text Input */}
          {option.type === 'TEXT' && (
            <Input
              placeholder={`Enter ${option.name.toLowerCase()}`}
              value={values[option.id] || ''}
              onChange={(e) => onChange(option.id, e.target.value)}
              maxLength={option.maxLength}
              required={option.required}
            />
          )}

          {/* Message Input */}
          {option.type === 'MESSAGE' && (
            <Textarea
              placeholder={`Enter your message`}
              value={values[option.id] || ''}
              onChange={(e) => onChange(option.id, e.target.value)}
              maxLength={option.maxLength}
              required={option.required}
              className="min-h-[100px]"
            />
          )}

          {/* Color Selection */}
          {option.type === 'COLOR' && option.options && (
            <RadioGroup
              value={values[option.id] || ''}
              onValueChange={(value) => onChange(option.id, value)}
              className="grid grid-cols-4 gap-2"
            >
              {option.options.map((colorOption) => (
                <div key={colorOption.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={colorOption.id} id={`color-${colorOption.id}`} />
                  <Label htmlFor={`color-${colorOption.id}`} className="flex items-center">
                    <div 
                      className="w-6 h-6 rounded-full mr-2" 
                      style={{ backgroundColor: colorOption.name.toLowerCase() }}
                    />
                    <span>{colorOption.name}</span>
                    {colorOption.price > 0 && (
                      <span className="text-sm text-gray-500 ml-1">+₹{colorOption.price.toFixed(2)}</span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* Flavor Selection */}
          {option.type === 'FLAVOR' && option.options && (
            <RadioGroup
              value={values[option.id] || ''}
              onValueChange={(value) => onChange(option.id, value)}
              className="space-y-2"
            >
              {option.options.map((flavorOption) => (
                <div key={flavorOption.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={flavorOption.id} id={`flavor-${flavorOption.id}`} />
                  <Label htmlFor={`flavor-${flavorOption.id}`} className="flex items-center">
                    <span>{flavorOption.name}</span>
                    {flavorOption.price > 0 && (
                      <span className="text-sm text-gray-500 ml-1">+₹{flavorOption.price.toFixed(2)}</span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* Topping Selection */}
          {option.type === 'TOPPING' && option.options && (
            <div className="grid grid-cols-2 gap-2">
              {option.options.map((toppingOption) => (
                <div key={toppingOption.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`topping-${toppingOption.id}`}
                    checked={(values[option.id] || []).includes(toppingOption.id)}
                    onCheckedChange={(checked) => {
                      const currentValues = values[option.id] || [];
                      const newValues = checked
                        ? [...currentValues, toppingOption.id]
                        : currentValues.filter((id: string) => id !== toppingOption.id);
                      onChange(option.id, newValues);
                    }}
                  />
                  <Label htmlFor={`topping-${toppingOption.id}`} className="flex items-center">
                    <span>{toppingOption.name}</span>
                    {toppingOption.price > 0 && (
                      <span className="text-sm text-gray-500 ml-1">+₹{toppingOption.price.toFixed(2)}</span>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {/* Add-on Selection */}
          {option.type === 'ADDON' && option.options && (
            <div className="grid grid-cols-2 gap-2">
              {option.options.map((addonOption) => (
                <div key={addonOption.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`addon-${addonOption.id}`}
                    checked={(values[option.id] || []).includes(addonOption.id)}
                    onCheckedChange={(checked) => {
                      const currentValues = values[option.id] || [];
                      const newValues = checked
                        ? [...currentValues, addonOption.id]
                        : currentValues.filter((id: string) => id !== addonOption.id);
                      onChange(option.id, newValues);
                    }}
                  />
                  <Label htmlFor={`addon-${addonOption.id}`} className="flex items-center">
                    <span>{addonOption.name}</span>
                    {addonOption.price > 0 && (
                      <span className="text-sm text-gray-500 ml-1">+₹{addonOption.price.toFixed(2)}</span>
                    )}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {/* Card Selection */}
          {option.type === 'CARD' && option.options && (
            <RadioGroup
              value={values[option.id] || ''}
              onValueChange={(value) => onChange(option.id, value)}
              className="space-y-2"
            >
              {option.options.map((cardOption) => (
                <div key={cardOption.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={cardOption.id} id={`card-${cardOption.id}`} />
                  <Label htmlFor={`card-${cardOption.id}`} className="flex items-center">
                    {cardOption.image && (
                      <img 
                        src={cardOption.image} 
                        alt={cardOption.name} 
                        className="w-12 h-12 object-cover rounded mr-2" 
                      />
                    )}
                    <span>{cardOption.name}</span>
                    {cardOption.price > 0 && (
                      <span className="text-sm text-gray-500 ml-1">+₹{cardOption.price.toFixed(2)}</span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {/* Ribbon Selection */}
          {option.type === 'RIBBON' && option.options && (
            <RadioGroup
              value={values[option.id] || ''}
              onValueChange={(value) => onChange(option.id, value)}
              className="space-y-2"
            >
              {option.options.map((ribbonOption) => (
                <div key={ribbonOption.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={ribbonOption.id} id={`ribbon-${ribbonOption.id}`} />
                  <Label htmlFor={`ribbon-${ribbonOption.id}`} className="flex items-center">
                    {ribbonOption.image && (
                      <img 
                        src={ribbonOption.image} 
                        alt={ribbonOption.name} 
                        className="w-12 h-12 object-cover rounded mr-2" 
                      />
                    )}
                    <span>{ribbonOption.name}</span>
                    {ribbonOption.price > 0 && (
                      <span className="text-sm text-gray-500 ml-1">+₹{ribbonOption.price.toFixed(2)}</span>
                    )}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      ))}
    </div>
  );
}
