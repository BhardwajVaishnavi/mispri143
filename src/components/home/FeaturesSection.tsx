'use client';

import { Truck, Clock, Gift, CreditCard } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function FeaturesSection() {
  const features: Feature[] = [
    {
      icon: <Truck className="h-10 w-10 text-pink-600" />,
      title: 'Free Shipping',
      description: 'On orders above ₹499'
    },
    {
      icon: <Clock className="h-10 w-10 text-pink-600" />,
      title: 'Same Day Delivery',
      description: 'Order before 4 PM'
    },
    {
      icon: <Gift className="h-10 w-10 text-pink-600" />,
      title: 'Fresh Products',
      description: 'Guaranteed quality'
    },
    {
      icon: <CreditCard className="h-10 w-10 text-pink-600" />,
      title: 'Secure Payment',
      description: 'Multiple payment options'
    },
  ];

  return (
    <div className="bg-white py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-lg text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
