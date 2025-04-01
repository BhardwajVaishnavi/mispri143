import { useQuery } from '@tanstack/react-query';

interface Alert {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

async function fetchAlerts(): Promise<Alert[]> {
  const response = await fetch('/api/inventory/alerts');
  if (!response.ok) {
    throw new Error('Failed to fetch alerts');
  }
  return response.json();
}

export function useInventoryAlerts() {
  return useQuery({
    queryKey: ['inventory-alerts'],
    queryFn: fetchAlerts,
  });
}