import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/layout/AdminLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { POSService } from '@/lib/services/pos.service';

// Define Product interface
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

// Add printReceipt function
const printReceipt = async (order: any) => {
  // Implement receipt printing logic here
  console.log('Printing receipt for order:', order);
};

const POSSystem = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Implement your product fetching logic here
        const response = await fetch('/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddToCart = (product: Product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      }]);
    }
  };

  const handleCompleteOrder = async () => {
    setIsProcessing(true);
    try {
      const order = await POSService.createSale({
        storeId: 'current-store-id', // Replace with actual store ID
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        paymentMethod: 'CASH',
        staffId: 'current-staff-id' // Replace with actual staff ID
      });

      await printReceipt(order);
      setCart([]);
    } catch (error) {
      console.error('Error processing order:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-3 gap-6 p-6">
        <div className="col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="grid grid-cols-4 gap-4">
              {products.map(product => (
                <div
                  key={product.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                  onClick={() => handleAddToCart(product)}
                >
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
                  <p className="font-semibold mt-2">{product.name}</p>
                  <p className="text-gray-600">₹{product.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Current Order</h2>
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="p-2 text-left">Item</th>
                    <th className="p-2 text-right">Qty</th>
                    <th className="p-2 text-right">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.productId} className="border-b">
                      <td className="p-2">{item.name}</td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">₹{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <span className="font-semibold">Total:</span>
              <span className="font-semibold">₹{total.toFixed(2)}</span>
            </div>

            <Button
              onClick={handleCompleteOrder}
              disabled={cart.length === 0}
            >
              Process Payment
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default POSSystem;


