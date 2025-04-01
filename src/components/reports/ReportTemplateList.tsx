'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ReportTemplate } from '@/lib/services/report-template.service';

export const ReportTemplateList = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const { data: templates, isLoading } = useQuery<ReportTemplate[]>({
    queryKey: ['report-templates'],
    queryFn: async () => {
      const response = await fetch('/api/reports/templates');
      return response.json();
    },
  });

  const handleGenerateReport = async (templateId: string) => {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId }),
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      
      // Handle success
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  if (isLoading) return <div>Loading templates...</div>;

  return (
    <div className="space-y-4">
      {templates?.map((template) => (
        <div
          key={template.id}
          className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
          onClick={() => setSelectedTemplate(template.id)}
        >
          <h3 className="font-semibold">{template.name}</h3>
          <p className="text-sm text-gray-600">{template.description}</p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => handleGenerateReport(template.id)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Generate Report
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};