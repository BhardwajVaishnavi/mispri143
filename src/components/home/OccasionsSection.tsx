'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Occasion {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export default function OccasionsSection() {
  // Mock data for occasions
  const occasions: Occasion[] = [
    {
      id: '1',
      name: 'Birthday',
      slug: 'birthday',
      image: '/images/occasion-birthday.jpg',
      description: 'Make their day special with our birthday gifts'
    },
    {
      id: '2',
      name: 'Anniversary',
      slug: 'anniversary',
      image: '/images/occasion-anniversary.jpg',
      description: 'Celebrate your love with perfect anniversary gifts'
    },
    {
      id: '3',
      name: 'Valentine\'s Day',
      slug: 'valentines-day',
      image: '/images/occasion-valentines.jpg',
      description: 'Express your love with romantic gifts'
    },
    {
      id: '4',
      name: 'Wedding',
      slug: 'wedding',
      image: '/images/occasion-wedding.jpg',
      description: 'Celebrate the special day with beautiful gifts'
    },
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Shop By Occasion</h2>
          <p className="text-gray-600 mt-2">Find the perfect gift for every moment</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {occasions.map((occasion) => (
            <Link 
              key={occasion.id} 
              href={`/occasions/${occasion.slug}`}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={occasion.image}
                  alt={occasion.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg text-gray-800 mb-1">{occasion.name}</h3>
                <p className="text-gray-600 text-sm">{occasion.description}</p>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Special occasions banner */}
        <div className="mt-12 bg-pink-50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Same Day Delivery</h3>
              <p className="text-gray-600 mb-6">
                Forgot an important occasion? Don't worry! We offer same-day delivery for last-minute gifts.
              </p>
              <div>
                <Link 
                  href="/same-day-delivery"
                  className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-medium py-2 px-6 rounded-full transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <Image
                src="/images/same-day-delivery.jpg"
                alt="Same Day Delivery"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
