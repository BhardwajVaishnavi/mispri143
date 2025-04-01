'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  slug: string;
  variant?: string;
  addons?: string[];
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  
  useEffect(() => {
    // In a real app, fetch cart items from API or local storage
    const mockCartItems: CartItem[] = [
      {
        id: '1',
        name: 'Red Roses Bouquet',
        price: 1299,
        image: '/images/product-roses.jpg',
        quantity: 1,
        category: 'flowers',
        slug: 'red-roses-bouquet',
        variant: 'Medium (12 Roses)',
        addons: ['Greeting Card']
      },
      {
        id: '2',
        name: 'Chocolate Cake',
        price: 899,
        image: '/images/product-cake.jpg',
        quantity: 1,
        category: 'cakes',
        slug: 'chocolate-cake',
        variant: '1 Kg'
      },
    ];
    
    setCartItems(mockCartItems);
    setIsLoading(false);
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1 || newQuantity > 10) return;
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
    toast.success('Item removed from cart');
  };

  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    // In a real app, validate coupon with API
    if (couponCode.toUpperCase() === 'WELCOME10') {
      setDiscount(10);
      toast.success('Coupon applied successfully!');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return (calculateSubtotal() * discount) / 100;
  };

  const calculateDeliveryFee = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 1000 ? 0 : 99;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount() + calculateDeliveryFee();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
            <div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mb-6">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
          <Button asChild className="bg-pink-600 hover:bg-pink-700">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">
                Cart Items ({cartItems.length})
              </h2>
            </div>
            
            <div>
              {cartItems.map((item) => (
                <div key={item.id} className="p-6 border-b flex flex-col sm:flex-row gap-4">
                  <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between">
                      <div>
                        <Link 
                          href={`/products/${item.category}/${item.slug}`}
                          className="font-medium text-gray-800 hover:text-pink-600"
                        >
                          {item.name}
                        </Link>
                        {item.variant && (
                          <p className="text-sm text-gray-500">Variant: {item.variant}</p>
                        )}
                        {item.addons && item.addons.length > 0 && (
                          <p className="text-sm text-gray-500">
                            Add-ons: {item.addons.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="text-right mt-2 sm:mt-0">
                        <p className="font-semibold text-gray-800">₹{item.price}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center">
                        <button
                          className="w-8 h-8 rounded-l border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-10 h-8 border-t border-b border-gray-300 text-center [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          className="w-8 h-8 rounded-r border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        className="text-gray-500 hover:text-red-600"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 flex justify-between items-center">
              <Link 
                href="/products"
                className="text-pink-600 hover:text-pink-700 font-medium flex items-center"
              >
                <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
        
        {/* Order summary */}
        <div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{calculateSubtotal().toLocaleString()}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount}%)</span>
                  <span>-₹{calculateDiscount().toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className={calculateDeliveryFee() === 0 ? 'text-green-600' : ''}>
                  {calculateDeliveryFee() === 0 ? 'Free' : `₹${calculateDeliveryFee()}`}
                </span>
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>
              
              {/* Coupon code */}
              <div className="mt-6">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    className="border-pink-600 text-pink-600 hover:bg-pink-50"
                    onClick={applyCoupon}
                  >
                    Apply
                  </Button>
                </div>
                {discount > 0 && (
                  <p className="text-green-600 text-sm mt-2">
                    Coupon applied: {couponCode.toUpperCase()} ({discount}% off)
                  </p>
                )}
              </div>
              
              <Button 
                className="w-full bg-pink-600 hover:bg-pink-700 mt-6"
                asChild
              >
                <Link href="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>
              
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>We accept:</p>
                <div className="flex justify-center space-x-2 mt-2">
                  <div className="h-6 w-10 bg-gray-200 rounded"></div>
                  <div className="h-6 w-10 bg-gray-200 rounded"></div>
                  <div className="h-6 w-10 bg-gray-200 rounded"></div>
                  <div className="h-6 w-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
