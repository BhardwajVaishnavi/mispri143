import { Store } from './store';

export interface StoreTransfer {
  id: string;
  sourceStore: Store;
  destinationStore: Store;
  quantity: number;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  createdAt: string | Date;
  product?: {
    name: string;
    id: string;
  };
}
