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
  TrashIcon,
  EyeIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface ProductRow {
  id: string;
  image: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  [key: string]: string | number; // Index signature for dynamic access
}

type ProductStatus = 'active' | 'inactive' | 'out_of_stock';

const productColumns: readonly Column[] = [
  { key: 'image', label: 'Image' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'sku', label: 'SKU', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'price', label: 'Price', sortable: true },
  { key: 'stock', label: 'Stock', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions' },
];

const statusColors: Record<ProductStatus, string> = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  out_of_stock: 'bg-red-100 text-red-800',
};

export default function ProductsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use mock data
      const mockProducts: ProductRow[] = [
        {
          id: '1',
          name: 'Red Roses Bouquet',
          sku: 'FLW-ROS-001',
          category: 'Flowers',
          price: 1299,
          stock: 15,
          status: 'active',
          image: '/images/product-roses.jpg'
        },
        {
          id: '2',
          name: 'Chocolate Cake',
          sku: 'CAK-CHO-001',
          category: 'Cakes',
          price: 899,
          stock: 8,
          status: 'active',
          image: '/images/product-cake.jpg'
        },
        {
          id: '3',
          name: 'Mixed Flowers Arrangement',
          sku: 'FLW-MIX-001',
          category: 'Flowers',
          price: 1499,
          stock: 10,
          status: 'active',
          image: '/images/product-mixed-flowers.jpg'
        },
        {
          id: '4',
          name: 'Vanilla Cake',
          sku: 'CAK-VAN-001',
          category: 'Cakes',
          price: 799,
          stock: 0,
          status: 'out_of_stock',
          image: '/images/product-vanilla-cake.jpg'
        },
        {
          id: '5',
          name: 'Premium Gift Hamper',
          sku: 'GFT-HAM-001',
          category: 'Gifts',
          price: 2499,
          stock: 5,
          status: 'active',
          image: '/images/product-gift-hamper.jpg'
        },
        {
          id: '6',
          name: 'Teddy Bear',
          sku: 'GFT-TED-001',
          category: 'Gifts',
          price: 599,
          stock: 20,
          status: 'active',
          image: '/images/product-teddy.jpg'
        },
        {
          id: '7',
          name: 'Succulent Plant',
          sku: 'PLT-SUC-001',
          category: 'Plants',
          price: 699,
          stock: 12,
          status: 'active',
          image: '/images/product-plant.jpg'
        },
        {
          id: '8',
          name: 'New Year Special Cake',
          sku: 'CAK-NYS-001',
          category: 'Cakes',
          price: 1299,
          stock: 0,
          status: 'inactive',
          image: '/images/product-new-year-cake.jpg'
        },
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use mock data
      const mockCategories = ['Flowers', 'Cakes', 'Plants', 'Gifts', 'Combos'];
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleAddProduct = () => {
    router.push('/admin/products/new');
  };

  const handleEditProduct = (id: string) => {
    router.push(`/admin/products/${id}`);
  };

  const handleViewProduct = (id: string) => {
    // Find the product to get its category and slug
    const product = products.find(p => p.id === id);
    if (product) {
      // Convert product name to slug
      const slug = product.name.toLowerCase().replace(/\s+/g, '-');
      // Open the product page in a new tab
      window.open(`/products/${product.category.toLowerCase()}/${slug}`, '_blank');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setIsLoading(true);
      try {
        // In a real app, you would call your API
        // For now, we'll just update the state
        setProducts(products.filter(product => product.id !== id));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Failed to delete product');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredProducts = products.filter(product => {
    // Apply search filter
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());

    // Apply category filter
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;

    // Apply status filter
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const headerActions = (
    <>
      <Button variant="outline" onClick={fetchProducts} className="gap-1">
        <ArrowPathIcon className="h-5 w-5" />
        Refresh
      </Button>
      <Button variant="outline" onClick={() => {}}>
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        Export
      </Button>
      <Button onClick={handleAddProduct}>
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Product
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog"
        actions={headerActions}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>

          <div className="w-full md:w-48">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable<ProductRow>
          columns={productColumns}
          data={filteredProducts}
          isLoading={isLoading}
          onSort={(key: string, direction: 'asc' | 'desc') => {
            console.log('Sorting by', key, direction);
          }}
          renderCell={(row: ProductRow, column: Column) => {
            if (column.key === 'image') {
              return (
                <div className="relative h-12 w-12 rounded-md overflow-hidden">
                  <Image
                    src={row.image}
                    alt={row.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              );
            }
            if (column.key === 'name') {
              return (
                <div className="font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => handleEditProduct(row.id)}>
                  {row.name}
                </div>
              );
            }
            if (column.key === 'price') {
              return `₹${row.price.toLocaleString()}`;
            }
            if (column.key === 'stock') {
              return (
                <span className={row.stock === 0 ? 'text-red-500 font-medium' : ''}>
                  {row.stock}
                </span>
              );
            }
            if (column.key === 'status') {
              return (
                <Badge className={statusColors[row.status as ProductStatus]}>
                  {row.status === 'active' ? 'Active' :
                   row.status === 'inactive' ? 'Inactive' :
                   'Out of Stock'}
                </Badge>
              );
            }
            if (column.key === 'actions') {
              return (
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewProduct(row.id)}>
                    <EyeIcon className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditProduct(row.id)}>
                    <PencilIcon className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteProduct(row.id)}>
                    <TrashIcon className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              );
            }
            return row[column.key];
          }}
        />
      </div>
    </div>
  );
}
