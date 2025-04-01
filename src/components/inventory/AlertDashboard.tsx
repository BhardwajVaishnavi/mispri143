'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';

interface InventoryAlert {
  id: string;
  type: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

interface GroupedAlerts {
  HIGH?: InventoryAlert[];
  MEDIUM?: InventoryAlert[];
  LOW?: InventoryAlert[];
}

export default function AlertDashboard() {
  const { data: alerts, isLoading } = useQuery<InventoryAlert[]>({
    queryKey: ['inventory-alerts'],
    queryFn: async () => {
      const response = await fetch('/api/inventory/alerts');
      return response.json();
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const groupedAlerts = alerts?.reduce((acc: GroupedAlerts, alert: InventoryAlert) => {
    acc[alert.severity] = [...(acc[alert.severity] || []), alert];
    return acc;
  }, {});

  return (
    <div className="grid gap-4">
      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">High Priority Alerts</h2>
        {groupedAlerts?.HIGH?.map((alert: InventoryAlert) => (
          <Alert
            key={alert.id}
            variant="destructive"
            title={alert.type}
            description={alert.message}
          />
        ))}
      </Card>

      <Card className="p-4">
        <h2 className="text-xl font-bold mb-4">Medium Priority Alerts</h2>
        {groupedAlerts?.MEDIUM?.map((alert: InventoryAlert) => (
          <Alert
            key={alert.id}
            variant="warning"
            title={alert.type}
            description={alert.message}
          />
        ))}
      </Card>
    </div>
  );
}
