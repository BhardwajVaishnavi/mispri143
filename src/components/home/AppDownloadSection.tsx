'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Smartphone, Check } from 'lucide-react';

export default function AppDownloadSection() {
  const appFeatures = [
    'Exclusive app-only offers and discounts',
    'Track your orders in real-time',
    'Quick and easy ordering process',
    'Save your favorite products',
    'Get notifications for special occasions'
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-block bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
              <Smartphone className="h-4 w-4 inline-block mr-1" />
              Mobile App
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Shop On The Go With Our Mobile App
            </h2>
            <p className="text-gray-600 mb-6">
              Download our mobile app for a seamless shopping experience. Order flowers, cakes, and gifts anytime, anywhere with just a few taps.
            </p>
            
            <div className="space-y-3 mb-8">
              {appFeatures.map((feature, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-pink-100 rounded-full p-1 mr-3">
                    <Check className="h-4 w-4 text-pink-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#" className="block w-48">
                <Image
                  src="/images/app-store-badge.png"
                  alt="Download on the App Store"
                  width={200}
                  height={60}
                  className="w-full"
                />
              </Link>
              <Link href="#" className="block w-48">
                <Image
                  src="/images/google-play-badge.png"
                  alt="Get it on Google Play"
                  width={200}
                  height={60}
                  className="w-full"
                />
              </Link>
            </div>
          </div>
          
          <div className="relative h-96 md:h-auto flex justify-center">
            <div className="relative w-64 h-[500px]">
              <Image
                src="/images/app-screenshot.png"
                alt="Mobile App Screenshot"
                fill
                style={{ objectFit: 'contain' }}
                className="drop-shadow-2xl"
              />
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-200 rounded-full opacity-30 blur-3xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
