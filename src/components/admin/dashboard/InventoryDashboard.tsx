import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StockTransfer } from '@/components/inventory/StockTransfer';
import { toast } from '@/components/ui/toast';

interface LowStockAlert {
  id: string;
  product: { name: string; };
  store: { name: string; };
  quantity: number;
  reorderPoint: number;
}

interface Transfer {
  id: string;
  sourceStore: { name: string; };
  destinationStore: { name: string; };
  product: { name: string; };
  quantity: number;
  status: 'PENDING' | 'IN_TRANSIT' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export default function InventoryDashboard() {
  const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
  const [pendingTransfers, setPendingTransfers] = useState<Transfer[]>([]);
  const [showTransferModal, setShowTransferModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [alertsRes, transfersRes] = await Promise.all([
        fetch('/api/inventory/alerts'),
        fetch('/api/inventory/transfers')
      ]);

      if (alertsRes.ok) {
        const alerts = await alertsRes.json();
        setLowStockAlerts(alerts);
      }

      if (transfersRes.ok) {
        const transfers = await transfersRes.json();
        setPendingTransfers(transfers.filter(t => t.status === 'PENDING'));
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch dashboard data',
        variant: 'destructive',
      });
    }
  };

  const handleTransferAction = async (transferId: string, action: 'approve' | 'cancel') => {
    try {
      const response = await fetch(`/api/inventory/transfers/${transferId}/${action}`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Action failed');

      toast({
        title: 'Success',
        description: `Transfer ${action}ed successfully`,
      });
      fetchDashboardData();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} transfer`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Dashboard</h1>
        <Button onClick={() => setShowTransferModal(true)}>
          New Transfer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Low Stock Alerts */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Low Stock Alerts</h2>
          <div className="space-y-4">
            {lowStockAlerts.map((alert) => (
              <div key={alert.id} className="border p-3 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{alert.product.name}</p>
                    <p className="text-sm text-gray-500">{alert.store.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-500">Quantity: {alert.quantity}</p>
                    <p className="text-sm">Reorder at: {alert.reorderPoint}</p>
                  </div>
                </div>
              </div>
            ))}
            {lowStockAlerts.length === 0 && (
              <p className="text-gray-500 text-center">No low stock alerts</p>
            )}
          </div>
        </Card>

        {/* Pending Transfers */}
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Pending Transfers</h2>
          <div className="space-y-4">
            {pendingTransfers.map((transfer) => (
              <div key={transfer.id} className="border p-3 rounded-lg">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <p className="font-medium">{transfer.product.name}</p>
                    <p>Qty: {transfer.quantity}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>From: {transfer.sourceStore.name}</p>
                    <p>To: {transfer.destinationStore.name}</p>
                  </div>
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTransferAction(transfer.id, 'approve')}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleTransferAction(transfer.id, 'cancel')}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {pendingTransfers.length === 0 && (
              <p className="text-gray-500 text-center">No pending transfers</p>
            )}
          </div>
        </Card>
      </div>

      {showTransferModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <StockTransfer onComplete={() => {
              setShowTransferModal(false);
              fetchDashboardData();
            }} />
          </div>
        </div>
      )}
    </div>
  );
}