export interface Store {
  id: string;
  name: string;
  storeRole: 'MAIN' | 'BRANCH';
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  managerName: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TEMPORARILY_CLOSED' | 'RENOVATING';
  storeType: 'MULTI_SPECIALTY';
  operatingHours: {
    open: string;
    close: string;
    breakStart?: string;
    breakEnd?: string;
    specialHours?: {
      [key: string]: { open: string; close: string; }; // For holidays/special days
    };
  };
  specialties: ('CAKES' | 'PASTRIES' | 'BREAD' | 'COOKIES' | 'FLOWERS' | 'GIFTS')[];
  facilities: {
    hasParking: boolean;
    hasDineIn: boolean;
    hasWifi: boolean;
    isAirConditioned: boolean;
    hasCustomizationArea: boolean;
    hasTastingRoom: boolean;
    hasEventSpace: boolean;
  };
  deliveryOptions: {
    selfPickup: boolean;
    homeDelivery: boolean;
    expressDelivery: boolean;
    deliveryRadius: number; // in kilometers
    minimumOrderForDelivery: number;
  };
  paymentMethods: ('CASH' | 'CARD' | 'UPI' | 'ONLINE')[];
  certifications: string[]; // Food safety, quality certifications
  taxIdentificationNumber?: string;
  size: number; // in square feet
  capacity: number; // seating capacity if applicable
  orderCapacity: {
    maxDailyOrders: number;
    maxAdvanceBookingDays: number;
    specialOrderLeadTime: number; // in hours
  };
  features: string[]; // Additional features
  images: {
    storefront?: string;
    interior?: string[];
    logo?: string;
  };
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}





