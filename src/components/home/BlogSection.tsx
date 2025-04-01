'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
  image: string;
  date: string;
  category: string;
}

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, fetch from API
    // const fetchPosts = async () => {
    //   const response = await fetch('/api/blog/featured');
    //   const data = await response.json();
    //   setPosts(data);
    //   setIsLoading(false);
    // };
    // fetchPosts();
    
    // Mock data
    const mockPosts: BlogPost[] = [
      {
        id: '1',
        title: '10 Best Birthday Gift Ideas for Your Loved Ones',
        excerpt: 'Discover unique and thoughtful birthday gift ideas that will make your loved ones feel special on their big day.',
        slug: 'best-birthday-gift-ideas',
        image: '/images/blog-birthday-gifts.jpg',
        date: 'May 15, 2023',
        category: 'Gift Ideas'
      },
      {
        id: '2',
        title: 'How to Choose the Perfect Anniversary Flowers',
        excerpt: 'Learn the meaning behind different flowers and how to select the perfect bouquet for your anniversary celebration.',
        slug: 'perfect-anniversary-flowers',
        image: '/images/blog-anniversary-flowers.jpg',
        date: 'June 22, 2023',
        category: 'Flowers'
      },
      {
        id: '3',
        title: 'Ultimate Guide to Wedding Cake Flavors and Designs',
        excerpt: 'Explore popular wedding cake flavors and designs to help you choose the perfect cake for your special day.',
        slug: 'wedding-cake-guide',
        image: '/images/blog-wedding-cakes.jpg',
        date: 'July 10, 2023',
        category: 'Cakes'
      }
    ];
    
    setPosts(mockPosts);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Gift Ideas & Inspiration</h2>
          <p className="text-gray-600 mt-2">Explore our blog for gifting tips, ideas, and inspiration</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.slug}`}
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-48 w-full">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{post.category}</span>
                    <span className="mx-2">•</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <span className="text-pink-600 text-sm font-medium flex items-center group-hover:underline">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <Button asChild variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
            <Link href="/blog">
              View All Articles
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
