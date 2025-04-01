'use client';

import { useState, useEffect } from 'react';
import PageHeader from '@/components/admin/common/PageHeader';
import DataTable, { Column } from '@/components/DataTable';
import {
  PlusIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';

interface DeliveryOptionRow {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedTime: string;
  isActive: boolean;
  [key: string]: string | number | boolean; // Index signature for dynamic access
}

const deliveryOptionColumns: readonly Column[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'description', label: 'Description' },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'estimatedTime', label: 'Estimated Time' },
  { key: 'isActive', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions' },
];

export default function DeliveryOptionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOptionRow[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentOption, setCurrentOption] = useState<Partial<DeliveryOptionRow>>({
    name: '',
    description: '',
    price: 0,
    estimatedTime: '',
    isActive: true
  });

  // Fetch delivery options on component mount
  useEffect(() => {
    fetchDeliveryOptions();
  }, []);

  const fetchDeliveryOptions = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use mock data
      const mockDeliveryOptions: DeliveryOptionRow[] = [
        { 
          id: '1', 
          name: 'Standard Delivery', 
          description: 'Delivery within 1-2 business days', 
          price: 0, 
          estimatedTime: '1-2 days', 
          isActive: true 
        },
        { 
          id: '2', 
          name: 'Express Delivery', 
          description: 'Same day delivery (order before 2 PM)', 
          price: 99, 
          estimatedTime: 'Same day', 
          isActive: true 
        },
        { 
          id: '3', 
          name: 'Fixed Time Delivery', 
          description: 'Choose a specific time slot', 
          price: 149, 
          estimatedTime: 'Selected time slot', 
          isActive: true 
        },
        { 
          id: '4', 
          name: 'Midnight Delivery', 
          description: 'Delivery between 11 PM and 12 AM', 
          price: 199, 
          estimatedTime: 'Midnight', 
          isActive: true 
        },
        { 
          id: '5', 
          name: 'International Delivery', 
          description: 'Delivery to international locations', 
          price: 999, 
          estimatedTime: '3-5 days', 
          isActive: false 
        },
      ];
      
      setDeliveryOptions(mockDeliveryOptions);
    } catch (error) {
      console.error('Error fetching delivery options:', error);
      toast.error('Failed to load delivery options');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOption = () => {
    setIsEditMode(false);
    setCurrentOption({
      name: '',
      description: '',
      price: 0,
      estimatedTime: '',
      isActive: true
    });
    setIsDialogOpen(true);
  };

  const handleEditOption = (option: DeliveryOptionRow) => {
    setIsEditMode(true);
    setCurrentOption(option);
    setIsDialogOpen(true);
  };

  const handleDeleteOption = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this delivery option?')) {
      setIsLoading(true);
      try {
        // In a real app, you would call your API
        // For now, we'll just update the state
        setDeliveryOptions(deliveryOptions.filter(option => option.id !== id));
        toast.success('Delivery option deleted successfully');
      } catch (error) {
        console.error('Error deleting delivery option:', error);
        toast.error('Failed to delete delivery option');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveOption = async () => {
    if (!currentOption.name || !currentOption.description || !currentOption.estimatedTime) {
      toast.error('All fields are required');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you would call your API
      // For now, we'll just update the state
      if (isEditMode) {
        setDeliveryOptions(deliveryOptions.map(option => 
          option.id === currentOption.id ? { ...option, ...currentOption } as DeliveryOptionRow : option
        ));
        toast.success('Delivery option updated successfully');
      } else {
        const newOption: DeliveryOptionRow = {
          id: Date.now().toString(),
          name: currentOption.name as string,
          description: currentOption.description as string,
          price: currentOption.price as number,
          estimatedTime: currentOption.estimatedTime as string,
          isActive: currentOption.isActive as boolean
        };
        setDeliveryOptions([...deliveryOptions, newOption]);
        toast.success('Delivery option created successfully');
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving delivery option:', error);
      toast.error('Failed to save delivery option');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentOption(prev => ({ 
      ...prev, 
      [name]: name === 'price' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentOption(prev => ({ ...prev, isActive: checked }));
  };

  const filteredOptions = deliveryOptions.filter(option => 
    option.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    option.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const headerActions = (
    <>
      <Button variant="outline" onClick={() => {}}>
        <FunnelIcon className="h-5 w-5 mr-2" />
        Filter
      </Button>
      <Button variant="outline" onClick={() => {}}>
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        Export
      </Button>
      <Button onClick={handleAddOption}>
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Delivery Option
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery Options"
        subtitle="Manage delivery methods and special delivery options"
        actions={headerActions}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search delivery options..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <DataTable<DeliveryOptionRow>
          columns={deliveryOptionColumns}
          data={filteredOptions}
          isLoading={isLoading}
          onSort={(key: string, direction: 'asc' | 'desc') => {
            console.log('Sorting by', key, direction);
          }}
          renderCell={(row: DeliveryOptionRow, column: Column) => {
            if (column.key === 'price') {
              return row.price === 0 ? 'Free' : `₹${row.price}`;
            }
            if (column.key === 'isActive') {
              return (
                <Badge className={row.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                  {row.isActive ? 'Active' : 'Inactive'}
                </Badge>
              );
            }
            if (column.key === 'actions') {
              return (
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditOption(row)}>
                    <PencilIcon className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteOption(row.id)}>
                    <TrashIcon className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              );
            }
            return row[column.key];
          }}
        />
      </div>

      {/* Delivery Option Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && setIsDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Delivery Option' : 'Add Delivery Option'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={currentOption.name || ''}
                onChange={handleInputChange}
                placeholder="e.g. Express Delivery"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={currentOption.description || ''}
                onChange={handleInputChange}
                placeholder="Brief description of the delivery option"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="1"
                value={currentOption.price || 0}
                onChange={handleInputChange}
                placeholder="0 for free delivery"
              />
            </div>
            <div>
              <Label htmlFor="estimatedTime">Estimated Delivery Time</Label>
              <Input
                id="estimatedTime"
                name="estimatedTime"
                value={currentOption.estimatedTime || ''}
                onChange={handleInputChange}
                placeholder="e.g. 1-2 days, Same day, etc."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={currentOption.isActive || false}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveOption} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Option'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
