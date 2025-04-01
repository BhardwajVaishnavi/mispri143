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
  StarIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';

interface TestimonialRow {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  isActive: boolean;
  [key: string]: string | number | boolean; // Index signature for dynamic access
}

const testimonialColumns: readonly Column[] = [
  { key: 'name', label: 'Customer Name', sortable: true },
  { key: 'location', label: 'Location', sortable: true },
  { key: 'rating', label: 'Rating', sortable: true },
  { key: 'text', label: 'Testimonial' },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'isActive', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions' },
];

export default function TestimonialsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<TestimonialRow>>({
    name: '',
    location: '',
    rating: 5,
    text: '',
    date: new Date().toISOString().split('T')[0],
    isActive: true
  });

  // Fetch testimonials on component mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use mock data
      const mockTestimonials: TestimonialRow[] = [
        {
          id: '1',
          name: 'Priya Sharma',
          location: 'Mumbai',
          rating: 5,
          text: 'I ordered a bouquet of roses for my wife\'s birthday and she absolutely loved it! The flowers were fresh and beautifully arranged. The delivery was on time and the packaging was excellent. Will definitely order again!',
          date: '2023-06-15',
          isActive: true
        },
        {
          id: '2',
          name: 'Rahul Patel',
          location: 'Delhi',
          rating: 5,
          text: 'The cake I ordered for my parents\' anniversary was not only delicious but also looked exactly like the picture. Everyone at the party loved it. Thank you for making their day special!',
          date: '2023-07-03',
          isActive: true
        },
        {
          id: '3',
          name: 'Ananya Gupta',
          location: 'Bangalore',
          rating: 4,
          text: 'I\'ve ordered multiple times and have never been disappointed. The quality of products is consistently good. The only suggestion would be to add more variety to the gift options.',
          date: '2023-08-22',
          isActive: true
        },
        {
          id: '4',
          name: 'Vikram Singh',
          location: 'Chennai',
          rating: 5,
          text: 'The same-day delivery service saved me when I forgot my anniversary! The combo of flowers and chocolates was perfect, and my wife was so surprised. Thank you for the excellent service!',
          date: '2023-09-10',
          isActive: true
        },
        {
          id: '5',
          name: 'Neha Kapoor',
          location: 'Kolkata',
          rating: 3,
          text: 'The product quality was good, but the delivery was delayed by a few hours. It would be great if you could improve your delivery service.',
          date: '2023-10-05',
          isActive: false
        },
      ];

      setTestimonials(mockTestimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to load testimonials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTestimonial = () => {
    setIsEditMode(false);
    setCurrentTestimonial({
      name: '',
      location: '',
      rating: 5,
      text: '',
      date: new Date().toISOString().split('T')[0],
      isActive: true
    });
    setIsDialogOpen(true);
  };

  const handleEditTestimonial = (testimonial: TestimonialRow) => {
    setIsEditMode(true);
    setCurrentTestimonial(testimonial);
    setIsDialogOpen(true);
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      setIsLoading(true);
      try {
        // In a real app, you would call your API
        // For now, we'll just update the state
        setTestimonials(testimonials.filter(testimonial => testimonial.id !== id));
        toast.success('Testimonial deleted successfully');
      } catch (error) {
        console.error('Error deleting testimonial:', error);
        toast.error('Failed to delete testimonial');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveTestimonial = async () => {
    if (!currentTestimonial.name || !currentTestimonial.text) {
      toast.error('Name and testimonial text are required');
      return;
    }

    setIsLoading(true);
    try {
      // In a real app, you would call your API
      // For now, we'll just update the state
      if (isEditMode) {
        setTestimonials(testimonials.map(testimonial =>
          testimonial.id === currentTestimonial.id ? { ...testimonial, ...currentTestimonial } as TestimonialRow : testimonial
        ));
        toast.success('Testimonial updated successfully');
      } else {
        const newTestimonial: TestimonialRow = {
          id: Date.now().toString(),
          name: currentTestimonial.name as string,
          location: currentTestimonial.location as string || '',
          rating: currentTestimonial.rating as number,
          text: currentTestimonial.text as string,
          date: currentTestimonial.date as string,
          isActive: currentTestimonial.isActive as boolean
        };
        setTestimonials([...testimonials, newTestimonial]);
        toast.success('Testimonial created successfully');
      }
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentTestimonial(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (rating: number) => {
    setCurrentTestimonial(prev => ({ ...prev, rating }));
  };

  const handleSwitchChange = (checked: boolean) => {
    setCurrentTestimonial(prev => ({ ...prev, isActive: checked }));
  };

  const filteredTestimonials = testimonials.filter(testimonial =>
    testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    testimonial.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    testimonial.location.toLowerCase().includes(searchQuery.toLowerCase())
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
      <Button onClick={handleAddTestimonial}>
        <PlusIcon className="h-5 w-5 mr-2" />
        Add Testimonial
      </Button>
    </>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        subtitle="Manage customer testimonials and reviews"
        actions={headerActions}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search testimonials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <DataTable<TestimonialRow>
          columns={testimonialColumns}
          data={filteredTestimonials}
          isLoading={isLoading}
          onSort={(key: string, direction: 'asc' | 'desc') => {
            console.log('Sorting by', key, direction);
          }}
          renderCell={(row: TestimonialRow, column: Column) => {
            if (column.key === 'rating') {
              return (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < row.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              );
            }
            if (column.key === 'text') {
              return (
                <div className="max-w-xs truncate" title={row.text}>
                  {row.text}
                </div>
              );
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
                  <Button variant="ghost" size="sm" onClick={() => handleEditTestimonial(row)}>
                    <PencilIcon className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteTestimonial(row.id)}>
                    <TrashIcon className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              );
            }
            return row[column.key];
          }}
        />
      </div>

      {/* Testimonial Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => !open && setIsDialogOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Customer Name</Label>
              <Input
                id="name"
                name="name"
                value={currentTestimonial.name || ''}
                onChange={handleInputChange}
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={currentTestimonial.location || ''}
                onChange={handleInputChange}
                placeholder="e.g. Mumbai, India"
              />
            </div>
            <div>
              <Label htmlFor="rating">Rating</Label>
              <div className="flex items-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleRatingChange(i + 1)}
                    className="focus:outline-none"
                  >
                    <StarIcon
                      className={`h-6 w-6 ${
                        i < (currentTestimonial.rating || 5) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="text">Testimonial Text</Label>
              <Textarea
                id="text"
                name="text"
                value={currentTestimonial.text || ''}
                onChange={handleInputChange}
                placeholder="Customer's feedback and comments"
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={currentTestimonial.date || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={currentTestimonial.isActive || false}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTestimonial} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Testimonial'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
