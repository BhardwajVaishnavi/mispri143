'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PageHeader from '@/components/admin/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeftIcon, EyeIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';

// Import the editor component with SSR disabled
const Editor = dynamic(() => import('@/components/admin/common/RichTextEditor'), { ssr: false });

interface PageData {
  id: string;
  title: string;
  slug: string;
  type: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  isPublished: boolean;
  lastUpdated: string;
}

export default function PageEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const isNewPage = id === 'new';

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pageData, setPageData] = useState<PageData>({
    id: '',
    title: '',
    slug: '',
    type: 'Information',
    content: '',
    metaTitle: '',
    metaDescription: '',
    isPublished: true,
    lastUpdated: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (!isNewPage) {
      fetchPageData();
    }
  }, [id, isNewPage]);

  const fetchPageData = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use mock data
      const mockPages: Record<string, PageData> = {
        '1': {
          id: '1',
          title: 'About Us',
          slug: 'about-us',
          type: 'Information',
          content: '<h2>Our Story</h2><p>MISPRI was founded with a simple mission: to help people express their emotions and celebrate special moments through beautiful flowers, delicious cakes, and thoughtful gifts.</p><h2>Our Mission</h2><p>At MISPRI, our mission is to bring joy and happiness to every occasion. We believe that every celebration deserves the perfect gift, and we\'re here to help you find it.</p>',
          metaTitle: 'About Us | MISPRI',
          metaDescription: 'Learn about MISPRI, our story, mission, and values.',
          isPublished: true,
          lastUpdated: '2023-06-01'
        },
        '2': {
          id: '2',
          title: 'Contact Us',
          slug: 'contact-us',
          type: 'Information',
          content: '<h2>Get in Touch</h2><p>We\'d love to hear from you! Reach out to us with any questions, feedback, or inquiries.</p><h2>Contact Information</h2><p>Email: support@mispri.com</p><p>Phone: +91 1234 567 890</p><p>Address: 123 Main Street, City, State, 12345, India</p>',
          metaTitle: 'Contact Us | MISPRI',
          metaDescription: 'Contact MISPRI for any questions or feedback. We\'re here to help!',
          isPublished: true,
          lastUpdated: '2023-06-01'
        },
        // Add more mock pages as needed
      };

      if (mockPages[id as string]) {
        setPageData(mockPages[id as string]);
      } else {
        toast.error('Page not found');
        router.push('/admin/pages');
      }
    } catch (error) {
      console.error('Error fetching page data:', error);
      toast.error('Failed to load page data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPageData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setPageData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setPageData(prev => ({ ...prev, isPublished: checked }));
  };

  const handleContentChange = (content: string) => {
    setPageData(prev => ({ ...prev, content }));
  };

  const generateSlug = () => {
    if (!pageData.title) return;

    const slug = pageData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();

    setPageData(prev => ({ ...prev, slug }));
  };

  const handleSave = async () => {
    // Validate form
    if (!pageData.title || !pageData.slug || !pageData.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      // In a real app, you would call your API
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success(`Page ${isNewPage ? 'created' : 'updated'} successfully`);

      if (isNewPage) {
        router.push('/admin/pages');
      }
    } catch (error) {
      console.error('Error saving page:', error);
      toast.error('Failed to save page');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    // In a real app, you might want to save a draft first
    // For now, we'll just open a new tab with the page URL
    if (pageData.slug) {
      window.open(`/${pageData.slug}`, '_blank');
    } else {
      toast.error('Please generate a slug first');
    }
  };

  const headerActions = (
    <>
      <Button variant="outline" onClick={handlePreview}>
        <EyeIcon className="h-5 w-5 mr-2" />
        Preview
      </Button>
      <Button onClick={handleSave} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Save Page'}
      </Button>
    </>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Loading..."
          subtitle="Please wait"
          backHref="/admin/pages"
        />
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isNewPage ? 'Create New Page' : `Edit Page: ${pageData.title}`}
        subtitle={isNewPage ? 'Create a new page for your website' : 'Edit page content and settings'}
        backHref="/admin/pages"
        actions={headerActions}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Label htmlFor="title">Page Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={pageData.title}
                onChange={handleInputChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="content">Page Content <span className="text-red-500">*</span></Label>
              <div className="mt-1 border rounded-md">
                <Editor
                  value={pageData.content}
                  onChange={handleContentChange}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-4">Page Settings</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="slug">URL Slug <span className="text-red-500">*</span></Label>
                  <div className="flex mt-1">
                    <Input
                      id="slug"
                      name="slug"
                      value={pageData.slug}
                      onChange={handleInputChange}
                      className="rounded-r-none"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-l-none border-l-0"
                      onClick={generateSlug}
                    >
                      Generate
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    The URL will be: yourdomain.com/{pageData.slug || 'page-slug'}
                  </p>
                </div>

                <div>
                  <Label htmlFor="type">Page Type</Label>
                  <Select
                    value={pageData.type}
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select page type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Information">Information</SelectItem>
                      <SelectItem value="Policy">Policy</SelectItem>
                      <SelectItem value="Legal">Legal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isPublished"
                    checked={pageData.isPublished}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="isPublished">Published</Label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-4">SEO Settings</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    name="metaTitle"
                    value={pageData.metaTitle}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Defaults to page title if left empty
                  </p>
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={pageData.metaDescription}
                    onChange={handleInputChange}
                    className="mt-1"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended length: 150-160 characters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
