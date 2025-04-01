'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, fetch from API
        // const response = await fetch('/api/products/featured');
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
            isBestseller: true
          },
          {
            id: '2',
            name: 'Chocolate Truffle Cake',
            slug: 'chocolate-truffle-cake',
            price: 899,
            image: '/images/product-cake.jpg',
            category: 'cakes',
            rating: 4.7
          },
          {
            id: '3',
            name: 'Money Plant',
            slug: 'money-plant',
            price: 799,
            originalPrice: 999,
            image: '/images/product-plant.jpg',
            category: 'plants',
            rating: 4.5
          },
          {
            id: '4',
            name: 'Teddy Bear with Chocolates',
            slug: 'teddy-bear-with-chocolates',
            price: 1499,
            image: '/images/product-combo.jpg',
            category: 'combos',
            rating: 4.9,
            isNew: true
          },
          {
            id: '5',
            name: 'Premium Chocolate Box',
            slug: 'premium-chocolate-box',
            price: 999,
            image: '/images/product-chocolate.jpg',
            category: 'chocolates',
            rating: 4.6
          },
          {
            id: '6',
            name: 'Personalized Photo Frame',
            slug: 'personalized-photo-frame',
            price: 699,
            originalPrice: 899,
            image: '/images/product-gift.jpg',
            category: 'gifts',
            rating: 4.4,
            isNew: true
          },
          {
            id: '7',
            name: 'Mixed Flowers Bouquet',
            slug: 'mixed-flowers-bouquet',
            price: 1099,
            image: '/images/product-mixed-flowers.jpg',
            category: 'flowers',
            rating: 4.7
          },
          {
            id: '8',
            name: 'Vanilla Cake',
            slug: 'vanilla-cake',
            price: 849,
            originalPrice: 999,
            image: '/images/product-vanilla-cake.jpg',
            category: 'cakes',
            rating: 4.5,
            isBestseller: true
          },
        ];
        
        setProducts(mockProducts);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = activeTab === 'all' 
    ? products 
    : products.filter(product => product.category === activeTab);

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'flowers', label: 'Flowers' },
    { id: 'cakes', label: 'Cakes' },
    { id: 'plants', label: 'Plants' },
    { id: 'gifts', label: 'Gifts' },
    { id: 'combos', label: 'Combos' },
  ];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-8"></div>
            <div className="h-10 max-w-2xl mx-auto bg-gray-200 rounded mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-80"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
        <p className="text-gray-600 mt-2">Handpicked products for you</p>
      </div>
      
      {/* Category tabs */}
      <div className="flex flex-wrap justify-center mb-8">
        <div className="inline-flex flex-wrap justify-center gap-2 p-1 bg-gray-100 rounded-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-pink-600 text-white'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="relative">
              <Link href={`/products/${product.category}/${product.slug}`}>
                <div className="relative h-64 w-full">
                  <Image
                    src={product.image}
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
                <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Button asChild variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    </div>
  );
}
