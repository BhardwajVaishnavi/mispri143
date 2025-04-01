'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  PrinterIcon, 
  PaperAirplaneIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrderStatusTimeline from '@/components/orders/OrderStatusTimeline';
import OrderDeliveryMap from '@/components/orders/OrderDeliveryMap';
import OrderPaymentDetails from '@/components/orders/OrderPaymentDetails';
import OrderCustomerDetails from '@/components/orders/OrderCustomerDetails';
import OrderItemsTable from '@/components/orders/OrderItemsTable';
import OrderNotes from '@/components/orders/OrderNotes';

// Define order status types
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';
type DeliveryType = 'HOME_DELIVERY' | 'STORE_PICKUP';

// Define order interface
interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  deliveryType: DeliveryType;
  deliveryDate: string;
  deliveryTime: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  items: {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
    customText?: string;
    image?: string;
  }[];
  notes: {
    id: string;
    content: string;
    createdBy: string;
    createdAt: string;
  }[];
  timeline: {
    status: string;
    timestamp: string;
    description: string;
    performedBy: string;
  }[];
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(`/api/orders/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!order) return;
    
    try {
      setUpdating(true);
      // Replace with your actual API endpoint
      const response = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      const updatedOrder = await response.json();
      setOrder(updatedOrder);
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!order || !newNote.trim()) return;
    
    try {
      setUpdating(true);
      // Replace with your actual API endpoint
      const response = await fetch(`/api/orders/${order.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newNote }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add note');
      }
      
      const updatedOrder = await response.json();
      setOrder(updatedOrder);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setUpdating(false);
    }
  };

  const printOrder = () => {
    window.print();
  };

  const sendInvoice = async () => {
    if (!order) return;
    
    try {
      setUpdating(true);
      // Replace with your actual API endpoint
      const response = await fetch(`/api/orders/${order.id}/send-invoice`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to send invoice');
      }
      
      // Show success message
      alert('Invoice sent successfully');
    } catch (error) {
      console.error('Error sending invoice:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Order not found</h2>
        <p className="text-gray-600 mt-2">The order you're looking for doesn't exist or has been removed.</p>
        <Button 
          className="mt-4"
          onClick={() => router.push('/admin/orders')}
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      CONFIRMED: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      PROCESSING: { color: 'bg-purple-100 text-purple-800', label: 'Processing' },
      SHIPPED: { color: 'bg-indigo-100 text-indigo-800', label: 'Shipped' },
      DELIVERED: { color: 'bg-green-100 text-green-800', label: 'Delivered' },
      CANCELLED: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };
    
    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} text-xs font-medium px-2.5 py-0.5 rounded`}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      COMPLETED: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      FAILED: { color: 'bg-red-100 text-red-800', label: 'Failed' },
    };
    
    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} text-xs font-medium px-2.5 py-0.5 rounded`}>
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/orders')}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-gray-500 text-sm">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={printOrder}
          >
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button 
            variant="outline"
            size="sm"
            onClick={sendInvoice}
            disabled={updating}
          >
            <PaperAirplaneIcon className="h-4 w-4 mr-2" />
            Send Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Order Status</h2>
              {getStatusBadge(order.status)}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">Payment Status</p>
                <div className="mt-1">{getPaymentStatusBadge(order.paymentStatus)}</div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Type</p>
                <p className="font-medium">
                  {order.deliveryType === 'HOME_DELIVERY' ? 'Home Delivery' : 'Store Pickup'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Date</p>
                <p className="font-medium">{new Date(order.deliveryDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivery Time</p>
                <p className="font-medium">{order.deliveryTime}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <h3 className="font-medium">Update Status</h3>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={order.status === 'PENDING' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleStatusChange('PENDING')}
                  disabled={updating || order.status === 'PENDING'}
                >
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Pending
                </Button>
                <Button 
                  variant={order.status === 'CONFIRMED' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleStatusChange('CONFIRMED')}
                  disabled={updating || order.status === 'CONFIRMED'}
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Confirm
                </Button>
                <Button 
                  variant={order.status === 'PROCESSING' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleStatusChange('PROCESSING')}
                  disabled={updating || order.status === 'PROCESSING'}
                >
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Processing
                </Button>
                <Button 
                  variant={order.status === 'SHIPPED' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleStatusChange('SHIPPED')}
                  disabled={updating || order.status === 'SHIPPED'}
                >
                  <TruckIcon className="h-4 w-4 mr-2" />
                  Shipped
                </Button>
                <Button 
                  variant={order.status === 'DELIVERED' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleStatusChange('DELIVERED')}
                  disabled={updating || order.status === 'DELIVERED'}
                >
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Delivered
                </Button>
                <Button 
                  variant={order.status === 'CANCELLED' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => handleStatusChange('CANCELLED')}
                  disabled={updating || order.status === 'CANCELLED'}
                  className="bg-red-100 text-red-800 hover:bg-red-200"
                >
                  <XCircleIcon className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <OrderItemsTable items={order.items} />
            
            <div className="mt-4 flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span>₹0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </Card>

          <Tabs defaultValue="timeline">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="delivery">Delivery</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="timeline" className="p-4 border rounded-md mt-2">
              <OrderStatusTimeline timeline={order.timeline} />
            </TabsContent>
            <TabsContent value="delivery" className="p-4 border rounded-md mt-2">
              <OrderDeliveryMap 
                address={order.address} 
                deliveryType={order.deliveryType}
                deliveryDate={order.deliveryDate}
                deliveryTime={order.deliveryTime}
              />
            </TabsContent>
            <TabsContent value="notes" className="p-4 border rounded-md mt-2">
              <OrderNotes 
                notes={order.notes} 
                onAddNote={handleAddNote}
                newNote={newNote}
                setNewNote={setNewNote}
                isSubmitting={updating}
              />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <OrderCustomerDetails customer={order.customer} />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
            <address className="not-italic">
              <p>{order.address.street}</p>
              <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
              <p>{order.address.country}</p>
            </address>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
            <OrderPaymentDetails 
              paymentStatus={order.paymentStatus}
              totalAmount={order.totalAmount}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}
