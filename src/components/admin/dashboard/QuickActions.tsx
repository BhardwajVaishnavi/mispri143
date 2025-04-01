'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  PlusIcon, ArrowDownTrayIcon, UserPlusIcon,
  CubeIcon, TruckIcon, DocumentTextIcon,
  BuildingLibraryIcon, BeakerIcon
} from '@heroicons/react/24/outline';

interface QuickActionsProps {
  className?: string;
}

interface ActionItem {
  label: string;
  icon: React.ElementType;
  href: string;
  color: string;
}

const QuickActions = ({ className }: QuickActionsProps) => {
  const actions: ActionItem[] = [
    {
      label: 'Manage Warehouse',
      icon: BuildingLibraryIcon,
      href: '/admin/warehouse',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Production',
      icon: BeakerIcon,
      href: '/admin/production',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'New Order',
      icon: PlusIcon,
      href: '/admin/orders/new',
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Add Product',
      icon: CubeIcon,
      href: '/admin/products/new',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Transfer Inventory',
      icon: TruckIcon,
      href: '/admin/inventory/transfers',
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      label: 'View Reports',
      icon: DocumentTextIcon,
      href: '/admin/reports',
      color: 'bg-pink-100 text-pink-600',
    },
  ];

  return (
    <Card className={`p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action) => (
          <Link key={action.label} href={action.href}>
            <Button
              variant="outline"
              className={`w-full h-24 flex flex-col items-center justify-center space-y-2 ${action.color} border-0 hover:bg-opacity-80`}
            >
              <action.icon className="h-6 w-6" />
              <span>{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;
