'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface RoleAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { role: string }) => void;
  user: User;
}

export default function RoleAssignmentModal({
  isOpen,
  onClose,
  onSubmit,
  user
}: RoleAssignmentModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>(user.role);
  const [showWarning, setShowWarning] = useState<boolean>(false);

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);

    // Show warning if changing to or from SUPER_ADMIN
    if (
      (user.role === 'SUPER_ADMIN' && value !== 'SUPER_ADMIN') ||
      (user.role !== 'SUPER_ADMIN' && value === 'SUPER_ADMIN')
    ) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ role: selectedRole });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Change Role for {user.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Current Role: <span className="font-semibold">{user.role}</span></Label>
            <Select
              value={selectedRole}
              onValueChange={handleRoleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select new role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="MANAGER">Manager</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
                <SelectItem value="CASHIER">Cashier</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">
              {selectedRole === 'SUPER_ADMIN' && 'Has full access to all features and settings'}
              {selectedRole === 'ADMIN' && 'Has access to most features and settings'}
              {selectedRole === 'MANAGER' && 'Can manage store operations and staff'}
              {selectedRole === 'STAFF' && 'Can handle day-to-day operations'}
              {selectedRole === 'CASHIER' && 'Can process orders and payments'}
            </p>
          </div>

          {showWarning && (
            <div className="flex items-start space-x-2 p-4 border border-red-300 bg-red-50 rounded-md">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <h5 className="font-medium text-red-800">Warning</h5>
                <p className="text-sm text-red-700">
                  {user.role === 'SUPER_ADMIN'
                    ? 'Removing Super Admin privileges will restrict access to critical system functions.'
                    : 'Granting Super Admin privileges gives full access to all system functions.'}
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={showWarning ? 'destructive' : 'default'}
              disabled={selectedRole === user.role}
            >
              Update Role
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
