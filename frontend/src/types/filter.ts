// Filter-related TypeScript type definitions
// Feature: 007-dashboard-ui
// Reference: specs/007-dashboard-ui/data-model.md

import { TaskPriority, TaskCategory } from './task';

export type TaskStatus = 'all' | 'pending' | 'completed';

export interface TaskFilters {
  status: TaskStatus;
  priority: TaskPriority | 'all';
  category: TaskCategory | 'all';
  search: string;
}

export const defaultFilters: TaskFilters = {
  status: 'all',
  priority: 'all',
  category: 'all',
  search: ''
};
