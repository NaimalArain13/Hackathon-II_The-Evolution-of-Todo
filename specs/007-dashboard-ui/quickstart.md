# Quickstart: Dashboard UI and API Integration

**Feature**: 007-dashboard-ui | **Date**: 2025-12-14 | **Branch**: `007-dashboard-ui`

## Overview

This quickstart guide helps developers get up and running with the dashboard UI implementation. Follow these steps in order to set up dependencies, understand the architecture, and start implementing components.

## Prerequisites

- Node.js 18+ and pnpm installed
- Backend API running on `http://localhost:8000` (or configured in `.env.local`)
- Existing frontend authentication pages (signin/signup) functional
- Basic understanding of Next.js 16+ App Router, React Query, and Tailwind CSS

## Step 1: Install Dependencies

Navigate to the frontend directory and install required packages:

```bash
cd frontend

# Install core dependencies
pnpm add @tanstack/react-query@^5.17.0 \
         framer-motion@^11.0.0 \
         react-hook-form@^7.49.0 \
         zod@^3.22.0 \
         axios@^1.6.5 \
         sonner@^1.3.0 \
         lucide-react@^0.309.0 \
         class-variance-authority@^0.7.0 \
         clsx@^2.1.0 \
         tailwind-merge@^2.2.0

# Install optional dependencies (for large lists)
pnpm add react-window@^1.8.10

# Install dev dependencies
pnpm add -D @testing-library/react@^14.1.0 \
            @testing-library/jest-dom@^6.1.5 \
            @testing-library/user-event@^14.5.0 \
            @playwright/test@^1.40.0 \
            eslint-plugin-jsx-a11y@^6.8.0 \
            @axe-core/react@^4.8.0 \
            @types/react-window@^1.8.8
```

## Step 2: Install shadcn/ui Components

Install required shadcn/ui components:

```bash
# Initialize shadcn/ui (if not already done)
npx shadcn@latest init

# Add required components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add dialog
npx shadcn@latest add alert-dialog
npx shadcn@latest add skeleton
npx shadcn@latest add tooltip
npx shadcn@latest add avatar
npx shadcn@latest add form
npx shadcn@latest add dropdown-menu
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add tabs
npx shadcn@latest add radio-group
```

## Step 3: Environment Configuration

Ensure your `.env.local` file has the correct API URL:

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Step 4: Project Structure Setup

Create the necessary directories:

```bash
# Navigate to frontend/src
cd src

# Create dashboard component directories
mkdir -p components/dashboard
mkdir -p components/modals

# Create hooks directory
mkdir -p lib/hooks

# Create validations directory
mkdir -p lib/validations

# Create services directory
mkdir -p services

# Create types directory for TypeScript definitions
mkdir -p types

# Create dashboard route group
mkdir -p app/\(dashboard\)
mkdir -p app/\(dashboard\)/tasks
mkdir -p app/\(dashboard\)/profile
```

## Step 5: Core TypeScript Types

Create the core type definitions:

**File**: `src/types/task.ts`

```typescript
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
  created_at: string;
  updated_at: string;
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

**File**: `src/types/filter.ts`

```typescript
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
```

## Step 6: API Client Configuration

The API client should already exist from the auth implementation. Verify it includes JWT injection:

**File**: `src/lib/api-client.ts` (should already exist)

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// JWT interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('access_token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## Step 7: React Query Setup

Ensure React Query provider is set up (should already exist):

**File**: `src/components/providers/query-provider.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            retry: 1
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

## Step 8: Task Service Layer

Create the API service for tasks:

**File**: `src/services/tasks.ts`

```typescript
import apiClient from '@/lib/api-client';
import type { Task, TaskCreateInput, TaskUpdateInput } from '@/types/task';
import type { TaskFilters, TaskStatus } from '@/types/filter';

export interface GetTasksParams {
  userId: string;
  status?: TaskStatus;
  priority?: string;
  category?: string;
  search?: string;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

export const taskService = {
  async getTasks(params: GetTasksParams): Promise<Task[]> {
    const { userId, ...queryParams} = params;
    const response = await apiClient.get(`/api/${userId}/tasks`, {
      params: Object.fromEntries(
        Object.entries(queryParams).filter(([_, v]) => v !== undefined && v !== 'all' && v !== '')
      )
    });
    return response.data;
  },

  async createTask(userId: string, data: TaskCreateInput): Promise<Task> {
    const response = await apiClient.post(`/api/${userId}/tasks`, data);
    return response.data;
  },

  async updateTask(userId: string, taskId: number, data: TaskUpdateInput): Promise<Task> {
    const response = await apiClient.put(`/api/${userId}/tasks/${taskId}`, data);
    return response.data;
  },

  async deleteTask(userId: string, taskId: number): Promise<void> {
    await apiClient.delete(`/api/${userId}/tasks/${taskId}`);
  },

  async toggleComplete(userId: string, taskId: number): Promise<Task> {
    const response = await apiClient.patch(`/api/${userId}/tasks/${taskId}/complete`);
    return response.data;
  }
};
```

## Step 9: Custom Hooks

Create the React Query hooks for tasks:

**File**: `src/lib/hooks/useTasks.ts`

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/tasks';
import { useAuth } from './useAuth'; // Existing auth hook
import type { TaskFilters } from '@/types/filter';
import type { TaskCreateInput, TaskUpdateInput } from '@/types/task';
import { toast } from 'sonner';

export const queryKeys = {
  tasks: (userId: string, filters: TaskFilters) => ['tasks', userId, filters] as const
};

export function useTasks(filters: TaskFilters) {
  const { user } = useAuth();

  return useQuery({
    queryKey: queryKeys.tasks(user?.id || '', filters),
    queryFn: () => taskService.getTasks({
      userId: user!.id,
      status: filters.status,
      priority: filters.priority,
      category: filters.category,
      search: filters.search
    }),
    enabled: !!user?.id
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (data: TaskCreateInput) =>
      taskService.createTask(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user!.id] });
      toast.success('Task created successfully');
    },
    onError: () => {
      toast.error('Failed to create task');
    }
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: number; data: TaskUpdateInput }) =>
      taskService.updateTask(user!.id, taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user!.id] });
      toast.success('Task updated successfully');
    },
    onError: () => {
      toast.error('Failed to update task');
    }
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (taskId: number) =>
      taskService.deleteTask(user!.id, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user!.id] });
      toast.success('Task deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete task');
    }
  });
}

export function useToggleComplete() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: (taskId: number) =>
      taskService.toggleComplete(user!.id, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user!.id] });
    },
    onError: () => {
      toast.error('Failed to update task');
    }
  });
}
```

## Step 10: Form Validation Schemas

Create Zod schemas for form validation:

**File**: `src/lib/validations/task.ts`

```typescript
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

## Step 11: Run Development Server

Start the development server:

```bash
pnpm dev
```

Visit `http://localhost:3000/dashboard` (you'll be redirected to signin if not authenticated).

## Step 12: Implementation Order

Follow this order to implement the dashboard:

1. **Dashboard Layout** (`app/(dashboard)/layout.tsx`)
   - Basic layout with sidebar slot
   - Authentication check
   - User context access

2. **Sidebar Component** (`components/dashboard/Sidebar.tsx`)
   - Navigation links
   - User profile display
   - Collapse/expand functionality

3. **Dashboard Page** (`app/(dashboard)/page.tsx`)
   - Fetch tasks with useTasks hook
   - Display loading state
   - Display task list

4. **TaskCard Component** (`components/dashboard/TaskCard.tsx`)
   - Display task data
   - Completion checkbox
   - Edit/delete buttons

5. **CreateTaskModal** (`components/modals/CreateTaskModal.tsx`)
   - Form with validation
   - Submit with useCreateTask hook

6. **Filters & Search** (`components/dashboard/TaskFilters.tsx`, `SearchBar.tsx`)
   - Filter controls
   - Search input with debounce

7. **EditTaskModal & DeleteDialog**
   - Complete CRUD operations

8. **Polish & Animations**
   - Add Framer Motion animations
   - Loading states
   - Error handling

## Common Issues & Solutions

### Issue: "Cannot read property 'id' of undefined"
**Solution**: Ensure `useAuth()` hook returns user data before accessing `user.id`. Add loading checks.

### Issue: CORS errors when calling API
**Solution**: Verify backend CORS is configured to allow `http://localhost:3000`. Check `backend/main.py`.

### Issue: 401 Unauthorized errors
**Solution**: Check that JWT token is being stored in localStorage after login and API client interceptor is working.

### Issue: Tasks not refetching after create/update/delete
**Solution**: Ensure `queryClient.invalidateQueries()` is called in mutation `onSuccess` callbacks.

### Issue: Hydration errors in Next.js
**Solution**: Use 'use client' directive for components that use hooks or browser APIs. Avoid mismatches between server and client renders.

## Testing

Run tests:

```bash
# Unit tests
pnpm test

# E2E tests
pnpm playwright test

# Type checking
pnpm tsc --noEmit
```

## Next Steps

1. Implement core components following `contracts/components.yaml`
2. Add animations with Framer Motion
3. Write unit tests for hooks and components
4. Write E2E tests for critical user flows
5. Optimize performance with virtual scrolling if needed
6. Add accessibility features (keyboard navigation, ARIA labels)
7. Test on mobile devices and different browsers

## Resources

- **Spec**: [`specs/007-dashboard-ui/spec.md`](./spec.md)
- **Plan**: [`specs/007-dashboard-ui/plan.md`](./plan.md)
- **Research**: [`specs/007-dashboard-ui/research.md`](./research.md)
- **Data Model**: [`specs/007-dashboard-ui/data-model.md`](./data-model.md)
- **Component Contracts**: [`specs/007-dashboard-ui/contracts/components.yaml`](./contracts/components.yaml)
- **Route Contracts**: [`specs/007-dashboard-ui/contracts/routes.yaml`](./contracts/routes.yaml)

## Support

For questions or issues:
- Review the spec and plan documents
- Check existing frontend patterns in `frontend/CLAUDE.md`
- Refer to Next.js 16+ documentation
- Check React Query documentation for data fetching patterns
