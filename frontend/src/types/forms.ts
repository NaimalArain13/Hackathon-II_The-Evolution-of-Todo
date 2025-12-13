/**
 * Form data type definitions
 */

import { Task } from './entities';

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

