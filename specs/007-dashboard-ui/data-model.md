# Data Model: Dashboard UI and API Integration

**Feature**: 007-dashboard-ui | **Date**: 2025-12-14 | **Phase**: 1 (Design)

## Purpose

This document defines the TypeScript types and interfaces for the dashboard UI. These models represent client-side state, API contracts, and UI entities.

## Type Definitions

### 1. Task Entity

```typescript
// types/task.ts

export enum TaskPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  NONE = 'none'
}

export enum TaskCategory {
  WORK = 'work',
  PERSONAL = 'personal',
  SHOPPING = 'shopping',
  HEALTH = 'health',
  OTHER = 'other'
}

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: TaskPriority;
  category: TaskCategory;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

export interface TaskCreateInput {
  title: string;
  description?: string;
  priority: TaskPriority;
  category: TaskCategory;
}

export interface TaskUpdateInput {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: TaskPriority;
  category?: TaskCategory;
}
```

**Validation Rules**:
- `title`: Required, 1-200 characters
- `description`: Optional, max 1000 characters
- `priority`: Must be one of TaskPriority enum values
- `category`: Must be one of TaskCategory enum values
- `completed`: Boolean, defaults to false on creation

**Relationships**:
- Each Task belongs to one User (via `user_id`)
- User can have many Tasks

### 2. User Entity

```typescript
// types/user.ts

export interface User {
  id: string; // UUID
  email: string;
  name: string;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
  is_active: boolean;
}

export interface UserProfileUpdateInput {
  name: string;
}
```

**Validation Rules**:
- `email`: Required, valid email format (read-only in UI)
- `name`: Required, min 1 character
- `is_active`: Boolean (read-only in UI)

### 3. Filter State

```typescript
// types/filter.ts

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
```

**State Management**:
- Filters are stored in React state
- URL query params sync with filter state (optional)
- Filters apply with AND logic (all must match)

### 4. Sort State

```typescript
// types/sort.ts

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
```

**Sort Priority Order** (for priority field):
- Descending: high → medium → low → none
- Ascending: none → low → medium → high

### 5. UI State

```typescript
// types/ui.ts

export type ModalType = 'create' | 'edit' | 'delete' | null;

export interface DashboardUIState {
  sidebarCollapsed: boolean;
  activeSection: 'dashboard' | 'tasks' | 'profile';
  activeModal: ModalType;
  selectedTaskId: number | null; // For edit/delete modals
  isLoading: boolean;
}

export interface NotificationState {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number; // milliseconds
}
```

**State Transitions**:
- `activeModal`: null → 'create' → null
- `activeModal`: null → 'edit' → null (requires selectedTaskId)
- `activeModal`: null → 'delete' → null (requires selectedTaskId)
- `sidebarCollapsed`: toggle on user action

### 6. API Response Types

```typescript
// types/api.ts

export interface APIResponse<T> {
  data: T;
  message?: string;
}

export interface APIError {
  detail: string | { loc: string[]; msg: string; type: string }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
  has_prev: boolean;
}

// Auth responses (existing)
export interface AuthResponse {
  access_token: string;
  token_type: 'bearer';
  user: User;
}
```

### 7. Form State Types

```typescript
// types/forms.ts

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
```

## Zod Validation Schemas

### Task Validation

```typescript
// lib/validations/task.ts

import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less')
    .optional()
    .default(''),
  priority: z.enum(['high', 'medium', 'low', 'none'], {
    errorMap: () => ({ message: 'Please select a valid priority' })
  }),
  category: z.enum(['work', 'personal', 'shopping', 'health', 'other'], {
    errorMap: () => ({ message: 'Please select a valid category' })
  })
});

export const editTaskSchema = createTaskSchema.extend({
  completed: z.boolean()
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type EditTaskFormData = z.infer<typeof editTaskSchema>;
```

### Profile Validation

```typescript
// lib/validations/profile.ts

import { z } from 'zod';

export const editProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
    .trim()
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;
```

## React Query Keys

```typescript
// lib/query-keys.ts

export const queryKeys = {
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (filters: TaskFilters, sort: TaskSort) =>
      [...queryKeys.tasks.lists(), { filters, sort }] as const,
    detail: (id: number) => [...queryKeys.tasks.all, 'detail', id] as const
  },
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const
  }
} as const;
```

**Usage**:
```typescript
// Query
const { data: tasks } = useQuery({
  queryKey: queryKeys.tasks.list(filters, sort),
  queryFn: () => fetchTasks(filters, sort)
});

// Invalidate
queryClient.invalidateQueries({
  queryKey: queryKeys.tasks.lists()
});
```

## Component Props Types

### Core Components

```typescript
// components/dashboard/TaskCard.tsx
export interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onToggleComplete: (taskId: number) => void;
}

// components/dashboard/TaskList.tsx
export interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onToggleComplete: (taskId: number) => void;
}

// components/dashboard/TaskFilters.tsx
export interface TaskFiltersProps {
  filters: TaskFilters;
  onFilterChange: (filters: Partial<TaskFilters>) => void;
  onClearFilters: () => void;
}

// components/dashboard/TaskSort.tsx
export interface TaskSortProps {
  sort: TaskSort;
  onSortChange: (sort: TaskSort) => void;
}

// components/dashboard/Sidebar.tsx
export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activeSection: 'dashboard' | 'tasks' | 'profile';
  user: User;
}

// components/modals/CreateTaskModal.tsx
export interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (task: Task) => void;
}

// components/modals/EditTaskModal.tsx
export interface EditTaskModalProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onSuccess: (task: Task) => void;
}

// components/modals/DeleteConfirmDialog.tsx
export interface DeleteConfirmDialogProps {
  open: boolean;
  taskId: number | null;
  taskTitle: string | null;
  onClose: () => void;
  onConfirm: () => void;
}
```

## State Diagrams

### Task CRUD Flow

```
[View Tasks] → [Click Edit] → [Edit Modal] → [Save] → [Update Task] → [Refresh List]
                                ↓
                            [Cancel] → [Close Modal]

[View Tasks] → [Click Delete] → [Confirm Dialog] → [Confirm] → [Delete Task] → [Refresh List]
                                      ↓
                                  [Cancel] → [Close Dialog]

[View Tasks] → [Click Create] → [Create Modal] → [Submit] → [Create Task] → [Add to List]
                                     ↓
                                 [Cancel] → [Close Modal]

[View Task] → [Click Checkbox] → [Toggle Complete] → [Optimistic Update] → [Sync with Server]
```

### Filter Flow

```
[All Tasks] → [Select Status: Pending] → [Filter Tasks] → [Show Pending Tasks]
                                               ↓
                                    [Select Priority: High] → [Filter Tasks] → [Show Pending + High]
                                                                   ↓
                                                        [Enter Search: "meeting"] → [Filter Tasks] → [Show Pending + High + "meeting"]
                                                                                         ↓
                                                                              [Clear Filters] → [Show All Tasks]
```

## Data Flow Architecture

```
┌──────────────┐
│   UI Layer   │
│  (Components)│
└──────┬───────┘
       │
       │ uses
       ↓
┌──────────────┐
│  Hooks Layer │
│ (useTasks,   │
│ useFilters)  │
└──────┬───────┘
       │
       │ calls
       ↓
┌──────────────┐
│React Query   │
│ (Cache +     │
│  Mutations)  │
└──────┬───────┘
       │
       │ fetches
       ↓
┌──────────────┐
│Service Layer │
│(tasks.ts,    │
│ profile.ts)  │
└──────┬───────┘
       │
       │ HTTP
       ↓
┌──────────────┐
│API Client    │
│(Axios +      │
│ Interceptors)│
└──────┬───────┘
       │
       │ request
       ↓
┌──────────────┐
│Backend API   │
│(FastAPI)     │
└──────────────┘
```

## Persistence Strategy

| Data Type | Storage Location | Persistence Duration |
|-----------|------------------|---------------------|
| JWT Token | localStorage | Until logout or expiry |
| User Profile | React Query cache | 5 minutes (stale time) |
| Tasks List | React Query cache | 1 minute (stale time) |
| Filter State | React state | Session (lost on refresh) |
| Sort State | React state | Session (lost on refresh) |
| UI State (sidebar, modals) | React state | Session (lost on refresh) |

**Future Enhancement**: Persist filters/sort to localStorage or URL query params for better UX.

## Naming Conventions

- **Interfaces**: PascalCase with descriptive names (e.g., `TaskCardProps`, `TaskFilters`)
- **Enums**: PascalCase for type, UPPER_CASE for values (e.g., `TaskPriority.HIGH`)
- **Types**: PascalCase (e.g., `SortField`, `ModalType`)
- **Constants**: camelCase for objects, UPPER_CASE for primitives (e.g., `defaultFilters`, `MAX_TITLE_LENGTH`)
- **Files**: kebab-case (e.g., `task-card.tsx`, `use-tasks.ts`)

## Type Safety Guidelines

1. **No `any` types**: Use `unknown` for truly unknown types
2. **Strict null checks**: Always handle null/undefined explicitly
3. **Discriminated unions**: Use for modal state (`ModalType`)
4. **Const assertions**: Use `as const` for fixed values
5. **Type guards**: Implement for runtime type checking
6. **Branded types**: Consider for IDs to prevent mix-ups

## Conclusion

All TypeScript types are defined with clear validation rules and relationships. The type system ensures compile-time safety and provides excellent IDE support. Next step: generate API/component contracts.
