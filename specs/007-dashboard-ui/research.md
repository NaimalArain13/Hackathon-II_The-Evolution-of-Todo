# Research: Dashboard UI and API Integration

**Feature**: 007-dashboard-ui | **Date**: 2025-12-14 | **Phase**: 0 (Research)

## Purpose

This document consolidates research findings to resolve all technical uncertainties before design and implementation. All NEEDS CLARIFICATION items from Technical Context have been researched and decided.

## Research Areas

### 1. Next.js 16+ App Router Architecture

**Decision**: Use Next.js 16+ App Router with (dashboard) route group for authenticated pages

**Rationale**:
- App Router provides better performance with React Server Components
- Route groups allow shared layouts without affecting URL structure
- Built-in support for loading states, error boundaries, and streaming
- Middleware can protect entire route groups with authentication

**Alternatives Considered**:
- Pages Router: Rejected - legacy approach, less performant, no native loading/error states
- Client-only SPA: Rejected - worse SEO, slower initial load, more complex state management

**Implementation Pattern**:
```
app/
├── (dashboard)/          # Protected route group
│   ├── layout.tsx        # Shared sidebar layout
│   ├── page.tsx          # Dashboard home
│   ├── tasks/page.tsx    # Tasks view
│   └── profile/page.tsx  # Profile view
└── middleware.ts         # JWT validation for /dashboard routes
```

### 2. State Management Strategy

**Decision**: React Query (TanStack Query) for server state + React hooks for UI state

**Rationale**:
- React Query provides automatic caching, background refetching, and optimistic updates
- Eliminates need for global state library (Redux, Zustand) for API data
- Built-in loading/error states per query
- Optimistic UI updates for instant feedback on completion toggles

**Alternatives Considered**:
- Redux Toolkit: Rejected - too complex for this use case, requires more boilerplate
- Zustand: Rejected - not needed for UI state, React hooks sufficient
- SWR: Considered - similar to React Query but less feature-complete

**Implementation Pattern**:
```typescript
// Server state with React Query
const { data: tasks, isLoading } = useQuery({
  queryKey: ['tasks', filters],
  queryFn: () => fetchTasks(filters)
});

// UI state with React hooks
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
const [activeModal, setActiveModal] = useState<'create' | 'edit' | null>(null);
```

### 3. Component Architecture

**Decision**: Atomic design pattern with shadcn/ui base components

**Rationale**:
- shadcn/ui provides unstyled, accessible components that can be customized
- Components live in your codebase (not node_modules), fully controllable
- Built on Radix UI primitives for robust accessibility
- Tailwind CSS integration for consistent styling

**Component Hierarchy**:
1. **Atoms** (shadcn/ui): Button, Input, Checkbox, Badge, etc.
2. **Molecules**: TaskCard, FilterDropdown, SearchBar
3. **Organisms**: TaskList, Sidebar, DashboardHeader
4. **Templates**: DashboardLayout
5. **Pages**: Dashboard page, Tasks page, Profile page

**Alternatives Considered**:
- Material UI (MUI): Rejected - opinionated styling, larger bundle size
- Chakra UI: Rejected - runtime CSS-in-JS performance concerns
- Headless UI: Considered - good but shadcn/ui provides more complete solution

### 4. Animation Library

**Decision**: Framer Motion 11+ for all animations and transitions

**Rationale**:
- Declarative API with React components (motion.div, etc.)
- Hardware-accelerated animations (uses transform/opacity)
- Layout animations for smooth reordering
- Gesture support (drag, hover, tap)
- Variants for coordinating multiple animations

**Use Cases**:
- Page transitions between dashboard sections
- Task card enter/exit animations
- Sidebar collapse/expand
- Modal open/close
- Filter/sort reordering animations
- Hover/focus micro-interactions

**Alternatives Considered**:
- CSS Transitions: Rejected - limited control, no gesture support
- React Spring: Rejected - physics-based animations unnecessary for this use case
- GSAP: Rejected - not React-first, more complex API

**Implementation Pattern**:
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.2 }}
>
  {/* Content */}
</motion.div>
```

### 5. Form Validation

**Decision**: React Hook Form + Zod for schema validation

**Rationale**:
- React Hook Form minimizes re-renders (uncontrolled inputs)
- Zod provides type-safe schema validation
- Native TypeScript integration
- Real-time validation with minimal boilerplate

**Implementation Pattern**:
```typescript
const taskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  priority: z.enum(['high', 'medium', 'low', 'none']),
  category: z.enum(['work', 'personal', 'shopping', 'health', 'other'])
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(taskSchema)
});
```

**Alternatives Considered**:
- Formik: Rejected - causes more re-renders, less performant
- Yup: Rejected - Zod provides better TypeScript integration
- Manual validation: Rejected - too much boilerplate, error-prone

### 6. API Client Architecture

**Decision**: Axios with interceptors for JWT injection + retry logic

**Rationale**:
- Axios supports request/response interceptors
- Automatic JWT token injection on every request
- Request retry logic for transient failures
- Timeout configuration
- Better error handling than fetch

**Implementation Pattern**:
```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000
});

// JWT interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Retry interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      router.push('/signin');
    }
    return Promise.reject(error);
  }
);
```

**Alternatives Considered**:
- Fetch API: Rejected - requires manual interceptor implementation
- tRPC: Rejected - backend is FastAPI (Python), not Next.js API routes

### 7. Performance Optimization Strategies

**Decision**: Implement progressive enhancement and code splitting

**Strategies**:
1. **Code Splitting**: Dynamic imports for modals and heavy components
2. **Virtual Scrolling**: Use react-window for task lists >500 items
3. **Debouncing**: 300ms debounce on search input
4. **Optimistic Updates**: Instant UI feedback for completion toggles
5. **Image Optimization**: Next.js Image component for avatars/icons
6. **Lazy Loading**: Load components only when needed

**Implementation**:
```typescript
// Code splitting
const CreateTaskModal = dynamic(() => import('@/components/modals/CreateTaskModal'));

// Virtual scrolling
import { FixedSizeList } from 'react-window';

// Debounced search
const debouncedSearch = useMemo(
  () => debounce((value) => setSearchQuery(value), 300),
  []
);
```

### 8. Responsive Design Approach

**Decision**: Mobile-first with Tailwind CSS breakpoints

**Breakpoints**:
- Mobile: 320px - 767px (sm)
- Tablet: 768px - 1023px (md)
- Desktop: 1024px+ (lg, xl, 2xl)

**Responsive Patterns**:
- Sidebar → Drawer on mobile
- Grid layout → Single column on mobile
- Touch-friendly targets (44px minimum) on mobile
- Hamburger menu on mobile

**Implementation**:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Task cards */}
</div>

<Sidebar className="hidden md:block" />  {/* Desktop sidebar */}
<MobileDrawer className="md:hidden" />   {/* Mobile drawer */}
```

### 9. Accessibility (a11y) Requirements

**Decision**: WCAG 2.1 Level AA compliance with shadcn/ui + manual testing

**Requirements**:
- Keyboard navigation for all interactive elements
- ARIA labels for screen readers
- Focus management for modals
- Color contrast ratios ≥4.5:1
- Skip to main content link
- Semantic HTML

**Tools**:
- ESLint plugin: eslint-plugin-jsx-a11y
- Testing: @axe-core/react for runtime checks
- Manual testing: Keyboard-only navigation

**Implementation**:
```typescript
<button
  aria-label="Create new task"
  aria-pressed={isModalOpen}
  onClick={openModal}
>
  <PlusIcon aria-hidden="true" />
</button>
```

### 10. Error Handling Strategy

**Decision**: Error boundaries + toast notifications + fallback UI

**Patterns**:
1. **Global Error Boundary**: Catch React rendering errors
2. **Query Error States**: React Query error states for API failures
3. **Toast Notifications**: sonner library for success/error feedback
4. **Fallback UI**: Skeleton loaders during loading states

**Implementation**:
```typescript
// Error boundary
<ErrorBoundary fallback={<ErrorFallback />}>
  <DashboardContent />
</ErrorBoundary>

// Query error handling
const { error } = useQuery({...});
if (error) return <ErrorMessage error={error} />;

// Toast notifications
toast.error('Failed to create task. Please try again.');
```

## Technology Stack Summary

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Next.js | 16+ | App Router, SSR, routing |
| Language | TypeScript | 5.x | Type safety |
| UI Library | React | 19+ | Component library |
| Components | shadcn/ui | Latest | Pre-built accessible components |
| Styling | Tailwind CSS | 3.4+ | Utility-first CSS |
| Animations | Framer Motion | 11+ | Smooth animations |
| State (Server) | React Query | 5+ | API state management |
| State (UI) | React Hooks | - | Local UI state |
| Forms | React Hook Form | 7+ | Form state management |
| Validation | Zod | 3+ | Schema validation |
| HTTP Client | Axios | 1.6+ | API requests with interceptors |
| Notifications | Sonner | Latest | Toast notifications |
| Icons | Lucide React | Latest | Icon library |
| Testing (Unit) | Jest + RTL | Latest | Component testing |
| Testing (E2E) | Playwright | Latest | End-to-end testing |

## Design System Decisions

### Color Palette

**Decision**: Extend Tailwind's default palette with custom brand colors

**Priority Colors**:
- High: `red-500` (#ef4444)
- Medium: `yellow-500` (#eab308)
- Low: `blue-500` (#3b82f6)
- None: `gray-400` (#9ca3af)

**Status Colors**:
- Completed: `green-500` (#22c55e)
- Pending: `gray-600` (#4b5563)
- Error: `red-600` (#dc2626)
- Success: `green-600` (#16a34a)

### Typography

**Decision**: Use Tailwind's font stack with Inter as primary font

**Hierarchy**:
- Headings: font-semibold (600 weight)
- Body: font-normal (400 weight)
- Labels: font-medium (500 weight)
- Code: font-mono (monospace)

### Spacing

**Decision**: Use Tailwind's spacing scale (4px base unit)

**Common Values**:
- Extra small: `gap-2` (8px)
- Small: `gap-4` (16px)
- Medium: `gap-6` (24px)
- Large: `gap-8` (32px)

### Animation Timing

**Decision**: Follow Material Design motion principles

**Durations**:
- Micro: 100-200ms (hover, focus)
- Short: 200-300ms (modals, dropdowns)
- Medium: 300-500ms (page transitions)
- Long: 500ms+ (complex animations)

**Easing**: Use ease-in-out for natural motion

## Best Practices Research

### 1. Next.js 16+ Best Practices

**Server Components by Default**:
- Use Server Components unless interactivity is needed
- Fetch data in Server Components for better performance
- Only use 'use client' when necessary

**Route Protection**:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}
```

### 2. React Query Best Practices

**Query Keys Structure**:
```typescript
// Organized query keys
const queryKeys = {
  tasks: {
    all: ['tasks'] as const,
    lists: () => [...queryKeys.tasks.all, 'list'] as const,
    list: (filters: Filters) => [...queryKeys.tasks.lists(), { filters }] as const,
    detail: (id: number) => [...queryKeys.tasks.all, 'detail', id] as const
  }
};
```

**Optimistic Updates**:
```typescript
const mutation = useMutation({
  mutationFn: toggleTaskCompletion,
  onMutate: async (taskId) => {
    await queryClient.cancelQueries({ queryKey: ['tasks'] });
    const previous = queryClient.getQueryData(['tasks']);

    queryClient.setQueryData(['tasks'], (old) =>
      old.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );

    return { previous };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['tasks'], context.previous);
  }
});
```

### 3. Tailwind CSS Best Practices

**Component Variants**:
```typescript
// Use cva (class-variance-authority) for component variants
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300'
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
      }
    }
  }
);
```

### 4. Accessibility Best Practices

**Focus Management**:
```typescript
// Trap focus in modals
import { FocusTrap } from '@headlessui/react';

<FocusTrap>
  <Dialog>
    {/* Modal content */}
  </Dialog>
</FocusTrap>
```

**Keyboard Shortcuts**:
```typescript
// Global keyboard shortcuts
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      openCreateTaskModal();
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, []);
```

## Implementation Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Performance degradation with 1000+ tasks | High | Medium | Implement virtual scrolling with react-window |
| Complex animation jank on mobile | Medium | Low | Use hardware-accelerated properties (transform, opacity) |
| JWT token expiration handling | High | High | Implement automatic refresh or redirect to login |
| CORS issues with backend | High | Low | Ensure backend CORS configured for frontend domain |
| Accessibility violations | Medium | Medium | Use eslint-plugin-jsx-a11y and manual testing |
| State synchronization issues | Medium | Medium | Use React Query for single source of truth |
| Mobile drawer performance | Low | Low | Lazy load drawer component |

## Dependencies Not in package.json Yet

These will be added during implementation:

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.17.0",
    "framer-motion": "^11.0.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "axios": "^1.6.5",
    "sonner": "^1.3.0",
    "lucide-react": "^0.309.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "react-window": "^1.8.10"
  },
  "devDependencies": {
    "@testing-library/react": "^14.1.0",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.0",
    "@playwright/test": "^1.40.0",
    "eslint-plugin-jsx-a11y": "^6.8.0",
    "@axe-core/react": "^4.8.0",
    "@types/react-window": "^1.8.8"
  }
}
```

## Conclusion

All technical uncertainties have been resolved through research. The stack is well-established with battle-tested libraries that align with modern React/Next.js best practices. No blockers identified for moving to Phase 1 (Design & Contracts).

**Next Phase**: Generate data-model.md and contracts for UI components and routes.
