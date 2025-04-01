'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Filter, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  isNew?: boolean;
  isBestseller?: boolean;
  tags?: string[];
  occasion?: string[];
}

interface FilterOption {
  id: string;
  name: string;
  count: number;
}

export default function ProductListingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { category } = params;
  
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popularity');
  
  // Filter options
  const occasions: FilterOption[] = [
    { id: 'birthday', name: 'Birthday', count: 24 },
    { id: 'anniversary', name: 'Anniversary', count: 18 },
    { id: 'valentines', name: 'Valentine\'s Day', count: 15 },
    { id: 'wedding', name: 'Wedding', count: 12 },
    { id: 'congratulations', name: 'Congratulations', count: 10 },
  ];
  
  const tags: FilterOption[] = [
    { id: 'roses', name: 'Roses', count: 15 },
    { id: 'lilies', name: 'Lilies', count: 12 },
    { id: 'orchids', name: 'Orchids', count: 8 },
    { id: 'chocolate', name: 'Chocolate', count: 20 },
    { id: 'vanilla', name: 'Vanilla', count: 15 },
    { id: 'fruit', name: 'Fruit', count: 10 },
  ];
  
  const sortOptions = [
    { id: 'popularity', name: 'Popularity' },
    { id: 'price_low', name: 'Price: Low to High' },
    { id: 'price_high', name: 'Price: High to Low' },
    { id: 'newest', name: 'Newest First' },
  ];
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, fetch from API with filters
        // const queryParams = new URLSearchParams();
        // if (selectedOccasions.length) queryParams.set('occasions', selectedOccasions.join(','));
        // if (selectedTags.length) queryParams.set('tags', selectedTags.join(','));
        // queryParams.set('minPrice', priceRange[0].toString());
        // queryParams.set('maxPrice', priceRange[1].toString());
        // queryParams.set('sort', sortBy);
        
        // const response = await fetch(`/api/products/${category}?${queryParams}`);
        // const data = await response.json();
        
        // Mock data for now
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Red Roses Bouquet',
            slug: 'red-roses-bouquet',
            price: 1299,
            originalPrice: 1499,
            image: '/images/product-roses.jpg',
            category: 'flowers',
            rating: 4.8,
            isBestseller: true,
            tags: ['roses', 'red', 'bouquet'],
            occasion: ['anniversary', 'valentines']
          },
          {
            id: '2',
            name: 'Mixed Flowers Bouquet',
            slug: 'mixed-flowers-bouquet',
            price: 1099,
            image: '/images/product-mixed-flowers.jpg',
            category: 'flowers',
            rating: 4.7,
            tags: ['mixed', 'bouquet'],
            occasion: ['birthday', 'congratulations']
          },
          {
            id: '3',
            name: 'Lilies Arrangement',
            slug: 'lilies-arrangement',
            price: 1399,
            originalPrice: 1599,
            image: '/images/product-lilies.jpg',
            category: 'flowers',
            rating: 4.6,
            tags: ['lilies', 'white', 'arrangement'],
            occasion: ['wedding', 'sympathy']
          },
          {
            id: '4',
            name: 'Orchid Plant',
            slug: 'orchid-plant',
            price: 1899,
            image: '/images/product-orchid.jpg',
            category: 'plants',
            rating: 4.9,
            isNew: true,
            tags: ['orchids', 'plant', 'premium'],
            occasion: ['housewarming', 'anniversary']
          },
          {
            id: '5',
            name: 'Chocolate Cake',
            slug: 'chocolate-cake',
            price: 899,
            image: '/images/product-cake.jpg',
            category: 'cakes',
            rating: 4.7,
            tags: ['chocolate', 'cake', 'dessert'],
            occasion: ['birthday', 'celebration']
          },
          {
            id: '6',
            name: 'Vanilla Cake',
            slug: 'vanilla-cake',
            price: 849,
            originalPrice: 999,
            image: '/images/product-vanilla-cake.jpg',
            category: 'cakes',
            rating: 4.5,
            isBestseller: true,
            tags: ['vanilla', 'cake', 'dessert'],
            occasion: ['birthday', 'anniversary']
          },
          {
            id: '7',
            name: 'Fruit Cake',
            slug: 'fruit-cake',
            price: 949,
            image: '/images/product-fruit-cake.jpg',
            category: 'cakes',
            rating: 4.6,
            tags: ['fruit', 'cake', 'dessert'],
            occasion: ['birthday', 'celebration']
          },
          {
            id: '8',
            name: 'Gift Basket',
            slug: 'gift-basket',
            price: 1499,
            image: '/images/product-gift-basket.jpg',
            category: 'gifts',
            rating: 4.8,
            isNew: true,
            tags: ['basket', 'assorted', 'gift'],
            occasion: ['thank you', 'congratulations']
          },
        ];
        
        // Filter by category if specified
        let filteredProducts = mockProducts;
        if (category && category !== 'all') {
          filteredProducts = mockProducts.filter(p => p.category === category);
        }
        
        // Apply filters
        if (selectedOccasions.length) {
          filteredProducts = filteredProducts.filter(p => 
            p.occasion && p.occasion.some(o => selectedOccasions.includes(o))
          );
        }
        
        if (selectedTags.length) {
          filteredProducts = filteredProducts.filter(p => 
            p.tags && p.tags.some(t => selectedTags.includes(t))
          );
        }
        
        filteredProducts = filteredProducts.filter(p => 
          p.price >= priceRange[0] && p.price <= priceRange[1]
        );
        
        // Apply sorting
        switch (sortBy) {
          case 'price_low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price_high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            filteredProducts.sort((a, b) => (a.isNew ? -1 : 1) - (b.isNew ? -1 : 1));
            break;
          default: // popularity
            filteredProducts.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
            break;
        }
        
        setProducts(filteredProducts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category, selectedOccasions, selectedTags, priceRange, sortBy]);

  const toggleOccasion = (id: string) => {
    setSelectedOccasions(prev => 
      prev.includes(id) ? prev.filter(o => o !== id) : [...prev, id]
    );
  };

  const toggleTag = (id: string) => {
    setSelectedTags(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]]);
  };

  const clearFilters = () => {
    setSelectedOccasions([]);
    setSelectedTags([]);
    setPriceRange([0, 5000]);
  };

  const handleAddToCart = (productId: string) => {
    // In a real app, this would add the product to the cart
    toast.success('Added to cart!');
  };

  const getCategoryTitle = () => {
    if (!category || category === 'all') return 'All Products';
    return category.toString().charAt(0).toUpperCase() + category.toString().slice(1);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="hidden md:block">
              <div className="h-80 bg-gray-200 rounded mb-6"></div>
            </div>
            <div className="md:col-span-3">
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
                ))}
              </div>
            </div>
          </div>
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
        {category && category !== 'all' && (
          <>
            <span className="mx-2">/</span>
            <span className="text-gray-800 capitalize">{category}</span>
          </>
        )}
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{getCategoryTitle()}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters - Desktop */}
        <div className="hidden md:block space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Filters</h2>
              <button 
                className="text-sm text-pink-600 hover:text-pink-700"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Price Range</h3>
              <div className="px-2">
                <Slider
                  defaultValue={[0, 5000]}
                  min={0}
                  max={5000}
                  step={100}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={handlePriceChange}
                  className="mb-4"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
            
            {/* Occasions */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Occasions</h3>
              <div className="space-y-2">
                {occasions.map((occasion) => (
                  <div key={occasion.id} className="flex items-center">
                    <Checkbox
                      id={`occasion-${occasion.id}`}
                      checked={selectedOccasions.includes(occasion.id)}
                      onCheckedChange={() => toggleOccasion(occasion.id)}
                      className="mr-2"
                    />
                    <label 
                      htmlFor={`occasion-${occasion.id}`}
                      className="text-sm text-gray-700 flex-1 cursor-pointer"
                    >
                      {occasion.name}
                    </label>
                    <span className="text-xs text-gray-500">({occasion.count})</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Tags */}
            <div>
              <h3 className="font-medium text-gray-800 mb-3">Tags</h3>
              <div className="space-y-2">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={selectedTags.includes(tag.id)}
                      onCheckedChange={() => toggleTag(tag.id)}
                      className="mr-2"
                    />
                    <label 
                      htmlFor={`tag-${tag.id}`}
                      className="text-sm text-gray-700 flex-1 cursor-pointer"
                    >
                      {tag.name}
                    </label>
                    <span className="text-xs text-gray-500">({tag.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Products */}
        <div className="md:col-span-3">
          {/* Sort and filter controls */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Sort by:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
            
            <div className="flex items-center">
              <span className="text-gray-600 mr-2">Showing {products.length} products</span>
              
              {/* Mobile filter button */}
              <button
                className="md:hidden flex items-center bg-white border border-gray-300 rounded-md py-2 px-3 text-sm"
                onClick={() => setIsMobileFilterOpen(true)}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filters
              </button>
            </div>
          </div>
          
          {/* Active filters */}
          {(selectedOccasions.length > 0 || selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < 5000) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedOccasions.map((id) => (
                <Badge
                  key={`occasion-${id}`}
                  className="bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100"
                  onClick={() => toggleOccasion(id)}
                >
                  {occasions.find(o => o.id === id)?.name}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              
              {selectedTags.map((id) => (
                <Badge
                  key={`tag-${id}`}
                  className="bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100"
                  onClick={() => toggleTag(id)}
                >
                  {tags.find(t => t.id === id)?.name}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
              
              {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                <Badge
                  className="bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100"
                  onClick={() => setPriceRange([0, 5000])}
                >
                  ₹{priceRange[0]} - ₹{priceRange[1]}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              )}
              
              <button
                className="text-sm text-pink-600 hover:text-pink-700 ml-2"
                onClick={clearFilters}
              >
                Clear All
              </button>
            </div>
          )}
          
          {/* Products grid */}
          {products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or browse our other categories.</p>
              <Button asChild>
                <Link href="/products">View All Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="relative">
                    <Link href={`/products/${product.category}/${product.slug}`}>
                      <div className="relative h-64 w-full">
                        <Image
                          src={product.image || '/images/product-placeholder.jpg'}
                          alt={product.name}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isNew && (
                        <Badge className="bg-blue-500 text-white">New</Badge>
                      )}
                      {product.isBestseller && (
                        <Badge className="bg-yellow-500 text-white">Bestseller</Badge>
                      )}
                    </div>
                    
                    {/* Quick actions */}
                    <div className="absolute top-2 right-2">
                      <button className="bg-white rounded-full p-2 shadow-md hover:bg-pink-50">
                        <Heart className="h-5 w-5 text-gray-600 hover:text-pink-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <Link href={`/products/${product.category}/${product.slug}`}>
                      <h3 className="font-medium text-gray-800 mb-1 hover:text-pink-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
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
                      <span className="text-xs text-gray-500 ml-1">({product.rating})</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-gray-800">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-gray-500 text-sm line-through ml-2">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-pink-600 hover:bg-pink-700"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        <ShoppingBag className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-2">
              <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-2 rounded-md bg-pink-600 text-white">1</button>
              <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">2</button>
              <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">3</button>
              <span className="px-2 text-gray-600">...</span>
              <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* Mobile filters */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileFilterOpen(false)}></div>
          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <div className="relative w-screen max-w-md">
              <div className="h-full flex flex-col bg-white shadow-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setIsMobileFilterOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  {/* Price Range */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-3">Price Range</h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={[0, 5000]}
                        min={0}
                        max={5000}
                        step={100}
                        value={[priceRange[0], priceRange[1]]}
                        onValueChange={handlePriceChange}
                        className="mb-4"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Occasions */}
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-3">Occasions</h3>
                    <div className="space-y-2">
                      {occasions.map((occasion) => (
                        <div key={occasion.id} className="flex items-center">
                          <Checkbox
                            id={`mobile-occasion-${occasion.id}`}
                            checked={selectedOccasions.includes(occasion.id)}
                            onCheckedChange={() => toggleOccasion(occasion.id)}
                            className="mr-2"
                          />
                          <label 
                            htmlFor={`mobile-occasion-${occasion.id}`}
                            className="text-sm text-gray-700 flex-1 cursor-pointer"
                          >
                            {occasion.name}
                          </label>
                          <span className="text-xs text-gray-500">({occasion.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Tags */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Tags</h3>
                    <div className="space-y-2">
                      {tags.map((tag) => (
                        <div key={tag.id} className="flex items-center">
                          <Checkbox
                            id={`mobile-tag-${tag.id}`}
                            checked={selectedTags.includes(tag.id)}
                            onCheckedChange={() => toggleTag(tag.id)}
                            className="mr-2"
                          />
                          <label 
                            htmlFor={`mobile-tag-${tag.id}`}
                            className="text-sm text-gray-700 flex-1 cursor-pointer"
                          >
                            {tag.name}
                          </label>
                          <span className="text-xs text-gray-500">({tag.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 p-4 flex space-x-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                  <Button 
                    className="flex-1 bg-pink-600 hover:bg-pink-700"
                    onClick={() => setIsMobileFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
