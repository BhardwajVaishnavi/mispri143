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
  EyeIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

interface PageRow {
  id: string;
  title: string;
  slug: string;
  type: string;
  lastUpdated: string;
  status: 'published' | 'draft';
  [key: string]: string; // Index signature for dynamic access
}

const pageColumns: readonly Column[] = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'slug', label: 'URL Slug', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'lastUpdated', label: 'Last Updated', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions' },
];

export default function PagesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState<PageRow[]>([]);

  // Fetch pages on component mount
  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use mock data
      const mockPages: PageRow[] = [
        { 
          id: '1', 
          title: 'About Us', 
          slug: 'about-us', 
          type: 'Information', 
          lastUpdated: '2023-06-01', 
          status: 'published' 
        },
        { 
          id: '2', 
          title: 'Contact Us', 
          slug: 'contact-us', 
          type: 'Information', 
          lastUpdated: '2023-06-01', 
          status: 'published' 
        },
        { 
          id: '3', 
          title: 'FAQs', 
          slug: 'faqs', 
          type: 'Information', 
          lastUpdated: '2023-06-01', 
          status: 'published' 
        },
        { 
          id: '4', 
          title: 'Shipping Policy', 
          slug: 'shipping-policy', 
          type: 'Policy', 
          lastUpdated: '2023-06-01', 
          status: 'published' 
        },
        { 
          id: '5', 
          title: 'Cancellation Policy', 
          slug: 'cancellation-policy', 
          type: 'Policy', 
          lastUpdated: '2023-06-01', 
          status: 'published' 
        },
        { 
          id: '6', 
          title: 'Return Policy', 
          slug: 'return-policy', 
          type: 'Policy', 
          lastUpdated: '2023-06-01', 
          status: 'published' 
        },
        { 
          id: '7', 
          title: 'Terms & Conditions', 
          slug: 'terms-conditions', 
          type: 'Legal', 
          lastUpdated: '2023-06-01', 
          status: 'published' 
        },
        { 
          id: '8', 
          title: 'Privacy Policy', 
          slug: 'privacy-policy', 
          type: 'Legal', 
          lastUpdated: '2023-06-01', 
          status: 'published' 
        },
        { 
          id: '9', 
          title: 'Corporate Gifting', 
          slug: 'corporate-gifting', 
          type: 'Information', 
          lastUpdated: '2023-06-15', 
          status: 'draft' 
        },
      ];
      
      setPages(mockPages);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast.error('Failed to load pages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPage = () => {
    router.push('/admin/pages/new');
  };

  const handleEditPage = (id: string) => {
    router.push(`/admin/pages/${id}`);
  };

  const handleViewPage = (slug: string) => {
    // Open the page in a new tab
    window.open(`/${slug}`, '_blank');
  };

  const handleDeletePage = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      setIsLoading(true);
      try {
        // In a real app, you would call your API
        // For now, we'll just update the state
        setPages(pages.filter(page => page.id !== id));
        toast.success('Page deleted successfully');
      } catch (error) {
        console.error('Error deleting page:', error);
        toast.error('Failed to delete page');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    page.type.toLowerCase().includes(searchQuery.toLowerCase())
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
      <Button onClick={handleAddPage}>
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Page
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pages Management"
        subtitle="Create and manage website pages"
        actions={headerActions}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search pages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <DataTable<PageRow>
          columns={pageColumns}
          data={filteredPages}
          isLoading={isLoading}
          onSort={(key: string, direction: 'asc' | 'desc') => {
            console.log('Sorting by', key, direction);
          }}
          renderCell={(row: PageRow, column: Column) => {
            if (column.key === 'title') {
              return (
                <div className="font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => handleEditPage(row.id)}>
                  {row.title}
                </div>
              );
            }
            if (column.key === 'type') {
              return (
                <Badge className={
                  row.type === 'Information' ? 'bg-blue-100 text-blue-800' : 
                  row.type === 'Policy' ? 'bg-purple-100 text-purple-800' : 
                  'bg-gray-100 text-gray-800'
                }>
                  {row.type}
                </Badge>
              );
            }
            if (column.key === 'status') {
              return (
                <Badge className={
                  row.status === 'published' ? 'bg-green-100 text-green-800' : 
                  'bg-gray-100 text-gray-800'
                }>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </Badge>
              );
            }
            if (column.key === 'actions') {
              return (
                <div className="flex space-x-2">
                  {row.status === 'published' && (
                    <Button variant="ghost" size="sm" onClick={() => handleViewPage(row.slug)}>
                      <EyeIcon className="h-4 w-4 text-gray-600" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleEditPage(row.id)}>
                    <PencilIcon className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeletePage(row.id)}>
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
