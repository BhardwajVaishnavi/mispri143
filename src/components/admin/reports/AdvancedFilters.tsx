'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface Filter {
  id: string;
  field: string;
  operator: string;
  value: string;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: Filter[]) => void;
  availableFields: Array<{
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean';
  }>;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onFiltersChange,
  availableFields,
}) => {
  const [filters, setFilters] = useState<Filter[]>([]);

  const addFilter = () => {
    const newFilter: Filter = {
      id: Math.random().toString(36).substr(2, 9),
      field: availableFields[0].name,
      operator: '=',
      value: '',
    };
    setFilters([...filters, newFilter]);
  };

  const removeFilter = (id: string) => {
    setFilters(filters.filter(f => f.id !== id));
    onFiltersChange(filters.filter(f => f.id !== id));
  };

  const updateFilter = (id: string, updates: Partial<Filter>) => {
    const updatedFilters = filters.map(f =>
      f.id === id ? { ...f, ...updates } : f
    );
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const getOperatorsForType = (type: string) => {
    switch (type) {
      case 'string':
        return ['equals', 'contains', 'starts with', 'ends with'];
      case 'number':
        return ['=', '>', '<', '>=', '<=', '!='];
      case 'date':
        return ['=', 'before', 'after', 'between'];
      case 'boolean':
        return ['is', 'is not'];
      default:
        return ['='];
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Advanced Filters</h2>
        <Button onClick={addFilter}>
          <Plus className="w-4 h-4 mr-2" />
          Add Filter
        </Button>
      </div>

      <div className="space-y-4">
        {filters.map(filter => {
          const fieldType = availableFields.find(f => f.name === filter.field)?.type;
          const operators = getOperatorsForType(fieldType || 'string');

          return (
            <div key={filter.id} className="flex gap-2 items-center">
              <Select
                value={filter.field}
                onValueChange={(value) => updateFilter(filter.id, { field: value })}
              >
                {availableFields.map(field => (
                  <Select.Option key={field.name} value={field.name}>
                    {field.name}
                  </Select.Option>
                ))}
              </Select>

              <Select
                value={filter.operator}
                onValueChange={(value) => updateFilter(filter.id, { operator: value })}
              >
                {operators.map(op => (
                  <Select.Option key={op} value={op}>
                    {op}
                  </Select.Option>
                ))}
              </Select>

              <Input
                value={filter.value}
                onChange={(e) => updateFilter(filter.id, { value: e.target.value })}
                placeholder="Value"
              />

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFilter(filter.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
};