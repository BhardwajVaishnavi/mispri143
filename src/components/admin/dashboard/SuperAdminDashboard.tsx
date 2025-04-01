import React, { useEffect, useState } from 'react';
import type { Store } from '@/types/store';
import type { StoreTransfer } from '@/types/store-transfer';

interface LowStockAlert {
  id: string;
  product: {
    name: string;
  };
  store: {
    name: string;
  };
  quantity: number;
  reorderPoint: number;
}

interface StoreWithInventory extends Store {
  inventory: {
    id: string;
    productId: string;
  }[];
}

export default function SuperAdminDashboard() {
  const [stores, setStores] = useState<StoreWithInventory[]>([]);
  const [transfers, setTransfers] = useState<StoreTransfer[]>([]);
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [storesRes, transfersRes, alertsRes] = await Promise.all([
        fetch('/api/stores'),
        fetch('/api/transfers'),
        fetch('/api/inventory/low-stock')
      ]);

      const [storesData, transfersData, alertsData] = await Promise.all([
        storesRes.json(),
        transfersRes.json(),
        alertsRes.json()
      ]);

      setStores(storesData);
      setTransfers(transfersData);
      setLowStockAlerts(alertsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
      
      {/* Stores Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stores.map(store => (
          <div key={store.id} className="p-4 border rounded-lg">
            <h3 className="font-bold">{store.name}</h3>
            <p>Role: {store.storeRole}</p>
            <p>Status: {store.status}</p>
            <p>Products: {store.inventory?.length || 0}</p>
          </div>
        ))}
      </div>

      {/* Recent Transfers */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Transfers</h2>
        <table className="w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Products</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transfers.map(transfer => (
              <tr key={transfer.id}>
                <td>{new Date(transfer.createdAt).toLocaleDateString()}</td>
                <td>{transfer.sourceStore.name}</td>
                <td>{transfer.destinationStore.name}</td>
                <td>{transfer.quantity}</td>
                <td>{transfer.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Low Stock Alerts */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Low Stock Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lowStockAlerts.map(alert => (
            <div key={alert.id} className="p-4 border rounded-lg bg-red-50">
              <p className="font-bold">{alert.product.name}</p>
              <p>Store: {alert.store.name}</p>
              <p>Current Stock: {alert.quantity}</p>
              <p>Reorder Point: {alert.reorderPoint}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


