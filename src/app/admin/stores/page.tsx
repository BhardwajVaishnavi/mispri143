'use client';

import { useState } from 'react';
import PageHeader from '@/components/admin/common/PageHeader';
import StoreManagement from '@/components/admin/stores/StoreManagement';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function StoresPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const headerActions = (
    <button 
      className="btn-primary flex items-center"
      onClick={() => setIsCreateModalOpen(true)}
    >
      <PlusIcon className="h-5 w-5 mr-2" />
      Create Store
    </button>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Store Management"
        subtitle="Create and manage your stores"
        actions={headerActions}
      />
      <StoreManagement 
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
      />
    </div>
  );
}