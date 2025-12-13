# Implementation Tasks: Frontend Project Setup

**Feature Branch**: `004-frontend-setup`
**Created**: 2025-12-13
**Status**: Ready for Development
**Plan Reference**: [plan.md](./plan.md)

---

## Task Overview

This document contains actionable, scalable tasks derived from the implementation plan. Each task is:
- ✅ **Independent**: Can be completed without waiting for other tasks (where possible)
- ✅ **Testable**: Has clear acceptance criteria
- ✅ **Scoped**: Can be completed in 30-60 minutes
- ✅ **Documented**: Includes validation steps

---

## Task Categories

### 🔧 Setup Tasks (TASK-001 to TASK-004)
Core project initialization and configuration

### 🎨 Design & Styling Tasks (TASK-005 to TASK-008)
Tailwind CSS setup and design token configuration

### 🧩 Component Library Tasks (TASK-009 to TASK-012)
shadcn/ui installation and configuration

### 📦 State & Data Tasks (TASK-013 to TASK-016)
State management and API integration

### 🛠️ Utilities & Tools Tasks (TASK-017 to TASK-020)
TypeScript types, date utilities, and development tooling

### ✅ Verification Tasks (TASK-021 to TASK-022)
Testing and validation

---

## TASK-001: Initialize Next.js 16+ Project with TypeScript

**Priority**: P0 (Blocker - Must complete first)
**Estimated Time**: 30 minutes
**Depends On**: None

### Description
Bootstrap a new Next.js 16+ project with TypeScript configuration and App Router enabled. This is the foundation for all subsequent tasks.

### Steps
1. Navigate to `frontend/` directory
2. Verify Node.js 18+ is installed: `node --version`
3. Initialize Next.js project:
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
   ```
   - Answer prompts:
     - TypeScript: Yes
     - ESLint: Yes
     - Tailwind CSS: Yes
     - `src/` directory: Yes
     - App Router: Yes
     - Import alias: @/*

4. Verify initial setup:
   ```bash
   npm run dev
   ```

### Acceptance Criteria
- [ ] Next.js project initializes without errors
- [ ] `package.json` contains Next.js 16+ as dependency
- [ ] `tsconfig.json` exists with proper configuration
- [ ] `src/app/` directory exists with App Router structure
- [ ] Development server starts on `http://localhost:3000`
- [ ] Default Next.js page loads successfully

### Validation
```bash
# Check Node version
node --version  # Should be 18+

# Start dev server
npm run dev

# Visit http://localhost:3000 - should see Next.js welcome page
```

### Deliverables
- ✅ Working Next.js 16+ project
- ✅ `package.json` with core dependencies
- ✅ `tsconfig.json` with TypeScript configuration
- ✅ `.gitignore` with proper exclusions

---

## TASK-002: Configure Project Structure and Path Aliases

**Priority**: P0 (Blocker)
**Estimated Time**: 20 minutes
**Depends On**: TASK-001

### Description
Create the recommended folder structure and configure TypeScript path aliases for clean imports.

### Steps
1. Create directory structure inside `src/`:
   ```bash
   cd frontend
   mkdir -p src/components/ui
   mkdir -p src/components/features
   mkdir -p src/components/layout
   mkdir -p src/lib
   mkdir -p src/hooks
   mkdir -p src/types
   mkdir -p src/store
   mkdir -p src/services
   mkdir -p src/constants
   ```

2. Update `tsconfig.json` to add path aliases:
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

3. Create a test file to verify path aliases work:
   - Create `src/lib/test-utils.ts` with a simple export
   - Import it in `src/app/page.tsx` using `@/lib/test-utils`
   - Verify no TypeScript errors

### Acceptance Criteria
- [ ] All 8 directories exist in `src/`
- [ ] `tsconfig.json` includes all path aliases
- [ ] Path aliases resolve correctly (no TS errors)
- [ ] VSCode/IDE provides autocomplete for aliases

### Validation
```bash
# Verify directory structure
ls -la src/

# Should see: app, components, lib, hooks, types, store, services, constants

# Type check
npx tsc --noEmit  # Should pass
```

### Deliverables
- ✅ Complete folder structure
- ✅ Updated `tsconfig.json` with path aliases
- ✅ Working path alias imports

---

## TASK-003: Configure Environment Variables

**Priority**: P0 (Blocker)
**Estimated Time**: 15 minutes
**Depends On**: TASK-001

### Description
Set up environment variables for local development and create example file for documentation.

### Steps
1. Create `.env.local` in frontend root:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=https://naimalcreativityai-sdd-todo-app.hf.space

   # Authentication
   BETTER_AUTH_SECRET=your-shared-secret-key-here
   BETTER_AUTH_URL=http://localhost:3000

   # Environment
   NODE_ENV=development
   ```

2. Create `.env.example` for documentation:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=https://your-backend-api-url.com

   # Authentication (must match backend secret)
   BETTER_AUTH_SECRET=your-shared-secret-key-here
   BETTER_AUTH_URL=http://localhost:3000

   # Environment
   NODE_ENV=development
   ```

3. Verify `.env.local` is in `.gitignore`

4. Create `src/lib/env.ts` for type-safe env access:
   ```typescript
   export const env = {
     apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
     authSecret: process.env.BETTER_AUTH_SECRET || '',
     authUrl: process.env.BETTER_AUTH_URL || '',
     isDev: process.env.NODE_ENV === 'development',
   };
   ```

### Acceptance Criteria
- [ ] `.env.local` exists and is not committed to git
- [ ] `.env.example` exists for documentation
- [ ] Environment variables are accessible in code
- [ ] Type-safe env helper exists

### Validation
```typescript
// Test in src/app/page.tsx
import { env } from '@/lib/env';
console.log(env.apiUrl); // Should log the API URL
```

### Deliverables
- ✅ `.env.local` with all required variables
- ✅ `.env.example` for documentation
- ✅ `src/lib/env.ts` for type-safe access

---

## TASK-004: Install Core Dependencies

**Priority**: P0 (Blocker)
**Estimated Time**: 15 minutes
**Depends On**: TASK-001

### Description
Install all npm packages required for the project. This can be done in parallel with TASK-002 and TASK-003.

### Steps
1. Install state management:
   ```bash
   npm install zustand @tanstack/react-query @tanstack/react-query-devtools
   ```

2. Install HTTP client and utilities:
   ```bash
   npm install axios js-cookie jwt-decode
   npm install -D @types/js-cookie
   ```

3. Install form libraries:
   ```bash
   npm install react-hook-form @hookform/resolvers zod
   ```

4. Install animation library:
   ```bash
   npm install framer-motion
   ```

5. Install icon library:
   ```bash
   npm install lucide-react
   ```

6. Install date utilities:
   ```bash
   npm install date-fns
   ```

7. Install authentication:
   ```bash
   npm install better-auth
   ```

8. Verify installation:
   ```bash
   npm list --depth=0
   ```

### Acceptance Criteria
- [ ] All packages are in `package.json` dependencies
- [ ] `package-lock.json` is updated
- [ ] No installation errors or warnings
- [ ] All packages can be imported without errors

### Validation
```bash
# Check installed packages
npm list zustand axios react-hook-form framer-motion date-fns

# Should show all installed versions
```

### Deliverables
- ✅ Updated `package.json` with all dependencies
- ✅ Updated `package-lock.json`
- ✅ All packages successfully installed

---

## TASK-005: Configure Tailwind CSS with Design Tokens

**Priority**: P1 (High)
**Estimated Time**: 45 minutes
**Depends On**: TASK-001

### Description
Configure Tailwind CSS with TaskFlow design tokens including color palette, typography, and spacing system.

### Steps
1. Update `tailwind.config.ts` with custom theme:
   ```typescript
   import type { Config } from 'tailwindcss';

   const config: Config = {
     content: [
       './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
       './src/components/**/*.{js,ts,jsx,tsx,mdx}',
       './src/app/**/*.{js,ts,jsx,tsx,mdx}',
     ],
     theme: {
       extend: {
         colors: {
           primary: {
             50: '#F5FCFF',
             100: '#E6F7FF',
             200: '#CCEFFF',
             300: '#99DFFF',
             400: '#66CFFF',
             500: '#3ABEFF', // Main brand color
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
             500: '#FF6767', // Main error/danger color
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
         },
         fontFamily: {
           sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
         },
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
         },
         spacing: {
           // 4px baseline grid
           0.5: '2px',
           1: '4px',
           2: '8px',
           3: '12px',
           4: '16px',
           5: '20px',
           6: '24px',
           8: '32px',
           10: '40px',
           12: '48px',
           16: '64px',
           20: '80px',
           24: '96px',
         },
       },
     },
     plugins: [],
   };

   export default config;
   ```

2. Configure Inter font in `src/app/layout.tsx`:
   ```typescript
   import { Inter } from 'next/font/google';
   import './globals.css';

   const inter = Inter({
     subsets: ['latin'],
     variable: '--font-inter',
   });

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode;
   }) {
     return (
       <html lang="en" className={inter.variable}>
         <body className={inter.className}>{children}</body>
       </html>
     );
   }
   ```

3. Update `src/app/globals.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   @layer base {
     :root {
       --background: 0 0% 100%;
       --foreground: 240 10% 3.9%;
     }
   }
   ```

### Acceptance Criteria
- [ ] Tailwind config includes all design tokens
- [ ] Primary color `bg-primary-500` renders as #3ABEFF (cyan)
- [ ] Danger color `bg-danger-500` renders as #FF6767 (red/coral)
- [ ] Neutral colors include custom values (#F8F8FB, #F8F8F8, #F5F8FF, #A1A3AB)
- [ ] Inter font loads and displays correctly
- [ ] Type scale from 12px to 48px is available
- [ ] 4px baseline grid spacing works

### Validation
```typescript
// Create test component in src/app/page.tsx
export default function TestPage() {
  return (
    <div className="p-4 bg-neutral-50">
      <h1 className="text-5xl font-bold text-primary-500">Primary Color (Cyan)</h1>
      <h2 className="text-3xl text-danger-500">Danger Color (Red)</h2>
      <p className="text-base text-neutral-500">Body text with Inter font</p>
      <div className="mt-4 space-y-2">
        <div className="h-12 bg-primary-500"></div>
        <div className="h-12 bg-danger-500"></div>
        <div className="h-12 bg-neutral-100"></div>
      </div>
    </div>
  );
}
```

### Deliverables
- ✅ Updated `tailwind.config.ts` with design tokens
- ✅ Inter font configured in `src/app/layout.tsx`
- ✅ Updated `src/app/globals.css`

---

## TASK-006: Install Tailwind Animation Utilities

**Priority**: P2 (Medium)
**Estimated Time**: 15 minutes
**Depends On**: TASK-005

### Description
Install and configure tailwindcss-animate for animation utilities.

### Steps
1. Install dependency:
   ```bash
   npm install tailwindcss-animate
   ```

2. Add plugin to `tailwind.config.ts`:
   ```typescript
   import tailwindAnimate from 'tailwindcss-animate';

   const config: Config = {
     // ... existing config
     plugins: [tailwindAnimate],
   };
   ```

3. Test animations work:
   ```typescript
   // Test component
   <div className="animate-in fade-in duration-500">
     Fade in animation
   </div>
   ```

### Acceptance Criteria
- [ ] `tailwindcss-animate` is installed
- [ ] Plugin is added to Tailwind config
- [ ] Animation classes work in components

### Validation
```bash
# Verify installation
npm list tailwindcss-animate
```

### Deliverables
- ✅ `tailwindcss-animate` installed and configured

---

## TASK-007: Install and Configure shadcn/ui

**Priority**: P1 (High)
**Estimated Time**: 30 minutes
**Depends On**: TASK-005

### Description
Initialize shadcn/ui and configure for the project.

### Steps
1. Initialize shadcn/ui:
   ```bash
   npx shadcn@latest init
   ```
   Configuration options:
   - Style: Default
   - Base color: Slate
   - CSS variables: Yes
   - Tailwind config: Yes (tailwind.config.ts)
   - Import alias: @/components
   - React Server Components: Yes

2. Verify `components.json` is created

3. Install utility libraries (if not auto-installed):
   ```bash
   npm install class-variance-authority clsx tailwind-merge
   ```

4. Verify `src/lib/utils.ts` exists (auto-created):
   ```typescript
   import { type ClassValue, clsx } from 'clsx';
   import { twMerge } from 'tailwind-merge';

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```

### Acceptance Criteria
- [ ] `components.json` exists with correct configuration
- [ ] Utility libraries are installed
- [ ] `src/lib/utils.ts` exists with `cn` helper
- [ ] `src/components/ui/` directory is created

### Validation
```bash
# Verify components.json
cat components.json

# Should show configuration with aliases and paths
```

### Deliverables
- ✅ shadcn/ui initialized
- ✅ `components.json` configuration file
- ✅ `src/lib/utils.ts` with helper functions

---

## TASK-008: Install shadcn/ui Components (Batch 1)

**Priority**: P1 (High)
**Estimated Time**: 20 minutes
**Depends On**: TASK-007

### Description
Install the first batch of shadcn/ui components: Button, Input, Label, Card.

### Steps
1. Install components:
   ```bash
   npx shadcn@latest add button input label card
   ```

2. Verify components are in `src/components/ui/`

3. Test each component:
   ```typescript
   // src/app/test/page.tsx
   import { Button } from '@/components/ui/button';
   import { Input } from '@/components/ui/input';
   import { Label } from '@/components/ui/label';
   import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

   export default function TestPage() {
     return (
       <div className="p-8 space-y-4">
         <Button>Click me</Button>
         <div>
           <Label htmlFor="email">Email</Label>
           <Input id="email" type="email" />
         </div>
         <Card>
           <CardHeader>
             <CardTitle>Card Title</CardTitle>
           </CardHeader>
           <CardContent>
             <p>Card content</p>
           </CardContent>
         </Card>
       </div>
     );
   }
   ```

### Acceptance Criteria
- [ ] 4 components installed in `src/components/ui/`
- [ ] Each component imports without errors
- [ ] Components render with correct styling
- [ ] Component variants work (e.g., Button variants)

### Validation
```bash
# Verify components exist
ls src/components/ui/

# Should see: button.tsx, input.tsx, label.tsx, card.tsx
```

### Deliverables
- ✅ Button component
- ✅ Input component
- ✅ Label component
- ✅ Card component

---

## TASK-009: Install shadcn/ui Components (Batch 2)

**Priority**: P1 (High)
**Estimated Time**: 20 minutes
**Depends On**: TASK-007

### Description
Install the second batch of shadcn/ui components: Dialog, Dropdown Menu, Select, Checkbox.

### Steps
1. Install components:
   ```bash
   npx shadcn@latest add dialog dropdown-menu select checkbox
   ```

2. Verify Radix UI dependencies are installed:
   - @radix-ui/react-dialog
   - @radix-ui/react-dropdown-menu
   - @radix-ui/react-select
   - @radix-ui/react-checkbox

3. Test components render correctly

### Acceptance Criteria
- [ ] 4 components installed in `src/components/ui/`
- [ ] Radix UI primitives are installed
- [ ] Each component imports without errors

### Validation
```bash
# Verify components
ls src/components/ui/ | grep -E "(dialog|dropdown|select|checkbox)"
```

### Deliverables
- ✅ Dialog component
- ✅ Dropdown Menu component
- ✅ Select component
- ✅ Checkbox component

---

## TASK-010: Install shadcn/ui Components (Batch 3)

**Priority**: P2 (Medium)
**Estimated Time**: 20 minutes
**Depends On**: TASK-007

### Description
Install the third batch of shadcn/ui components: Radio Group, Tabs, Toast, Form.

### Steps
1. Install components:
   ```bash
   npx shadcn@latest add radio-group tabs toast form
   ```

2. Verify Radix UI dependencies

3. Configure Toast provider in layout:
   ```typescript
   // src/app/layout.tsx
   import { Toaster } from '@/components/ui/toaster';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Toaster />
         </body>
       </html>
     );
   }
   ```

4. Verify `src/hooks/use-toast.ts` is created

### Acceptance Criteria
- [ ] 4 components installed
- [ ] Toast provider added to layout
- [ ] Form component works with react-hook-form
- [ ] `use-toast` hook is available

### Validation
```bash
# Verify components
ls src/components/ui/ | grep -E "(radio|tabs|toast|form)"
```

### Deliverables
- ✅ Radio Group component
- ✅ Tabs component
- ✅ Toast component with provider
- ✅ Form component
- ✅ `use-toast` hook

---

## TASK-011: Install shadcn/ui Components (Batch 4)

**Priority**: P2 (Medium)
**Estimated Time**: 15 minutes
**Depends On**: TASK-007

### Description
Install the final batch of shadcn/ui components: Avatar, Badge, Skeleton.

### Steps
1. Install components:
   ```bash
   npx shadcn@latest add avatar badge skeleton
   ```

2. Test each component

### Acceptance Criteria
- [ ] 3 components installed
- [ ] All 14 total shadcn components are available

### Validation
```bash
# Count components
ls src/components/ui/*.tsx | wc -l

# Should be 14+ files (including utilities like sonner, toaster)
```

### Deliverables
- ✅ Avatar component
- ✅ Badge component
- ✅ Skeleton component
- ✅ Complete shadcn/ui component library (14 components)

---

## TASK-012: Install Icon Library

**Priority**: P2 (Medium)
**Estimated Time**: 10 minutes
**Depends On**: TASK-004

### Description
Install lucide-react icon library and create icon re-export file.

### Steps
1. Verify lucide-react is installed (from TASK-004):
   ```bash
   npm list lucide-react
   ```

2. Create `src/components/ui/icons.ts`:
   ```typescript
   export {
     Check,
     X,
     Plus,
     Minus,
     ChevronDown,
     ChevronUp,
     ChevronLeft,
     ChevronRight,
     Search,
     User,
     Mail,
     Lock,
     LogOut,
     Settings,
     Trash,
     Edit,
     MoreVertical,
     Calendar,
     Clock,
     AlertCircle,
     CheckCircle,
     XCircle,
     Info,
     Loader2,
   } from 'lucide-react';
   ```

3. Test icons:
   ```typescript
   import { Check, User } from '@/components/ui/icons';

   <Check className="h-4 w-4" />
   <User className="h-6 w-6 text-primary-500" />
   ```

### Acceptance Criteria
- [ ] lucide-react is installed
- [ ] Icon re-export file exists
- [ ] Icons render correctly with className props

### Validation
```typescript
// Test in component
import { Check } from '@/components/ui/icons';
```

### Deliverables
- ✅ `src/components/ui/icons.ts` with commonly used icons

---

## TASK-013: Create Authentication Store (Zustand)

**Priority**: P1 (High)
**Estimated Time**: 45 minutes
**Depends On**: TASK-004

### Description
Create Zustand store for authentication state management with cookie persistence.

### Steps
1. Create `src/store/auth-store.ts`:
   ```typescript
   import { create } from 'zustand';
   import { persist } from 'zustand/middleware';
   import Cookies from 'js-cookie';

   export interface User {
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
     updateUser: (user: Partial<User>) => void;
   }

   export const useAuthStore = create<AuthState>()(
     persist(
       (set, get) => ({
         user: null,
         token: null,
         isAuthenticated: false,

         setAuth: (user, token) => {
           Cookies.set('auth_token', token, { expires: 7, sameSite: 'strict' });
           set({ user, token, isAuthenticated: true });
         },

         clearAuth: () => {
           Cookies.remove('auth_token');
           set({ user: null, token: null, isAuthenticated: false });
         },

         restoreAuth: () => {
           const token = Cookies.get('auth_token');
           if (token) {
             // Token exists, set authenticated state
             // User info will be fetched by a separate API call
             set({ token, isAuthenticated: true });
           }
         },

         updateUser: (userData) => {
           const currentUser = get().user;
           if (currentUser) {
             set({ user: { ...currentUser, ...userData } });
           }
         },
       }),
       {
         name: 'auth-storage',
         partialize: (state) => ({ user: state.user }), // Only persist user, not token
       }
     )
   );
   ```

2. Create initialization hook in `src/hooks/use-auth-init.ts`:
   ```typescript
   'use client';

   import { useEffect } from 'react';
   import { useAuthStore } from '@/store/auth-store';

   export function useAuthInit() {
     useEffect(() => {
       useAuthStore.getState().restoreAuth();
     }, []);
   }
   ```

3. Update root layout to use initialization hook:
   ```typescript
   // src/app/layout.tsx
   'use client';
   import { useAuthInit } from '@/hooks/use-auth-init';

   function LayoutContent({ children }: { children: React.ReactNode }) {
     useAuthInit();
     return children;
   }

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <LayoutContent>{children}</LayoutContent>
         </body>
       </html>
     );
   }
   ```

### Acceptance Criteria
- [ ] Auth store exports all required methods
- [ ] Token is stored in cookies (not localStorage)
- [ ] State persists across page refreshes
- [ ] `clearAuth` removes token and user data
- [ ] TypeScript types are properly defined

### Validation
```typescript
// Test in component
const { setAuth, clearAuth, user } = useAuthStore();

// Set auth
setAuth({ id: 1, email: 'test@example.com', name: 'Test', created_at: new Date().toISOString() }, 'fake-token');

// Refresh page - state should persist

// Clear auth
clearAuth();
```

### Deliverables
- ✅ `src/store/auth-store.ts` with Zustand store
- ✅ `src/hooks/use-auth-init.ts` for initialization
- ✅ Cookie-based token persistence

---

## TASK-014: Configure TanStack Query Provider

**Priority**: P1 (High)
**Estimated Time**: 30 minutes
**Depends On**: TASK-004

### Description
Set up TanStack Query for server state management with proper configuration.

### Steps
1. Create `src/lib/query-client.ts`:
   ```typescript
   import { QueryClient } from '@tanstack/react-query';

   export const queryClient = new QueryClient({
     defaultOptions: {
       queries: {
         staleTime: 60 * 1000, // 1 minute
         gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
         retry: 1,
         refetchOnWindowFocus: false,
       },
       mutations: {
         retry: 0,
       },
     },
   });
   ```

2. Create provider component `src/components/providers/query-provider.tsx`:
   ```typescript
   'use client';

   import { QueryClientProvider } from '@tanstack/react-query';
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
   import { queryClient } from '@/lib/query-client';
   import { ReactNode } from 'react';

   export function QueryProvider({ children }: { children: ReactNode }) {
     return (
       <QueryClientProvider client={queryClient}>
         {children}
         <ReactQueryDevtools initialIsOpen={false} />
       </QueryClientProvider>
     );
   }
   ```

3. Wrap app in provider (`src/app/layout.tsx`):
   ```typescript
   import { QueryProvider } from '@/components/providers/query-provider';

   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           <QueryProvider>
             {children}
           </QueryProvider>
         </body>
       </html>
     );
   }
   ```

### Acceptance Criteria
- [ ] QueryClient is configured with sensible defaults
- [ ] Provider wraps the entire app
- [ ] DevTools are available in development mode
- [ ] No hydration errors occur

### Validation
```bash
# Start dev server and check browser console
# Should see React Query DevTools button in bottom-right corner
```

### Deliverables
- ✅ `src/lib/query-client.ts` with QueryClient
- ✅ `src/components/providers/query-provider.tsx`
- ✅ Provider integrated in root layout

---

## TASK-015: Create Singleton API Service

**Priority**: P1 (High - Critical for backend integration)
**Estimated Time**: 60 minutes
**Depends On**: TASK-004, TASK-013

### Description
Create singleton Axios service with request/response interceptors for JWT token injection and error handling.

### Steps
1. Create `src/services/api.ts`:
   ```typescript
   import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
   import Cookies from 'js-cookie';
   import { useAuthStore } from '@/store/auth-store';
   import { env } from '@/lib/env';

   class ApiService {
     private static instance: ApiService;
     private axiosInstance: AxiosInstance;

     private constructor() {
       this.axiosInstance = axios.create({
         baseURL: env.apiUrl,
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
         (error) => {
           return Promise.reject(error);
         }
       );

       // Response interceptor - handle errors globally
       this.axiosInstance.interceptors.response.use(
         (response) => response,
         (error: AxiosError) => {
           // Handle 401 Unauthorized
           if (error.response?.status === 401) {
             useAuthStore.getState().clearAuth();
             if (typeof window !== 'undefined') {
               window.location.href = '/login';
             }
           }

           // Handle 403 Forbidden
           if (error.response?.status === 403) {
             console.error('Access forbidden:', error.response.data);
           }

           // Handle 500 Server Error
           if (error.response?.status === 500) {
             console.error('Server error:', error.response.data);
           }

           return Promise.reject(error);
         }
       );
     }

     public getAxios(): AxiosInstance {
       return this.axiosInstance;
     }
   }

   // Export singleton instance
   export const api = ApiService.getInstance().getAxios();
   ```

2. Create API helper methods `src/lib/api-client.ts`:
   ```typescript
   import { api } from '@/services/api';
   import type { User, Task } from '@/types';

   // Auth endpoints
   export const authApi = {
     register: async (data: { email: string; password: string; name: string }) => {
       const response = await api.post<{ user: User; token: string }>('/auth/register', data);
       return response.data;
     },

     login: async (data: { email: string; password: string }) => {
       const response = await api.post<{ user: User; token: string }>('/auth/login', data);
       return response.data;
     },

     logout: async () => {
       const response = await api.post('/auth/logout');
       return response.data;
     },

     getCurrentUser: async () => {
       const response = await api.get<{ user: User }>('/auth/me');
       return response.data;
     },
   };

   // Task endpoints
   export const tasksApi = {
     getTasks: async (params?: { status?: string; priority?: string }) => {
       const response = await api.get<{ tasks: Task[] }>('/api/tasks', { params });
       return response.data;
     },

     getTask: async (id: number) => {
       const response = await api.get<{ task: Task }>(`/api/tasks/${id}`);
       return response.data;
     },

     createTask: async (data: Partial<Task>) => {
       const response = await api.post<{ task: Task }>('/api/tasks', data);
       return response.data;
     },

     updateTask: async (id: number, data: Partial<Task>) => {
       const response = await api.put<{ task: Task }>(`/api/tasks/${id}`, data);
       return response.data;
     },

     deleteTask: async (id: number) => {
       const response = await api.delete(`/api/tasks/${id}`);
       return response.data;
     },
   };
   ```

### Acceptance Criteria
- [ ] API service is a true singleton
- [ ] Request interceptor adds Authorization header when token exists
- [ ] Response interceptor catches 401 and redirects to login
- [ ] All API helper methods are typed correctly
- [ ] Service uses environment variable for base URL

### Validation
```typescript
// Test in component
import { api } from '@/services/api';
import { tasksApi } from '@/lib/api-client';

// Direct usage
const response = await api.get('/api/tasks');

// Using helper
const data = await tasksApi.getTasks();
```

### Deliverables
- ✅ `src/services/api.ts` with singleton ApiService
- ✅ `src/lib/api-client.ts` with typed API methods
- ✅ Request/response interceptors working

---

## TASK-016: Define TypeScript Type Definitions

**Priority**: P1 (High)
**Estimated Time**: 30 minutes
**Depends On**: TASK-001

### Description
Create comprehensive TypeScript type definitions for entities, API responses, and forms.

### Steps
1. Create `src/types/entities.ts`:
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

2. Create `src/types/api.ts`:
   ```typescript
   export interface ApiResponse<T = any> {
     data: T;
     error: string | null;
     status: number;
   }

   export interface ApiError {
     message: string;
     code?: string;
     details?: Record<string, any>;
   }

   export interface PaginatedResponse<T> {
     data: T[];
     total: number;
     page: number;
     per_page: number;
     total_pages: number;
   }

   export interface ApiSuccessResponse<T> {
     success: true;
     data: T;
   }

   export interface ApiErrorResponse {
     success: false;
     error: ApiError;
   }
   ```

3. Create `src/types/forms.ts`:
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

   export interface UpdateTaskFormData extends Partial<TaskFormData> {}
   ```

4. Create `src/types/utils.ts`:
   ```typescript
   export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
   export type Nullable<T> = T | null;
   export type AsyncData<T> = {
     data: T | null;
     loading: boolean;
     error: Error | null;
   };
   export type DeepPartial<T> = {
     [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
   };
   ```

5. Create barrel export `src/types/index.ts`:
   ```typescript
   export * from './entities';
   export * from './api';
   export * from './forms';
   export * from './utils';
   ```

### Acceptance Criteria
- [ ] All entity types are defined
- [ ] API response types are comprehensive
- [ ] Form types are derived from entities
- [ ] Utility types are reusable
- [ ] Barrel export allows `import { User } from '@/types'`

### Validation
```typescript
// Test type checking
import { User, Task, ApiResponse } from '@/types';

const user: User = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  created_at: new Date().toISOString(),
};

const task: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Description',
  status: 'pending', // Should autocomplete: pending | in_progress | completed
  priority: 'high', // Should autocomplete: low | medium | high
  user_id: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};
```

### Deliverables
- ✅ `src/types/entities.ts`
- ✅ `src/types/api.ts`
- ✅ `src/types/forms.ts`
- ✅ `src/types/utils.ts`
- ✅ `src/types/index.ts` (barrel export)

---

## TASK-017: Create Date Utility Functions

**Priority**: P2 (Medium)
**Estimated Time**: 20 minutes
**Depends On**: TASK-004

### Description
Create utility functions for date formatting using date-fns.

### Steps
1. Create `src/lib/date-utils.ts`:
   ```typescript
   import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

   /**
    * Format a date as "MMM d, yyyy" (e.g., "Dec 13, 2025")
    */
   export function formatDate(date: string | Date): string {
     const dateObj = typeof date === 'string' ? parseISO(date) : date;
     if (!isValid(dateObj)) return 'Invalid date';
     return format(dateObj, 'MMM d, yyyy');
   }

   /**
    * Format a date with time as "MMM d, yyyy h:mm a" (e.g., "Dec 13, 2025 3:45 PM")
    */
   export function formatDateTime(date: string | Date): string {
     const dateObj = typeof date === 'string' ? parseISO(date) : date;
     if (!isValid(dateObj)) return 'Invalid date';
     return format(dateObj, 'MMM d, yyyy h:mm a');
   }

   /**
    * Format a date as relative time (e.g., "2 hours ago", "in 3 days")
    */
   export function formatRelativeTime(date: string | Date): string {
     const dateObj = typeof date === 'string' ? parseISO(date) : date;
     if (!isValid(dateObj)) return 'Invalid date';
     return formatDistanceToNow(dateObj, { addSuffix: true });
   }

   /**
    * Format date for input[type="date"] (YYYY-MM-DD)
    */
   export function formatInputDate(date: string | Date): string {
     const dateObj = typeof date === 'string' ? parseISO(date) : date;
     if (!isValid(dateObj)) return '';
     return format(dateObj, 'yyyy-MM-dd');
   }
   ```

### Acceptance Criteria
- [ ] All date formatting functions work correctly
- [ ] Invalid dates are handled gracefully
- [ ] Functions accept both string and Date objects

### Validation
```typescript
import { formatDate, formatRelativeTime } from '@/lib/date-utils';

console.log(formatDate('2025-12-13T10:30:00Z')); // Dec 13, 2025
console.log(formatRelativeTime('2025-12-13T10:30:00Z')); // X hours ago
```

### Deliverables
- ✅ `src/lib/date-utils.ts` with date formatting functions

---

## TASK-018: Configure ESLint and Prettier

**Priority**: P2 (Medium)
**Estimated Time**: 30 minutes
**Depends On**: TASK-001

### Description
Set up code quality tools for consistent code formatting and linting.

### Steps
1. Install Prettier and plugins:
   ```bash
   npm install -D prettier prettier-plugin-tailwindcss
   ```

2. Install TypeScript ESLint:
   ```bash
   npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
   ```

3. Create `.prettierrc`:
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

4. Create `.prettierignore`:
   ```
   .next
   node_modules
   build
   dist
   coverage
   public
   *.lock
   ```

5. Update `.eslintrc.json`:
   ```json
   {
     "extends": [
       "next/core-web-vitals",
       "plugin:@typescript-eslint/recommended"
     ],
     "parser": "@typescript-eslint/parser",
     "plugins": ["@typescript-eslint"],
     "rules": {
       "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
       "@typescript-eslint/no-explicit-any": "warn",
       "@typescript-eslint/no-non-null-assertion": "warn"
     }
   }
   ```

6. Add scripts to `package.json`:
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

### Acceptance Criteria
- [ ] Prettier formats code correctly
- [ ] ESLint catches TypeScript issues
- [ ] Tailwind classes are automatically sorted
- [ ] Scripts run without errors

### Validation
```bash
# Format code
npm run format

# Check formatting
npm run format:check

# Run linter
npm run lint

# Type check
npm run type-check
```

### Deliverables
- ✅ `.prettierrc` configuration
- ✅ `.prettierignore` file
- ✅ Updated `.eslintrc.json`
- ✅ Scripts in `package.json`

---

## TASK-019: Create Animation Utilities

**Priority**: P2 (Medium)
**Estimated Time**: 30 minutes
**Depends On**: TASK-004

### Description
Create reusable animation presets using Framer Motion.

### Steps
1. Create `src/lib/animations.ts`:
   ```typescript
   import { Variants } from 'framer-motion';

   /**
    * Fade in animation
    */
   export const fadeIn: Variants = {
     hidden: { opacity: 0 },
     visible: { opacity: 1 },
   };

   /**
    * Fade in and slide up
    */
   export const fadeInUp: Variants = {
     hidden: { opacity: 0, y: 20 },
     visible: { opacity: 1, y: 0 },
   };

   /**
    * Fade in and slide down
    */
   export const fadeInDown: Variants = {
     hidden: { opacity: 0, y: -20 },
     visible: { opacity: 1, y: 0 },
   };

   /**
    * Scale up animation
    */
   export const scaleIn: Variants = {
     hidden: { opacity: 0, scale: 0.95 },
     visible: { opacity: 1, scale: 1 },
   };

   /**
    * Stagger children animation
    */
   export const staggerContainer: Variants = {
     hidden: { opacity: 0 },
     visible: {
       opacity: 1,
       transition: {
         staggerChildren: 0.1,
       },
     },
   };

   /**
    * Page transition animations
    */
   export const pageTransition = {
     type: 'tween',
     ease: 'anticipate',
     duration: 0.5,
   };
   ```

2. Create example usage documentation in comments

### Acceptance Criteria
- [ ] Animation variants are properly typed
- [ ] Animations work with Framer Motion components
- [ ] Presets are reusable across the app

### Validation
```typescript
'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';

export function TestComponent() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      This will fade in and slide up
    </motion.div>
  );
}
```

### Deliverables
- ✅ `src/lib/animations.ts` with reusable animation presets

---

## TASK-020: Update Documentation

**Priority**: P2 (Medium)
**Estimated Time**: 45 minutes
**Depends On**: All previous tasks

### Description
Create comprehensive documentation for the frontend setup.

### Steps
1. Create/Update `frontend/README.md`:
   ```markdown
   # Frontend - Todo App

   Modern Next.js 16+ application with TypeScript, Tailwind CSS, and shadcn/ui.

   ## Tech Stack

   - **Framework**: Next.js 16+ (App Router)
   - **Language**: TypeScript 5+
   - **Styling**: Tailwind CSS v4
   - **UI Components**: shadcn/ui (Radix UI primitives)
   - **State Management**: Zustand (client) + TanStack Query (server)
   - **Forms**: React Hook Form + Zod
   - **HTTP Client**: Axios
   - **Animations**: Framer Motion
   - **Icons**: Lucide React
   - **Date Utilities**: date-fns

   ## Getting Started

   ### Prerequisites
   - Node.js 18+
   - npm or pnpm

   ### Installation

   1. Install dependencies:
      ```bash
      npm install
      ```

   2. Configure environment variables:
      ```bash
      cp .env.example .env.local
      ```
      Update `NEXT_PUBLIC_API_URL` and `BETTER_AUTH_SECRET`

   3. Start development server:
      ```bash
      npm run dev
      ```

   4. Open http://localhost:3000

   ## Project Structure

   ```
   frontend/
   ├── src/
   │   ├── app/              # Next.js App Router pages
   │   ├── components/
   │   │   ├── ui/          # shadcn/ui components
   │   │   ├── features/    # Feature-specific components
   │   │   ├── layout/      # Layout components
   │   │   └── providers/   # Context providers
   │   ├── lib/             # Utilities and API client
   │   ├── hooks/           # Custom React hooks
   │   ├── types/           # TypeScript type definitions
   │   ├── store/           # Zustand stores
   │   ├── services/        # API service layer
   │   └── constants/       # App constants
   └── public/              # Static assets
   ```

   ## Available Scripts

   - `npm run dev` - Start development server
   - `npm run build` - Build for production
   - `npm run start` - Start production server
   - `npm run lint` - Run ESLint
   - `npm run format` - Format code with Prettier
   - `npm run type-check` - TypeScript type checking

   ## Environment Variables

   | Variable | Description | Example |
   |----------|-------------|---------|
   | NEXT_PUBLIC_API_URL | Backend API URL | https://api.example.com |
   | BETTER_AUTH_SECRET | Shared auth secret | your-secret-key |
   | BETTER_AUTH_URL | Frontend URL | http://localhost:3000 |

   ## Development Guide

   ### Using shadcn/ui Components

   ```typescript
   import { Button } from '@/components/ui/button';
   import { Input } from '@/components/ui/input';

   <Button variant="default">Click me</Button>
   <Input type="email" placeholder="Email" />
   ```

   ### Making API Calls

   ```typescript
   import { tasksApi } from '@/lib/api-client';
   import { useQuery } from '@tanstack/react-query';

   const { data, isLoading } = useQuery({
     queryKey: ['tasks'],
     queryFn: () => tasksApi.getTasks(),
   });
   ```

   ### Using Authentication Store

   ```typescript
   import { useAuthStore } from '@/store/auth-store';

   const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();
   ```

   ## Design System

   ### Colors

   - **Primary**: Cyan (#3ABEFF)
   - **Danger**: Red/Coral (#FF6767)
   - **Neutral**: Custom grays (#F8F8FB, #F8F8F8, #F5F8FF, #A1A3AB, #000000)

   ### Typography

   - **Font**: Inter
   - **Scale**: 12px - 48px

   See `tailwind.config.ts` for full design tokens.
   ```

### Acceptance Criteria
- [ ] README is comprehensive and accurate
- [ ] All setup steps are documented
- [ ] Code examples are provided
- [ ] New developers can follow the README successfully

### Validation
- Follow README from scratch to verify instructions work

### Deliverables
- ✅ Updated/Created `frontend/README.md`

---

## TASK-021: Create Comprehensive Test Page

**Priority**: P1 (High - Critical for validation)
**Estimated Time**: 45 minutes
**Depends On**: TASK-008, TASK-009, TASK-010, TASK-011, TASK-013, TASK-015

### Description
Create a test page that demonstrates all installed features working together.

### Steps
1. Create `src/app/test/page.tsx`:
   ```typescript
   'use client';

   import { useState } from 'react';
   import { Button } from '@/components/ui/button';
   import { Input } from '@/components/ui/input';
   import { Label } from '@/components/ui/label';
   import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
   import { Badge } from '@/components/ui/badge';
   import { Skeleton } from '@/components/ui/skeleton';
   import { useAuthStore } from '@/store/auth-store';
   import { useToast } from '@/hooks/use-toast';
   import { Check, User } from '@/components/ui/icons';
   import { motion } from 'framer-motion';
   import { fadeInUp } from '@/lib/animations';
   import { formatDate, formatRelativeTime } from '@/lib/date-utils';

   export default function TestPage() {
     const { user, setAuth, clearAuth, isAuthenticated } = useAuthStore();
     const { toast } = useToast();

     const testAuth = () => {
       setAuth(
         {
           id: 1,
           email: 'test@example.com',
           name: 'Test User',
           created_at: new Date().toISOString()
         },
         'fake-token-123'
       );
       toast({
         title: 'Auth Test',
         description: 'User authenticated successfully!',
       });
     };

     return (
       <div className="min-h-screen bg-neutral-50 p-8">
         <div className="mx-auto max-w-4xl space-y-8">
           <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
             <h1 className="text-5xl font-bold text-primary-500">Frontend Setup Test</h1>
             <p className="mt-2 text-lg text-neutral-700">Testing all installed features</p>
           </motion.div>

           {/* Design System Test */}
           <Card>
             <CardHeader>
               <CardTitle>Design System</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex gap-2">
                 <div className="h-16 w-16 rounded bg-primary-500"></div>
                 <div className="h-16 w-16 rounded bg-danger-500"></div>
                 <div className="h-16 w-16 rounded bg-neutral-900"></div>
               </div>
               <div>
                 <p className="text-xs">Extra Small (12px)</p>
                 <p className="text-sm">Small (14px)</p>
                 <p className="text-base">Base (16px)</p>
                 <p className="text-lg">Large (18px)</p>
                 <p className="text-xl">Extra Large (20px)</p>
               </div>
             </CardContent>
           </Card>

           {/* Components Test */}
           <Card>
             <CardHeader>
               <CardTitle>UI Components</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div className="flex gap-2">
                 <Button variant="default">Default</Button>
                 <Button variant="secondary">Secondary</Button>
                 <Button variant="outline">Outline</Button>
                 <Button variant="ghost">Ghost</Button>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="test-input">Email</Label>
                 <Input id="test-input" type="email" placeholder="test@example.com" />
               </div>
               <div className="flex gap-2">
                 <Badge variant="default">Default</Badge>
                 <Badge variant="secondary">Secondary</Badge>
                 <Badge variant="outline">Outline</Badge>
               </div>
             </CardContent>
           </Card>

           {/* Icons Test */}
           <Card>
             <CardHeader>
               <CardTitle>Icons</CardTitle>
             </CardHeader>
             <CardContent className="flex gap-4">
               <Check className="h-6 w-6 text-danger-500" />
               <User className="h-6 w-6 text-primary-500" />
             </CardContent>
           </Card>

           {/* Loading State Test */}
           <Card>
             <CardHeader>
               <CardTitle>Loading States</CardTitle>
             </CardHeader>
             <CardContent className="space-y-2">
               <Skeleton className="h-4 w-full" />
               <Skeleton className="h-4 w-3/4" />
               <Skeleton className="h-4 w-1/2" />
             </CardContent>
           </Card>

           {/* Auth Store Test */}
           <Card>
             <CardHeader>
               <CardTitle>Authentication Store</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
               <div>
                 <p className="text-sm font-medium">
                   Status: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
                 </p>
                 {user && (
                   <div className="mt-2 text-sm">
                     <p>User: {user.name}</p>
                     <p>Email: {user.email}</p>
                   </div>
                 )}
               </div>
               <div className="flex gap-2">
                 <Button onClick={testAuth}>Test Login</Button>
                 <Button variant="outline" onClick={clearAuth}>Test Logout</Button>
               </div>
             </CardContent>
           </Card>

           {/* Date Utilities Test */}
           <Card>
             <CardHeader>
               <CardTitle>Date Utilities</CardTitle>
             </CardHeader>
             <CardContent className="space-y-2">
               <p className="text-sm">Formatted: {formatDate(new Date())}</p>
               <p className="text-sm">Relative: {formatRelativeTime(new Date())}</p>
             </CardContent>
           </Card>
         </div>
       </div>
     );
   }
   ```

2. Test the page at `http://localhost:3000/test`

### Acceptance Criteria
- [ ] All shadcn components render correctly
- [ ] Design tokens display the correct colors
- [ ] Auth store functions work (login/logout)
- [ ] Animations are smooth
- [ ] Icons display correctly
- [ ] Date formatting works
- [ ] No console errors

### Validation
```bash
# Visit http://localhost:3000/test
# Verify all sections display correctly
# Test interactive elements (buttons, inputs)
# Check browser console for errors (should be none)
```

### Deliverables
- ✅ `src/app/test/page.tsx` demonstrating all features

---

## TASK-022: Final Verification and Quality Checks

**Priority**: P0 (Blocker - Must pass before completion)
**Estimated Time**: 30 minutes
**Depends On**: All previous tasks

### Description
Run comprehensive verification to ensure all success criteria are met.

### Steps
1. **Automated Checks**:
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install

   # Development server
   npm run dev

   # Build check
   npm run build

   # Linting
   npm run lint

   # Type checking
   npm run type-check

   # Format check
   npm run format:check
   ```

2. **Manual Verification Checklist**:
   - [ ] Dev server starts without errors
   - [ ] Build completes successfully
   - [ ] All 14 shadcn components are in `src/components/ui/`
   - [ ] Primary color (#6366F1) displays correctly
   - [ ] Inter font loads properly
   - [ ] Path aliases work (`@/components`, `@/lib`, etc.)
   - [ ] Environment variables load correctly
   - [ ] Auth store persists across page refresh
   - [ ] API service is a singleton
   - [ ] TypeScript autocomplete works in IDE
   - [ ] Hot reload works within 2 seconds

3. **User Story Validation**:
   - [ ] US-1: Developer can initialize frontend project ✓
   - [ ] US-2: Design system configured with correct tokens ✓
   - [ ] US-3: All UI components work ✓
   - [ ] US-4: API service makes authenticated requests ✓
   - [ ] US-5: Auth state management works ✓
   - [ ] US-6: Type definitions provide autocomplete ✓
   - [ ] US-7: Environment variables configured ✓

4. **Success Criteria Validation**:
   - [ ] SC-001: Dev server starts within 30 seconds
   - [ ] SC-002: All 14 shadcn components installed
   - [ ] SC-003: Design tokens match specification
   - [ ] SC-004: API service injects auth tokens
   - [ ] SC-005: Auth state persists
   - [ ] SC-006: TypeScript compiles without errors
   - [ ] SC-007: All 8 directories exist
   - [ ] SC-008: Hot reload within 2 seconds

5. **Edge Case Testing**:
   - [ ] Test 401 response triggers logout
   - [ ] Test API call without token
   - [ ] Test localStorage unavailable scenario
   - [ ] Test invalid environment variables

### Acceptance Criteria
- [ ] All automated checks pass
- [ ] All manual verification items checked
- [ ] All user stories validated
- [ ] All success criteria met
- [ ] No console errors or warnings

### Validation
```bash
# Run all checks
npm run lint && npm run type-check && npm run build

# All should pass without errors
```

### Deliverables
- ✅ Verified, production-ready frontend setup
- ✅ All acceptance criteria met
- ✅ Documentation complete

---

## Task Summary

| Task ID | Title | Priority | Time | Status |
|---------|-------|----------|------|--------|
| TASK-001 | Initialize Next.js 16+ Project | P0 | 30m | ✅ Completed |
| TASK-002 | Configure Project Structure | P0 | 20m | ✅ Completed |
| TASK-003 | Configure Environment Variables | P0 | 15m | ✅ Completed |
| TASK-004 | Install Core Dependencies | P0 | 15m | ✅ Completed |
| TASK-005 | Configure Tailwind with Design Tokens | P1 | 45m | ✅ Completed |
| TASK-006 | Install Tailwind Animation Utilities | P2 | 15m | ✅ Completed |
| TASK-007 | Install and Configure shadcn/ui | P1 | 30m | ✅ Completed |
| TASK-008 | Install shadcn Components (Batch 1) | P1 | 20m | ✅ Completed |
| TASK-009 | Install shadcn Components (Batch 2) | P1 | 20m | ✅ Completed |
| TASK-010 | Install shadcn Components (Batch 3) | P2 | 20m | ✅ Completed |
| TASK-011 | Install shadcn Components (Batch 4) | P2 | 15m | ✅ Completed |
| TASK-012 | Install Icon Library | P2 | 10m | ✅ Completed |
| TASK-013 | Create Authentication Store | P1 | 45m | ✅ Completed |
| TASK-014 | Configure TanStack Query Provider | P1 | 30m | ✅ Completed |
| TASK-015 | Create Singleton API Service | P1 | 60m | ✅ Completed |
| TASK-016 | Define TypeScript Types | P1 | 30m | ✅ Completed |
| TASK-017 | Create Date Utilities | P2 | 20m | ✅ Completed |
| TASK-018 | Configure ESLint and Prettier | P2 | 30m | ✅ Completed |
| TASK-019 | Create Animation Utilities | P2 | 30m | ✅ Completed |
| TASK-020 | Update Documentation | P2 | 45m | ✅ Completed |
| TASK-021 | Create Test Page | P1 | 45m | ✅ Completed |
| TASK-022 | Final Verification | P0 | 30m | ✅ Completed |

**Total Estimated Time**: ~9.5 hours
**Total Tasks**: 22 (All Completed)

---

## Dependency Graph

```
TASK-001 (Initialize Next.js)
├── TASK-002 (Project Structure)
├── TASK-003 (Environment Variables)
├── TASK-004 (Install Dependencies)
│   ├── TASK-013 (Auth Store)
│   ├── TASK-014 (TanStack Query)
│   ├── TASK-015 (API Service - requires TASK-013)
│   ├── TASK-017 (Date Utilities)
│   └── TASK-019 (Animation Utilities)
├── TASK-005 (Tailwind Config)
│   ├── TASK-006 (Tailwind Animate)
│   └── TASK-007 (shadcn Init)
│       ├── TASK-008 (shadcn Batch 1)
│       ├── TASK-009 (shadcn Batch 2)
│       ├── TASK-010 (shadcn Batch 3)
│       └── TASK-011 (shadcn Batch 4)
├── TASK-012 (Icons)
├── TASK-016 (TypeScript Types)
└── TASK-018 (ESLint/Prettier)

TASK-021 (Test Page) - requires TASK-008, 009, 010, 011, 013, 015
TASK-020 (Documentation) - requires all previous tasks
TASK-022 (Final Verification) - requires all tasks
```

---

## Implementation Strategy

### Recommended Execution Order

**Phase 1 - Foundation (P0 tasks first)**:
1. TASK-001 → TASK-002, TASK-003, TASK-004 (parallel after TASK-001)

**Phase 2 - Design & Components (P1 tasks)**:
2. TASK-005 → TASK-006 → TASK-007
3. TASK-008, TASK-009, TASK-010, TASK-011 (parallel after TASK-007)

**Phase 3 - State & API (P1 tasks)**:
4. TASK-013 → TASK-015 (TASK-015 depends on TASK-013)
5. TASK-014, TASK-016 (parallel)

**Phase 4 - Utilities & Tooling (P2 tasks)**:
6. TASK-012, TASK-017, TASK-018, TASK-019 (all parallel)

**Phase 5 - Documentation & Validation**:
7. TASK-021 (Test page)
8. TASK-020 (Documentation)
9. TASK-022 (Final verification)

---

## Notes

- Tasks marked P0 are blockers and must be completed first
- Tasks marked P1 are high priority for core functionality
- Tasks marked P2 are medium priority enhancements
- Many tasks can be parallelized for faster completion
- Each task has clear acceptance criteria and validation steps
- All tasks reference the plan and specification for context

---

**Tasks Created**: 2025-12-13
**Status**: ✅ All Tasks Completed
**Completed**: 2025-12-13
**Next Step**: Ready for feature implementation phase
