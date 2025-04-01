'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface HistoryEntry {
  id: string;
  quantity: number;
  type: 'ADJUSTMENT' | 'SALE' | 'RESTOCK' | 'INITIAL';
  description: string;
  createdAt: string;
}

interface InventoryHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
}

const InventoryHistoryModal = ({ isOpen, onClose, itemId }: InventoryHistoryModalProps) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && itemId) {
      fetchHistory();
    }
  }, [isOpen, itemId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/inventory/${itemId}/history`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch history');
      }

      const data = await response.json();
      setHistory(data.history);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to fetch history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Inventory History</DialogTitle>
        </DialogHeader>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="mt-4">
            <div className="space-y-4">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 border rounded-lg"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">
                        {entry.type}
                      </span>
                      <p className="text-sm text-gray-600">
                        {entry.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${entry.quantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {entry.quantity >= 0 ? '+' : ''}{entry.quantity}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(entry.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {history.length === 0 && (
                <p className="text-center text-gray-500">
                  No history available
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InventoryHistoryModal;


