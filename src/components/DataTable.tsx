'use client'

import { useState } from 'react';
import {
  ArrowUpIcon, ArrowDownIcon,
  ArrowsUpDownIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

export type Column = {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: readonly Column[];
  data: T[];
  isLoading: boolean;
  renderCell: (row: T, column: Column) => React.ReactNode;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}

export default function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  isLoading = false,
  onSort,
  renderCell
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  const handleRowSelect = (index: number) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRows(newSelected);
  };

  const exportData = (format: 'csv' | 'json') => {
    const exportData = data.filter((_, index) =>
      selectedRows.size === 0 || selectedRows.has(index)
    );

    if (format === 'csv') {
      const headers = columns.map(col => col.label).join(',');
      const rows = exportData.map(row =>
        columns.map(col => String(row[col.key])).join(',')
      ).join('\n');
      const csv = `${headers}\n${rows}`;
      downloadFile(csv, 'export.csv', 'text/csv');
    } else {
      const json = JSON.stringify(exportData, null, 2);
      downloadFile(json, 'export.json', 'application/json');
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
      {isLoading ? (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="p-4 bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedRows.size} selected
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => exportData('csv')}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2 inline" />
                Export CSV
              </button>
              <button
                onClick={() => exportData('json')}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-2 inline" />
                Export JSON
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="w-8 px-6 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 dark:border-gray-600"
                      checked={selectedRows.size === data.length}
                      onChange={() => {
                        if (selectedRows.size === data.length) {
                          setSelectedRows(new Set());
                        } else {
                          setSelectedRows(new Set(data.map((_, i) => i)));
                        }
                      }}
                    />
                  </th>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.label}</span>
                        {column.sortable && (
                          <button
                            onClick={() => handleSort(column.key)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            {sortConfig?.key === column.key ? (
                              sortConfig.direction === 'asc' ? (
                                <ArrowUpIcon className="h-4 w-4" />
                              ) : (
                                <ArrowDownIcon className="h-4 w-4" />
                              )
                            ) : (
                              <ArrowsUpDownIcon className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      selectedRows.has(rowIndex) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 dark:border-gray-600"
                        checked={selectedRows.has(rowIndex)}
                        onChange={() => handleRowSelect(rowIndex)}
                      />
                    </td>
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                      >
                        {renderCell ? renderCell(row, column) : String(row[column.key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}







