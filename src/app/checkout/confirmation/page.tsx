'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircleIcon, TruckIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<any>(null);
  
  useEffect(() => {
    // In a real app, you would fetch the order details from your API
    // For this example, we'll use mock data
    const mockOrder = {
      id: 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      date: new Date().toISOString(),
      status: 'PENDING',
      paymentStatus: 'COMPLETED',
      paymentMethod: 'ONLINE',
      deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deliveryTime: '14:00-16:00',
      deliveryType: 'HOME_DELIVERY',
      totalAmount: 2299.98,
      items: [
        {
          id: '1',
          name: 'Red Roses Bouquet',
          price: 1299.99,
          quantity: 1,
          image: 'https://example.com/images/red-roses.jpg',
          variant: 'Medium',
        },
        {
          id: '2',
          name: 'Chocolate Cake',
          price: 899.99,
          quantity: 1,
          image: 'https://example.com/images/chocolate-cake.jpg',
          variant: '1 kg',
        }
      ],
      address: {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
        phone: '+91 9876543210',
      }
    };
    
    setOrder(mockOrder);
  }, []);
  
  if (!order) {
    return (
      <div className="container mx-auto py-12 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-gray-600 mt-2">
            Thank you for your order. Your order has been received and is being processed.
          </p>
        </div>
        
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold">Order #{order.id}</h2>
              <p className="text-gray-600">
                Placed on {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
              </p>
            </div>
            <div className="mt-2 md:mt-0">
              <Button variant="outline" size="sm">
                View Order Details
              </Button>
            </div>
          </div>
          
          <Separator className="mb-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-start space-x-3">
              <TruckIcon className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-medium">Delivery Method</h3>
                <p className="text-sm text-gray-600">
                  {order.deliveryType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Store Pickup'}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CalendarIcon className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-medium">Delivery Date</h3>
                <p className="text-sm text-gray-600">
                  {new Date(order.deliveryDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <ClockIcon className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-medium">Delivery Time</h3>
                <p className="text-sm text-gray-600">
                  {order.deliveryTime}
                </p>
              </div>
            </div>
          </div>
          
          <h3 className="font-semibold mb-2">Order Items</h3>
          <div className="space-y-4 mb-6">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex space-x-4">
                <div className="w-16 h-16 relative flex-shrink-0 rounded-md overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  {item.variant && <p className="text-sm text-gray-500">Variant: {item.variant}</p>}
                  <div className="flex justify-between mt-1">
                    <p className="text-sm">Qty: {item.quantity}</p>
                    <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <h3 className="font-semibold mb-2">Delivery Address</h3>
          <div className="mb-6">
            <p className="font-medium">{order.address.name}</p>
            <p className="text-gray-600">{order.address.street}</p>
            <p className="text-gray-600">{order.address.city}, {order.address.state} {order.address.postalCode}</p>
            <p className="text-gray-600">{order.address.country}</p>
            <p className="text-gray-600">{order.address.phone}</p>
          </div>
          
          <h3 className="font-semibold mb-2">Payment Information</h3>
          <div className="mb-6">
            <p className="text-gray-600">Method: {order.paymentMethod === 'ONLINE' ? 'Online Payment' : 'Cash on Delivery'}</p>
            <p className="text-gray-600">Status: {order.paymentStatus === 'COMPLETED' ? 'Paid' : 'Pending'}</p>
          </div>
          
          <Separator className="mb-4" />
          
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>₹{(order.totalAmount - 100 - (order.totalAmount * 0.05)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span>₹100.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span>₹{(order.totalAmount * 0.05).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 mb-4 md:mb-0">
            We'll send you a confirmation email with your order details and tracking information.
          </p>
          <div className="space-x-4">
            <Button variant="outline" asChild>
              <Link href="/orders">View My Orders</Link>
            </Button>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
