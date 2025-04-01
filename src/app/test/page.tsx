'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function TestPage() {
  const [productResult, setProductResult] = useState<any>(null);
  const [orderResult, setOrderResult] = useState<any>(null);
  const [loading, setLoading] = useState({
    product: false,
    order: false
  });

  const testCreateProduct = async () => {
    try {
      setLoading(prev => ({ ...prev, product: true }));
      const response = await fetch('/api/test/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setProductResult(data);
    } catch (error) {
      console.error('Error testing product creation:', error);
      setProductResult({ error: 'Failed to test product creation' });
    } finally {
      setLoading(prev => ({ ...prev, product: false }));
    }
  };

  const testCreateOrder = async () => {
    try {
      setLoading(prev => ({ ...prev, order: true }));
      const response = await fetch('/api/test/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setOrderResult(data);
    } catch (error) {
      console.error('Error testing order creation:', error);
      setOrderResult({ error: 'Failed to test order creation' });
    } finally {
      setLoading(prev => ({ ...prev, order: false }));
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Product Creation</h2>
          <p className="mb-4">
            This will create a test product with variants, customization options, and care instructions.
          </p>
          <Button 
            onClick={testCreateProduct}
            disabled={loading.product}
          >
            {loading.product ? 'Creating...' : 'Create Test Product'}
          </Button>
          
          {productResult && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
                {JSON.stringify(productResult, null, 2)}
              </pre>
            </div>
          )}
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Test Order Creation</h2>
          <p className="mb-4">
            This will create a test order with a test user and address.
          </p>
          <Button 
            onClick={testCreateOrder}
            disabled={loading.order}
          >
            {loading.order ? 'Creating...' : 'Create Test Order'}
          </Button>
          
          {orderResult && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs">
                {JSON.stringify(orderResult, null, 2)}
              </pre>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
