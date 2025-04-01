'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { permissions: string[] }) => void;
  user: User;
}

// Define all available permissions grouped by category
const availablePermissions = {
  'Store Management': [
    { id: 'VIEW_STORES', label: 'View Stores' },
    { id: 'MANAGE_STORES', label: 'Manage Stores' },
    { id: 'CREATE_STORE', label: 'Create Store' },
    { id: 'DELETE_STORE', label: 'Delete Store' },
  ],
  'Product Management': [
    { id: 'VIEW_PRODUCTS', label: 'View Products' },
    { id: 'MANAGE_PRODUCTS', label: 'Manage Products' },
    { id: 'CREATE_PRODUCT', label: 'Create Product' },
    { id: 'DELETE_PRODUCT', label: 'Delete Product' },
  ],
  'Inventory Management': [
    { id: 'VIEW_INVENTORY', label: 'View Inventory' },
    { id: 'MANAGE_INVENTORY', label: 'Manage Inventory' },
    { id: 'TRANSFER_INVENTORY', label: 'Transfer Inventory' },
  ],
  'Order Management': [
    { id: 'VIEW_ORDERS', label: 'View Orders' },
    { id: 'MANAGE_ORDERS', label: 'Manage Orders' },
    { id: 'PROCESS_ORDERS', label: 'Process Orders' },
    { id: 'CANCEL_ORDERS', label: 'Cancel Orders' },
  ],
  'Customer Management': [
    { id: 'VIEW_CUSTOMERS', label: 'View Customers' },
    { id: 'MANAGE_CUSTOMERS', label: 'Manage Customers' },
  ],
  'Staff Management': [
    { id: 'VIEW_STAFF', label: 'View Staff' },
    { id: 'MANAGE_STAFF', label: 'Manage Staff' },
    { id: 'CREATE_STAFF', label: 'Create Staff' },
    { id: 'DELETE_STAFF', label: 'Delete Staff' },
  ],
  'Warehouse Management': [
    { id: 'VIEW_WAREHOUSE', label: 'View Warehouse' },
    { id: 'MANAGE_WAREHOUSE', label: 'Manage Warehouse' },
    { id: 'MANAGE_RAW_MATERIALS', label: 'Manage Raw Materials' },
  ],
  'Production Management': [
    { id: 'VIEW_PRODUCTION', label: 'View Production' },
    { id: 'MANAGE_PRODUCTION', label: 'Manage Production' },
    { id: 'CREATE_PRODUCTION', label: 'Create Production' },
  ],
  'Reports & Analytics': [
    { id: 'VIEW_REPORTS', label: 'View Reports' },
    { id: 'EXPORT_REPORTS', label: 'Export Reports' },
    { id: 'VIEW_ANALYTICS', label: 'View Analytics' },
  ],
  'System Settings': [
    { id: 'VIEW_SETTINGS', label: 'View Settings' },
    { id: 'MANAGE_SETTINGS', label: 'Manage Settings' },
  ],
};

export default function PermissionsModal({
  isOpen,
  onClose,
  onSubmit,
  user
}: PermissionsModalProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Initialize with user's current permissions
    if (user.permissions.includes('ALL')) {
      setIsSuperAdmin(true);

      // Select all permissions
      const allPermissions = Object.values(availablePermissions)
        .flat()
        .map(permission => permission.id);

      setSelectedPermissions(allPermissions);
    } else {
      setIsSuperAdmin(false);
      setSelectedPermissions(user.permissions);
    }
  }, [user, isOpen]);

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions(prev => [...prev, permissionId]);
    } else {
      setSelectedPermissions(prev => prev.filter(id => id !== permissionId));
    }
  };

  const handleSelectAll = (category: string, checked: boolean) => {
    const categoryPermissions = availablePermissions[category as keyof typeof availablePermissions]
      .map(permission => permission.id);

    if (checked) {
      // Add all permissions from this category
      setSelectedPermissions(prev => {
        const newPermissions = [...prev];
        categoryPermissions.forEach(permId => {
          if (!newPermissions.includes(permId)) {
            newPermissions.push(permId);
          }
        });
        return newPermissions;
      });
    } else {
      // Remove all permissions from this category
      setSelectedPermissions(prev =>
        prev.filter(id => !categoryPermissions.includes(id))
      );
    }
  };

  const handleSuperAdminToggle = (checked: boolean) => {
    setIsSuperAdmin(checked);

    if (checked) {
      // Select all permissions
      const allPermissions = Object.values(availablePermissions)
        .flat()
        .map(permission => permission.id);

      setSelectedPermissions(allPermissions);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSuperAdmin) {
      onSubmit({ permissions: ['ALL'] });
    } else {
      onSubmit({ permissions: selectedPermissions });
    }
  };

  const isCategoryFullySelected = (category: string) => {
    const categoryPermissions = availablePermissions[category as keyof typeof availablePermissions]
      .map(permission => permission.id);

    return categoryPermissions.every(permId => selectedPermissions.includes(permId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Permissions for {user.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
              <Checkbox
                id="super-admin"
                checked={isSuperAdmin}
                onCheckedChange={handleSuperAdminToggle}
              />
              <Label htmlFor="super-admin" className="font-bold">
                Super Admin (All Permissions)
              </Label>
            </div>

            {isSuperAdmin && (
              <Alert
                title="Super Admin Access"
                description="Super Admin has access to all system functions and permissions."
                className="bg-blue-50 border-blue-200"
              />
            )}
          </div>

          {!isSuperAdmin && (
            <div className="space-y-6">
              {Object.entries(availablePermissions).map(([category, permissions]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                    <Checkbox
                      id={`category-${category}`}
                      checked={isCategoryFullySelected(category)}
                      onCheckedChange={(checked) => handleSelectAll(category, checked as boolean)}
                    />
                    <Label htmlFor={`category-${category}`} className="font-bold">
                      {category}
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 gap-2 ml-6">
                    {permissions.map(permission => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(permission.id, checked as boolean)
                          }
                        />
                        <Label htmlFor={permission.id}>
                          {permission.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Permissions
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
