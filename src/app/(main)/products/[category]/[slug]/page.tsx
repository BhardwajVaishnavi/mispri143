'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Heart, ShoppingBag, Truck, Clock, ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
  variants?: {
    type: string;
    options: {
      id: string;
      name: string;
      price?: number;
      image?: string;
    }[];
  }[];
  addons?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  }[];
  specifications?: {
    [key: string]: string;
  };
  deliveryInfo?: string;
  careInstructions?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const category = params.category as string;
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<{[key: string]: string}>({});
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // In a real app, fetch from API
        // const response = await fetch(`/api/products/${category}/${slug}`);
        // const data = await response.json();

        // Mock data for now
        const mockProduct: Product = {
          id: '1',
          name: 'Red Roses Bouquet',
          slug: 'red-roses-bouquet',
          description: 'A beautiful bouquet of fresh red roses, perfect for expressing love and affection. Each rose is carefully selected and arranged to create a stunning presentation.',
          price: 1299,
          originalPrice: 1499,
          images: [
            '/images/product-roses.jpg',
            '/images/product-roses-2.jpg',
            '/images/product-roses-3.jpg',
          ],
          category: 'flowers',
          rating: 4.8,
          reviewsCount: 124,
          isBestseller: true,
          variants: [
            {
              type: 'Size',
              options: [
                { id: 'small', name: 'Small (8 Roses)', price: 1299 },
                { id: 'medium', name: 'Medium (12 Roses)', price: 1699 },
                { id: 'large', name: 'Large (20 Roses)', price: 2499 },
              ],
            },
            {
              type: 'Wrapping',
              options: [
                { id: 'paper', name: 'Paper Wrap' },
                { id: 'box', name: 'Gift Box', price: 200 },
                { id: 'vase', name: 'Glass Vase', price: 500 },
              ],
            },
          ],
          addons: [
            { id: 'card', name: 'Greeting Card', price: 99 },
            { id: 'chocolates', name: 'Box of Chocolates', price: 299 },
            { id: 'teddy', name: 'Teddy Bear', price: 399 },
          ],
          specifications: {
            'Flower Type': 'Roses',
            'Color': 'Red',
            'Stem Length': '40-50 cm',
            'Occasion': 'Birthday, Anniversary, Valentine\'s Day',
          },
          deliveryInfo: 'Same day delivery available if ordered before 4 PM. Standard delivery takes 1-2 business days.',
          careInstructions: 'Keep in a cool place away from direct sunlight. Change water every 2 days. Trim stems at an angle every 3 days.',
        };

        setProduct(mockProduct);

        // Initialize selected variants with default values
        if (mockProduct.variants) {
          const defaultVariants: {[key: string]: string} = {};
          mockProduct.variants.forEach(variant => {
            defaultVariants[variant.type] = variant.options[0].id;
          });
          setSelectedVariants(defaultVariants);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [category, slug]);

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= 10) {
      setQuantity(value);
    }
  };

  const handleVariantChange = (type: string, optionId: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [type]: optionId
    }));
  };

  const handleAddonToggle = (addonId: string) => {
    setSelectedAddons(prev => {
      if (prev.includes(addonId)) {
        return prev.filter(id => id !== addonId);
      } else {
        return [...prev, addonId];
      }
    });
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;

    let total = product.price;

    // Add variant prices
    if (product.variants) {
      product.variants.forEach(variant => {
        const selectedOption = variant.options.find(option => option.id === selectedVariants[variant.type]);
        if (selectedOption && selectedOption.price) {
          // If the variant has a specific price, use that instead of the base price
          if (variant.type === 'Size') {
            total = selectedOption.price;
          } else {
            total += selectedOption.price;
          }
        }
      });
    }

    // Add addon prices
    if (product.addons) {
      product.addons.forEach(addon => {
        if (selectedAddons.includes(addon.id)) {
          total += addon.price;
        }
      });
    }

    // Multiply by quantity
    total *= quantity;

    return total;
  };

  const handleAddToCart = () => {
    // In a real app, this would add the product to the cart
    toast.success('Added to cart!');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="flex space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-gray-200 h-20 w-20 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you are looking for does not exist or has been removed.</p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-pink-600">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-pink-600">Products</Link>
        <span className="mx-2">/</span>
        <Link href={`/products/${category}`} className="hover:text-pink-600 capitalize">{category}</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">{product.name}</span>
      </div>

      {/* Back button for mobile */}
      <div className="md:hidden mb-4">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/products/${category}`} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to {category}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product images */}
        <div className="space-y-4">
          <div className="relative h-96 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={product.images[selectedImage] || '/images/product-placeholder.jpg'}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
            {product.isBestseller && (
              <div className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                Bestseller
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                New
              </div>
            )}
          </div>

          {/* Thumbnail images */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-20 w-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-pink-600' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image || '/images/product-placeholder.jpg'}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

          {/* Ratings */}
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 15.585l-7.07 3.707 1.35-7.87-5.72-5.573 7.91-1.149L10 0l3.53 7.7 7.91 1.149-5.72 5.573 1.35 7.87L10 15.585z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-2">
              {product.rating} ({product.reviewsCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-gray-800">₹{calculateTotalPrice().toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-gray-500 text-lg line-through ml-2">
                  ₹{(product.originalPrice * quantity).toLocaleString()}
                </span>
              )}
              {product.originalPrice && (
                <span className="ml-2 text-green-600 text-sm font-medium">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Variants */}
          {product.variants && product.variants.map((variant) => (
            <div key={variant.type} className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Select {variant.type}</h3>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((option) => (
                  <button
                    key={option.id}
                    className={`px-4 py-2 rounded-full border ${
                      selectedVariants[variant.type] === option.id
                        ? 'border-pink-600 bg-pink-50 text-pink-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleVariantChange(variant.type, option.id)}
                  >
                    {option.name}
                    {option.price && option.price !== product.price && (
                      <span className="ml-1">
                        {option.price > product.price ? `+₹${option.price - product.price}` : ''}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Addons */}
          {product.addons && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-2">Add Extras</h3>
              <div className="space-y-2">
                {product.addons.map((addon) => (
                  <div
                    key={addon.id}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      selectedAddons.includes(addon.id)
                        ? 'border-pink-600 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleAddonToggle(addon.id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        selectedAddons.includes(addon.id)
                          ? 'border-pink-600 bg-pink-600 text-white'
                          : 'border-gray-300'
                      }`}>
                        {selectedAddons.includes(addon.id) && <Check className="h-3 w-3" />}
                      </div>
                      <span className="ml-2">{addon.name}</span>
                    </div>
                    <span className="font-medium">+₹{addon.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">Quantity</h3>
            <div className="flex items-center">
              <button
                className="w-10 h-10 rounded-l-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-12 h-10 border-t border-b border-gray-300 text-center [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
              />
              <button
                className="w-10 h-10 rounded-r-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 10}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Delivery info */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Truck className="h-5 w-5 text-pink-600 mt-0.5 mr-2" />
              <div>
                <h3 className="font-semibold text-gray-800">Delivery Information</h3>
                <p className="text-sm text-gray-600 mt-1">{product.deliveryInfo}</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-6"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-pink-600 text-pink-600 hover:bg-pink-50 py-6"
            >
              <Heart className="h-5 w-5 mr-2" />
              Add to Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* Product details tabs */}
      <div className="mt-12">
        <Tabs defaultValue="details">
          <TabsList className="w-full border-b border-gray-200 mb-6">
            <TabsTrigger value="details" className="text-lg py-3">Details</TabsTrigger>
            <TabsTrigger value="care" className="text-lg py-3">Care Instructions</TabsTrigger>
            <TabsTrigger value="reviews" className="text-lg py-3">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Product Specifications</h3>
                <div className="space-y-2">
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex border-b border-gray-200 py-2">
                      <span className="font-medium text-gray-700 w-1/3">{key}</span>
                      <span className="text-gray-600 w-2/3">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Delivery Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Truck className="h-5 w-5 text-pink-600 mt-1 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">Shipping</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        We deliver across India. Standard delivery takes 1-2 business days.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-pink-600 mt-1 mr-3" />
                    <div>
                      <h4 className="font-medium text-gray-800">Same Day Delivery</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Order before 4 PM for same-day delivery in select cities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="care" className="py-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Care Instructions</h3>
            <p className="text-gray-600">{product.careInstructions}</p>
          </TabsContent>

          <TabsContent value="reviews" className="py-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Customer Reviews</h3>
              <Button>Write a Review</Button>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="text-3xl font-bold text-gray-800">{product.rating}</div>
                  <div className="flex mt-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 15.585l-7.07 3.707 1.35-7.87-5.72-5.573 7.91-1.149L10 0l3.53 7.7 7.91 1.149-5.72 5.573 1.35 7.87L10 15.585z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{product.reviewsCount} reviews</div>
                </div>

                <div className="flex-1">
                  {/* Rating bars */}
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="flex items-center mb-1">
                      <div className="text-sm text-gray-600 w-8">{star} star</div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full mx-2">
                        <div
                          className="h-2 bg-yellow-400 rounded-full"
                          style={{
                            width: `${Math.random() * 100}%`
                          }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-500 w-8">
                        {Math.floor(Math.random() * product.reviewsCount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sample reviews */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="border-b border-gray-200 pb-6">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium text-gray-800">John Doe</div>
                    <div className="text-sm text-gray-500">2 weeks ago</div>
                  </div>
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, j) => (
                      <svg
                        key={j}
                        className={`h-4 w-4 ${
                          j < 5 - i ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 15.585l-7.07 3.707 1.35-7.87-5.72-5.573 7.91-1.149L10 0l3.53 7.7 7.91 1.149-5.72 5.573 1.35 7.87L10 15.585z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">Great product!</h4>
                  <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline">Load More Reviews</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Related products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Also Like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative">
                <Link href="#">
                  <div className="relative h-64 w-full">
                    <Image
                      src={`/images/product-placeholder.jpg`}
                      alt={`Related Product ${i + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Link>
              </div>

              <div className="p-4">
                <Link href="#">
                  <h3 className="font-medium text-gray-800 mb-1 hover:text-pink-600 transition-colors">
                    Related Product {i + 1}
                  </h3>
                </Link>

                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, j) => (
                      <svg
                        key={j}
                        className={`h-4 w-4 ${
                          j < 4 ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 15.585l-7.07 3.707 1.35-7.87-5.72-5.573 7.91-1.149L10 0l3.53 7.7 7.91 1.149-5.72 5.573 1.35 7.87L10 15.585z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-gray-800">₹{899 + i * 100}</span>
                  </div>
                  <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                    <ShoppingBag className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
