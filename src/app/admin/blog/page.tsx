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

interface BlogPostRow {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  status: 'published' | 'draft' | 'scheduled';
  [key: string]: string; // Index signature for dynamic access
}

const blogColumns: readonly Column[] = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'author', label: 'Author', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions' },
];

export default function BlogPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [blogPosts, setBlogPosts] = useState<BlogPostRow[]>([]);

  // Fetch blog posts on component mount
  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use mock data
      const mockBlogPosts: BlogPostRow[] = [
        { 
          id: '1', 
          title: '10 Best Birthday Gift Ideas for Your Loved Ones', 
          category: 'Gift Ideas', 
          author: 'Priya Sharma', 
          date: '2023-05-15', 
          status: 'published' 
        },
        { 
          id: '2', 
          title: 'How to Choose the Perfect Anniversary Flowers', 
          category: 'Flowers', 
          author: 'Rahul Patel', 
          date: '2023-06-22', 
          status: 'published' 
        },
        { 
          id: '3', 
          title: 'Ultimate Guide to Wedding Cake Flavors and Designs', 
          category: 'Cakes', 
          author: 'Ananya Gupta', 
          date: '2023-07-10', 
          status: 'published' 
        },
        { 
          id: '4', 
          title: 'Top 5 Plants That Purify Indoor Air', 
          category: 'Plants', 
          author: 'Vikram Singh', 
          date: '2023-08-05', 
          status: 'draft' 
        },
        { 
          id: '5', 
          title: 'Valentine\'s Day Special: Romantic Gift Ideas', 
          category: 'Gift Ideas', 
          author: 'Neha Kapoor', 
          date: '2024-01-15', 
          status: 'scheduled' 
        },
      ];
      
      setBlogPosts(mockBlogPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBlogPost = () => {
    router.push('/admin/blog/new');
  };

  const handleEditBlogPost = (id: string) => {
    router.push(`/admin/blog/${id}`);
  };

  const handleViewBlogPost = (id: string) => {
    // In a real app, this would open the published blog post
    window.open(`/blog/${id}`, '_blank');
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setIsLoading(true);
      try {
        // In a real app, you would call your API
        // For now, we'll just update the state
        setBlogPosts(blogPosts.filter(post => post.id !== id));
        toast.success('Blog post deleted successfully');
      } catch (error) {
        console.error('Error deleting blog post:', error);
        toast.error('Failed to delete blog post');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredBlogPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase())
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
      <Button onClick={handleAddBlogPost}>
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Blog Post
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blog Management"
        subtitle="Create and manage blog posts and articles"
        actions={headerActions}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <DataTable<BlogPostRow>
          columns={blogColumns}
          data={filteredBlogPosts}
          isLoading={isLoading}
          onSort={(key: string, direction: 'asc' | 'desc') => {
            console.log('Sorting by', key, direction);
          }}
          renderCell={(row: BlogPostRow, column: Column) => {
            if (column.key === 'title') {
              return (
                <div className="font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => handleEditBlogPost(row.id)}>
                  {row.title}
                </div>
              );
            }
            if (column.key === 'status') {
              return (
                <Badge className={
                  row.status === 'published' ? 'bg-green-100 text-green-800' : 
                  row.status === 'draft' ? 'bg-gray-100 text-gray-800' : 
                  'bg-blue-100 text-blue-800'
                }>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </Badge>
              );
            }
            if (column.key === 'actions') {
              return (
                <div className="flex space-x-2">
                  {row.status === 'published' && (
                    <Button variant="ghost" size="sm" onClick={() => handleViewBlogPost(row.id)}>
                      <EyeIcon className="h-4 w-4 text-gray-600" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => handleEditBlogPost(row.id)}>
                    <PencilIcon className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteBlogPost(row.id)}>
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
