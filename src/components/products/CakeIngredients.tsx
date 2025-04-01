'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface CakeIngredientsProps {
  ingredients?: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    allergen: boolean;
  }[];
  nutritionalInfo?: {
    calories?: number;
    fat?: number;
    carbs?: number;
    protein?: number;
    sugar?: number;
    allergens?: string[];
  };
}

export default function CakeIngredients({ ingredients, nutritionalInfo }: CakeIngredientsProps) {
  if (!ingredients || ingredients.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">No ingredient information available for this product.</p>
      </div>
    );
  }

  // Sort ingredients to show allergens first
  const sortedIngredients = [...ingredients].sort((a, b) => {
    if (a.allergen && !b.allergen) return -1;
    if (!a.allergen && b.allergen) return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold mb-4">Ingredients</h3>
        <div className="grid grid-cols-1 gap-2">
          {sortedIngredients.map((ingredient) => (
            <div 
              key={ingredient.id} 
              className="flex justify-between items-center p-2 rounded-md border"
            >
              <div className="flex items-center">
                <span className="font-medium">{ingredient.name}</span>
                {ingredient.allergen && (
                  <Badge variant="destructive" className="ml-2">Allergen</Badge>
                )}
              </div>
              <span className="text-gray-600">
                {ingredient.quantity} {ingredient.unit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {nutritionalInfo && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Nutritional Information</h3>
          <Card className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {nutritionalInfo.calories !== undefined && (
                <div className="text-center">
                  <p className="text-2xl font-bold">{nutritionalInfo.calories}</p>
                  <p className="text-sm text-gray-500">Calories</p>
                </div>
              )}
              {nutritionalInfo.fat !== undefined && (
                <div className="text-center">
                  <p className="text-2xl font-bold">{nutritionalInfo.fat}g</p>
                  <p className="text-sm text-gray-500">Fat</p>
                </div>
              )}
              {nutritionalInfo.carbs !== undefined && (
                <div className="text-center">
                  <p className="text-2xl font-bold">{nutritionalInfo.carbs}g</p>
                  <p className="text-sm text-gray-500">Carbs</p>
                </div>
              )}
              {nutritionalInfo.protein !== undefined && (
                <div className="text-center">
                  <p className="text-2xl font-bold">{nutritionalInfo.protein}g</p>
                  <p className="text-sm text-gray-500">Protein</p>
                </div>
              )}
              {nutritionalInfo.sugar !== undefined && (
                <div className="text-center">
                  <p className="text-2xl font-bold">{nutritionalInfo.sugar}g</p>
                  <p className="text-sm text-gray-500">Sugar</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}

      {nutritionalInfo?.allergens && nutritionalInfo.allergens.length > 0 && (
        <div className="mt-6 bg-red-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Allergen Information</h4>
              <p className="text-sm text-gray-700 mb-2">
                This product contains the following allergens:
              </p>
              <div className="flex flex-wrap gap-2">
                {nutritionalInfo.allergens.map((allergen, index) => (
                  <Badge key={index} variant="outline" className="bg-white">
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
