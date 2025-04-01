'use client';

import { MapPinIcon, TruckIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface OrderDeliveryMapProps {
  address: Address;
  deliveryType: 'HOME_DELIVERY' | 'STORE_PICKUP';
  deliveryDate: string;
  deliveryTime: string;
}

export default function OrderDeliveryMap({ 
  address, 
  deliveryType,
  deliveryDate,
  deliveryTime
}: OrderDeliveryMapProps) {
  const formattedAddress = `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
  
  // In a real application, you would use a mapping API like Google Maps
  // For this example, we'll just show a placeholder
  
  return (
    <div className="space-y-4">
      <div className="bg-gray-100 rounded-lg p-4 flex items-center space-x-3">
        <div className="bg-white p-2 rounded-full">
          {deliveryType === 'HOME_DELIVERY' ? (
            <TruckIcon className="h-6 w-6 text-blue-500" />
          ) : (
            <MapPinIcon className="h-6 w-6 text-blue-500" />
          )}
        </div>
        <div>
          <h3 className="font-medium">
            {deliveryType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Store Pickup'}
          </h3>
          <p className="text-sm text-gray-500">{formattedAddress}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 rounded-lg p-4 flex items-center space-x-3">
          <div className="bg-white p-2 rounded-full">
            <CalendarIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium">Delivery Date</h3>
            <p className="text-sm text-gray-500">
              {new Date(deliveryDate).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4 flex items-center space-x-3">
          <div className="bg-white p-2 rounded-full">
            <ClockIcon className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium">Delivery Time</h3>
            <p className="text-sm text-gray-500">{deliveryTime}</p>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg overflow-hidden h-64 bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto" />
          <p className="mt-2 text-gray-500">Map view would be displayed here</p>
          <p className="text-sm text-gray-400">Integrate with Google Maps or other mapping service</p>
        </div>
      </div>
    </div>
  );
}
