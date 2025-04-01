'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ProductForm from '@/components/admin/products/ProductForm';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Mock categories data
  const mockCategories = [
    { id: 'cat1', name: 'Flowers' },
    { id: 'cat2', name: 'Cakes' },
    { id: 'cat3', name: 'Gift Baskets' },
    { id: 'cat4', name: 'Chocolates' },
    { id: 'cat5', name: 'Plants' }
  ];

  // Mock subcategories data
  const mockSubcategories = [
    { value: 'sub1', label: 'Roses', category: 'Flowers' },
    { value: 'sub2', label: 'Lilies', category: 'Flowers' },
    { value: 'sub3', label: 'Chocolate Cake', category: 'Cakes' },
    { value: 'sub4', label: 'Vanilla Cake', category: 'Cakes' },
    { value: 'sub5', label: 'Premium Gift Basket', category: 'Gift Baskets' }
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(`/api/products/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id && params.id !== 'new') {
      fetchProduct();
    } else {
      setLoading(false);
      setIsEditing(true);
      setProduct({
        name: '',
        description: '',
        shortDescription: '',
        price: 0,
        salePrice: null,
        categoryId: '',
        status: 'DRAFT',
        images: [],
        thumbnail: '',
        featured: false,
        bestseller: false,
        new: true,
        customizable: false,
        variants: [],
        customizationOptions: [],
        tags: [],
        occasions: [],
        minimumOrderQuantity: 1,
        maximumOrderQuantity: 10,
        leadTime: 24,
        availableForDelivery: true,
        availableForPickup: true,
        freeDelivery: false,
        deliveryFee: 0,
      });
    }
  }, [params.id]);

  const handleSave = async (productData: any) => {
    try {
      setLoading(true);

      const isNewProduct = params.id === 'new';
      const method = isNewProduct ? 'POST' : 'PATCH';
      const url = isNewProduct ? '/api/products' : `/api/products/${params.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(isNewProduct ? productData : { id: params.id, ...productData }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isNewProduct ? 'create' : 'update'} product`);
      }

      const savedProduct = await response.json();
      setProduct(savedProduct);
      setIsEditing(false);

      if (isNewProduct) {
        router.push(`/admin/products/${savedProduct.id}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !product) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/products')}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {params.id === 'new' ? 'Create New Product' : product?.name || 'Product Details'}
            </h1>
            {product?.id && (
              <p className="text-gray-500 text-sm">
                ID: {product.id}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit Product
            </Button>
          )}
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (params.id === 'new') {
                  router.push('/admin/products');
                } else {
                  setIsEditing(false);
                }
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
          <p className="text-gray-500 mb-6">The product form is temporarily unavailable due to component issues. Please try again later.</p>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-gray-500 mt-1">{product.shortDescription}</p>
                </div>
                <Badge className={
                  product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                  product.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {product.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-medium">₹{product.price.toFixed(2)}</p>
                  {product.salePrice && (
                    <p className="text-sm text-red-500">Sale: ₹{product.salePrice.toFixed(2)}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{product.category?.name || 'Uncategorized'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Stock</p>
                  <p className="font-medium">
                    {product.variants?.length > 0
                      ? `${product.variants.reduce((sum: number, v: any) => sum + (v.stockQuantity || 0), 0)} units`
                      : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lead Time</p>
                  <p className="font-medium">{product.leadTime} hours</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
            </Card>

            <Tabs defaultValue="variants">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="variants">Variants</TabsTrigger>
                <TabsTrigger value="customization">Customization</TabsTrigger>
                <TabsTrigger value="images">Images</TabsTrigger>
                <TabsTrigger value="details">Additional Details</TabsTrigger>
              </TabsList>

              <TabsContent value="variants" className="p-4 border rounded-md mt-2">
                {product.variants?.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attributes</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {product.variants.map((variant: any) => (
                          <tr key={variant.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{variant.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.sku || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ₹{variant.price.toFixed(2)}
                              {variant.salePrice && (
                                <span className="text-red-500 ml-2">₹{variant.salePrice.toFixed(2)}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{variant.stockQuantity || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {variant.size && <span className="mr-2">Size: {variant.size}</span>}
                              {variant.color && <span className="mr-2">Color: {variant.color}</span>}
                              {variant.flavor && <span className="mr-2">Flavor: {variant.flavor}</span>}
                              {variant.weight && <span>Weight: {variant.weight}kg</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No variants available for this product.</p>
                )}
              </TabsContent>

              <TabsContent value="customization" className="p-4 border rounded-md mt-2">
                {product.customizationOptions?.length > 0 ? (
                  <div className="space-y-4">
                    {product.customizationOptions.map((option: any) => (
                      <div key={option.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{option.name}</h3>
                            <p className="text-sm text-gray-500">Type: {option.type}</p>
                            {option.required && (
                              <Badge className="mt-1 bg-blue-100 text-blue-800">Required</Badge>
                            )}
                          </div>
                          {option.additionalPrice > 0 && (
                            <Badge className="bg-green-100 text-green-800">+₹{option.additionalPrice.toFixed(2)}</Badge>
                          )}
                        </div>

                        {option.options?.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-sm font-medium mb-2">Available Options:</h4>
                            <ul className="space-y-1">
                              {option.options.map((subOption: any) => (
                                <li key={subOption.id} className="text-sm flex justify-between">
                                  <span>{subOption.name}</span>
                                  {subOption.price > 0 && <span>+₹{subOption.price.toFixed(2)}</span>}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {option.maxLength && (
                          <p className="text-sm text-gray-500 mt-2">Maximum Length: {option.maxLength} characters</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No customization options available for this product.</p>
                )}
              </TabsContent>

              <TabsContent value="images" className="p-4 border rounded-md mt-2">
                {product.images?.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {product.images.map((image: string, index: number) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                        <img
                          src={image}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                        {image === product.thumbnail && (
                          <Badge className="absolute top-2 left-2 bg-blue-100 text-blue-800">Thumbnail</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No images available for this product.</p>
                )}
              </TabsContent>

              <TabsContent value="details" className="p-4 border rounded-md mt-2">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags?.length > 0 ? (
                        product.tags.map((tag: string, index: number) => (
                          <Badge key={index} className="bg-gray-100 text-gray-800">{tag}</Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">No tags</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Occasions</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.occasions?.length > 0 ? (
                        product.occasions.map((occasion: string, index: number) => (
                          <Badge key={index} className="bg-purple-100 text-purple-800">{occasion}</Badge>
                        ))
                      ) : (
                        <p className="text-gray-500">No occasions</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Delivery Options</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Available for Delivery</p>
                        <p className="font-medium">{product.availableForDelivery ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Available for Pickup</p>
                        <p className="font-medium">{product.availableForPickup ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Free Delivery</p>
                        <p className="font-medium">{product.freeDelivery ? 'Yes' : 'No'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Delivery Fee</p>
                        <p className="font-medium">₹{product.deliveryFee?.toFixed(2) || '0.00'}</p>
                      </div>
                    </div>
                  </div>

                  {product.careInstructions && (
                    <div>
                      <h3 className="font-medium mb-2">Care Instructions</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {product.careInstructions.wateringFrequency && (
                          <div>
                            <p className="text-sm text-gray-500">Watering Frequency</p>
                            <p className="font-medium">{product.careInstructions.wateringFrequency}</p>
                          </div>
                        )}
                        {product.careInstructions.sunlightNeeds && (
                          <div>
                            <p className="text-sm text-gray-500">Sunlight Needs</p>
                            <p className="font-medium">{product.careInstructions.sunlightNeeds}</p>
                          </div>
                        )}
                        {product.careInstructions.temperature && (
                          <div>
                            <p className="text-sm text-gray-500">Temperature</p>
                            <p className="font-medium">{product.careInstructions.temperature}</p>
                          </div>
                        )}
                        {product.careInstructions.shelfLife && (
                          <div>
                            <p className="text-sm text-gray-500">Shelf Life</p>
                            <p className="font-medium">{product.careInstructions.shelfLife}</p>
                          </div>
                        )}
                      </div>
                      {product.careInstructions.additionalNotes && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Additional Notes</p>
                          <p className="font-medium">{product.careInstructions.additionalNotes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {product.nutritionalInfo && (
                    <div>
                      <h3 className="font-medium mb-2">Nutritional Information</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Calories</p>
                          <p className="font-medium">{product.nutritionalInfo.calories} kcal</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fat</p>
                          <p className="font-medium">{product.nutritionalInfo.fat}g</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Carbs</p>
                          <p className="font-medium">{product.nutritionalInfo.carbs}g</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Protein</p>
                          <p className="font-medium">{product.nutritionalInfo.protein}g</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Sugar</p>
                          <p className="font-medium">{product.nutritionalInfo.sugar}g</p>
                        </div>
                      </div>
                      {product.nutritionalInfo.allergens?.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">Allergens</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {product.nutritionalInfo.allergens.map((allergen: string, index: number) => (
                              <Badge key={index} className="bg-red-100 text-red-800">{allergen}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Product Status</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Featured</span>
                  <Badge className={product.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {product.featured ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Bestseller</span>
                  <Badge className={product.bestseller ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {product.bestseller ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">New</span>
                  <Badge className={product.new ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {product.new ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Customizable</span>
                  <Badge className={product.customizable ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {product.customizable ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Limits</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Minimum Order</span>
                  <span className="font-medium">{product.minimumOrderQuantity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Maximum Order</span>
                  <span className="font-medium">{product.maximumOrderQuantity}</span>
                </div>
              </div>
            </Card>

            {product.ingredients?.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-semibold mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {product.ingredients.map((ingredient: any) => (
                    <li key={ingredient.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-gray-700">{ingredient.name}</span>
                        {ingredient.allergen && (
                          <Badge className="ml-2 bg-red-100 text-red-800">Allergen</Badge>
                        )}
                      </div>
                      <span className="text-gray-500">
                        {ingredient.quantity} {ingredient.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
