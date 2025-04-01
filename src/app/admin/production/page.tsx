'use client';

import { useState, useEffect } from 'react';
import { 
  CubeIcon, 
  PlusIcon, 
  ArrowPathIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'react-hot-toast';
import ProductionFormModal from '@/components/admin/production/ProductionFormModal';

interface RawMaterial {
  id: string;
  name: string;
  currentStock: number;
  unit: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface Production {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  startDate: string;
  endDate?: string;
  wastage: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  consumption: {
    id: string;
    rawMaterialId: string;
    rawMaterial: RawMaterial;
    quantity: number;
  }[];
}

export default function ProductionPage() {
  const [productions, setProductions] = useState<Production[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productionsRes, materialsRes, productsRes] = await Promise.all([
        fetch('/api/production'),
        fetch('/api/warehouse/materials'),
        fetch('/api/products')
      ]);

      if (!productionsRes.ok || !materialsRes.ok || !productsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const productionsData = await productionsRes.json();
      const materialsData = await materialsRes.json();
      const productsData = await productsRes.json();

      setProductions(productionsData);
      setRawMaterials(materialsData);
      setProducts(productsData.products);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
      
      // For demo purposes, set mock data if API fails
      setProductions([
        {
          id: '1',
          productId: '1',
          product: { id: '1', name: 'Premium Rose Bouquet', description: 'Luxury rose arrangement', price: 89.99 },
          quantity: 10,
          startDate: '2023-05-15T10:00:00Z',
          endDate: '2023-05-15T14:00:00Z',
          wastage: 0.5,
          status: 'COMPLETED',
          consumption: [
            { id: '1', rawMaterialId: '1', rawMaterial: { id: '1', name: 'Fresh Roses', currentStock: 350, unit: 'stems' }, quantity: 120 },
            { id: '2', rawMaterialId: '2', rawMaterial: { id: '2', name: 'Wrapping Paper', currentStock: 45, unit: 'sheets' }, quantity: 10 }
          ]
        },
        {
          id: '2',
          productId: '2',
          product: { id: '2', name: 'Chocolate Cake', description: 'Rich chocolate cake', price: 49.99 },
          quantity: 5,
          startDate: '2023-05-16T09:00:00Z',
          endDate: undefined,
          wastage: 0,
          status: 'IN_PROGRESS',
          consumption: [
            { id: '3', rawMaterialId: '3', rawMaterial: { id: '3', name: 'Cake Flour', currentStock: 180, unit: 'kg' }, quantity: 2.5 },
            { id: '4', rawMaterialId: '4', rawMaterial: { id: '4', name: 'Chocolate', currentStock: 25, unit: 'kg' }, quantity: 1.5 }
          ]
        },
        {
          id: '3',
          productId: '3',
          product: { id: '3', name: 'Birthday Gift Basket', description: 'Assorted birthday gifts', price: 79.99 },
          quantity: 8,
          startDate: '2023-05-17T08:00:00Z',
          endDate: undefined,
          wastage: 0,
          status: 'PLANNED',
          consumption: [
            { id: '5', rawMaterialId: '5', rawMaterial: { id: '5', name: 'Gift Basket', currentStock: 20, unit: 'pcs' }, quantity: 8 },
            { id: '6', rawMaterialId: '6', rawMaterial: { id: '6', name: 'Assorted Chocolates', currentStock: 50, unit: 'boxes' }, quantity: 8 }
          ]
        }
      ]);
      
      setRawMaterials([
        { id: '1', name: 'Fresh Roses', currentStock: 350, unit: 'stems' },
        { id: '2', name: 'Wrapping Paper', currentStock: 45, unit: 'sheets' },
        { id: '3', name: 'Cake Flour', currentStock: 180, unit: 'kg' },
        { id: '4', name: 'Chocolate', currentStock: 25, unit: 'kg' },
        { id: '5', name: 'Gift Basket', currentStock: 20, unit: 'pcs' },
        { id: '6', name: 'Assorted Chocolates', currentStock: 50, unit: 'boxes' }
      ]);
      
      setProducts([
        { id: '1', name: 'Premium Rose Bouquet', description: 'Luxury rose arrangement', price: 89.99 },
        { id: '2', name: 'Chocolate Cake', description: 'Rich chocolate cake', price: 49.99 },
        { id: '3', name: 'Birthday Gift Basket', description: 'Assorted birthday gifts', price: 79.99 }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProduction = async (data: any) => {
    try {
      const response = await fetch('/api/production', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create production');
      }

      toast.success('Production created successfully');
      setIsFormModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error creating production:', error);
      toast.error('Failed to create production');
    }
  };

  const handleUpdateStatus = async (id: string, status: 'COMPLETED' | 'CANCELLED') => {
    try {
      const response = await fetch(`/api/production/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update production status to ${status}`);
      }

      toast.success(`Production ${status.toLowerCase()} successfully`);
      fetchData();
    } catch (error) {
      console.error('Error updating production status:', error);
      toast.error(`Failed to update production status to ${status}`);
    }
  };

  const filteredProductions = activeTab === 'all' 
    ? productions 
    : productions.filter(p => p.status === activeTab.toUpperCase());

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PLANNED':
        return <Badge className="bg-blue-100 text-blue-800">Planned</Badge>;
      case 'IN_PROGRESS':
        return <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Production Management</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchData}>
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => setIsFormModalOpen(true)}>
            <PlusIcon className="h-5 w-5 mr-2" />
            New Production
          </Button>
        </div>
      </div>

      {/* Production Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center">
            <CubeIcon className="h-10 w-10 text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Productions</p>
              <p className="text-2xl font-semibold">{productions.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-yellow-100 mr-4">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold">
                {productions.filter(p => p.status === 'IN_PROGRESS').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 mr-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-semibold">
                {productions.filter(p => p.status === 'COMPLETED').length}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 mr-4">
              <XCircleIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Planned</p>
              <p className="text-2xl font-semibold">
                {productions.filter(p => p.status === 'PLANNED').length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Production List */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="planned">Planned</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Materials Used
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProductions.map((production) => (
                    <tr key={production.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{production.product.name}</div>
                        <div className="text-sm text-gray-500">{production.product.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {production.quantity} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(production.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(production.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {production.consumption.map((item) => (
                            <div key={item.id} className="mb-1">
                              {item.quantity} {item.rawMaterial.unit} of {item.rawMaterial.name}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {production.status === 'PLANNED' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleUpdateStatus(production.id, 'CANCELLED')}
                            >
                              Cancel
                            </Button>
                          )}
                          {production.status === 'IN_PROGRESS' && (
                            <Button 
                              size="sm"
                              onClick={() => handleUpdateStatus(production.id, 'COMPLETED')}
                            >
                              Complete
                            </Button>
                          )}
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Production Form Modal */}
      <ProductionFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleCreateProduction}
        products={products}
        rawMaterials={rawMaterials}
      />
    </div>
  );
}
