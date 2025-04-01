import React, { useState } from 'react';
import CategoryCreateDialog from './CategoryCreateDialog';
import { useForm, Controller } from 'react-hook-form';
import { PhotoIcon, PlusIcon } from '@heroicons/react/24/outline';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ProductVariantsForm from './ProductVariantsForm';
import ProductCustomizationForm from './ProductCustomizationForm';
import { ProductCategory, ProductVariant, ProductCustomizationOption } from '@/types/product';

interface ProductFormData {
  name: string;
  description: string;
  shortDescription?: string;
  sku?: string;
  barcode?: string;
  slug?: string;
  price: number;
  salePrice?: number;
  cost?: number;
  taxRate?: number;
  categoryId: string;
  subcategory?: string;
  status: string;
  featured: boolean;
  bestseller: boolean;
  new: boolean;
  occasions: string[];
  tags: string[];
  images: FileList;
  thumbnail?: string;
  customizable: boolean;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number;
  leadTime?: number;
  availableForDelivery: boolean;
  availableForPickup: boolean;
  freeDelivery: boolean;
  deliveryFee?: number;
  variants: ProductVariant[];
  customizationOptions: ProductCustomizationOption[];
  ingredients?: {
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
  careInstructions?: {
    wateringFrequency?: string;
    sunlightNeeds?: string;
    temperature?: string;
    shelfLife?: string;
    storageInfo?: string;
    additionalNotes?: string;
  };
}

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  categories?: { id: string; name: string; }[];
  subcategories?: { value: string; label: string; category: string; }[];
  isLoading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  categories = [],
  subcategories = [],
  isLoading = false
}) => {
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: {
      ...initialData,
      status: initialData?.status || 'ACTIVE',
      featured: initialData?.featured || false,
      bestseller: initialData?.bestseller || false,
      new: initialData?.new || false,
      customizable: initialData?.customizable || false,
      availableForDelivery: initialData?.availableForDelivery || true,
      availableForPickup: initialData?.availableForPickup || true,
      freeDelivery: initialData?.freeDelivery || false,
      minimumOrderQuantity: initialData?.minimumOrderQuantity || 1,
      maximumOrderQuantity: initialData?.maximumOrderQuantity || 100,
      variants: initialData?.variants || [],
      customizationOptions: initialData?.customizationOptions || [],
      occasions: initialData?.occasions || [],
      tags: initialData?.tags || []
    }
  });

  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [ingredients, setIngredients] = useState(initialData?.ingredients || []);
  const [allergens, setAllergens] = useState<string[]>(initialData?.nutritionalInfo?.allergens || []);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  // Watch for category changes to filter subcategories
  const selectedCategory = watch('categoryId');
  const isCustomizable = watch('customizable');

  // Get the category name for the selected category ID
  const selectedCategoryName = categories?.find(cat => cat.id === selectedCategory)?.name as ProductCategory || '';

  // Filter subcategories based on selected category
  const filteredSubcategories = subcategories?.filter(sub => sub.category === selectedCategoryName) || [];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const previews = Array.from(files).map(file => URL.createObjectURL(file));
      setImagePreview(previews);
    }
  };

  // Handle variants change
  const handleVariantsChange = (variants: ProductVariant[]) => {
    setValue('variants', variants);
  };

  // Handle customization options change
  const handleCustomizationOptionsChange = (options: ProductCustomizationOption[]) => {
    setValue('customizationOptions', options);
  };

  // Handle adding a new ingredient
  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: 0, unit: 'g', allergen: false }]);
  };

  // Handle updating an ingredient
  const handleIngredientChange = (index: number, field: string, value: any) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    setIngredients(updatedIngredients);
    setValue('ingredients', updatedIngredients);
  };

  // Handle removing an ingredient
  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
    setValue('ingredients', updatedIngredients);
  };

  // Handle adding a new allergen
  const handleAddAllergen = (allergen: string) => {
    if (allergen && !allergens.includes(allergen)) {
      const updatedAllergens = [...allergens, allergen];
      setAllergens(updatedAllergens);
      setValue('nutritionalInfo.allergens', updatedAllergens);
    }
  };

  // Handle removing an allergen
  const handleRemoveAllergen = (allergen: string) => {
    const updatedAllergens = allergens.filter(a => a !== allergen);
    setAllergens(updatedAllergens);
    setValue('nutritionalInfo.allergens', updatedAllergens);
  };

  // Handle adding a new category
  const handleAddCategory = (newCategory: { id: string; name: string }) => {
    // In a real app, you would update the categories list from the API
    // For now, we'll just set the selected category
    setValue('categoryId', newCategory.id);
  };

  // Set ingredients and allergens when form is submitted
  const handleFormSubmit = (data: ProductFormData) => {
    data.ingredients = ingredients;
    if (data.nutritionalInfo) {
      data.nutritionalInfo.allergens = allergens;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="customization">Customization</TabsTrigger>
          <TabsTrigger value="additional">Additional Info</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                className="mt-1"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                {...register('sku')}
                className="mt-1"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="category">Category</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCategoryDialogOpen(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  + Add New
                </Button>
              </div>
              <select
                id="category"
                {...register('categoryId', { required: 'Category is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories?.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
            </div>

            <div>
              <Label htmlFor="subcategory">Subcategory</Label>
              <select
                id="subcategory"
                {...register('subcategory')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!selectedCategory}
              >
                <option value="">Select a subcategory</option>
                {filteredSubcategories.map(subcategory => (
                  <option key={subcategory.value} value={subcategory.value}>{subcategory.label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { required: 'Price is required', min: 0 })}
                className="mt-1"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
            </div>

            <div>
              <Label htmlFor="salePrice">Sale Price</Label>
              <Input
                id="salePrice"
                type="number"
                step="0.01"
                {...register('salePrice', { min: 0 })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cost">Cost</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                {...register('cost', { min: 0 })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                step="0.01"
                {...register('taxRate', { min: 0 })}
                className="mt-1"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea
                id="shortDescription"
                {...register('shortDescription')}
                rows={2}
                className="mt-1"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Full Description</Label>
              <Textarea
                id="description"
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="mt-1"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                {...register('status')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="featured"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="featured">Featured Product</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="bestseller"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="bestseller"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="bestseller">Bestseller</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="new"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="new"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="new">New Product</Label>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="minimumOrderQuantity">Minimum Order Quantity</Label>
              <Input
                id="minimumOrderQuantity"
                type="number"
                {...register('minimumOrderQuantity', { min: 1 })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="maximumOrderQuantity">Maximum Order Quantity</Label>
              <Input
                id="maximumOrderQuantity"
                type="number"
                {...register('maximumOrderQuantity', { min: 1 })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="leadTime">Lead Time (hours)</Label>
              <Input
                id="leadTime"
                type="number"
                {...register('leadTime', { min: 0 })}
                className="mt-1"
              />
            </div>

            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2">
                <Controller
                  name="availableForDelivery"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="availableForDelivery"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="availableForDelivery">Available for Delivery</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="availableForPickup"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="availableForPickup"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="availableForPickup">Available for Pickup</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="freeDelivery"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="freeDelivery"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="freeDelivery">Free Delivery</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="deliveryFee">Delivery Fee</Label>
              <Input
                id="deliveryFee"
                type="number"
                step="0.01"
                {...register('deliveryFee', { min: 0 })}
                className="mt-1"
                disabled={watch('freeDelivery')}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                {...register('tags')}
                className="mt-1"
                placeholder="e.g. birthday, anniversary, gift"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="occasions">Occasions (comma separated)</Label>
              <Input
                id="occasions"
                {...register('occasions')}
                className="mt-1"
                placeholder="e.g. BIRTHDAY, ANNIVERSARY, WEDDING"
              />
            </div>

            <div className="col-span-2">
              <Label className="block text-sm font-medium text-gray-700">Images</Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                      <span>Upload files</span>
                      <input
                        type="file"
                        multiple
                        {...register('images')}
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-4">
                {imagePreview.map((preview, index) => (
                  <img key={index} src={preview} alt="Preview" className="h-24 w-24 object-cover rounded-md" />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Variants Tab */}
        <TabsContent value="variants" className="space-y-6">
          <ProductVariantsForm
            variants={watch('variants') || []}
            onChange={handleVariantsChange}
            productCategory={selectedCategoryName}
          />
        </TabsContent>

        {/* Customization Tab */}
        <TabsContent value="customization" className="space-y-6">
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <Controller
                name="customizable"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="customizable"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="customizable">Product is Customizable</Label>
            </div>
          </div>

          {isCustomizable && (
            <ProductCustomizationForm
              customizationOptions={watch('customizationOptions') || []}
              onChange={handleCustomizationOptionsChange}
              productCategory={selectedCategoryName}
            />
          )}
        </TabsContent>

        {/* Additional Info Tab */}
        <TabsContent value="additional" className="space-y-6">
          {/* Ingredients Section (for cakes, chocolates, etc.) */}
          {['CAKE', 'CHOCOLATE'].includes(selectedCategoryName) && (
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Ingredients</h3>
              <div className="space-y-4">
                {ingredients.map((ingredient, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <Label htmlFor={`ingredient-name-${index}`}>Name</Label>
                      <Input
                        id={`ingredient-name-${index}`}
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`ingredient-quantity-${index}`}>Quantity</Label>
                      <Input
                        id={`ingredient-quantity-${index}`}
                        type="number"
                        step="0.01"
                        value={ingredient.quantity}
                        onChange={(e) => handleIngredientChange(index, 'quantity', parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`ingredient-unit-${index}`}>Unit</Label>
                      <select
                        id={`ingredient-unit-${index}`}
                        value={ingredient.unit}
                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="ml">ml</option>
                        <option value="l">l</option>
                        <option value="pcs">pcs</option>
                        <option value="tbsp">tbsp</option>
                        <option value="tsp">tsp</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2 mt-6">
                        <input
                          type="checkbox"
                          id={`ingredient-allergen-${index}`}
                          checked={ingredient.allergen}
                          onChange={(e) => handleIngredientChange(index, 'allergen', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <Label htmlFor={`ingredient-allergen-${index}`}>Allergen</Label>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="mt-6 text-red-500"
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        &times;
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddIngredient}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>

              {/* Nutritional Information */}
              <h3 className="text-lg font-medium mt-6 mb-4">Nutritional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    step="0.01"
                    {...register('nutritionalInfo.calories', { min: 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    step="0.01"
                    {...register('nutritionalInfo.fat', { min: 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    step="0.01"
                    {...register('nutritionalInfo.carbs', { min: 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    step="0.01"
                    {...register('nutritionalInfo.protein', { min: 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="sugar">Sugar (g)</Label>
                  <Input
                    id="sugar"
                    type="number"
                    step="0.01"
                    {...register('nutritionalInfo.sugar', { min: 0 })}
                  />
                </div>
              </div>

              {/* Allergens */}
              <h4 className="font-medium mt-4 mb-2">Allergens</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {allergens.map((allergen, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                    <span>{allergen}</span>
                    <button
                      type="button"
                      className="ml-2 text-gray-500 hover:text-red-500"
                      onClick={() => handleRemoveAllergen(allergen)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="allergen-input"
                  placeholder="Add allergen"
                  className="w-64"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddAllergen((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById('allergen-input') as HTMLInputElement;
                    handleAddAllergen(input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
            </Card>
          )}

          {/* Care Instructions (for flowers, plants) */}
          {['FLOWER', 'PLANT'].includes(selectedCategoryName) && (
            <Card className="p-4">
              <h3 className="text-lg font-medium mb-4">Care Instructions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wateringFrequency">Watering Frequency</Label>
                  <Input
                    id="wateringFrequency"
                    {...register('careInstructions.wateringFrequency')}
                    placeholder="e.g. Every 2-3 days"
                  />
                </div>
                <div>
                  <Label htmlFor="sunlightNeeds">Sunlight Needs</Label>
                  <Input
                    id="sunlightNeeds"
                    {...register('careInstructions.sunlightNeeds')}
                    placeholder="e.g. Indirect sunlight"
                  />
                </div>
                <div>
                  <Label htmlFor="temperature">Temperature</Label>
                  <Input
                    id="temperature"
                    {...register('careInstructions.temperature')}
                    placeholder="e.g. 18-24°C"
                  />
                </div>
                <div>
                  <Label htmlFor="shelfLife">Shelf Life</Label>
                  <Input
                    id="shelfLife"
                    {...register('careInstructions.shelfLife')}
                    placeholder="e.g. 7-10 days"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="storageInfo">Storage Information</Label>
                  <Textarea
                    id="storageInfo"
                    {...register('careInstructions.storageInfo')}
                    placeholder="Storage instructions..."
                    rows={2}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    {...register('careInstructions.additionalNotes')}
                    placeholder="Any additional care instructions..."
                    rows={2}
                  />
                </div>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save Product'}
        </Button>
      </div>

      {/* Category Create Dialog */}
      <CategoryCreateDialog
        isOpen={isCategoryDialogOpen}
        onClose={() => setIsCategoryDialogOpen(false)}
        onSave={handleAddCategory}
      />
    </form>
  );
};

export default ProductForm;