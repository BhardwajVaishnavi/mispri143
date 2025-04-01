'use client';

import { useState } from 'react';
import { Search, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';

export default function GiftFinderTool() {
  const router = useRouter();
  const [occasion, setOccasion] = useState('');
  const [recipient, setRecipient] = useState('');
  const [priceRange, setPriceRange] = useState('');
  
  const occasions = [
    { id: 'birthday', label: 'Birthday' },
    { id: 'anniversary', label: 'Anniversary' },
    { id: 'valentines', label: 'Valentine\'s Day' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'congratulations', label: 'Congratulations' },
  ];
  
  const recipients = [
    { id: 'him', label: 'Him' },
    { id: 'her', label: 'Her' },
    { id: 'parents', label: 'Parents' },
    { id: 'friends', label: 'Friends' },
    { id: 'colleagues', label: 'Colleagues' },
  ];
  
  const priceRanges = [
    { id: 'under-500', label: 'Under ₹500' },
    { id: '500-1000', label: '₹500 - ₹1000' },
    { id: '1000-2000', label: '₹1000 - ₹2000' },
    { id: 'above-2000', label: 'Above ₹2000' },
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct query parameters
    const params = new URLSearchParams();
    if (occasion) params.append('occasion', occasion);
    if (recipient) params.append('recipient', recipient);
    if (priceRange) params.append('price', priceRange);
    
    // Navigate to products page with filters
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="bg-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-pink-600 text-white text-center">
            <Gift className="h-10 w-10 mx-auto mb-2" />
            <h2 className="text-2xl font-bold">Gift Finder</h2>
            <p className="text-white/80">Find the perfect gift in just a few clicks</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Occasion */}
              <div>
                <Label className="text-gray-700 font-medium mb-2 block">Occasion</Label>
                <RadioGroup value={occasion} onValueChange={setOccasion} className="space-y-2">
                  {occasions.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <RadioGroupItem value={item.id} id={`occasion-${item.id}`} />
                      <Label htmlFor={`occasion-${item.id}`} className="ml-2 cursor-pointer">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Recipient */}
              <div>
                <Label className="text-gray-700 font-medium mb-2 block">Recipient</Label>
                <RadioGroup value={recipient} onValueChange={setRecipient} className="space-y-2">
                  {recipients.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <RadioGroupItem value={item.id} id={`recipient-${item.id}`} />
                      <Label htmlFor={`recipient-${item.id}`} className="ml-2 cursor-pointer">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Price Range */}
              <div>
                <Label className="text-gray-700 font-medium mb-2 block">Price Range</Label>
                <RadioGroup value={priceRange} onValueChange={setPriceRange} className="space-y-2">
                  {priceRanges.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <RadioGroupItem value={item.id} id={`price-${item.id}`} />
                      <Label htmlFor={`price-${item.id}`} className="ml-2 cursor-pointer">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Button 
                type="submit" 
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-2"
                disabled={!occasion && !recipient && !priceRange}
              >
                <Search className="h-4 w-4 mr-2" />
                Find Gifts
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
