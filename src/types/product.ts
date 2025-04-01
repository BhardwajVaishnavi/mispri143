export type ProductCategory = 
  | 'FLOWER' 
  | 'CAKE' 
  | 'GIFT_BASKET' 
  | 'CHOCOLATE' 
  | 'GREETING_CARD'
  | 'PLUSH_TOY'
  | 'PLANT'
  | 'DECORATION'
  | 'OTHER';

export type ProductSubcategory = 
  // Flower subcategories
  | 'ROSE' 
  | 'LILY' 
  | 'TULIP' 
  | 'ORCHID'
  | 'SUNFLOWER'
  | 'CARNATION'
  | 'MIXED_BOUQUET'
  | 'ARRANGEMENT'
  // Cake subcategories
  | 'CHOCOLATE_CAKE'
  | 'VANILLA_CAKE'
  | 'FRUIT_CAKE'
  | 'CHEESECAKE'
  | 'CUPCAKE'
  | 'BIRTHDAY_CAKE'
  | 'WEDDING_CAKE'
  | 'CUSTOM_CAKE'
  // Gift basket subcategories
  | 'FRUIT_BASKET'
  | 'CHOCOLATE_BASKET'
  | 'WINE_BASKET'
  | 'SPA_BASKET'
  | 'GOURMET_BASKET'
  | 'CUSTOM_BASKET'
  // Other subcategories
  | 'OTHER';

export type ProductSize = 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE' | 'CUSTOM';

export type ProductColor = 
  | 'RED' 
  | 'PINK' 
  | 'WHITE' 
  | 'YELLOW' 
  | 'BLUE' 
  | 'PURPLE'
  | 'ORANGE'
  | 'GREEN'
  | 'MIXED'
  | 'CUSTOM';

export type ProductFlavor = 
  | 'CHOCOLATE' 
  | 'VANILLA' 
  | 'STRAWBERRY' 
  | 'RED_VELVET'
  | 'BUTTERSCOTCH'
  | 'COFFEE'
  | 'LEMON'
  | 'FRUIT'
  | 'CUSTOM';

export type ProductOccasion = 
  | 'BIRTHDAY' 
  | 'ANNIVERSARY' 
  | 'WEDDING' 
  | 'GRADUATION'
  | 'SYMPATHY'
  | 'GET_WELL'
  | 'CONGRATULATIONS'
  | 'THANK_YOU'
  | 'VALENTINES_DAY'
  | 'MOTHERS_DAY'
  | 'FATHERS_DAY'
  | 'CHRISTMAS'
  | 'NEW_YEAR'
  | 'OTHER';

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  salePrice?: number;
  size?: ProductSize;
  color?: ProductColor;
  flavor?: ProductFlavor;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  images: string[];
  stockQuantity: number;
}

export interface ProductCustomizationOption {
  id: string;
  name: string;
  type: 'TEXT' | 'COLOR' | 'FLAVOR' | 'TOPPING' | 'ADDON' | 'MESSAGE' | 'CARD' | 'RIBBON';
  required: boolean;
  options?: {
    id: string;
    name: string;
    price: number;
    image?: string;
  }[];
  maxLength?: number;
  additionalPrice: number;
}

export interface ProductIngredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  allergen: boolean;
}

export interface ProductCareInstructions {
  wateringInstructions?: string;
  lightRequirements?: string;
  storageInstructions?: string;
  shelfLife?: number;
  specialInstructions?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  sku: string;
  barcode?: string;
  category: ProductCategory;
  subcategory?: ProductSubcategory;
  price: number;
  salePrice?: number;
  cost: number;
  taxRate: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVED';
  featured: boolean;
  bestseller: boolean;
  new: boolean;
  occasions: ProductOccasion[];
  tags: string[];
  images: string[];
  thumbnail: string;
  variants: ProductVariant[];
  customizationOptions: ProductCustomizationOption[];
  ingredients?: ProductIngredient[];
  nutritionalInfo?: {
    calories?: number;
    fat?: number;
    carbs?: number;
    protein?: number;
    sugar?: number;
    allergens?: string[];
  };
  careInstructions?: ProductCareInstructions;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number;
  leadTime: number; // in hours
  availableForDelivery: boolean;
  availableForPickup: boolean;
  freeDelivery: boolean;
  deliveryFee?: number;
  ratings: {
    average: number;
    count: number;
  };
  relatedProducts: string[]; // IDs of related products
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}
