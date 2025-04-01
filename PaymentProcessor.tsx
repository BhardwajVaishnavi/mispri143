'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PaymentProcessorProps {
  amount: number;
  orderId: string;
  onSuccess: () => void;
}

export const PaymentProcessor = ({ amount, orderId, onSuccess }: PaymentProcessorProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      onSuccess();
      setIsProcessing(false);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <div>
      <Button onClick={() => setIsOpen(!isOpen)} disabled={isProcessing}>
        Process Payment
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Payment Details</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4 py-4">
              <div className="text-xl font-medium">Total: ₹{amount.toFixed(2)}</div>
              
              <div className="flex items-center space-x-2">
                <input type="radio" id="cash" name="paymentMethod" checked readOnly />
                <label htmlFor="cash">Cash Payment</label>
              </div>

              <Input
                placeholder="Amount Received"
                type="number"
                min={amount}
                className="mt-2"
              />
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handlePayment} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Confirm Payment'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
