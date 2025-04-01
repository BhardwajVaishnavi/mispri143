'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AssignFormData {
  userId: string;
  role: string;
}

interface StoreUserAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AssignFormData) => void;
  storeName: string;
}

export default function StoreUserAssignModal({
  isOpen,
  onClose,
  onSubmit,
  storeName
}: StoreUserAssignModalProps) {
  const [formData, setFormData] = useState<AssignFormData>({
    userId: '',
    role: 'STAFF',
  });
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      setFormData({
        userId: '',
        role: 'STAFF',
      });
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      
      // For demo purposes, set mock data if API fails
      setUsers([
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'ADMIN' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'MANAGER' },
        { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'STAFF' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      userId: value
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign User to {storeName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userId">User</Label>
              <Select
                value={formData.userId}
                onValueChange={handleUserChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {users.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role in Store</Label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MANAGER">Store Manager</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="CASHIER">Cashier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={!formData.userId || !formData.role}
            >
              Assign User
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
