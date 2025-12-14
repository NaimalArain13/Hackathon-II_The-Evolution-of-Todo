/**
 * useFilters Custom Hook
 * Feature: 007-dashboard-ui (User Story 3)
 *
 * Manages filter state for task list:
 * - Status filter (all, pending, completed)
 * - Priority filter
 * - Category filter
 * - Search query
 * - Clear filters function
 */

import { useState, useCallback, useMemo } from 'react';
import { TaskFilters, defaultFilters } from '@/types/filter';

interface UseFiltersReturn {
  filters: TaskFilters;
  setFilters: (filters: Partial<TaskFilters>) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
}

/**
 * Hook for managing task filter state
 *
 * @example
 * ```tsx
 * const { filters, setFilters, clearFilters, hasActiveFilters } = useFilters();
 *
 * // Update a single filter
 * setFilters({ status: 'pending' });
 *
 * // Update multiple filters
 * setFilters({ priority: 'high', category: 'work' });
 *
 * // Clear all filters
 * clearFilters();
 * ```
 */
export function useFilters(initialFilters: Partial<TaskFilters> = {}): UseFiltersReturn {
  const [filters, setFiltersState] = useState<TaskFilters>({
    ...defaultFilters,
    ...initialFilters,
  });

  // Update filters (partial update)
  const setFilters = useCallback((newFilters: Partial<TaskFilters>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Reset filters to default
  const clearFilters = useCallback(() => {
    setFiltersState(defaultFilters);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      filters.status !== 'all' ||
      filters.priority !== 'all' ||
      filters.category !== 'all' ||
      filters.search.trim() !== ''
    );
  }, [filters]);

  return {
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
  };
}
