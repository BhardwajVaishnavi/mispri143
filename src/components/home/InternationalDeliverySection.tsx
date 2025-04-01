'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Country {
  id: string;
  name: string;
  flag: string;
  slug: string;
  popular: boolean;
}

export default function InternationalDeliverySection() {
  const [showAllCountries, setShowAllCountries] = useState(false);
  
  // Mock data for countries
  const countries: Country[] = [
    { id: '1', name: 'United States', flag: '🇺🇸', slug: 'usa', popular: true },
    { id: '2', name: 'United Kingdom', flag: '🇬🇧', slug: 'uk', popular: true },
    { id: '3', name: 'Canada', flag: '🇨🇦', slug: 'canada', popular: true },
    { id: '4', name: 'Australia', flag: '🇦🇺', slug: 'australia', popular: true },
    { id: '5', name: 'Singapore', flag: '🇸🇬', slug: 'singapore', popular: true },
    { id: '6', name: 'UAE', flag: '🇦🇪', slug: 'uae', popular: true },
    { id: '7', name: 'Germany', flag: '🇩🇪', slug: 'germany', popular: false },
    { id: '8', name: 'France', flag: '🇫🇷', slug: 'france', popular: false },
    { id: '9', name: 'Italy', flag: '🇮🇹', slug: 'italy', popular: false },
    { id: '10', name: 'Japan', flag: '🇯🇵', slug: 'japan', popular: false },
    { id: '11', name: 'South Africa', flag: '🇿🇦', slug: 'south-africa', popular: false },
    { id: '12', name: 'New Zealand', flag: '🇳🇿', slug: 'new-zealand', popular: false },
  ];
  
  const popularCountries = countries.filter(country => country.popular);
  const displayedCountries = showAllCountries ? countries : popularCountries;

  return (
    <div className="bg-gray-50 py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-2">
              <Globe className="h-6 w-6 text-pink-600 mr-2" />
              <h2 className="text-3xl font-bold text-gray-800">International Delivery</h2>
            </div>
            <p className="text-gray-600">Send flowers and gifts to your loved ones around the world</p>
          </div>
          
          <Button asChild className="mt-4 md:mt-0 bg-pink-600 hover:bg-pink-700">
            <Link href="/international-delivery">Learn More</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {displayedCountries.map((country) => (
            <Link 
              key={country.id} 
              href={`/international-delivery/${country.slug}`}
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-pink-200 hover:bg-pink-50 transition-colors"
            >
              <span className="text-2xl mr-2">{country.flag}</span>
              <span className="text-gray-700">{country.name}</span>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <Button
            variant="outline"
            className="border-pink-600 text-pink-600 hover:bg-pink-50"
            onClick={() => setShowAllCountries(!showAllCountries)}
          >
            {showAllCountries ? (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show Less Countries
              </>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 mr-1" />
                View All Countries
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
