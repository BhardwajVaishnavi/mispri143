'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  TruckIcon, 
  HomeIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
  customizations?: Record<string, any>;
}

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [deliveryTime, setDeliveryTime] = useState<string>('');
  const [deliveryType, setDeliveryType] = useState<'HOME_DELIVERY' | 'STORE_PICKUP'>('HOME_DELIVERY');
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isNewAddress, setIsNewAddress] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({
    name: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryType === 'HOME_DELIVERY' ? 100 : 0;
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax;

  useEffect(() => {
    // In a real app, you would fetch cart items from your cart state or API
    const mockCartItems: CartItem[] = [
      {
        id: '1',
        productId: 'prod-1',
        name: 'Red Roses Bouquet',
        price: 1299.99,
        quantity: 1,
        image: 'https://example.com/images/red-roses.jpg',
        variant: 'Medium',
        customizations: {
          message: 'Happy Birthday!',
          ribbon: 'Red'
        }
      },
      {
        id: '2',
        productId: 'prod-2',
        name: 'Chocolate Cake',
        price: 899.99,
        quantity: 1,
        image: 'https://example.com/images/chocolate-cake.jpg',
        variant: '1 kg',
        customizations: {
          message: 'Happy Anniversary!',
          topping: 'Chocolate Chips'
        }
      }
    ];
    
    setCartItems(mockCartItems);
    
    // In a real app, you would fetch addresses from your API
    const mockAddresses: Address[] = [
      {
        id: 'addr-1',
        name: 'Home',
        street: '123 Main Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400001',
        country: 'India',
        phone: '+91 9876543210',
        isDefault: true
      },
      {
        id: 'addr-2',
        name: 'Office',
        street: '456 Business Park',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400051',
        country: 'India',
        phone: '+91 9876543211',
        isDefault: false
      }
    ];
    
    setAddresses(mockAddresses);
    
    // Set default address
    const defaultAddress = mockAddresses.find(addr => addr.isDefault);
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    }
    
    // Set default delivery date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDeliveryDate(tomorrow.toISOString().split('T')[0]);
    
    // Set default delivery time
    setDeliveryTime('14:00-16:00');
  }, []);

  const handleAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId);
    setIsNewAddress(false);
  };

  const handleNewAddressChange = (field: keyof typeof newAddress, value: string) => {
    setNewAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddNewAddress = () => {
    // In a real app, you would save the new address to your API
    const newAddr: Address = {
      id: `addr-${Date.now()}`,
      ...newAddress,
      isDefault: false
    };
    
    setAddresses(prev => [...prev, newAddr]);
    setSelectedAddressId(newAddr.id);
    setIsNewAddress(false);
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!selectedAddressId && !isNewAddress) {
        alert('Please select a delivery address');
        setLoading(false);
        return;
      }
      
      if (isNewAddress) {
        // Validate new address fields
        const requiredFields = ['name', 'street', 'city', 'state', 'postalCode', 'country', 'phone'];
        for (const field of requiredFields) {
          if (!newAddress[field as keyof typeof newAddress]) {
            alert(`Please enter your ${field}`);
            setLoading(false);
            return;
          }
        }
        
        // Add the new address
        await handleAddNewAddress();
      }
      
      if (!deliveryDate) {
        alert('Please select a delivery date');
        setLoading(false);
        return;
      }
      
      if (!deliveryTime) {
        alert('Please select a delivery time');
        setLoading(false);
        return;
      }
      
      // In a real app, you would submit the order to your API
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          customText: item.customizations?.message
        })),
        addressId: selectedAddressId,
        deliveryDate,
        deliveryTime,
        deliveryType,
        paymentMethod,
        specialInstructions,
        totalAmount: total
      };
      
      console.log('Placing order:', orderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to order confirmation page
      router.push('/checkout/confirmation');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Delivery Address */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
            
            <RadioGroup 
              value={isNewAddress ? 'new' : selectedAddressId} 
              onValueChange={(value) => {
                if (value === 'new') {
                  setIsNewAddress(true);
                } else {
                  handleAddressChange(value);
                }
              }}
            >
              {addresses.map(address => (
                <div key={address.id} className="flex items-start space-x-2 mb-4">
                  <RadioGroupItem value={address.id} id={address.id} />
                  <div className="grid gap-1.5">
                    <Label htmlFor={address.id} className="font-medium">
                      {address.name} {address.isDefault && <span className="text-sm text-gray-500">(Default)</span>}
                    </Label>
                    <p className="text-sm text-gray-500">
                      {address.street}, {address.city}, {address.state} {address.postalCode}, {address.country}
                    </p>
                    <p className="text-sm text-gray-500">{address.phone}</p>
                  </div>
                </div>
              ))}
              
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="new" id="new-address" />
                <Label htmlFor="new-address" className="font-medium">
                  Add a new address
                </Label>
              </div>
            </RadioGroup>
            
            {isNewAddress && (
              <div className="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={newAddress.name}
                    onChange={(e) => handleNewAddressChange('name', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={newAddress.phone}
                    onChange={(e) => handleNewAddressChange('phone', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input 
                    id="street" 
                    value={newAddress.street}
                    onChange={(e) => handleNewAddressChange('street', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    value={newAddress.city}
                    onChange={(e) => handleNewAddressChange('city', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state" 
                    value={newAddress.state}
                    onChange={(e) => handleNewAddressChange('state', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input 
                    id="postalCode" 
                    value={newAddress.postalCode}
                    onChange={(e) => handleNewAddressChange('postalCode', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country" 
                    value={newAddress.country}
                    onChange={(e) => handleNewAddressChange('country', e.target.value)}
                  />
                </div>
              </div>
            )}
          </Card>
          
          {/* Delivery Options */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Options</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Delivery Type</Label>
                <RadioGroup 
                  value={deliveryType} 
                  onValueChange={(value) => setDeliveryType(value as 'HOME_DELIVERY' | 'STORE_PICKUP')}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="HOME_DELIVERY" id="home-delivery" />
                    <div className="flex items-center">
                      <TruckIcon className="h-5 w-5 mr-2 text-primary" />
                      <Label htmlFor="home-delivery">Home Delivery</Label>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="STORE_PICKUP" id="store-pickup" />
                    <div className="flex items-center">
                      <HomeIcon className="h-5 w-5 mr-2 text-primary" />
                      <Label htmlFor="store-pickup">Store Pickup</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="delivery-date" className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                    Delivery Date
                  </Label>
                  <Input 
                    id="delivery-date" 
                    type="date" 
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="delivery-time" className="flex items-center">
                    <ClockIcon className="h-5 w-5 mr-2 text-primary" />
                    Delivery Time
                  </Label>
                  <select
                    id="delivery-time"
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="10:00-12:00">10:00 AM - 12:00 PM</option>
                    <option value="12:00-14:00">12:00 PM - 2:00 PM</option>
                    <option value="14:00-16:00">2:00 PM - 4:00 PM</option>
                    <option value="16:00-18:00">4:00 PM - 6:00 PM</option>
                    <option value="18:00-20:00">6:00 PM - 8:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="special-instructions">Special Instructions</Label>
                <Textarea 
                  id="special-instructions" 
                  placeholder="Any special instructions for delivery..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>
            </div>
          </Card>
          
          {/* Payment Method */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={(value) => setPaymentMethod(value as 'ONLINE' | 'COD')}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ONLINE" id="online-payment" />
                <div className="flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2 text-primary" />
                  <Label htmlFor="online-payment">Online Payment</Label>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="COD" id="cash-on-delivery" />
                <div className="flex items-center">
                  <BanknotesIcon className="h-5 w-5 mr-2 text-primary" />
                  <Label htmlFor="cash-on-delivery">Cash on Delivery</Label>
                </div>
              </div>
            </RadioGroup>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.id} className="flex space-x-4">
                  <div className="w-16 h-16 relative flex-shrink-0 rounded-md overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    {item.variant && <p className="text-sm text-gray-500">Variant: {item.variant}</p>}
                    <div className="flex justify-between mt-1">
                      <p className="text-sm">Qty: {item.quantity}</p>
                      <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>₹{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={handlePlaceOrder}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Place Order'}
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-2">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
