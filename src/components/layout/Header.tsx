'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const categories = [
  { name: 'Flowers', href: '/products/flowers' },
  { name: 'Cakes', href: '/products/cakes' },
  { name: 'Combos', href: '/products/combos' },
  { name: 'Plants', href: '/products/plants' },
  { name: 'Gifts', href: '/products/gifts' },
  { name: 'Occasions', href: '/occasions' },
];

const occasions = [
  { name: 'Birthday', href: '/occasions/birthday' },
  { name: 'Anniversary', href: '/occasions/anniversary' },
  { name: 'Valentine\'s Day', href: '/occasions/valentines-day' },
  { name: 'Wedding', href: '/occasions/wedding' },
  { name: 'Congratulations', href: '/occasions/congratulations' },
  { name: 'Thank You', href: '/occasions/thank-you' },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showOccasionsDropdown, setShowOccasionsDropdown] = useState(false);

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch cart count from local storage or API
  useEffect(() => {
    // Mock cart count for now
    setCartCount(3);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/90 py-4'}`}>
      {/* Top bar with contact info and user links */}
      <div className="hidden md:block bg-gray-100 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>Call us: +91 1234567890</span>
            <span>|</span>
            <span>Same Day Delivery Available</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/track-order" className="hover:text-pink-600">Track Order</Link>
            <span>|</span>
            <Link href="/contact-us" className="hover:text-pink-600">Contact Us</Link>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative h-12 w-40">
              <Image
                src="/images/logo.png"
                alt="MISPRI"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </Link>

          {/* Search bar - desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for flowers, cakes, gifts..."
                className="pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-pink-500 focus:ring-pink-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          {/* Navigation - desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <div
              className="relative group"
              onMouseEnter={() => setShowCategoryDropdown(true)}
              onMouseLeave={() => setShowCategoryDropdown(false)}
            >
              <button className="flex items-center space-x-1 hover:text-pink-600">
                <span>Categories</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50">
                  <div className="py-2">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={category.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div
              className="relative group"
              onMouseEnter={() => setShowOccasionsDropdown(true)}
              onMouseLeave={() => setShowOccasionsDropdown(false)}
            >
              <button className="flex items-center space-x-1 hover:text-pink-600">
                <span>Occasions</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              {showOccasionsDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50">
                  <div className="py-2">
                    {occasions.map((occasion) => (
                      <Link
                        key={occasion.name}
                        href={occasion.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                      >
                        {occasion.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link href="/account" className="hover:text-pink-600">
              <User className="h-6 w-6" />
            </Link>
            <Link href="/cart" className="relative hover:text-pink-600">
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link href="/cart" className="relative mr-4 hover:text-pink-600">
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </Badge>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-pink-600"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t mt-2">
          <div className="px-4 py-3">
            <Input
              type="text"
              placeholder="Search for flowers, cakes, gifts..."
              className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300"
            />
            <Search className="absolute left-7 top-[7.5rem] transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
          <nav className="px-4 py-2 space-y-1">
            <div className="py-2 border-b">
              <button
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center justify-between w-full py-2"
              >
                <span>Categories</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showCategoryDropdown && (
                <div className="pl-4 mt-2 space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="block py-2 text-gray-700 hover:text-pink-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="py-2 border-b">
              <button
                onClick={() => setShowOccasionsDropdown(!showOccasionsDropdown)}
                className="flex items-center justify-between w-full py-2"
              >
                <span>Occasions</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showOccasionsDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showOccasionsDropdown && (
                <div className="pl-4 mt-2 space-y-2">
                  {occasions.map((occasion) => (
                    <Link
                      key={occasion.name}
                      href={occasion.href}
                      className="block py-2 text-gray-700 hover:text-pink-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {occasion.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/account"
              className="block py-2 border-b hover:text-pink-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Account
            </Link>
            <Link
              href="/track-order"
              className="block py-2 border-b hover:text-pink-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Track Order
            </Link>
            <Link
              href="/contact-us"
              className="block py-2 border-b hover:text-pink-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
