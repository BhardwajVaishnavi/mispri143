'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, CreditCard, Truck, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variant?: string;
}

interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDelivery: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [discount, setDiscount] = useState(10); // Assuming a 10% discount is applied
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    deliveryOption: 'standard',
    paymentMethod: 'card',
    saveInfo: true,
    message: '',
  });
  
  // Delivery options
  const deliveryOptions: DeliveryOption[] = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: 'Delivery within 1-2 business days',
      price: 0,
      estimatedDelivery: 'Apr 15 - Apr 16',
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: 'Same day delivery (order before 2 PM)',
      price: 99,
      estimatedDelivery: 'Today',
    },
    {
      id: 'fixed',
      name: 'Fixed Time Delivery',
      description: 'Choose a specific time slot',
      price: 149,
      estimatedDelivery: 'Select time slot',
    },
  ];
  
  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your card',
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      id: 'upi',
      name: 'UPI',
      description: 'Pay using UPI apps like Google Pay, PhonePe, etc.',
      icon: <div className="h-5 w-5 bg-gray-200 rounded"></div>,
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: <div className="h-5 w-5 bg-gray-200 rounded"></div>,
    },
  ];
  
  useEffect(() => {
    // In a real app, fetch cart items from API or local storage
    const mockCartItems: CartItem[] = [
      {
        id: '1',
        name: 'Red Roses Bouquet',
        price: 1299,
        image: '/images/product-roses.jpg',
        quantity: 1,
        variant: 'Medium (12 Roses)',
      },
      {
        id: '2',
        name: 'Chocolate Cake',
        price: 899,
        image: '/images/product-cake.jpg',
        quantity: 1,
        variant: '1 Kg',
      },
    ];
    
    setCartItems(mockCartItems);
    setIsLoading(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, saveInfo: checked }));
  };

  const handleDeliveryOptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, deliveryOption: value }));
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || 
        !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // In a real app, submit order to API
    toast.success('Order placed successfully!');
    
    // Redirect to confirmation page
    // router.push('/checkout/confirmation');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateDiscount = () => {
    return (calculateSubtotal() * discount) / 100;
  };

  const getSelectedDeliveryOption = () => {
    return deliveryOptions.find(option => option.id === formData.deliveryOption) || deliveryOptions[0];
  };

  const calculateDeliveryFee = () => {
    return getSelectedDeliveryOption().price;
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
              <div className="h-96 bg-gray-200 rounded mb-4"></div>
            </div>
            <div>
              <div className="h-80 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex items-center mb-8">
        <Link 
          href="/cart"
          className="text-gray-600 hover:text-pink-600 flex items-center mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            {/* Delivery address */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Delivery Address</h2>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Checkbox
                    id="saveInfo"
                    checked={formData.saveInfo}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="saveInfo" className="ml-2">
                    Save this information for next time
                  </Label>
                </div>
              </div>
            </div>
            
            {/* Delivery options */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Delivery Options</h2>
              </div>
              
              <div className="p-6">
                <RadioGroup
                  value={formData.deliveryOption}
                  onValueChange={handleDeliveryOptionChange}
                  className="space-y-4"
                >
                  {deliveryOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        formData.deliveryOption === option.id
                          ? 'border-pink-600 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start">
                        <RadioGroupItem
                          value={option.id}
                          id={`delivery-${option.id}`}
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <Label
                            htmlFor={`delivery-${option.id}`}
                            className="font-medium text-gray-800"
                          >
                            {option.name}
                          </Label>
                          <p className="text-sm text-gray-600">{option.description}</p>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            {option.id === 'standard' || option.id === 'express' ? (
                              <>
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{option.estimatedDelivery}</span>
                              </>
                            ) : (
                              <>
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{option.estimatedDelivery}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-gray-800">
                          {option.price === 0 ? 'Free' : `₹${option.price}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            
            {/* Payment method */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Payment Method</h2>
              </div>
              
              <div className="p-6">
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={handlePaymentMethodChange}
                  className="space-y-4"
                >
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        formData.paymentMethod === method.id
                          ? 'border-pink-600 bg-pink-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start">
                        <RadioGroupItem
                          value={method.id}
                          id={`payment-${method.id}`}
                          className="mt-1"
                        />
                        <div className="ml-3">
                          <Label
                            htmlFor={`payment-${method.id}`}
                            className="font-medium text-gray-800"
                          >
                            {method.name}
                          </Label>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                      <div>{method.icon}</div>
                    </div>
                  ))}
                </RadioGroup>
                
                {formData.paymentMethod === 'card' && (
                  <div className="mt-6 p-4 border border-gray-200 rounded-lg">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Gift message */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Gift Message (Optional)</h2>
              </div>
              
              <div className="p-6">
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Add a personal message to your gift"
                  className="h-24"
                />
              </div>
            </div>
          </form>
        </div>
        
        {/* Order summary */}
        <div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
            </div>
            
            <div className="p-6">
              {/* Cart items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      {item.variant && (
                        <p className="text-sm text-gray-500">Variant: {item.variant}</p>
                      )}
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                        <span className="font-medium">₹{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price breakdown */}
              <div className="space-y-3 py-4 border-t border-b">
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
              </div>
              
              <div className="pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>
              
              <Button 
                className="w-full bg-pink-600 hover:bg-pink-700 mt-6"
                onClick={handleSubmit}
              >
                Place Order
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our{' '}
                <Link href="/terms" className="text-pink-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-pink-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
