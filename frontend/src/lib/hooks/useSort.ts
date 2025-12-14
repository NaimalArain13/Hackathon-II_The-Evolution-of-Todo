/**
 * useSort Custom Hook
 * Feature: 007-dashboard-ui (User Story 7)
 *
 * Manages sort state for task list:
 * - Sort field (priority, created_at, updated_at, title, status)
 * - Sort order (asc/desc)
 * - Default sort configuration
 */

import { useState, useCallback } from 'react';
import type { SortField, SortOrder, TaskSort } from '@/types/sort';
import { defaultSort } from '@/types/sort';

interface UseSortReturn {
  sort: TaskSort;
  setSort: (sort: TaskSort) => void;
  setSortField: (field: SortField) => void;
  setSortOrder: (order: SortOrder) => void;
  toggleOrder: () => void;
  resetSort: () => void;
}

/**
 * Hook for managing task sort state
 *
 * @param initialSort - Optional initial sort configuration
 * @returns Sort state and handlers
 *
 * @example
 * ```tsx
 * const { sort, setSort, toggleOrder } = useSort();
 *
 * // Use with TaskSort component
 * <TaskSort sort={sort} onSortChange={setSort} />
 *
 * // Use with useTasks hook
 * const { data: tasks } = useTasks({ sort });
 * ```
 */
export function useSort(initialSort: TaskSort = defaultSort): UseSortReturn {
  const [sort, setSortState] = useState<TaskSort>(initialSort);

  const setSort = useCallback((newSort: TaskSort) => {
    setSortState(newSort);
  }, []);

  const setSortField = useCallback((field: SortField) => {
    setSortState((prev) => ({ ...prev, field }));
  }, []);

  const setSortOrder = useCallback((order: SortOrder) => {
    setSortState((prev) => ({ ...prev, order }));
  }, []);

  const toggleOrder = useCallback(() => {
    setSortState((prev) => ({
      ...prev,
      order: prev.order === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const resetSort = useCallback(() => {
    setSortState(defaultSort);
  }, []);

  return {
    sort,
    setSort,
    setSortField,
    setSortOrder,
    toggleOrder,
    resetSort,
  };
}
