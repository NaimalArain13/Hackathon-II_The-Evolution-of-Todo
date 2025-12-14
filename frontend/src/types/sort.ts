// Sort-related TypeScript type definitions
// Feature: 007-dashboard-ui
// Reference: specs/007-dashboard-ui/data-model.md

export type SortField = 'priority' | 'created_at' | 'updated_at' | 'title' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface TaskSort {
  field: SortField;
  order: SortOrder;
}

export const defaultSort: TaskSort = {
  field: 'created_at',
  order: 'desc'
};
