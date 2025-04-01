'use client';

import { UserIcon, EnvelopeIcon, PhoneIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface OrderCustomerDetailsProps {
  customer: Customer;
}

export default function OrderCustomerDetails({ customer }: OrderCustomerDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 p-2 rounded-full">
            <UserIcon className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <h3 className="font-medium">{customer.name}</h3>
            <Link 
              href={`/admin/customers/${customer.id}`}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              View Profile
              <ArrowTopRightOnSquareIcon className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm">
          <EnvelopeIcon className="h-4 w-4 text-gray-400" />
          <a href={`mailto:${customer.email}`} className="text-gray-600 hover:text-gray-900">
            {customer.email}
          </a>
        </div>
        
        <div className="flex items-center space-x-2 text-sm">
          <PhoneIcon className="h-4 w-4 text-gray-400" />
          <a href={`tel:${customer.phone}`} className="text-gray-600 hover:text-gray-900">
            {customer.phone}
          </a>
        </div>
      </div>
      
      <div className="flex space-x-2 pt-2">
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Email Customer
        </button>
        <span className="text-gray-300">|</span>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Call Customer
        </button>
      </div>
    </div>
  );
}
