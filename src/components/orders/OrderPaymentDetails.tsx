'use client';

import { CreditCardIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';

interface OrderPaymentDetailsProps {
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED';
  totalAmount: number;
  paymentMethod?: string;
  transactionId?: string;
  paymentDate?: string;
}

export default function OrderPaymentDetails({ 
  paymentStatus, 
  totalAmount,
  paymentMethod = 'Credit Card',
  transactionId,
  paymentDate
}: OrderPaymentDetailsProps) {
  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'COMPLETED':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'FAILED':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'PENDING':
      default:
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusBadge = () => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      COMPLETED: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      FAILED: { color: 'bg-red-100 text-red-800', label: 'Failed' },
    };
    
    const config = statusConfig[paymentStatus];
    return (
      <Badge className={`${config.color} text-xs font-medium px-2.5 py-0.5 rounded`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <CreditCardIcon className="h-5 w-5 text-gray-400" />
          <span className="font-medium">{paymentMethod}</span>
        </div>
        {getStatusBadge()}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-3">
          {getStatusIcon()}
          <div>
            <h3 className="font-medium">Payment {paymentStatus.toLowerCase()}</h3>
            {paymentDate && (
              <p className="text-sm text-gray-500">
                on {new Date(paymentDate).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Amount:</span>
            <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
          </div>
          
          {transactionId && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Transaction ID:</span>
              <span className="font-mono text-xs">{transactionId}</span>
            </div>
          )}
        </div>
      </div>
      
      {paymentStatus === 'PENDING' && (
        <div className="flex justify-end">
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Send Payment Reminder
          </button>
        </div>
      )}
    </div>
  );
}
