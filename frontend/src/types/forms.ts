/**
 * Form data type definitions
 */

import { Task } from './entities';
import { TaskPriority, TaskCategory } from './task';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  email: string;
  password: string;
  name: string;
}

export interface TaskFormData extends Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'> {}

export interface UpdateTaskFormData extends Partial<TaskFormData> {}

// Dashboard-specific form types (007-dashboard-ui)
export interface CreateTaskFormData {
  title: string;
  description: string;
  priority: TaskPriority;
  category: TaskCategory;
}

export interface EditTaskFormData extends CreateTaskFormData {
  completed: boolean;
}

export interface EditProfileFormData {
  name: string;
}

