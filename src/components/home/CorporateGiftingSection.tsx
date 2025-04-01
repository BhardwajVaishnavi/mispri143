'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Briefcase, Users, Gift, Award } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function CorporateGiftingSection() {
  const features: Feature[] = [
    {
      icon: <Briefcase className="h-8 w-8 text-pink-600" />,
      title: 'Bulk Orders',
      description: 'Special pricing for large corporate orders'
    },
    {
      icon: <Users className="h-8 w-8 text-pink-600" />,
      title: 'Dedicated Account Manager',
      description: 'Personalized service for your business needs'
    },
    {
      icon: <Gift className="h-8 w-8 text-pink-600" />,
      title: 'Customized Gifts',
      description: 'Add your company logo and personalized messages'
    },
    {
      icon: <Award className="h-8 w-8 text-pink-600" />,
      title: 'Premium Quality',
      description: 'High-quality products for your corporate image'
    }
  ];

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="bg-gray-50 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-block bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
                For Businesses
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Corporate Gifting Solutions</h2>
              <p className="text-gray-600 mb-6 max-w-md">
                Make your corporate events, employee appreciation, and client relationships memorable with our premium gifting solutions.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 mr-4">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="bg-pink-600 hover:bg-pink-700">
                  <Link href="/corporate-gifting">Learn More</Link>
                </Button>
                <Button asChild variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                  <Link href="/contact-us">Contact Sales</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative h-64 lg:h-auto">
              <Image
                src="/images/corporate-gifting.jpg"
                alt="Corporate Gifting"
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
