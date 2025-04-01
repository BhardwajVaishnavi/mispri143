'use client';

import { useState, useEffect } from 'react';
import { 
  BuildingStorefrontIcon, 
  PlusIcon, 
  ArrowPathIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import WarehouseFormModal from '@/components/admin/warehouse/WarehouseFormModal';
import RawMaterialFormModal from '@/components/admin/warehouse/RawMaterialFormModal';

interface Warehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  description: string;
  status: string;
  rawMaterials: RawMaterial[];
}

interface RawMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  currentStock: number;
  warehouseId: string;
}

export default function WarehousePage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/warehouse');
      if (!response.ok) {
        throw new Error('Failed to fetch warehouses');
      }
      const data = await response.json();
      setWarehouses(data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      toast.error('Failed to load warehouses');
      
      // For demo purposes, set mock data if API fails
      setWarehouses([
        {
          id: '1',
          name: 'Main Warehouse',
          location: '123 Storage St, Warehouse District',
          capacity: 10000,
          description: 'Main storage facility for raw materials',
          status: 'ACTIVE',
          rawMaterials: [
            { id: '1', name: 'Fresh Roses', quantity: 500, unit: 'stems', minimumStock: 100, currentStock: 350, warehouseId: '1' },
            { id: '2', name: 'Cake Flour', quantity: 200, unit: 'kg', minimumStock: 50, currentStock: 180, warehouseId: '1' },
            { id: '3', name: 'Chocolate', quantity: 100, unit: 'kg', minimumStock: 30, currentStock: 25, warehouseId: '1' },
            { id: '4', name: 'Vanilla Extract', quantity: 50, unit: 'liters', minimumStock: 10, currentStock: 45, warehouseId: '1' },
          ]
        },
        {
          id: '2',
          name: 'Secondary Warehouse',
          location: '456 Backup Ave, Storage Park',
          capacity: 5000,
          description: 'Overflow storage for seasonal items',
          status: 'ACTIVE',
          rawMaterials: [
            { id: '5', name: 'Tulips', quantity: 300, unit: 'stems', minimumStock: 50, currentStock: 280, warehouseId: '2' },
            { id: '6', name: 'Sugar', quantity: 400, unit: 'kg', minimumStock: 100, currentStock: 350, warehouseId: '2' },
          ]
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWarehouse = async (data: Omit<Warehouse, 'id' | 'rawMaterials'>) => {
    try {
      const response = await fetch('/api/warehouse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create warehouse');
      }

      toast.success('Warehouse created successfully');
      setIsWarehouseModalOpen(false);
      fetchWarehouses();
    } catch (error) {
      console.error('Error creating warehouse:', error);
      toast.error('Failed to create warehouse');
    }
  };

  const handleAddRawMaterial = async (data: Omit<RawMaterial, 'id'>) => {
    if (!selectedWarehouse) return;
    
    try {
      const response = await fetch('/api/warehouse/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          warehouseId: selectedWarehouse.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add raw material');
      }

      toast.success('Raw material added successfully');
      setIsMaterialModalOpen(false);
      fetchWarehouses();
    } catch (error) {
      console.error('Error adding raw material:', error);
      toast.error('Failed to add raw material');
    }
  };

  const filteredMaterials = selectedWarehouse?.rawMaterials.filter(material => 
    material.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const lowStockMaterials = warehouses.flatMap(warehouse => 
    warehouse.rawMaterials.filter(material => material.currentStock <= material.minimumStock)
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Warehouse Management</h1>
        <Button onClick={() => setIsWarehouseModalOpen(true)}>
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Warehouse
        </Button>
      </div>

      {/* Warehouse Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center">
            <BuildingStorefrontIcon className="h-10 w-10 text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500">Total Warehouses</p>
              <p className="text-2xl font-semibold">{warehouses.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-green-100 mr-4">
              <PlusIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Raw Materials</p>
              <p className="text-2xl font-semibold">
                {warehouses.reduce((total, warehouse) => total + warehouse.rawMaterials.length, 0)}
              </p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-red-100 mr-4">
              <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-semibold">{lowStockMaterials.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Warehouse List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {warehouses.map(warehouse => (
          <Card 
            key={warehouse.id} 
            className={`p-6 cursor-pointer transition-all hover:shadow-md ${
              selectedWarehouse?.id === warehouse.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedWarehouse(warehouse)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{warehouse.name}</h3>
                <p className="text-sm text-gray-500">{warehouse.location}</p>
              </div>
              <Badge variant={warehouse.status === 'ACTIVE' ? 'default' : 'destructive'}>
                {warehouse.status}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm">
                <span className="font-medium">Capacity:</span> {warehouse.capacity} units
              </p>
              <p className="text-sm">
                <span className="font-medium">Materials:</span> {warehouse.rawMaterials.length} items
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Raw Materials Section */}
      {selectedWarehouse && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Raw Materials - {selectedWarehouse.name}
            </h2>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={fetchWarehouses}>
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setIsMaterialModalOpen(true)}>
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Material
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <Input
              type="search"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Minimum Stock
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMaterials.map((material) => (
                    <tr key={material.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {material.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {material.currentStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {material.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {material.minimumStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          material.currentStock <= material.minimumStock
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {material.currentStock <= material.minimumStock ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button variant="outline" size="sm">Edit</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <WarehouseFormModal
        isOpen={isWarehouseModalOpen}
        onClose={() => setIsWarehouseModalOpen(false)}
        onSubmit={handleAddWarehouse}
      />

      {selectedWarehouse && (
        <RawMaterialFormModal
          isOpen={isMaterialModalOpen}
          onClose={() => setIsMaterialModalOpen(false)}
          onSubmit={handleAddRawMaterial}
          warehouseName={selectedWarehouse.name}
        />
      )}
    </div>
  );
}
