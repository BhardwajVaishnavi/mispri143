'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import PageHeader from '@/components/admin/common/PageHeader';
import DataTable, { Column } from '@/components/DataTable';
import NewOrderModal from '@/components/admin/orders/NewOrderModal';
import {
  PlusIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TruckIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OrderRow {
  id: string;
  orderNumber: string;
  date: string;
  customer: string;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  [key: string]: string | number | OrderStatus | PaymentStatus;
}

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED';

const orderColumns: readonly Column[] = [
  { key: 'orderNumber', label: 'Order #', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'total', label: 'Total', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'paymentStatus', label: 'Payment', sortable: true },
  { key: 'actions', label: 'Actions' },
];

export default function OrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      // In a real application, you would fetch from your API with proper filters
      const response = await fetch(`/api/orders?status=${selectedStatus}`);
      const data = await response.json();

      // Transform the data to match our enhanced OrderRow interface
      const transformedOrders = data.orders?.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber || `ORD-${order.id.substring(0, 6)}`,
        date: new Date(order.createdAt).toLocaleDateString(),
        customer: order.customer?.name || 'N/A',
        total: order.totalAmount,
        status: order.status.toUpperCase() as OrderStatus,
        paymentStatus: order.paymentStatus || 'PENDING',
      })) || [];

      // Filter by active tab if needed
      let filteredOrders = transformedOrders;

      if (activeTab !== 'all') {
        filteredOrders = transformedOrders.filter((order: OrderRow) => order.status === activeTab);
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredOrders = filteredOrders.filter((order: OrderRow) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query)
        );
      }

      setOrders(filteredOrders);
    } catch (error) {
      toast.error('Failed to fetch orders');
      // If API fails, use mock data for demo
      const mockOrders: OrderRow[] = [
        {
          id: '1',
          orderNumber: 'ORD-001',
          customer: 'John Doe',
          date: '2023-04-01',
          total: 1250,
          status: 'DELIVERED',
          paymentStatus: 'COMPLETED',
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          customer: 'Jane Smith',
          date: '2023-04-02',
          total: 850,
          status: 'PROCESSING',
          paymentStatus: 'COMPLETED',
        },
        {
          id: '3',
          orderNumber: 'ORD-003',
          customer: 'Robert Johnson',
          date: '2023-04-03',
          total: 2100,
          status: 'PENDING',
          paymentStatus: 'PENDING',
        },
      ];
      setOrders(mockOrders);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, searchQuery, activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewOrder = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`);
  };

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800', icon: <ClockIcon className="h-4 w-4 mr-1" /> },
      CONFIRMED: { color: 'bg-blue-100 text-blue-800', icon: <CheckCircleIcon className="h-4 w-4 mr-1" /> },
      PROCESSING: { color: 'bg-purple-100 text-purple-800', icon: <CogIcon className="h-4 w-4 mr-1" /> },
      SHIPPED: { color: 'bg-indigo-100 text-indigo-800', icon: <TruckIcon className="h-4 w-4 mr-1" /> },
      DELIVERED: { color: 'bg-green-100 text-green-800', icon: <CheckCircleIcon className="h-4 w-4 mr-1" /> },
      CANCELLED: { color: 'bg-red-100 text-red-800', icon: <XCircleIcon className="h-4 w-4 mr-1" /> },
    };

    const config = statusConfig[status];
    return (
      <Badge className={`${config.color} flex items-center`}>
        {config.icon}
        <span>{status.charAt(0) + status.slice(1).toLowerCase()}</span>
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const statusConfig = {
      PENDING: { color: 'bg-yellow-100 text-yellow-800' },
      COMPLETED: { color: 'bg-green-100 text-green-800' },
      FAILED: { color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.color}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    );
  };

  const headerActions = (
    <>
      <Button variant="outline" size="sm">
        <FunnelIcon className="h-4 w-4 mr-2" />
        Filter
      </Button>
      <Button variant="outline" size="sm">
        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
        Export
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={() => setIsNewOrderModalOpen(true)}
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        New Order
      </Button>
    </>
  );

  const handleCreateOrder = async (orderData: any) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      await fetchOrders(); // Refresh the orders list
      setIsNewOrderModalOpen(false);
      toast.success('Order created successfully');
    } catch (error) {
      toast.error('Failed to create order');
      throw error; // Re-throw to be handled by the modal
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        subtitle="Manage and track customer orders"
        actions={headerActions}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="PROCESSING">Processing</TabsTrigger>
          <TabsTrigger value="SHIPPED">Shipped</TabsTrigger>
          <TabsTrigger value="DELIVERED">Delivered</TabsTrigger>
          <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="admin-card">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full select-input"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="select-input w-48"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <DataTable<OrderRow>
          columns={orderColumns}
          data={orders}
          isLoading={isLoading}
          onSort={(key: string, direction: 'asc' | 'desc') => {
            console.log('Sorting by', key, direction);
          }}
          renderCell={(row: OrderRow, column: Column) => {
            if (column.key === 'orderNumber') {
              return (
                <div className="font-medium text-blue-600">{row.orderNumber}</div>
              );
            }
            if (column.key === 'total') {
              return `₹${row.total.toFixed(2)}`;
            }
            if (column.key === 'status') {
              return getStatusBadge(row.status);
            }
            if (column.key === 'paymentStatus') {
              return getPaymentStatusBadge(row.paymentStatus);
            }
            if (column.key === 'actions') {
              return (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewOrder(row.id)}
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </div>
              );
            }
            return row[column.key];
          }}
        />
      </div>

      <NewOrderModal
        isOpen={isNewOrderModalOpen}
        onClose={() => setIsNewOrderModalOpen(false)}
        onSubmit={handleCreateOrder}
      />
    </div>
  );
}



