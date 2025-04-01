import { Dialog } from '@/components/ui/dialog';
import { Store } from '@/types/store';
import { format } from 'date-fns';

interface StoreDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: Store;
}

export default function StoreDetailsModal({
  isOpen,
  onClose,
  store
}: StoreDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-4">Store Details</h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Basic Information</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Name:</span> {store.name}</p>
                <p><span className="font-medium">Manager:</span> {store.managerName}</p>
                <p><span className="font-medium">Type:</span> {store.storeType}</p>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    store.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {store.status}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
              <div className="mt-2 space-y-2">
                <p><span className="font-medium">Phone:</span> {store.phone}</p>
                <p><span className="font-medium">Email:</span> {store.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <div className="mt-2">
              <p>{store.address}</p>
              <p>{store.city}, {store.state} {store.postalCode}</p>
              <p>{store.country}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Operating Hours</h3>
              <div className="mt-2">
                <p>Opens: {store.operatingHours?.open}</p>
                <p>Closes: {store.operatingHours?.close}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Store Metrics</h3>
              <div className="mt-2">
                <p><span className="font-medium">Size:</span> {store.size} sq ft</p>
                <p><span className="font-medium">Capacity:</span> {store.capacity} people</p>
                <p><span className="font-medium">Tax ID:</span> {store.taxIdentificationNumber}</p>
              </div>
            </div>
          </div>

          {store.features && store.features.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Features</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {store.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <p>Created: {format(new Date(store.createdAt), 'PPP')}</p>
            <p>Last Updated: {format(new Date(store.updatedAt), 'PPP')}</p>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
