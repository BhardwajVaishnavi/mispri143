'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  productsCount: number;
  isActive: boolean;
  [key: string]: string | number | boolean; // Index signature for dynamic access
}

const categoryColumns: readonly Column[] = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'description', label: 'Description' },
  { key: 'productsCount', label: 'Products', sortable: true },
  { key: 'isActive', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions' },
];

export default function CategoriesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<CategoryRow>>({
    name: '',
    description: '',
    isActive: true
  });

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/categories');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch categories');
      }

      const data = await response.json();

      // Transform the data to match our CategoryRow interface
      const transformedCategories: CategoryRow[] = data.map((category: any) => ({
        id: category.id,
        name: category.name,
        slug: category.slug || '',
        description: category.description || '',
        productsCount: category.productsCount || 0,
        isActive: true // Assuming all categories from API are active
      }));

      setCategories(transformedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = () => {
    setIsEditMode(false);
    setCurrentCategory({
      name: '',
      description: '',
      isActive: true
    });
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: CategoryRow) => {
    setIsEditMode(true);
    setCurrentCategory(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/categories?id=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete category');
        }

        setCategories(categories.filter(category => category.id !== id));
        toast.success('Category deleted successfully');
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to delete category');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveCategory = async () => {
    if (!currentCategory.name) {
      toast.error('Category name is required');
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode) {
        // Update existing category
        const response = await fetch('/api/categories', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: currentCategory.id,
            name: currentCategory.name,
            description: currentCategory.description || '',
            slug: currentCategory.name.toLowerCase().replace(/\s+/g, '-'),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update category');
        }

        const updatedCategory = await response.json();

        setCategories(categories.map(category =>
          category.id === currentCategory.id ? {
            ...category,
            name: updatedCategory.name,
            slug: updatedCategory.slug || '',
            description: updatedCategory.description || ''
          } : category
        ));
        toast.success('Category updated successfully');
      } else {
        // Create new category
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: currentCategory.name,
            description: currentCategory.description || '',
            slug: currentCategory.name.toLowerCase().replace(/\s+/g, '-'),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create category');
        }

        const newCategory = await response.json();

        setCategories([...categories, {
          id: newCategory.id,
          name: newCategory.name,
          slug: newCategory.slug || '',
          description: newCategory.description || '',
          productsCount: 0,
          isActive: true
        }]);
        toast.success('Category created successfully');
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentCategory(prev => ({ ...prev, isActive: checked }));
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
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
      <Button onClick={handleAddCategory}>
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Category
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        subtitle="Manage your product categories"
        actions={headerActions}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <DataTable<CategoryRow>
          columns={categoryColumns}
          data={filteredCategories}
          isLoading={isLoading}
          onSort={(key: string, direction: 'asc' | 'desc') => {
            console.log('Sorting by', key, direction);
          }}
          renderCell={(row: CategoryRow, column: Column) => {
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
                  <Button variant="ghost" size="sm" onClick={() => handleEditCategory(row)}>
                    <PencilIcon className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(row.id)}>
                    <TrashIcon className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              );
            }
            return row[column.key];
          }}
        />
      </div>

      {/* Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && setIsDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                value={currentCategory.name || ''}
                onChange={handleInputChange}
                placeholder="e.g. Flowers, Cakes, Gift Baskets"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={currentCategory.description || ''}
                onChange={handleInputChange}
                placeholder="Brief description of the category"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={currentCategory.isActive || false}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCategory} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
