'use client';

import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { ProductVariant, ProductCategory } from '@/types/product';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | null;
  onChange: (variant: ProductVariant) => void;
  productCategory: ProductCategory;
}

export default function ProductVariantSelector({
  variants,
  selectedVariant,
  onChange,
  productCategory
}: ProductVariantSelectorProps) {
  // Determine which attributes to show based on product category
  const showSizeSelector = ['FLOWER', 'CAKE', 'GIFT_BASKET'].includes(productCategory);
  const showColorSelector = ['FLOWER', 'DECORATION', 'PLUSH_TOY'].includes(productCategory);
  const showFlavorSelector = ['CAKE', 'CHOCOLATE'].includes(productCategory);

  // Group variants by attribute for easier selection
  const sizes = [...new Set(variants.map(v => v.size).filter(Boolean))];
  const colors = [...new Set(variants.map(v => v.color).filter(Boolean))];
  const flavors = [...new Set(variants.map(v => v.flavor).filter(Boolean))];

  // Local state for selected attributes
  const [selectedSize, setSelectedSize] = useState(selectedVariant?.size || sizes[0]);
  const [selectedColor, setSelectedColor] = useState(selectedVariant?.color || colors[0]);
  const [selectedFlavor, setSelectedFlavor] = useState(selectedVariant?.flavor || flavors[0]);

  // Update the selected variant when attributes change
  const updateSelectedVariant = (attribute: string, value: string) => {
    let newSelectedAttributes = {
      size: selectedSize,
      color: selectedColor,
      flavor: selectedFlavor
    };

    // Update the specific attribute
    newSelectedAttributes[attribute as keyof typeof newSelectedAttributes] = value;

    // Find the best matching variant
    const matchingVariant = findBestMatchingVariant(
      variants,
      newSelectedAttributes.size,
      newSelectedAttributes.color,
      newSelectedAttributes.flavor
    );

    if (matchingVariant) {
      onChange(matchingVariant);
      
      // Update all attributes to match the selected variant
      setSelectedSize(matchingVariant.size || selectedSize);
      setSelectedColor(matchingVariant.color || selectedColor);
      setSelectedFlavor(matchingVariant.flavor || selectedFlavor);
    }
  };

  // Helper function to find the best matching variant
  const findBestMatchingVariant = (
    variants: ProductVariant[],
    size?: string,
    color?: string,
    flavor?: string
  ) => {
    // Try to find an exact match first
    let match = variants.find(v => 
      (!size || v.size === size) && 
      (!color || v.color === color) && 
      (!flavor || v.flavor === flavor)
    );

    if (match) return match;

    // If no exact match, prioritize matching size and color for flowers
    if (productCategory === 'FLOWER') {
      match = variants.find(v => (!size || v.size === size) && (!color || v.color === color));
      if (match) return match;
    }

    // For cakes, prioritize matching size and flavor
    if (productCategory === 'CAKE') {
      match = variants.find(v => (!size || v.size === size) && (!flavor || v.flavor === flavor));
      if (match) return match;
    }

    // If still no match, just match any one attribute
    match = variants.find(v => 
      (!size || v.size === size) || 
      (!color || v.color === color) || 
      (!flavor || v.flavor === flavor)
    );

    // If all else fails, return the first variant
    return match || variants[0];
  };

  return (
    <div className="space-y-4">
      {/* Size Selector */}
      {showSizeSelector && sizes.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Size
          </label>
          <RadioGroup value={selectedSize} onChange={(size) => updateSelectedVariant('size', size)}>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <RadioGroup.Option
                  key={size}
                  value={size}
                  className={({ active, checked }) =>
                    `${
                      active ? 'ring-2 ring-primary ring-offset-2' : ''
                    } ${
                      checked ? 'bg-primary text-white' : 'bg-white text-gray-900 border border-gray-200'
                    } relative flex cursor-pointer rounded-lg px-4 py-2 focus:outline-none`
                  }
                >
                  {({ checked }) => (
                    <div className="flex items-center justify-center">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`font-medium ${
                            checked ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {size}
                        </RadioGroup.Label>
                      </div>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Color Selector */}
      {showColorSelector && colors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <RadioGroup value={selectedColor} onChange={(color) => updateSelectedVariant('color', color)}>
            <div className="flex flex-wrap gap-2">
              {colors.map((color) => (
                <RadioGroup.Option
                  key={color}
                  value={color}
                  className={({ active, checked }) =>
                    `${
                      active ? 'ring-2 ring-primary ring-offset-2' : ''
                    } ${
                      checked ? 'bg-primary text-white' : 'bg-white text-gray-900 border border-gray-200'
                    } relative flex cursor-pointer rounded-lg px-4 py-2 focus:outline-none`
                  }
                >
                  {({ checked }) => (
                    <div className="flex items-center justify-center">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`font-medium ${
                            checked ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {color}
                        </RadioGroup.Label>
                      </div>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Flavor Selector */}
      {showFlavorSelector && flavors.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Flavor
          </label>
          <RadioGroup value={selectedFlavor} onChange={(flavor) => updateSelectedVariant('flavor', flavor)}>
            <div className="flex flex-wrap gap-2">
              {flavors.map((flavor) => (
                <RadioGroup.Option
                  key={flavor}
                  value={flavor}
                  className={({ active, checked }) =>
                    `${
                      active ? 'ring-2 ring-primary ring-offset-2' : ''
                    } ${
                      checked ? 'bg-primary text-white' : 'bg-white text-gray-900 border border-gray-200'
                    } relative flex cursor-pointer rounded-lg px-4 py-2 focus:outline-none`
                  }
                >
                  {({ checked }) => (
                    <div className="flex items-center justify-center">
                      <div className="text-sm">
                        <RadioGroup.Label
                          as="p"
                          className={`font-medium ${
                            checked ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {flavor}
                        </RadioGroup.Label>
                      </div>
                    </div>
                  )}
                </RadioGroup.Option>
              ))}
            </div>
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
