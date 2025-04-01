'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/toast';
import { UploadIcon, DocumentIcon } from '@heroicons/react/24/outline';

const batchSchema = z.object({
  file: z.instanceof(File).optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number(),
      minimumStock: z.number(),
      maximumStock: z.number().optional(),
      location: z.string().optional(),
    })
  ).optional(),
});

export default function BatchOperations() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);

  const { register, handleSubmit, setValue } = useForm({
    resolver: zodResolver(batchSchema),
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        if (typeof text !== 'string') return;

        // Parse CSV/Excel data
        const items = parseFileData(text);
        setPreview(items);
        setValue('items', items);
      };
      reader.readAsText(file);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process file',
        variant: 'destructive',
      });
    }
  };

  const onSubmit = async (data: z.infer<typeof batchSchema>) => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/inventory/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.items),
      });

      if (!response.ok) throw new Error('Failed to process batch operation');

      toast({
        title: 'Success',
        description: 'Batch operation completed successfully',
      });
      setPreview([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process batch operation',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Batch Operations</h2>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => document.getElementById('template-download')?.click()}
          >
            <DocumentIcon className="h-5 w-5 mr-2" />
            Download Template
          </Button>
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <UploadIcon className="h-5 w-5 mr-2" />
            Upload File
          </Button>
        </div>
      </div>

      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept=".csv,.xlsx"
        onChange={handleFileUpload}
      />

      {preview.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          <table className="min-w-full divide-y divide-gray-200">
            {/* Add table headers and preview data */}
          </table>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setPreview([])}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Confirm Import'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function parseFileData(text: string): any[] {
  // Implement CSV/Excel parsing logic
  return [];
}