/**
 * Task Service Layer
 * Feature: 007-dashboard-ui
 *
 * Provides typed functions for task CRUD operations
 * Uses the singleton API instance for all HTTP calls
 */

import { api } from './api';
import type { Task, TaskCreateInput, TaskUpdateInput } from '@/types/task';
import type { TaskFilters } from '@/types/filter';
import type { TaskSort } from '@/types/sort';

/**
 * Build query parameters from filters and sort options
 */
function buildQueryParams(filters?: TaskFilters, sort?: TaskSort): Record<string, string> {
  const params: Record<string, string> = {};

  if (filters) {
    if (filters.status && filters.status !== 'all') {
      params.status = filters.status;
    }
    if (filters.priority && filters.priority !== 'all') {
      params.priority = filters.priority;
    }
    if (filters.category && filters.category !== 'all') {
      params.category = filters.category;
    }
    if (filters.search && filters.search.trim()) {
      params.search = filters.search.trim();
    }
  }

  if (sort) {
    params.sort_by = sort.field;
    params.order = sort.order;
  }

  return params;
}

/**
 * Get all tasks for the authenticated user
 * @param userId - User ID from auth store
 * @param filters - Optional filters (status, priority, category, search)
 * @param sort - Optional sort configuration (field, order)
 */
export async function getTasks(
  userId: string,
  filters?: TaskFilters,
  sort?: TaskSort
): Promise<Task[]> {
  const params = buildQueryParams(filters, sort);
  const response = await api.get<Task[]>(`/api/${userId}/tasks`, { params });
  return response.data;
}

/**
 * Get a single task by ID
 * @param userId - User ID from auth store
 * @param taskId - Task ID to retrieve
 */
export async function getTask(userId: string, taskId: number): Promise<Task> {
  const response = await api.get<Task>(`/api/${userId}/tasks/${taskId}`);
  return response.data;
}

/**
 * Create a new task
 * @param userId - User ID from auth store
 * @param data - Task creation data
 */
export async function createTask(userId: string, data: TaskCreateInput): Promise<Task> {
  const response = await api.post<Task>(`/api/${userId}/tasks`, data);
  return response.data;
}

/**
 * Update an existing task
 * @param userId - User ID from auth store
 * @param taskId - Task ID to update
 * @param data - Partial task update data
 */
export async function updateTask(
  userId: string,
  taskId: number,
  data: TaskUpdateInput
): Promise<Task> {
  const response = await api.put<Task>(`/api/${userId}/tasks/${taskId}`, data);
  return response.data;
}

/**
 * Delete a task
 * @param userId - User ID from auth store
 * @param taskId - Task ID to delete
 */
export async function deleteTask(userId: string, taskId: number): Promise<void> {
  await api.delete(`/api/${userId}/tasks/${taskId}`);
}

/**
 * Toggle task completion status
 * Uses PATCH to toggle the completed field
 * @param userId - User ID from auth store
 * @param taskId - Task ID to toggle
 */
export async function toggleComplete(userId: string, taskId: number): Promise<Task> {
  const response = await api.patch<Task>(`/api/${userId}/tasks/${taskId}/complete`);
  return response.data;
}

// Export all functions as a service object for convenience
export const tasksService = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleComplete,
};
