/**
 * useTasks Custom Hooks
 * Feature: 007-dashboard-ui (User Stories 1, 2, 4, 5, 6)
 *
 * Provides React Query integration for task operations:
 * - useQuery for fetching tasks with filters
 * - useMutation for create, update, delete, toggle complete
 * - Query key structure per data-model.md
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, deleteTask, toggleComplete } from '@/services/tasks';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import type { Task, TaskCreateInput, TaskUpdateInput } from '@/types/task';
import type { TaskFilters } from '@/types/filter';
import type { TaskSort } from '@/types/sort';

// Query keys for React Query cache management
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (userId: string, filters?: TaskFilters, sort?: TaskSort) =>
    [...taskKeys.lists(), userId, { filters, sort }] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (userId: string, taskId: number) =>
    [...taskKeys.details(), userId, taskId] as const,
};

interface UseTasksOptions {
  filters?: TaskFilters;
  sort?: TaskSort;
  enabled?: boolean;
}

/**
 * Hook for fetching tasks with optional filters and sorting
 *
 * @example
 * ```tsx
 * const { data: tasks, isLoading, error } = useTasks({
 *   filters: { status: 'pending', priority: 'high' },
 *   sort: { field: 'created_at', order: 'desc' }
 * });
 * ```
 */
export function useTasks(options: UseTasksOptions = {}) {
  const { filters, sort, enabled = true } = options;
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery<Task[], Error>({
    queryKey: taskKeys.list(userId ?? '', filters, sort),
    queryFn: async () => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return getTasks(userId, filters, sort);
    },
    enabled: enabled && !!userId,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook for creating a new task
 * Feature: User Story 2 (T027)
 *
 * @example
 * ```tsx
 * const { mutate: create, isPending } = useCreateTask();
 * create({ title: 'New Task', priority: TaskPriority.HIGH, category: TaskCategory.WORK });
 * ```
 */
export function useCreateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.id;

  return useMutation({
    mutationFn: async (data: TaskCreateInput) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return createTask(userId, data);
    },
    onSuccess: () => {
      // Invalidate and refetch all task lists (use predicate for proper matching)
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && queryKey[0] === 'tasks';
        },
      });
      toast.success('Task created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create task');
    },
  });
}

/**
 * Hook for updating an existing task
 * Feature: User Story 4 (T038)
 *
 * @example
 * ```tsx
 * const { mutate: update, isPending } = useUpdateTask();
 * update({ taskId: 1, data: { title: 'Updated Title' } });
 * ```
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.id;

  return useMutation({
    mutationFn: async ({ taskId, data }: { taskId: number; data: TaskUpdateInput }) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return updateTask(userId, taskId, data);
    },
    onSuccess: () => {
      // Invalidate and refetch all task queries
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && queryKey[0] === 'tasks';
        },
      });
      toast.success('Task updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update task');
    },
  });
}

/**
 * Hook for deleting a task
 * Feature: User Story 6 (T043)
 *
 * @example
 * ```tsx
 * const { mutate: remove, isPending } = useDeleteTask();
 * remove(taskId);
 * ```
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.id;

  return useMutation({
    mutationFn: async (taskId: number) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return deleteTask(userId, taskId);
    },
    onSuccess: () => {
      // Invalidate and refetch all task queries
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && queryKey[0] === 'tasks';
        },
      });
      toast.success('Task deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete task');
    },
  });
}

/**
 * Hook for toggling task completion status
 * Feature: User Story 5 (T041)
 *
 * Includes optimistic UI update - immediately updates UI before API call
 * and reverts on error.
 *
 * @example
 * ```tsx
 * const { mutate: toggle, isPending } = useToggleComplete();
 * toggle(taskId);
 * ```
 */
export function useToggleComplete() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const userId = user?.id;

  // Helper function to match task queries
  const isTaskQuery = (query: { queryKey: readonly unknown[] }) => {
    const queryKey = query.queryKey;
    return Array.isArray(queryKey) && queryKey[0] === 'tasks';
  };

  return useMutation({
    mutationFn: async (taskId: number) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      return toggleComplete(userId, taskId);
    },
    // Optimistic update
    onMutate: async (taskId: number) => {
      // Cancel any outgoing refetches for all task queries
      await queryClient.cancelQueries({ predicate: isTaskQuery });

      // Snapshot the previous value for all task queries
      const previousTasks = queryClient.getQueriesData({ predicate: isTaskQuery });

      // Optimistically update to the new value in all cached queries
      queryClient.setQueriesData({ predicate: isTaskQuery }, (old: Task[] | undefined) => {
        if (!old) return old;
        return old.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );
      });

      // Return context with the snapshotted value
      return { previousTasks };
    },
    onError: (error: Error, _taskId, context) => {
      // Revert to the previous value on error
      if (context?.previousTasks) {
        context.previousTasks.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(error.message || 'Failed to update task');
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ predicate: isTaskQuery });
    },
  });
}
