'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, Moon, Calendar } from 'lucide-react';

interface DeliveryOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  link: string;
}

export default function SpecialDeliverySection() {
  const deliveryOptions: DeliveryOption[] = [
    {
      id: 'same-day',
      title: 'Same Day Delivery',
      description: 'Order by 4 PM for delivery today',
      icon: <Clock className="h-8 w-8 text-pink-600" />,
      image: '/images/same-day-delivery.jpg',
      link: '/same-day-delivery'
    },
    {
      id: 'midnight',
      title: 'Midnight Delivery',
      description: 'Surprise your loved ones at midnight',
      icon: <Moon className="h-8 w-8 text-pink-600" />,
      image: '/images/midnight-delivery.jpg',
      link: '/midnight-delivery'
    },
    {
      id: 'fixed-time',
      title: 'Fixed Time Delivery',
      description: 'Choose your preferred delivery time',
      icon: <Calendar className="h-8 w-8 text-pink-600" />,
      image: '/images/fixed-time-delivery.jpg',
      link: '/fixed-time-delivery'
    }
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">Special Delivery Options</h2>
          <p className="text-gray-600 mt-2">Choose the perfect time to surprise your loved ones</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deliveryOptions.map((option) => (
            <Link 
              key={option.id} 
              href={option.link}
              className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={option.image}
                  alt={option.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="bg-white/90 rounded-full p-4">
                    {option.icon}
                  </div>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-semibold text-xl text-gray-800 mb-2">{option.title}</h3>
                <p className="text-gray-600">{option.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
