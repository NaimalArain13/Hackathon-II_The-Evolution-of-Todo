import { api } from '@/services/api';
import type { User, Task } from '@/types';

/**
 * API Client - Typed helper methods for API calls
 * 
 * All methods return typed responses matching backend schemas
 */

// Auth endpoints
export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: { email: string; password: string; name: string }) => {
    const response = await api.post<{ user: User; token: string }>('/api/auth/register', data);
    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: { email: string; password: string }) => {
    const response = await api.post<{ user: User; token: string }>('/api/auth/login', data);
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async () => {
    const response = await api.post('/api/auth/logout');
    return response.data;
  },

  /**
   * Get current user profile
   */
  getCurrentUser: async () => {
    const response = await api.get<User>('/api/auth/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: { name?: string }) => {
    const response = await api.put<User>('/api/auth/profile', data);
    return response.data;
  },
};

// Task endpoints
export const tasksApi = {
  /**
   * Get all tasks for a user
   * @param user_id - User ID from auth store
   * @param params - Query parameters (priority, category, search, status, sort_by, order)
   */
  getTasks: async (
    user_id: string,
    params?: {
      priority?: 'high' | 'medium' | 'low' | 'none';
      category?: 'work' | 'personal' | 'shopping' | 'health' | 'other';
      search?: string;
      status?: 'all' | 'pending' | 'completed';
      sort_by?: 'priority' | 'created_at' | 'updated_at' | 'title' | 'status';
      order?: 'asc' | 'desc';
    }
  ) => {
    const response = await api.get<Task[]>(`/api/${user_id}/tasks`, { params });
    return response.data;
  },

  /**
   * Get a single task by ID
   */
  getTask: async (user_id: string, task_id: number) => {
    const response = await api.get<Task>(`/api/${user_id}/tasks/${task_id}`);
    return response.data;
  },

  /**
   * Create a new task
   */
  createTask: async (
    user_id: string,
    data: {
      title: string;
      description?: string;
      priority?: 'high' | 'medium' | 'low' | 'none';
      category?: 'work' | 'personal' | 'shopping' | 'health' | 'other';
    }
  ) => {
    const response = await api.post<Task>(`/api/${user_id}/tasks`, data);
    return response.data;
  },

  /**
   * Update a task
   */
  updateTask: async (
    user_id: string,
    task_id: number,
    data: {
      title?: string;
      description?: string;
      completed?: boolean;
      priority?: 'high' | 'medium' | 'low' | 'none';
      category?: 'work' | 'personal' | 'shopping' | 'health' | 'other';
    }
  ) => {
    const response = await api.put<Task>(`/api/${user_id}/tasks/${task_id}`, data);
    return response.data;
  },

  /**
   * Delete a task
   */
  deleteTask: async (user_id: string, task_id: number) => {
    const response = await api.delete(`/api/${user_id}/tasks/${task_id}`);
    return response.data;
  },

  /**
   * Toggle task completion status
   */
  toggleTaskCompletion: async (user_id: string, task_id: number) => {
    const response = await api.patch<Task>(`/api/${user_id}/tasks/${task_id}/complete`);
    return response.data;
  },
};

