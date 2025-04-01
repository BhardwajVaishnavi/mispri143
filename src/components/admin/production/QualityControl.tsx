import React from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Check, X } from "lucide-react";
import { useDialog } from "@/hooks/use-dialog"; // You'll need to create this hook
import { QualityCheckModal } from '@/components/admin/modals/QualityCheckModal';

const QualityControl = () => {
  const { isOpen, onOpen, onClose } = useDialog();

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="h-12 px-4 text-left align-middle font-medium">Batch ID</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Product</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Production Date</th>
              <th className="h-12 px-4 text-left align-middle font-medium">QC Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Inspector</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Parameters</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b transition-colors hover:bg-slate-50">
              <td className="p-4">BATCH-001</td>
              <td className="p-4">Chocolate Cake</td>
              <td className="p-4">2023-08-15</td>
              <td className="p-4">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800">
                  Pending
                </span>
              </td>
              <td className="p-4">John Doe</td>
              <td className="p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onOpen}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </td>
              <td className="p-4">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <QualityCheckModal isOpen={isOpen} onClose={onClose} />
    </div>
  );
};

export default QualityControl;

