'use client';
import React from 'react';
import { useInventoryAlerts } from '@/lib/hooks/useInventoryAlerts';

export function InventoryAlerts() {
  const { data: alerts, isLoading, error } = useInventoryAlerts();

  if (isLoading) {
    return <div>Loading alerts...</div>;
  }

  if (error) {
    return <div>Error loading alerts: {error.message}</div>;
  }

  return (
    <div>
      {alerts?.map((alert) => (
        <div key={alert.id}>
          <h3>{alert.type}</h3>
          <p>{alert.message}</p>
          <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  );
}



