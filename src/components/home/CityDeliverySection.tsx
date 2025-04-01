'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface City {
  id: string;
  name: string;
  slug: string;
  popular: boolean;
}

export default function CityDeliverySection() {
  const [showAllCities, setShowAllCities] = useState(false);
  
  // Mock data for cities
  const cities: City[] = [
    { id: '1', name: 'Delhi', slug: 'delhi', popular: true },
    { id: '2', name: 'Mumbai', slug: 'mumbai', popular: true },
    { id: '3', name: 'Bangalore', slug: 'bangalore', popular: true },
    { id: '4', name: 'Hyderabad', slug: 'hyderabad', popular: true },
    { id: '5', name: 'Chennai', slug: 'chennai', popular: true },
    { id: '6', name: 'Kolkata', slug: 'kolkata', popular: true },
    { id: '7', name: 'Pune', slug: 'pune', popular: true },
    { id: '8', name: 'Ahmedabad', slug: 'ahmedabad', popular: true },
    { id: '9', name: 'Jaipur', slug: 'jaipur', popular: false },
    { id: '10', name: 'Lucknow', slug: 'lucknow', popular: false },
    { id: '11', name: 'Chandigarh', slug: 'chandigarh', popular: false },
    { id: '12', name: 'Gurgaon', slug: 'gurgaon', popular: false },
    { id: '13', name: 'Noida', slug: 'noida', popular: false },
    { id: '14', name: 'Ghaziabad', slug: 'ghaziabad', popular: false },
    { id: '15', name: 'Faridabad', slug: 'faridabad', popular: false },
    { id: '16', name: 'Patna', slug: 'patna', popular: false },
    { id: '17', name: 'Bhopal', slug: 'bhopal', popular: false },
    { id: '18', name: 'Indore', slug: 'indore', popular: false },
    { id: '19', name: 'Nagpur', slug: 'nagpur', popular: false },
    { id: '20', name: 'Surat', slug: 'surat', popular: false },
  ];
  
  const popularCities = cities.filter(city => city.popular);
  const displayedCities = showAllCities ? cities : popularCities;

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Flower Delivery in India</h2>
          <p className="text-gray-600 mt-2">Send flowers, cakes, and gifts to these cities with same-day delivery</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {displayedCities.map((city) => (
            <Link 
              key={city.id} 
              href={`/delivery/${city.slug}`}
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-pink-200 hover:bg-pink-50 transition-colors"
            >
              <MapPin className="h-4 w-4 text-pink-600 mr-2 flex-shrink-0" />
              <span className="text-gray-700">{city.name}</span>
            </Link>
          ))}
        </div>
        
        <div className="text-center mt-6">
          <Button
            variant="outline"
            className="border-pink-600 text-pink-600 hover:bg-pink-50"
            onClick={() => setShowAllCities(!showAllCities)}
          >
            {showAllCities ? (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                Show Less Cities
              </>
            ) : (
              <>
                <ChevronRight className="h-4 w-4 mr-1" />
                View All Cities
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
