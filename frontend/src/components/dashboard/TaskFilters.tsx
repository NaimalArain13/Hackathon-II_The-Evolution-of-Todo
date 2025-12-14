'use client';

/**
 * TaskFilters Component
 * Feature: 007-dashboard-ui (User Story 3)
 *
 * Filter controls for tasks:
 * - Status dropdown (all, pending, completed)
 * - Priority dropdown (all, high, medium, low, none)
 * - Category dropdown (all, work, personal, shopping, health, other)
 * - Active filter badges
 * - Clear all filters button
 * - Responsive layout
 */

import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskPriority, TaskCategory } from '@/types/task';
import type { TaskFilters as TaskFiltersType, TaskStatus } from '@/types/filter';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: Partial<TaskFiltersType>) => void;
  onClearFilters: () => void;
  className?: string;
}

// Status options
const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'completed', label: 'Completed' },
];

// Priority options
const priorityOptions: { value: TaskPriority | 'all'; label: string }[] = [
  { value: 'all', label: 'All Priorities' },
  { value: TaskPriority.HIGH, label: 'High' },
  { value: TaskPriority.MEDIUM, label: 'Medium' },
  { value: TaskPriority.LOW, label: 'Low' },
  { value: TaskPriority.NONE, label: 'None' },
];

// Category options
const categoryOptions: { value: TaskCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: TaskCategory.WORK, label: 'Work' },
  { value: TaskCategory.PERSONAL, label: 'Personal' },
  { value: TaskCategory.SHOPPING, label: 'Shopping' },
  { value: TaskCategory.HEALTH, label: 'Health' },
  { value: TaskCategory.OTHER, label: 'Other' },
];

export function TaskFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  className,
}: TaskFiltersProps) {
  // Check if any filters are active
  const hasActiveFilters =
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.category !== 'all' ||
    filters.search.trim() !== '';

  // Get active filter badges
  const activeFilters: { key: string; label: string }[] = [];

  if (filters.status !== 'all') {
    const option = statusOptions.find((o) => o.value === filters.status);
    if (option) activeFilters.push({ key: 'status', label: option.label });
  }
  if (filters.priority !== 'all') {
    const option = priorityOptions.find((o) => o.value === filters.priority);
    if (option) activeFilters.push({ key: 'priority', label: option.label });
  }
  if (filters.category !== 'all') {
    const option = categoryOptions.find((o) => o.value === filters.category);
    if (option) activeFilters.push({ key: 'category', label: option.label });
  }
  if (filters.search.trim()) {
    activeFilters.push({ key: 'search', label: `"${filters.search}"` });
  }

  const handleRemoveFilter = (key: string) => {
    switch (key) {
      case 'status':
        onFiltersChange({ status: 'all' });
        break;
      case 'priority':
        onFiltersChange({ priority: 'all' });
        break;
      case 'category':
        onFiltersChange({ category: 'all' });
        break;
      case 'search':
        onFiltersChange({ search: '' });
        break;
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      {/* Filter dropdowns */}
      <div className="flex flex-wrap gap-3">
        {/* Status filter */}
        <Select
          value={filters.status}
          onValueChange={(value: TaskStatus) => onFiltersChange({ status: value })}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority filter */}
        <Select
          value={filters.priority}
          onValueChange={(value: TaskPriority | 'all') =>
            onFiltersChange({ priority: value })
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            {priorityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Category filter */}
        <Select
          value={filters.category}
          onValueChange={(value: TaskCategory | 'all') =>
            onFiltersChange({ category: value })
          }
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active filter badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge
              key={filter.key}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {filter.label}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveFilter(filter.key)}
                aria-label={`Remove ${filter.key} filter`}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-6 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
