import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';

interface ProductionBatch {
  id: string;
  productId: string;
  quantity: number;
  startDate: Date;
  status: string;
  wastage: number;
  completedQuantity: number;
}

export const ProductionTracker = () => {
  const [batches, setBatches] = useState<ProductionBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await fetch('/api/manufacturing/batches');
      const data = await response.json();
      setBatches(data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressPercentage = (batch: ProductionBatch) => {
    return (batch.completedQuantity / batch.quantity) * 100;
  };

  const getStatusVariant = (status: string): "default" | "destructive" | "outline" | "secondary" => {
    switch (status) {
      case 'IN_PROGRESS': return 'default';
      case 'COMPLETED': return 'secondary';
      case 'PAUSED': return 'outline';
      default: return 'destructive';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Production Batches</h2>
        <Button>New Batch</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Batch ID</th>
              <th className="text-left p-2">Product</th>
              <th className="text-left p-2">Progress</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Started</th>
              <th className="text-left p-2">Wastage</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map(batch => (
              <tr key={batch.id} className="border-b">
                <td className="p-2">{batch.id}</td>
                <td className="p-2">{batch.productId}</td>
                <td className="p-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${getProgressPercentage(batch)}%` }}
                    />
                  </div>
                </td>
                <td className="p-2">
                  <Badge variant={getStatusVariant(batch.status)}>
                    {batch.status}
                  </Badge>
                </td>
                <td className="p-2">{new Date(batch.startDate).toLocaleDateString()}</td>
                <td className="p-2">{batch.wastage}%</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Update</Button>
                    <Button variant="destructive" size="sm">Stop</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
