import { useState, useEffect } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { TimePicker } from '@/components/ui/time-picker';
import { ImageUpload } from '@/components/ui/image-upload';
import { Textarea } from '@/components/ui/textarea';
import type { Store } from '@/types/store';

interface StoreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Store>) => Promise<void>;
  store?: Store;
}

const availableSpecialties = [
  { value: 'CAKES', label: 'Cakes' },
  { value: 'PASTRIES', label: 'Pastries' },
  { value: 'BREAD', label: 'Bread' },
  { value: 'COOKIES', label: 'Cookies' },
  { value: 'FLOWERS', label: 'Flowers' },
  { value: 'GIFTS', label: 'Gifts' }
] as const;

const availableStoreTypes = [
  { value: 'BAKERY', label: 'Bakery' },
  { value: 'CAKE_SHOP', label: 'Cake Shop' },
  { value: 'FLOWER_SHOP', label: 'Flower Shop' },
  { value: 'MULTI_SPECIALTY', label: 'Multi-Specialty' }
] as const;

const storeRoles = [
  { value: 'MAIN', label: 'Main Store (Warehouse)' },
  { value: 'BRANCH', label: 'Branch Store (Franchise)' }
] as const;

const availableStatuses = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
  { value: 'TEMPORARILY_CLOSED', label: 'Temporarily Closed' },
  { value: 'RENOVATING', label: 'Renovating' }
] as const;

const paymentMethods = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CARD', label: 'Card' },
  { value: 'UPI', label: 'UPI' },
  { value: 'ONLINE', label: 'Online Banking' }
] as const;

export default function StoreFormModal({
  isOpen,
  onClose,
  onSubmit,
  store
}: StoreFormModalProps) {
  const [formData, setFormData] = useState<Partial<Store>>({
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    phone: '',
    email: '',
    managerName: '',
    status: 'ACTIVE',
    storeRole: 'BRANCH',
    storeType: 'MULTI_SPECIALTY',
    specialties: [],
    operatingHours: {
      open: '09:00',
      close: '18:00'
    },
    facilities: {
      hasParking: false,
      hasDineIn: false,
      hasWifi: false,
      isAirConditioned: false,
      hasCustomizationArea: false,
      hasTastingRoom: false,
      hasEventSpace: false
    },
    deliveryOptions: {
      selfPickup: true,
      homeDelivery: false,
      expressDelivery: false,
      deliveryRadius: 5,
      minimumOrderForDelivery: 500
    },
    paymentMethods: ['CASH'],
    orderCapacity: {
      maxDailyOrders: 50,
      maxAdvanceBookingDays: 30,
      specialOrderLeadTime: 48
    },
    size: 0,
    capacity: 0,
    features: [],
    certifications: [],
    images: {},
    socialMedia: {
      instagram: '',
      facebook: '',
      twitter: ''
    }
  });

  useEffect(() => {
    if (store) {
      setFormData(store);
    }
  }, [store]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleMaxDailyOrdersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      orderCapacity: {
        maxDailyOrders: parseInt(e.target.value) || 0,
        maxAdvanceBookingDays: formData.orderCapacity?.maxAdvanceBookingDays || 0,
        specialOrderLeadTime: formData.orderCapacity?.specialOrderLeadTime || 0
      }
    });
  };

  const handleMaxAdvanceBookingDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      orderCapacity: {
        maxDailyOrders: formData.orderCapacity?.maxDailyOrders || 0,
        maxAdvanceBookingDays: parseInt(e.target.value) || 0,
        specialOrderLeadTime: formData.orderCapacity?.specialOrderLeadTime || 0
      }
    });
  };

  const handleSpecialOrderLeadTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      orderCapacity: {
        maxDailyOrders: formData.orderCapacity?.maxDailyOrders || 0,
        maxAdvanceBookingDays: formData.orderCapacity?.maxAdvanceBookingDays || 0,
        specialOrderLeadTime: parseInt(e.target.value) || 0
      }
    });
  };

  const handleStorefrontImageChange = (url: string) => {
    setFormData({
      ...formData,
      images: {
        ...formData.images,
        storefront: url
      }
    });
  };

  const handleLogoImageChange = (url: string) => {
    setFormData({
      ...formData,
      images: {
        ...formData.images,
        logo: url
      }
    });
  };

  const handleFacilityChange = (key: keyof Store['facilities'], checked: boolean) => {
    setFormData({
      ...formData,
      facilities: {
        hasParking: false,
        hasDineIn: false,
        hasWifi: false,
        isAirConditioned: false,
        hasCustomizationArea: false,
        hasTastingRoom: false,
        hasEventSpace: false,
        ...formData.facilities,
        [key]: checked
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6">
          {store ? 'Edit Store' : 'Create New Store'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Store Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Manager Name"
                value={formData.managerName}
                onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Store Role</label>
                <Select
                  value={formData.storeRole}
                  onValueChange={(value) => setFormData({ ...formData, storeRole: value as Store['storeRole'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select store role" />
                  </SelectTrigger>
                  <SelectContent>
                    {storeRoles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Store['status'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Store Type</label>
                <Select
                  value={formData.storeType}
                  onValueChange={(value) => setFormData({ ...formData, storeType: value as Store['storeType'] })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select store type" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableStoreTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Tax ID Number</label>
                <Input
                  value={formData.taxIdentificationNumber || ''}
                  onChange={(e) => setFormData({ ...formData, taxIdentificationNumber: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
              <Input
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Address</h3>
            <Input
              label="Street Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
              <Input
                label="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
              <Input
                label="Postal Code"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                required
              />
            </div>
            <Input
              label="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              required
            />
          </div>

          {/* Operating Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Operating Hours</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Opening Time</label>
                <TimePicker
                  value={formData.operatingHours?.open || '09:00'}
                  onChange={(time) => setFormData({
                    ...formData,
                    operatingHours: {
                      ...formData.operatingHours,
                      open: time,
                      close: formData.operatingHours?.close || '18:00'
                    }
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Closing Time</label>
                <TimePicker
                  value={formData.operatingHours?.close || '18:00'}
                  onChange={(time) => setFormData({
                    ...formData,
                    operatingHours: {
                      ...formData.operatingHours,
                      open: formData.operatingHours?.open || '09:00',
                      close: time
                    }
                  })}
                />
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Specialties</h3>
            <div className="grid grid-cols-3 gap-4">
              {availableSpecialties.map((specialty) => (
                <div key={specialty.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={specialty.value}
                    checked={formData.specialties?.includes(specialty.value)}
                    onCheckedChange={(checked) => {
                      const specialties = checked
                        ? [...(formData.specialties || []), specialty.value]
                        : formData.specialties?.filter((s) => s !== specialty.value);
                      setFormData({ ...formData, specialties });
                    }}
                  />
                  <label
                    htmlFor={specialty.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {specialty.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Facilities</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.facilities || {}).map(([key, value]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) =>
                      handleFacilityChange(
                        key as keyof Store['facilities'],
                        checked as boolean
                      )
                    }
                  />
                  <label
                    htmlFor={key}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Order Capacity */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Order Capacity</h3>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Max Daily Orders"
                type="number"
                value={formData.orderCapacity?.maxDailyOrders}
                onChange={handleMaxDailyOrdersChange}
              />
              <Input
                label="Max Advance Booking Days"
                type="number"
                value={formData.orderCapacity?.maxAdvanceBookingDays}
                onChange={handleMaxAdvanceBookingDaysChange}
              />
              <Input
                label="Special Order Lead Time (hours)"
                type="number"
                value={formData.orderCapacity?.specialOrderLeadTime}
                onChange={handleSpecialOrderLeadTimeChange}
              />
            </div>
          </div>

          {/* Store Size and Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Store Size (sq ft)"
              type="number"
              value={formData.size}
              onChange={(e) => setFormData({
                ...formData,
                size: parseInt(e.target.value)
              })}
            />
            <Input
              label="Seating Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({
                ...formData,
                capacity: parseInt(e.target.value)
              })}
            />
          </div>

          {/* Social Media Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Social Media</h3>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Instagram"
                value={formData.socialMedia?.instagram}
                onChange={(e) => setFormData({
                  ...formData,
                  socialMedia: {
                    ...formData.socialMedia,
                    instagram: e.target.value
                  }
                })}
              />
              <Input
                label="Facebook"
                value={formData.socialMedia?.facebook}
                onChange={(e) => setFormData({
                  ...formData,
                  socialMedia: {
                    ...formData.socialMedia,
                    facebook: e.target.value
                  }
                })}
              />
              <Input
                label="Twitter"
                value={formData.socialMedia?.twitter}
                onChange={(e) => setFormData({
                  ...formData,
                  socialMedia: {
                    ...formData.socialMedia,
                    twitter: e.target.value
                  }
                })}
              />
            </div>
          </div>

          {/* Store Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Store Images</h3>
            <div className="grid grid-cols-2 gap-4">
              <ImageUpload
                label="Store Front Image"
                value={formData.images?.storefront}
                onChange={handleStorefrontImageChange}
              />
              <ImageUpload
                label="Store Logo"
                value={formData.images?.logo}
                onChange={handleLogoImageChange}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
            >
              {store ? 'Update Store' : 'Create Store'}
            </Button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

// Example branch store data
const branchStoreData = {
  name: "Downtown Branch",
  address: "456 Market Street",
  city: "Metro City",
  state: "State",
  country: "Country",
  postalCode: "12346",
  phone: "+1234567891",
  email: "downtown@bakeryhub.com",
  managerName: "Jane Doe",
  status: "ACTIVE",
  storeType: "MULTI_SPECIALTY",
  specialties: ["CAKES", "PASTRIES"],
  operatingHours: {
    open: "09:00",
    close: "18:00"
  },
  facilities: {
    hasParking: true,
    hasDineIn: true,
    hasWifi: true,
    isAirConditioned: true
  }
};


