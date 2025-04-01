'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const footerLinks = [
  {
    title: 'Customer Service',
    links: [
      { name: 'Contact Us', href: '/contact-us' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'Shipping Policy', href: '/shipping-policy' },
      { name: 'Cancellation Policy', href: '/cancellation-policy' },
      { name: 'Return Policy', href: '/return-policy' },
    ],
  },
  {
    title: 'About Us',
    links: [
      { name: 'Our Story', href: '/about-us' },
      { name: 'Testimonials', href: '/testimonials' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Terms & Conditions', href: '/terms-conditions' },
    ],
  },
  {
    title: 'Shop By',
    links: [
      { name: 'Flowers', href: '/products/flowers' },
      { name: 'Cakes', href: '/products/cakes' },
      { name: 'Plants', href: '/products/plants' },
      { name: 'Gifts', href: '/products/gifts' },
      { name: 'Combos', href: '/products/combos' },
    ],
  },
  {
    title: 'Occasions',
    links: [
      { name: 'Birthday', href: '/occasions/birthday' },
      { name: 'Anniversary', href: '/occasions/anniversary' },
      { name: 'Valentine\'s Day', href: '/occasions/valentines-day' },
      { name: 'Wedding', href: '/occasions/wedding' },
      { name: 'Congratulations', href: '/occasions/congratulations' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        {/* Newsletter */}
        <div className="bg-pink-50 rounded-lg p-6 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-gray-600 mb-4">Stay updated with our latest offers and promotions</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-grow"
              />
              <Button className="bg-pink-600 hover:bg-pink-700 text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <div className="relative h-12 w-40">
                <Image
                  src="/images/logo.png"
                  alt="MISPRI"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </Link>
            <p className="text-gray-600 mb-4">
              Bringing joy and happiness through beautiful flowers, delicious cakes, and thoughtful gifts since 2023.
            </p>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-gray-600 hover:text-pink-600">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-600">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-600">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-pink-600">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-pink-600 mr-2 mt-0.5" />
                <span className="text-gray-600">123 Main Street, City, State, 12345</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-pink-600 mr-2" />
                <span className="text-gray-600">+91 1234567890</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-pink-600 mr-2" />
                <span className="text-gray-600">support@mispri.com</span>
              </div>
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="font-semibold text-gray-800 mb-4">{column.title}</h4>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-600 hover:text-pink-600">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment methods */}
        <div className="border-t border-gray-200 pt-6 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">
                © {new Date().getFullYear()} MISPRI. All rights reserved.
              </p>
            </div>
            <div className="flex items-center">
              <span className="text-gray-600 text-sm mr-4">We Accept:</span>
              <div className="flex space-x-2">
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
                <div className="h-8 w-12 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
