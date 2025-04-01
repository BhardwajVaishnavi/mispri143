import { z } from "zod";

export const inventoryFormSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().int().min(0, "Quantity must be 0 or greater"),
  minimumStock: z.number().int().min(0, "Minimum stock must be 0 or greater"),
  maximumStock: z.number().int().min(0, "Maximum stock must be 0 or greater").nullable(),
  reorderPoint: z.number().int().min(0, "Reorder point must be 0 or greater"),
  reorderQuantity: z.number().int().min(0, "Reorder quantity must be 0 or greater"),
  unitCost: z.number().min(0, "Unit cost must be 0 or greater"),
  location: z.string().nullable(),
  binNumber: z.string().nullable(),
  batchNumber: z.string().nullable(),
  expiryDate: z.date().nullable(),
  lastStockCheck: z.date().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ON_HOLD', 'DISCONTINUED']).default('ACTIVE'),
  storeId: z.string().min(1, "Store is required"),
  notes: z.string().nullable(),
});

export type InventoryFormData = z.infer<typeof inventoryFormSchema>;

export const inventoryFilterSchema = z.object({
  search: z.string().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  sortBy: z.enum(['quantity', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});




