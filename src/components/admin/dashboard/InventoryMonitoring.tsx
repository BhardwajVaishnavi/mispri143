'use client';

import { useEffect, useState } from 'react';
import { WebSocketService } from '@/lib/services/websocket.service';

interface InventoryAlert {
  id: string;
  message: string;
  type: string;
  severity: string;
}

interface Transfer {
  id: string;
  status: string;
  quantity: number;
  destinationStore: {
    name: string;
  };
}

export function InventoryMonitoring() {
  const [lowStockAlerts, setLowStockAlerts] = useState<InventoryAlert[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    // Subscribe to real-time updates
    const handleInventoryAlert = (data: InventoryAlert) => {
      setLowStockAlerts(prev => [...prev, data]);
    };

    const handleTransferStatus = (data: Transfer) => {
      setTransfers(prev => 
        prev.map(t => t.id === data.id ? { ...t, ...data } : t)
      );
    };

    WebSocketService.subscribe('inventory_alert', handleInventoryAlert);
    WebSocketService.subscribe('transfer_status', handleTransferStatus);

    // Initial data fetch
    fetchInitialData();

    return () => {
      // Cleanup subscriptions
      WebSocketService.unsubscribe('inventory_alert', handleInventoryAlert);
      WebSocketService.unsubscribe('transfer_status', handleTransferStatus);
    };
  }, []);

  const fetchInitialData = async () => {
    // Fetch current alerts and transfers
    const [alertsRes, transfersRes] = await Promise.all([
      fetch('/api/inventory/alerts'),
      fetch('/api/inventory/transfers')
    ]);

    const [alerts, transfersData] = await Promise.all([
      alertsRes.json(),
      transfersRes.json()
    ]);

    setLowStockAlerts(alerts);
    setTransfers(transfersData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Low Stock Alerts</h2>
        {lowStockAlerts.map(alert => (
          <div key={alert.id} className="mb-2 p-2 bg-red-50 rounded">
            <p className="text-red-700">{alert.message}</p>
          </div>
        ))}
      </div>
      
      <div className="p-4 border rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Recent Transfers</h2>
        {transfers.map(transfer => (
          <div key={transfer.id} className="mb-2 p-2 bg-blue-50 rounded">
            <p>Status: {transfer.status}</p>
            <p>Quantity: {transfer.quantity}</p>
            <p>Destination: {transfer.destinationStore.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
