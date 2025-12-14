# Implementation Plan: Frontend Project Setup

**Feature Branch**: `004-frontend-setup`
**Created**: 2025-12-13
**Status**: Ready for Implementation
**Estimated Complexity**: Medium (Setup and Configuration)

---

## Overview

This plan outlines the step-by-step implementation of the frontend project setup, establishing the foundation for all subsequent UI development. The implementation will create a fully configured Next.js 16+ application with design system, component library, API integration, and authentication infrastructure.

---

## Implementation Phases

### Phase 1: Core Project Initialization
**Goal**: Bootstrap Next.js 16+ project with TypeScript and essential configuration

#### Tasks:
1. **Initialize Next.js Project**
   - Navigate to `frontend/` directory
   - Verify Node.js 18+ is installed
   - Initialize Next.js 16 with TypeScript using `npx create-next-app@latest`
   - Configure App Router (default in Next.js 16)
   - Set up TypeScript strict mode

2. **Configure Project Structure**
   - Create directory structure:
     ```
     frontend/
     ├── src/
     │   ├── app/           # Next.js App Router pages
     │   ├── components/    # React components
     │   │   ├── ui/        # shadcn/ui components
     │   │   ├── features/  # Feature-specific components
     │   │   └── layout/    # Layout components
     │   ├── lib/           # Utilities and API client
     │   ├── hooks/         # Custom React hooks
     │   ├── types/         # TypeScript type definitions
     │   ├── store/         # Zustand stores
     │   ├── services/      # API service layer
     │   └── constants/     # App constants
     ├── public/            # Static assets
     └── package.json
     ```

3. **Configure Path Aliases**
   - Update `tsconfig.json` with path aliases:
     ```json
     {
       "compilerOptions": {
         "baseUrl": ".",
         "paths": {
           "@/*": ["./src/*"],
           "@/components/*": ["./src/components/*"],
           "@/lib/*": ["./src/lib/*"],
           "@/hooks/*": ["./src/hooks/*"],
           "@/types/*": ["./src/types/*"],
           "@/store/*": ["./src/store/*"],
           "@/services/*": ["./src/services/*"],
           "@/constants/*": ["./src/constants/*"]
         }
       }
     }
     ```

4. **Configure Environment Variables**
   - Create `.env.local` with:
     ```env
     NEXT_PUBLIC_API_URL=https://naimalcreativityai-sdd-todo-app.hf.space
     BETTER_AUTH_SECRET=<shared-secret-from-backend>
     BETTER_AUTH_URL=http://localhost:3000
     NODE_ENV=development
     ```
   - Create `.env.example` for documentation
   - Add `.env.local` to `.gitignore`

**Validation**:
- ✓ `npm run dev` starts server successfully on localhost:3000
- ✓ TypeScript compilation completes without errors
- ✓ Path aliases resolve correctly in imports
- ✓ Environment variables are accessible via `process.env`

---

### Phase 2: Design System & Styling Setup
**Goal**: Configure Tailwind CSS with TaskFlow design tokens

#### Tasks:
1. **Install Tailwind CSS v4**
   - Install dependencies: `tailwindcss@next postcss autoprefixer`
   - Initialize Tailwind: `npx tailwindcss init -p`
   - Configure `tailwind.config.js` with TaskFlow design tokens

2. **Configure Design Tokens**
   - Define color palette in `tailwind.config.js`:
     ```javascript
     colors: {
       primary: {
         50: '#F5FCFF',
         100: '#E6F7FF',
         200: '#CCEFFF',
         300: '#99DFFF',
         400: '#66CFFF',
         500: '#3ABEFF', // Brand primary (cyan)
         600: '#2E98CC',
         700: '#227299',
         800: '#174C66',
         900: '#0B2633',
       },
       danger: {
         50: '#FFF5F5',
         100: '#FFE6E6',
         200: '#FFCCCC',
         300: '#FF9999',
         400: '#FF8080',
         500: '#FF6767', // Error/danger color (red/coral)
         600: '#CC5252',
         700: '#993D3D',
         800: '#662929',
         900: '#331414',
       },
       neutral: {
         50: '#F8F8FB',  // Custom light lavender
         100: '#F8F8F8', // Custom light gray
         200: '#F5F8FF', // Custom light blue tint
         300: '#E5E7EB',
         400: '#D1D5DB',
         500: '#A1A3AB', // Custom medium gray
         600: '#6B7280',
         700: '#4B5563',
         800: '#1F2937',
         900: '#000000', // Black
       },
       white: '#FFFFFF',
       black: '#000000',
     }
     ```

3. **Configure Typography**
   - Install Inter font via `next/font/google`
   - Configure font family in `tailwind.config.js`:
     ```javascript
     fontFamily: {
       sans: ['Inter', 'system-ui', 'sans-serif'],
     }
     ```
   - Define type scale:
     ```javascript
     fontSize: {
       xs: '12px',
       sm: '14px',
       base: '16px',
       lg: '18px',
       xl: '20px',
       '2xl': '24px',
       '3xl': '30px',
       '4xl': '36px',
       '5xl': '48px',
     }
     ```

4. **Configure Spacing & Layout**
   - Set up 4px baseline grid spacing
   - Configure container widths and breakpoints
   - Add custom utilities for layout

5. **Install Animation Dependencies**
   - Install `tailwindcss-animate`
   - Configure animation presets in Tailwind config

**Validation**:
- ✓ Tailwind classes are applied correctly in components
- ✓ Primary color `bg-primary-500` renders as #3ABEFF (cyan)
- ✓ Inter font loads and displays correctly
- ✓ Type scale matches design specification
- ✓ Animations work with Tailwind utilities

---

### Phase 3: UI Component Library Setup
**Goal**: Install and configure shadcn/ui components

#### Tasks:
1. **Initialize shadcn/ui**
   - Run: `npx shadcn@latest init`
   - Configure with:
     - Style: Default
     - Base color: Slate
     - CSS variables: Yes
     - Tailwind config: Yes
     - Import alias: @/components/ui

2. **Install Required Components**
   - Run installation command:
     ```bash
     npx shadcn@latest add button input label card dialog \
       dropdown-menu select checkbox radio-group tabs toast \
       form avatar badge skeleton
     ```

3. **Install Additional UI Dependencies**
   - Install Radix UI primitives (if not auto-installed):
     ```bash
     npm install @radix-ui/react-slot @radix-ui/react-dialog \
       @radix-ui/react-dropdown-menu @radix-ui/react-select \
       @radix-ui/react-checkbox @radix-ui/react-radio-group \
       @radix-ui/react-tabs @radix-ui/react-toast
     ```
   - Install utility libraries:
     ```bash
     npm install class-variance-authority clsx tailwind-merge
     ```

4. **Install Icon Library**
   - Install: `npm install lucide-react`
   - Create icon re-export file at `src/components/ui/icons.ts`

5. **Configure Component Theming**
   - Update `globals.css` with CSS custom properties for theming
   - Ensure dark mode support is configured (even if not actively used yet)

**Validation**:
- ✓ All 14 shadcn components are in `src/components/ui/`
- ✓ Each component imports and renders without errors
- ✓ Components apply correct styling from design tokens
- ✓ Icons from lucide-react render correctly
- ✓ Component variants (button types, input sizes) work as expected

---

### Phase 4: Animation & Interaction Libraries
**Goal**: Set up Framer Motion for UI animations

#### Tasks:
1. **Install Framer Motion**
   - Run: `npm install framer-motion`
   - Create animation utilities in `src/lib/animations.ts`

2. **Create Animation Presets**
   - Page transition animations
   - Fade in/out utilities
   - Slide animations
   - Stagger children utilities

3. **Configure Next.js for Animations**
   - Ensure client components are properly marked with `'use client'`
   - Test page transitions with App Router

**Validation**:
- ✓ Framer Motion imports successfully
- ✓ Animation presets work in test components
- ✓ Page transitions are smooth
- ✓ No hydration errors occur with animations

---

### Phase 5: Form Handling & Validation
**Goal**: Set up React Hook Form with Zod validation

#### Tasks:
1. **Install Form Libraries**
   - Run: `npm install react-hook-form @hookform/resolvers zod`

2. **Create Form Utilities**
   - Create `src/lib/form-utils.ts` with common form helpers
   - Create Zod schemas for common form patterns

3. **Integrate with shadcn Form Component**
   - Verify shadcn `form` component works with react-hook-form
   - Create example form for testing

**Validation**:
- ✓ Forms handle validation correctly
- ✓ Error messages display properly
- ✓ Form submission works as expected
- ✓ Zod schemas validate input correctly

---

### Phase 6: State Management Setup
**Goal**: Configure Zustand for client state and TanStack Query for server state

#### Tasks:
1. **Install State Management Libraries**
   - Run: `npm install zustand`
   - Run: `npm install @tanstack/react-query @tanstack/react-query-devtools`

2. **Create Authentication Store (Zustand)**
   - Create `src/store/auth-store.ts`:
     ```typescript
     import { create } from 'zustand';
     import { persist } from 'zustand/middleware';
     import Cookies from 'js-cookie';

     interface User {
       id: number;
       email: string;
       name: string;
       created_at: string;
     }

     interface AuthState {
       user: User | null;
       token: string | null;
       isAuthenticated: boolean;
       setAuth: (user: User, token: string) => void;
       clearAuth: () => void;
       restoreAuth: () => void;
     }

     export const useAuthStore = create<AuthState>()(
       persist(
         (set) => ({
           user: null,
           token: null,
           isAuthenticated: false,
           setAuth: (user, token) => {
             Cookies.set('auth_token', token, { expires: 7 });
             set({ user, token, isAuthenticated: true });
           },
           clearAuth: () => {
             Cookies.remove('auth_token');
             set({ user: null, token: null, isAuthenticated: false });
           },
           restoreAuth: () => {
             const token = Cookies.get('auth_token');
             if (token) {
               // Decode token to get user info (will be implemented later)
               set({ token, isAuthenticated: true });
             }
           },
         }),
         {
           name: 'auth-storage',
           partialize: (state) => ({ user: state.user }),
         }
       )
     );
     ```

3. **Configure TanStack Query Provider**
   - Create `src/lib/query-client.ts`:
     ```typescript
     import { QueryClient } from '@tanstack/react-query';

     export const queryClient = new QueryClient({
       defaultOptions: {
         queries: {
           staleTime: 60 * 1000, // 1 minute
           retry: 1,
         },
       },
     });
     ```
   - Wrap app with `QueryClientProvider` in root layout

4. **Install Cookie Management**
   - Run: `npm install js-cookie @types/js-cookie`
   - Run: `npm install jwt-decode`

**Validation**:
- ✓ Auth store persists state to cookies
- ✓ State survives page refresh
- ✓ TanStack Query provider wraps the app
- ✓ DevTools are accessible in development

---

### Phase 7: API Service Layer
**Goal**: Create singleton Axios service with interceptors

#### Tasks:
1. **Install HTTP Client**
   - Run: `npm install axios`

2. **Create Singleton API Service**
   - Create `src/services/api.ts`:
     ```typescript
     import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
     import Cookies from 'js-cookie';
     import { useAuthStore } from '@/store/auth-store';

     class ApiService {
       private static instance: ApiService;
       private axiosInstance: AxiosInstance;

       private constructor() {
         this.axiosInstance = axios.create({
           baseURL: process.env.NEXT_PUBLIC_API_URL,
           timeout: 30000,
           headers: {
             'Content-Type': 'application/json',
           },
         });

         this.setupInterceptors();
       }

       public static getInstance(): ApiService {
         if (!ApiService.instance) {
           ApiService.instance = new ApiService();
         }
         return ApiService.instance;
       }

       private setupInterceptors(): void {
         // Request interceptor - inject JWT token
         this.axiosInstance.interceptors.request.use(
           (config: InternalAxiosRequestConfig) => {
             const token = Cookies.get('auth_token');
             if (token && config.headers) {
               config.headers.Authorization = `Bearer ${token}`;
             }
             return config;
           },
           (error) => Promise.reject(error)
         );

         // Response interceptor - handle 401 errors
         this.axiosInstance.interceptors.response.use(
           (response) => response,
           (error: AxiosError) => {
             if (error.response?.status === 401) {
               // Clear auth state and redirect to login
               useAuthStore.getState().clearAuth();
               if (typeof window !== 'undefined') {
                 window.location.href = '/login';
               }
             }
             return Promise.reject(error);
           }
         );
       }

       public getAxios(): AxiosInstance {
         return this.axiosInstance;
       }
     }

     export const api = ApiService.getInstance().getAxios();
     ```

3. **Create API Helper Functions**
   - Create `src/lib/api-client.ts` with typed API methods:
     ```typescript
     import { api } from '@/services/api';
     import { User, Task } from '@/types';

     export const authApi = {
       register: (data: { email: string; password: string; name: string }) =>
         api.post<{ user: User; token: string }>('/auth/register', data),
       login: (data: { email: string; password: string }) =>
         api.post<{ user: User; token: string }>('/auth/login', data),
       logout: () => api.post('/auth/logout'),
       getCurrentUser: () => api.get<{ user: User }>('/auth/me'),
     };

     export const tasksApi = {
       getTasks: (params?: { status?: string; priority?: string }) =>
         api.get<{ tasks: Task[] }>('/api/tasks', { params }),
       getTask: (id: number) =>
         api.get<{ task: Task }>(`/api/tasks/${id}`),
       createTask: (data: Partial<Task>) =>
         api.post<{ task: Task }>('/api/tasks', data),
       updateTask: (id: number, data: Partial<Task>) =>
         api.put<{ task: Task }>(`/api/tasks/${id}`, data),
       deleteTask: (id: number) =>
         api.delete(`/api/tasks/${id}`),
     };
     ```

**Validation**:
- ✓ API service is a singleton (same instance across imports)
- ✓ Request interceptor adds Authorization header
- ✓ Response interceptor handles 401 by clearing auth and redirecting
- ✓ Environment variable NEXT_PUBLIC_API_URL is used correctly
- ✓ Test API call completes successfully

---

### Phase 8: TypeScript Type Definitions
**Goal**: Define all type interfaces for type safety

#### Tasks:
1. **Create Entity Types**
   - Create `src/types/entities.ts`:
     ```typescript
     export interface User {
       id: number;
       email: string;
       name: string;
       created_at: string;
     }

     export interface Task {
       id: number;
       title: string;
       description: string;
       status: 'pending' | 'in_progress' | 'completed';
       priority: 'low' | 'medium' | 'high';
       user_id: number;
       created_at: string;
       updated_at: string;
     }
     ```

2. **Create API Response Types**
   - Create `src/types/api.ts`:
     ```typescript
     export interface ApiResponse<T = any> {
       data: T;
       error: string | null;
       status: number;
     }

     export interface ApiError {
       message: string;
       code?: string;
       details?: any;
     }

     export interface PaginatedResponse<T> {
       data: T[];
       total: number;
       page: number;
       per_page: number;
     }
     ```

3. **Create Form Types**
   - Create `src/types/forms.ts`:
     ```typescript
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
     ```

4. **Create Utility Types**
   - Create `src/types/utils.ts`:
     ```typescript
     export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
     export type Nullable<T> = T | null;
     export type AsyncData<T> = {
       data: T | null;
       loading: boolean;
       error: Error | null;
     };
     ```

5. **Create Index Barrel Export**
   - Create `src/types/index.ts`:
     ```typescript
     export * from './entities';
     export * from './api';
     export * from './forms';
     export * from './utils';
     ```

**Validation**:
- ✓ All types compile without errors
- ✓ Types are importable via `@/types`
- ✓ IDE provides autocomplete for entity properties
- ✓ Type checking catches invalid assignments

---

### Phase 9: Date & Time Utilities
**Goal**: Set up date-fns for date formatting

#### Tasks:
1. **Install Date Library**
   - Run: `npm install date-fns`

2. **Create Date Utilities**
   - Create `src/lib/date-utils.ts`:
     ```typescript
     import { format, formatDistanceToNow, parseISO } from 'date-fns';

     export const formatDate = (date: string | Date): string => {
       const dateObj = typeof date === 'string' ? parseISO(date) : date;
       return format(dateObj, 'MMM d, yyyy');
     };

     export const formatDateTime = (date: string | Date): string => {
       const dateObj = typeof date === 'string' ? parseISO(date) : date;
       return format(dateObj, 'MMM d, yyyy h:mm a');
     };

     export const formatRelativeTime = (date: string | Date): string => {
       const dateObj = typeof date === 'string' ? parseISO(date) : date;
       return formatDistanceToNow(dateObj, { addSuffix: true });
     };
     ```

**Validation**:
- ✓ Date formatting functions work correctly
- ✓ Relative time displays as expected ("2 hours ago")

---

### Phase 10: Development Tooling
**Goal**: Configure ESLint, Prettier, and code quality tools

#### Tasks:
1. **Configure ESLint**
   - Install: `npm install -D eslint eslint-config-next`
   - Install TypeScript ESLint: `npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin`
   - Update `.eslintrc.json`:
     ```json
     {
       "extends": [
         "next/core-web-vitals",
         "plugin:@typescript-eslint/recommended"
       ],
       "parser": "@typescript-eslint/parser",
       "plugins": ["@typescript-eslint"],
       "rules": {
         "@typescript-eslint/no-unused-vars": "warn",
         "@typescript-eslint/no-explicit-any": "warn"
       }
     }
     ```

2. **Configure Prettier**
   - Install: `npm install -D prettier prettier-plugin-tailwindcss`
   - Create `.prettierrc`:
     ```json
     {
       "semi": true,
       "trailingComma": "es5",
       "singleQuote": true,
       "tabWidth": 2,
       "printWidth": 100,
       "plugins": ["prettier-plugin-tailwindcss"]
     }
     ```
   - Create `.prettierignore`:
     ```
     .next
     node_modules
     build
     dist
     ```

3. **Add Scripts to package.json**
   - Add:
     ```json
     {
       "scripts": {
         "dev": "next dev",
         "build": "next build",
         "start": "next start",
         "lint": "next lint",
         "format": "prettier --write .",
         "format:check": "prettier --check .",
         "type-check": "tsc --noEmit"
       }
     }
     ```

**Validation**:
- ✓ `npm run lint` completes without errors
- ✓ `npm run format` formats code correctly
- ✓ `npm run type-check` verifies TypeScript compilation
- ✓ VSCode auto-formats on save (if configured)

---

### Phase 11: Documentation & README
**Goal**: Document the frontend setup and usage

#### Tasks:
1. **Update frontend/README.md**
   - Document project structure
   - List all installed dependencies and their purposes
   - Provide setup instructions
   - Document environment variables
   - Include development commands

2. **Create Component Documentation**
   - Document shadcn component usage
   - Provide examples of using the API client
   - Document authentication store usage

**Validation**:
- ✓ README is comprehensive and easy to follow
- ✓ New developers can set up the project using the README

---

### Phase 12: Verification & Testing
**Goal**: Ensure the entire setup works correctly

#### Tasks:
1. **Create Test Component**
   - Create `src/app/test/page.tsx` that uses:
     - Multiple shadcn components
     - API service (test call)
     - Auth store
     - TypeScript types
     - Animations

2. **Verify All User Stories**
   - ✓ US-1: Development server starts successfully
   - ✓ US-2: Design tokens render correctly
   - ✓ US-3: All shadcn components work
   - ✓ US-4: API service makes requests
   - ✓ US-5: Auth store persists state
   - ✓ US-6: Types provide autocomplete
   - ✓ US-7: Environment variables are loaded

3. **Run Quality Checks**
   - ✓ `npm run lint` passes
   - ✓ `npm run type-check` passes
   - ✓ `npm run build` completes successfully
   - ✓ No console errors in browser

4. **Performance Check**
   - ✓ Development server hot-reloads within 2 seconds
   - ✓ Initial page load is fast

**Validation**:
- ✓ All success criteria (SC-001 to SC-008) are met
- ✓ All user acceptance scenarios pass
- ✓ No errors in console or terminal

---

## Risk Assessment

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dependency conflicts between packages | Medium | Use exact versions, test incrementally |
| Tailwind v4 breaking changes | Medium | Use @next tag, verify with test components |
| Next.js 16 App Router SSR issues | High | Mark client components explicitly, test thoroughly |
| CORS issues with backend API | High | Verify backend CORS configuration, use proxy if needed |
| Authentication token expiry not handled | Medium | Implement token refresh logic in interceptor |

### Process Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Large number of dependencies increases install time | Low | Accept as necessary for modern stack |
| Configuration complexity overwhelming | Medium | Document each step, create checklists |
| Unused components bloating bundle size | Low | Tree-shaking handles this, can optimize later |

---

## Success Validation

### Automated Checks
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] `npm run lint` passes with no warnings
- [ ] `npm run type-check` passes
- [ ] All 14 shadcn components import successfully

### Manual Checks
- [ ] Primary color (#3ABEFF cyan) displays correctly
- [ ] Inter font loads properly
- [ ] API service injects Authorization header
- [ ] 401 response triggers logout and redirect
- [ ] Auth state persists across page refresh
- [ ] TypeScript autocomplete works in VSCode
- [ ] Hot reload completes within 2 seconds

### Acceptance Criteria Met
- [ ] All 7 user stories have passing acceptance scenarios
- [ ] All 15 functional requirements are implemented
- [ ] All 8 success criteria are achieved
- [ ] All identified edge cases are handled

---

## Dependencies

### External Dependencies
- ✅ Backend API at `https://naimalcreativityai-sdd-todo-app.hf.space/` must be operational
- ✅ Design specification in `frontend/FIGMA_DESIGN_SPEC.md` must be accurate
- ✅ Shared `BETTER_AUTH_SECRET` must match between frontend and backend

### Internal Dependencies
- None - This is a foundational feature

---

## Next Steps

After completing this setup, the following features can be implemented:
1. Landing page with hero and call-to-action
2. Authentication pages (login, register)
3. Dashboard with task list
4. Task CRUD operations
5. Task filtering and sorting

---

## Implementation Notes

### Key Decisions
1. **Cookie-based token storage**: More secure than localStorage, prevents XSS attacks
2. **Singleton API service**: Ensures consistent request/response handling across app
3. **Zustand over Redux**: Simpler API, less boilerplate, sufficient for this app's complexity
4. **TanStack Query for server state**: Industry standard, excellent caching and refetching
5. **shadcn/ui over other libraries**: Copy-paste approach gives full control, excellent accessibility
6. **Tailwind v4 (@next)**: Latest features, better performance, aligns with modern practices

### Testing Strategy
- This is a setup feature, so testing focuses on:
  - Verifying all dependencies install correctly
  - Ensuring configuration files are valid
  - Testing that all services/stores work in isolation
  - End-to-end verification with a test page

### Rollback Plan
If issues arise:
1. Check `package-lock.json` for dependency conflicts
2. Verify environment variables are set correctly
3. Clear `.next` cache and `node_modules`, reinstall
4. Roll back to previous commit if configuration is broken

---

**Plan Created**: 2025-12-13
**Plan Status**: Ready for Implementation
**Estimated Implementation Time**: 4-6 hours
**Complexity**: Medium (Configuration-heavy)
