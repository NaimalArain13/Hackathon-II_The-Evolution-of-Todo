'use client';

/**
 * TaskSort Component
 * Feature: 007-dashboard-ui (User Story 7)
 *
 * Sort controls for ordering task list:
 * - Sort field dropdown (Priority, Created, Updated, Title, Status)
 * - Order toggle button (Asc/Desc)
 * - Active sort indicator
 * - Responsive layout
 */

import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { SortField, TaskSort } from '@/types/sort';

interface TaskSortProps {
  sort: TaskSort;
  onSortChange: (sort: TaskSort) => void;
  className?: string;
}

// Sort field options with labels
const sortFieldOptions: { value: SortField; label: string }[] = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'updated_at', label: 'Date Updated' },
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
  { value: 'status', label: 'Status' },
];

export function TaskSort({ sort, onSortChange, className }: TaskSortProps) {
  const handleFieldChange = (field: string) => {
    onSortChange({ ...sort, field: field as SortField });
  };

  const handleOrderToggle = () => {
    onSortChange({
      ...sort,
      order: sort.order === 'asc' ? 'desc' : 'asc',
    });
  };

  const OrderIcon = sort.order === 'asc' ? ArrowUp : ArrowDown;

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="toolbar"
      aria-label="Sort tasks"
    >
      <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>

      <Select value={sort.field} onValueChange={handleFieldChange}>
        <SelectTrigger className="w-[140px] sm:w-[160px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          {sortFieldOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        onClick={handleOrderToggle}
        aria-label={`Sort ${sort.order === 'asc' ? 'ascending' : 'descending'}. Click to toggle.`}
        className="shrink-0"
      >
        <OrderIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
