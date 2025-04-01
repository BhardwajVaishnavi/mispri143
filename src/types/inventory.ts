export type InventoryStatus = 'ACTIVE' | 'INACTIVE' | 'ON_HOLD' | 'DISCONTINUED';

export interface InventoryFormData {
  productId: string;
  quantity: number;
  minimumStock: number;
  maximumStock: number | null;
  reorderPoint: number;
  reorderQuantity: number;
  unitCost: number;
  location: string | null;
  binNumber: string | null;
  batchNumber: string | null;
  expiryDate: Date | null;
  lastStockCheck: Date | null;
  status: InventoryStatus;
  storeId: string;
  notes: string | null;
}

export interface BaseInventoryItem extends InventoryFormData {
  id: string;
}

export interface InventoryItem extends BaseInventoryItem {
  product: {
    name: string;
    sku: string;
  };
  updatedAt: string;
}
