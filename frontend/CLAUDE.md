# Frontend Guidelines - Next.js 16+ Application

## Overview
This is the frontend for the Todo App built with Next.js 16+ using the App Router. It provides a responsive web interface for task management with Better Auth authentication.

---

## ⚠️ IMPORTANT: Design-First Implementation

**BEFORE implementing any UI, you MUST review these design reference documents:**

### Required Design References
1. **`frontend/FIGMA_DESIGN_SPEC.md`** - Complete design system specification
   - Design tokens (colors, typography, spacing)
   - Component specifications
   - Page layouts and wireframes
   - Animation guidelines

2. **`frontend/ROADMAP.md`** - Implementation roadmap and phases
   - Tech stack and dependencies
   - Phase-by-phase implementation plan
   - Component breakdown

3. **`specs/004-frontend-setup/COLOR_PALETTE.md`** - Official color palette
   - Primary: Cyan (#3ABEFF)
   - Danger: Red/Coral (#FF6767)
   - Neutral: Custom grays (#F8F8FB, #F8F8F8, #F5F8FF, #A1A3AB, #000000)

---

## Frontend Implementation Phases

The frontend UI and implementation is broken into **3 main parts**:

### Phase 1: Landing Page
- Hero section with CTA
- Features section
- How it works section
- Footer
- Responsive design (mobile-first)
- Framer Motion animations

### Phase 2: Auth Flow (Login/Signup + API Integration)
- Login page with form validation
- Registration page with password strength indicator
- Better Auth integration
- JWT token management
- Protected route handling
- Error states and loading states

### Phase 3: Dashboard (Tasks + Profile)
- **Task Management UI**:
  - Task list view
  - Task card components
  - Create/Edit/Delete task modals
  - Task filtering and sorting
  - Status and priority badges
- **API Integration**:
  - TanStack Query for data fetching
  - Optimistic updates
  - Error handling
- **User Profile Page**:
  - View profile information
  - Update profile settings
  - Password change functionality

---

## Required Skills

**Always use defined skills when applicable.** All skills are located under `.claude/skills/`

### Frontend Skills
| Skill | Path | Use Case |
|-------|------|----------|
| `nextjs` | `.claude/skills/nextjs/` | Next.js 16 patterns, App Router, proxy.ts |
| `shadcn` | `.claude/skills/shadcn/` | UI components, theming |
| `framer-motion` | `.claude/skills/framer-motion/` | Animations, page transitions |
| `better-auth-ts` | `.claude/skills/better-auth-ts/` | Authentication implementation |
| `drizzle-orm` | `.claude/skills/drizzle-orm/` | Database queries (if needed) |
| `neon-postgres` | `.claude/skills/neon-postgres/` | Neon database connection |

### Frontend-Specific Skills
| Skill | Path | Use Case |
|-------|------|----------|
| `frontend-api-client` | `.claude/skills/frontend-api-client/` | API client patterns |
| `frontend-auth` | `.claude/skills/frontend-auth/` | Auth flow implementation |
| `frontend-component` | `.claude/skills/frontend-component/` | Component patterns |
| `frontend-types` | `.claude/skills/frontend-types/` | TypeScript types |

### Figma/Design Skills
| Skill | Path | Use Case |
|-------|------|----------|
| `figma-modern-ui-design` | `.claude/skills/figma-modern-ui-design/` | Modern UI patterns |
| `figma-animations-prototypes` | `.claude/skills/figma-animations-prototypes/` | Animation specs |
| `figma-dashboard-components` | `.claude/skills/figma-dashboard-components/` | Dashboard UI |
| `figma-backend-integration-design` | `.claude/skills/figma-backend-integration-design/` | API-driven UI |

---

## Technology Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth (JWT-based)
- **HTTP Client**: Axios (singleton service pattern)
- **UI Components**: Custom components with Tailwind CSS
- **Deployment**: Vercel

## Project Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── (auth)/              # Auth route group
│   │   ├── signin/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   └── (dashboard)/         # Protected dashboard routes
│       ├── layout.tsx       # Dashboard layout with nav
│       ├── page.tsx         # Dashboard home
│       └── tasks/           # Task management pages
│           ├── page.tsx     # Task list view
│           └── [id]/        # Dynamic task routes
│               └── page.tsx
├── components/              # Reusable UI components
│   ├── auth/                # Auth-related components
│   │   ├── SignInForm.tsx
│   │   └── SignUpForm.tsx
│   ├── tasks/               # Task-related components
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   ├── TaskForm.tsx
│   │   └── TaskFilter.tsx
│   ├── layout/              # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── ui/                  # Generic UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Card.tsx
│       └── Modal.tsx
├── constants/               # Application constants
│   └── endpoints.ts         # API endpoint URLs
├── services/                # Service layer
│   └── api.ts               # Singleton API service (axios)
├── lib/                     # Utility libraries
│   ├── auth.ts              # Better Auth config
│   ├── types.ts             # TypeScript type definitions
│   └── utils.ts             # Helper functions
├── public/                  # Static assets
├── .env.local               # Environment variables
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind CSS config
└── next.config.js           # Next.js config
```

## Development Patterns

### 1. Server Components by Default
Use React Server Components by default for better performance:

```tsx
// app/tasks/page.tsx - Server Component (default)
export default async function TasksPage() {
  // Can directly fetch data on the server
  const tasks = await fetchTasks();

  return (
    <div>
      <h1>Tasks</h1>
      <TaskList tasks={tasks} />
    </div>
  );
}
```

### 2. Client Components Only When Needed
Use the `"use client"` directive only when you need:
- Interactivity (onClick, onChange, etc.)
- React hooks (useState, useEffect, etc.)
- Browser APIs (localStorage, window, etc.)

```tsx
// components/tasks/TaskForm.tsx - Client Component
"use client";

import { useState } from 'react';

export function TaskForm() {
  const [title, setTitle] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

### 3. Singleton API Service Pattern
All backend API calls go through a singleton service using **Axios**.

#### API Endpoints (constants/endpoints.ts)
Define all API endpoint URLs in one place:

```typescript
// constants/endpoints.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNIN: `${API_BASE_URL}/api/auth/signin`,
    SIGNUP: `${API_BASE_URL}/api/auth/signup`,
    SIGNOUT: `${API_BASE_URL}/api/auth/signout`,
  },

  // Tasks
  TASKS: {
    LIST: (userId: string) => `${API_BASE_URL}/api/${userId}/tasks`,
    CREATE: (userId: string) => `${API_BASE_URL}/api/${userId}/tasks`,
    GET: (userId: string, taskId: number) => `${API_BASE_URL}/api/${userId}/tasks/${taskId}`,
    UPDATE: (userId: string, taskId: number) => `${API_BASE_URL}/api/${userId}/tasks/${taskId}`,
    DELETE: (userId: string, taskId: number) => `${API_BASE_URL}/api/${userId}/tasks/${taskId}`,
    COMPLETE: (userId: string, taskId: number) => `${API_BASE_URL}/api/${userId}/tasks/${taskId}/complete`,
  },
} as const;
```

#### Singleton API Service (services/api.ts)
Create a singleton service with axios for all HTTP operations:

```typescript
// services/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_ENDPOINTS } from '@/constants/endpoints';

class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add JWT token
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Handle unauthorized access (e.g., redirect to login)
          this.clearToken();
        }
        return Promise.reject(error);
      }
    );
  }

  // Singleton pattern
  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Token management
  public setToken(token: string): void {
    this.token = token;
  }

  public clearToken(): void {
    this.token = null;
  }

  // Generic HTTP methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.get(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.post(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.put(url, data, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.patch(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.axiosInstance.delete(url, config);
    return response.data;
  }
}

// Export singleton instance
export const apiService = ApiService.getInstance();
```

#### Usage Example
```typescript
// In a component or service
import { apiService } from '@/services/api';
import { API_ENDPOINTS } from '@/constants/endpoints';
import type { Task } from '@/lib/types';

// Set token after authentication
apiService.setToken(jwtToken);

// GET request - List tasks
const tasks = await apiService.get<Task[]>(
  API_ENDPOINTS.TASKS.LIST(userId),
  { params: { status: 'pending' } }
);

// POST request - Create task
const newTask = await apiService.post<Task>(
  API_ENDPOINTS.TASKS.CREATE(userId),
  { title: 'New Task', description: 'Task description' }
);

// PUT request - Update task
const updatedTask = await apiService.put<Task>(
  API_ENDPOINTS.TASKS.UPDATE(userId, taskId),
  { title: 'Updated Title', completed: false }
);

// DELETE request - Delete task
await apiService.delete(API_ENDPOINTS.TASKS.DELETE(userId, taskId));

// PATCH request - Toggle completion
const completedTask = await apiService.patch<Task>(
  API_ENDPOINTS.TASKS.COMPLETE(userId, taskId)
);
```

### 4. Type Safety with TypeScript
Define all types in `/lib/types.ts`:

```tsx
// lib/types.ts
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}
```

## Styling Guidelines

### 1. Tailwind CSS Only
Use Tailwind utility classes for all styling:

```tsx
// ✅ Good - Tailwind classes
<div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
</div>

// ❌ Bad - Inline styles
<div style={{ display: 'flex', flexDirection: 'column', padding: '24px' }}>
  <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Tasks</h2>
</div>
```

### 2. Component-Specific Styles
For complex, reusable styling patterns, create utility classes in `tailwind.config.js`:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      },
    },
  },
};
```

### 3. Responsive Design
Use Tailwind's responsive prefixes:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid layout */}
</div>
```

## Authentication with Better Auth

### Configuration
```tsx
// lib/auth.ts
import { betterAuth } from 'better-auth/react';

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3000',
  jwtSecret: process.env.BETTER_AUTH_SECRET!,
  // Additional config
});
```

### Protected Routes
```tsx
// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function DashboardLayout({ children }: { children: React.Node }) {
  const session = await auth.getSession();

  if (!session) {
    redirect('/signin');
  }

  return (
    <div>
      <Sidebar user={session.user} />
      <main>{children}</main>
    </div>
  );
}
```

## Data Fetching

### Server-Side Fetching (Preferred)
```tsx
// app/tasks/page.tsx
import { api } from '@/lib/api';
import { auth } from '@/lib/auth';

export default async function TasksPage() {
  const session = await auth.getSession();
  if (!session) return null;

  const tasks = await api.getTasks(session.user.id);

  return <TaskList tasks={tasks} />;
}
```

### Client-Side Fetching (When Needed)
```tsx
// components/tasks/TaskList.tsx
"use client";

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await api.getTasks(userId);
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {tasks.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </div>
  );
}
```

## Environment Variables

Create `.env.local` in the frontend root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-shared-secret-key-here
```

**Important**:
- `NEXT_PUBLIC_*` variables are exposed to the browser
- `BETTER_AUTH_SECRET` should match the backend's secret

## Error Handling

### API Error Handling
```tsx
// lib/api.ts
async getTasks(userId: string) {
  try {
    const response = await fetch(`${this.baseURL}/api/${userId}/tasks`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Failed to fetch tasks');
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
```

### UI Error States
```tsx
"use client";

import { useState } from 'react';

export function TaskForm() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await api.createTask(userId, { title });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-md">
          {error}
        </div>
      )}
      {/* Form fields */}
    </form>
  );
}
```

## Running the Frontend

### Development
```bash
npm install         # Install dependencies
npm run dev         # Start dev server on http://localhost:3000
```

### Building for Production
```bash
npm run build       # Create production build
npm start           # Start production server
```

### Deployment to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL` (production backend URL)
   - `BETTER_AUTH_SECRET` (same as backend)
4. Deploy automatically on push

## Best Practices

### 1. Component Organization
- **app/**: Pages and layouts (App Router)
- **components/**: Reusable UI components
- **lib/**: Utilities, API client, types

### 2. Naming Conventions
- Components: PascalCase (`TaskList.tsx`)
- Files: camelCase for utilities (`api.ts`, `utils.ts`)
- CSS classes: kebab-case (handled by Tailwind)

### 3. Import Aliases
Use `@/` alias for cleaner imports:

```tsx
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

// Usage
import { api } from '@/lib/api';
import { TaskList } from '@/components/tasks/TaskList';
```

### 4. Performance Optimization
- Use Server Components by default
- Implement loading states with `loading.tsx`
- Use dynamic imports for code splitting when needed
- Optimize images with Next.js `<Image>` component

### 5. Accessibility
- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Maintain color contrast ratios

## Testing

### Unit Tests (Jest + React Testing Library)
```tsx
// components/tasks/__tests__/TaskItem.test.tsx
import { render, screen } from '@testing-library/react';
import { TaskItem } from '../TaskItem';

describe('TaskItem', () => {
  it('renders task title', () => {
    const task = { id: 1, title: 'Test Task', completed: false };
    render(<TaskItem task={task} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });
});
```

## Common Tasks

### Add a New Page
1. Create file in `app/` directory
2. Export default component
3. Add navigation link in layout

### Add a New Component
1. Create file in appropriate `components/` subdirectory
2. Define props interface
3. Implement component with TypeScript
4. Style with Tailwind CSS

### Add API Endpoint Call
1. Add method to `/lib/api.ts`
2. Define types in `/lib/types.ts`
3. Use in component (server or client)

---

**Remember**: Follow the monorepo conventions defined in the root CLAUDE.md. Reference backend API specs from `@specs/api/` when implementing features.

**Version**: 1.0.0 | **Last Updated**: 2025-12-08
