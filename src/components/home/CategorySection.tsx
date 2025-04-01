'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productsCount: number;
}

export default function CategorySection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // In a real app, fetch from API
        // const response = await fetch('/api/categories');
        // const data = await response.json();
        
        // Mock data for now
        const mockCategories: Category[] = [
          {
            id: '1',
            name: 'Flowers',
            slug: 'flowers',
            image: '/images/category-flowers.jpg',
            productsCount: 24
          },
          {
            id: '2',
            name: 'Cakes',
            slug: 'cakes',
            image: '/images/category-cakes.jpg',
            productsCount: 18
          },
          {
            id: '3',
            name: 'Plants',
            slug: 'plants',
            image: '/images/category-plants.jpg',
            productsCount: 15
          },
          {
            id: '4',
            name: 'Gifts',
            slug: 'gifts',
            image: '/images/category-gifts.jpg',
            productsCount: 20
          },
          {
            id: '5',
            name: 'Combos',
            slug: 'combos',
            image: '/images/category-combos.jpg',
            productsCount: 12
          },
          {
            id: '6',
            name: 'Chocolates',
            slug: 'chocolates',
            image: '/images/category-chocolates.jpg',
            productsCount: 10
          },
        ];
        
        setCategories(mockCategories);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-8"></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-48"></div>
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
        <h2 className="text-3xl font-bold text-gray-800">Shop By Category</h2>
        <p className="text-gray-600 mt-2">Find the perfect gift for every occasion</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            href={`/products/${category.slug}`}
            className="group"
          >
            <div className="relative rounded-lg overflow-hidden h-48 mb-2">
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-10"></div>
              <div className="relative h-full w-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <h3 className="text-white text-xl font-semibold text-center px-2">
                  {category.name}
                </h3>
              </div>
            </div>
            <p className="text-center text-gray-600 text-sm">
              {category.productsCount} Products
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
