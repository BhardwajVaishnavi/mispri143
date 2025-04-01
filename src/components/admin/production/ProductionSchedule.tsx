import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Check, X } from "lucide-react";

const ProductionSchedule = () => {
  return (
    <div className="w-full">
      <div className="rounded-md border">
        <table className="w-full caption-bottom text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="h-12 px-4 text-left align-middle font-medium">Batch ID</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Product</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Quantity</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Start Time</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Expected Completion</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Status</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Progress</th>
              <th className="h-12 px-4 text-left align-middle font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b transition-colors hover:bg-slate-50">
              <td className="p-4">BATCH-001</td>
              <td className="p-4">Chocolate Cake</td>
              <td className="p-4">50</td>
              <td className="p-4">09:00 AM</td>
              <td className="p-4">11:00 AM</td>
              <td className="p-4">
                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                  In Progress
                </span>
              </td>
              <td className="p-4">
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </td>
              <td className="p-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Check className="mr-2 h-4 w-4" />
                      <span>Mark Complete</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <X className="mr-2 h-4 w-4" />
                      <span>Cancel Batch</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionSchedule;

