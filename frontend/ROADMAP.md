# Frontend Development Roadmap - Phase II

## Project Overview
Building a modern, responsive todo application using Next.js 16 with complete backend integration and Figma-driven design workflow.

**Backend API**: `https://naimalcreativityai-sdd-todo-app.hf.space/`
**Design Inspiration**: [Figma Community Todo Design](https://www.figma.com/design/94mDWGXUYL9S0Qdmz1E3Vv/)

---

## Tech Stack & Dependencies

### Core Framework
- **Next.js 16+** (App Router, React Server Components)
- **React 19+**
- **TypeScript 5+**

### Styling & UI
- **Tailwind CSS v4** (Latest version with new features)
- **shadcn/ui** (Component library)
- **Lucide Icons** or **Heroicons** (Icon system)
- **CVA (Class Variance Authority)** (Component variants)

### Animation & Interaction
- **Framer Motion** (Animations, page transitions, micro-interactions)
- **React Hook Form** (Form management)
- **Zod** (Schema validation)

### State Management & Data Fetching
- **TanStack Query (React Query)** (Server state management, caching)
- **Zustand** or **Jotai** (Client state if needed)
- **SWR** (Alternative to React Query, if preferred)

### Authentication & API
- **Better Auth** (Authentication library - TypeScript)
- **Axios** or **ky** (HTTP client)
- **JWT Decode** (Token handling)

### Date & Time
- **date-fns** or **Day.js** (Date formatting and manipulation)

### Development Tools
- **ESLint** (Linting)
- **Prettier** (Code formatting)
- **TypeScript ESLint** (Type-safe linting)
- **Husky** (Git hooks)
- **lint-staged** (Pre-commit linting)

### Testing (Future)
- **Vitest** (Unit testing)
- **Testing Library** (Component testing)
- **Playwright** or **Cypress** (E2E testing)

---

## Phase 0: Project Setup & Dependencies

### ✅ Checklist

#### 1. Initialize Next.js Project (if not done)
```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

#### 2. Install Core Dependencies
```bash
# UI & Styling
npm install tailwindcss@next postcss autoprefixer
npm install class-variance-authority clsx tailwind-merge
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select @radix-ui/react-checkbox @radix-ui/react-radio-group
npm install @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip

# Animation
npm install framer-motion

# Icons
npm install lucide-react

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# State Management & Data Fetching
npm install @tanstack/react-query @tanstack/react-query-devtools
npm install zustand # or jotai

# API & HTTP
npm install axios
npm install jwt-decode

# Date Utilities
npm install date-fns

# Authentication
npm install better-auth
```

#### 3. Install Development Dependencies
```bash
npm install -D @types/node @types/react @types/react-dom
npm install -D eslint eslint-config-next
npm install -D prettier prettier-plugin-tailwindcss
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D husky lint-staged
```

#### 4. Setup shadcn/ui
```bash
npx shadcn@latest init
# Select: Default style, Neutral color, CSS variables: Yes

# Install commonly used components
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add tabs
npx shadcn@latest add toast
npx shadcn@latest add form
npx shadcn@latest add avatar
npx shadcn@latest add badge
npx shadcn@latest add skeleton
```

#### 5. Configure Tailwind CSS v4
```javascript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom color palette (match Figma design)
        primary: {
          50: "#f0f9ff",
          // ... full palette
        },
      },
      animation: {
        // Custom animations
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

#### 6. Setup Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=https://naimalcreativityai-sdd-todo-app.hf.space
BETTER_AUTH_SECRET=your-shared-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
NODE_ENV=development
```

#### 7. Configure TypeScript
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

#### 8. Project Structure Setup
```bash
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── proxy.ts           # Auth proxy (Next.js 16 - replaces middleware.ts)
│   │   ├── (auth)/            # Auth routes group
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/       # Dashboard routes group
│   │   │   ├── layout.tsx     # Dashboard layout
│   │   │   ├── page.tsx       # Dashboard home
│   │   │   ├── tasks/
│   │   │   ├── profile/
│   │   │   └── settings/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Landing page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopNav.tsx
│   │   │   └── Footer.tsx
│   │   ├── tasks/            # Task components
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskBoard.tsx
│   │   │   ├── CreateTaskModal.tsx
│   │   │   └── TaskFilters.tsx
│   │   ├── auth/             # Auth components
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── profile/          # Profile components
│   ├── lib/                   # Utilities
│   │   ├── api.ts            # API client
│   │   ├── auth.ts           # Better Auth setup
│   │   ├── utils.ts          # Utility functions
│   │   └── validations.ts    # Zod schemas
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useTasks.ts
│   │   └── useToast.ts
│   ├── types/                 # TypeScript types
│   │   ├── api.ts            # API types
│   │   ├── task.ts           # Task types
│   │   └── user.ts           # User types
│   └── store/                 # State management
│       └── authStore.ts       # Auth state (Zustand)
├── public/                    # Static assets
│   ├── images/
│   └── icons/
├── .env.local                 # Environment variables
├── next.config.js             # Next.js config
├── tailwind.config.ts         # Tailwind config
├── package.json
└── ROADMAP.md                 # This file
```

---

## Phase 1: Figma Design Creation

### Objective
Create comprehensive, high-fidelity designs in Figma that map to backend API structure and provide clear implementation guidelines for frontend development.

### Tools Required
- **Figma Account**: Use provided credentials (see CREDENTIALS.md - DO NOT COMMIT)
- **Figma MCP Server**: For programmatic design creation
- **figma-expert-agent**: Claude Code agent for design work

### Design Deliverables

#### 1.1 Design System Foundation
**Duration**: 1-2 sessions

- [ ] **Color Palette**
  - Primary colors (brand colors)
  - Secondary colors
  - Neutral palette (50-900 shades)
  - Semantic colors (success, warning, error, info)
  - Dark mode variants

- [ ] **Typography System**
  - Font families (Primary: Inter or SF Pro, Headings: Poppins or similar)
  - Type scale (12px to 48px)
  - Line heights and weights
  - Text styles (H1-H6, Body, Small, Caption)

- [ ] **Spacing System**
  - 4px/8px baseline grid
  - Spacing tokens (4, 8, 12, 16, 24, 32, 48, 64, 96px)

- [ ] **Component Library**
  - Buttons (primary, secondary, tertiary, ghost, icon)
  - Input fields (text, textarea, select, checkbox, radio)
  - Cards and containers
  - Navigation components
  - Modals and dialogs
  - Toast notifications
  - Loading states (skeletons, spinners)
  - Empty states

#### 1.2 Landing Page (Public)
**Skill**: `figma-modern-ui-design`

- [ ] **Navbar (Sticky)**
  - Logo + App name (left)
  - Navigation links: Features, How It Works, About (center)
  - CTA buttons: Login, Sign Up (right)
  - Mobile: Hamburger menu with slide-out drawer
  - Scroll behavior: Background becomes solid on scroll

- [ ] **Hero Section**
  - Main headline: Catchy value proposition (e.g., "Organize Your Life, One Task at a Time")
  - Subheadline: Brief description of the app's benefits
  - Primary CTA button: "Get Started Free" or "Start Organizing"
  - Secondary CTA button: "Learn More" or "See Demo"
  - Hero illustration/image: Task management visual or 3D illustration
  - Background: Gradient or subtle pattern
  - Floating task card mockups (optional animation)

- [ ] **Features Section**
  - Section title: "Why Choose TaskFlow?" or "Powerful Features"
  - 3-4 Feature cards in grid layout:
    - **Easy Task Management**: Create, edit, delete tasks effortlessly
    - **Priority & Status**: Organize by priority (low/medium/high) and status
    - **Progress Tracking**: Visual dashboard with task statistics
    - **Secure & Private**: Your data is protected with JWT authentication
  - Each card: Icon + Title + Description
  - Optional: Hover animations on cards

- [ ] **How It Works Section**
  - Section title: "Get Started in 3 Easy Steps"
  - Step 1: Sign Up - Create your free account in seconds
  - Step 2: Add Tasks - Quickly add tasks with title, description, priority
  - Step 3: Stay Organized - Track progress and mark tasks complete
  - Visual: Numbered steps with connecting line/arrows
  - Illustration or screenshot for each step

- [ ] **About/App Showcase Section**
  - Section title: "Built for Productivity"
  - App screenshot/mockup showing dashboard
  - Key benefits list with checkmarks:
    - Clean, intuitive interface
    - Works on all devices
    - Real-time sync
    - No credit card required
  - Optional: Testimonial quote or user count

- [ ] **Call-to-Action Section**
  - Background: Gradient or contrasting color
  - Headline: "Ready to Get Organized?"
  - Subtext: "Join thousands of users managing their tasks effectively"
  - Large CTA button: "Create Free Account"
  - Trust indicators: "No credit card required" / "Free forever"

- [ ] **Footer**
  - Logo + App name
  - Navigation links: Home, Features, About, Contact
  - Legal links: Privacy Policy, Terms of Service
  - Social media icons (optional)
  - Copyright: "© 2025 TaskFlow. All rights reserved."
  - Made with ❤️ badge (optional)

#### 1.3 Authentication Screens
**Skill**: `figma-backend-integration-design`

- [ ] **Login Page**
  - Split layout: Form on one side, illustration/branding on other
  - Logo + App name at top
  - Page title: "Welcome Back" or "Sign In"
  - Email input (with validation states)
  - Password input (with show/hide toggle)
  - "Remember me" checkbox
  - Submit button (with loading state)
  - "Forgot password?" link
  - Divider: "or continue with"
  - Social login buttons (optional: Google, GitHub)
  - "Don't have account? Sign up" link
  - Error states (invalid credentials)

- [ ] **Registration Page**
  - Split layout: Form on one side, illustration/branding on other
  - Logo + App name at top
  - Page title: "Create Account" or "Get Started"
  - Name input
  - Email input (with format validation)
  - Password input (with strength indicator)
  - Confirm password input
  - Submit button (with loading state)
  - Terms & conditions checkbox
  - Divider: "or continue with"
  - Social login buttons (optional: Google, GitHub)
  - "Already have account? Login" link
  - Error states (duplicate email, weak password)

#### 1.4 Dashboard & Layout
**Skills**: `figma-dashboard-components`, `figma-modern-ui-design`

- [ ] **Dashboard Layout**
  - Sidebar navigation (240px fixed)
  - Top navigation bar
  - Main content area
  - Responsive breakpoints (desktop, tablet, mobile)

- [ ] **Dashboard Homepage**
  - Welcome header
  - Quick stats cards (Total Tasks, Completed, In Progress, Due Today)
  - Recent tasks section
  - Quick actions (+ New Task button)

- [ ] **Sidebar Navigation**
  - Logo + App name
  - Navigation links (Dashboard, Tasks, Profile, Settings)
  - Active state indicators
  - User profile card (at bottom)
  - Collapsed state (icons only)
  - Mobile: slide-out drawer

- [ ] **Top Navigation**
  - Page title
  - Search bar (optional)
  - Notifications icon (with badge)
  - User avatar + dropdown
  - Mobile: hamburger menu

#### 1.5 Task Management Views
**Skills**: `figma-dashboard-components`, `figma-backend-integration-design`

- [ ] **Task List View**
  - Filters bar (Status tabs, Priority filter, Sort dropdown)
  - Search input
  - Task cards (vertical stack)
  - Empty state
  - Loading state (skeleton screens)

- [ ] **Task Card Component**
  - Checkbox (mark complete)
  - Priority badge (low/medium/high with colors)
  - Status badge (pending/in_progress/completed)
  - Task title (H4, max 2 lines)
  - Task description (truncated to 3 lines)
  - Created date, Updated date
  - Action buttons (Edit, Delete)
  - Hover state (lift effect)
  - Completed state (strikethrough, opacity)

- [ ] **Task Board View (Kanban)**
  - Three columns (Pending, In Progress, Completed)
  - Column headers with task count badges
  - Compact task cards
  - Drag & drop indicators
  - Drop zone highlights

- [ ] **Create Task Modal**
  - Title input (required)
  - Description textarea (optional)
  - Status selector (default: pending)
  - Priority selector (default: medium)
  - Due date picker (optional, future feature)
  - Save and Cancel buttons
  - Validation error states

- [ ] **Edit Task Modal**
  - Pre-filled form with current task data
  - Same fields as create modal
  - Delete button (destructive style)
  - Save and Cancel buttons

- [ ] **Delete Confirmation Dialog**
  - Warning icon
  - Title: "Delete Task?"
  - Message: "This action cannot be undone."
  - Cancel and Delete buttons

#### 1.6 Profile & Settings
**Skill**: `figma-dashboard-components`

- [ ] **Profile Page**
  - Profile header card (avatar, name, email, member since)
  - Edit profile button
  - Personal information section (editable)
  - Account statistics
  - Password change section

- [ ] **Settings Page**
  - Settings sidebar (sections: General, Account, Notifications, Appearance)
  - General: Language, timezone
  - Account: Password change, delete account
  - Notifications: Email preferences
  - Appearance: Theme toggle (light/dark)

#### 1.7 Animations & Prototypes
**Skill**: `figma-animations-prototypes`

- [ ] **Page Transitions**
  - Login → Dashboard (fade transition)
  - Navigation between pages (slide transitions)

- [ ] **Micro-interactions**
  - Button hover/active states
  - Input focus states
  - Checkbox check animation
  - Toggle switch animation
  - Dropdown menu open/close

- [ ] **Modal Animations**
  - Modal slide-up entrance (300ms ease-out)
  - Backdrop fade-in
  - Modal slide-down exit (200ms ease-in)

- [ ] **Task Interactions**
  - Mark complete: checkbox animation + strikethrough
  - Drag and drop: lift effect + shadow
  - Delete: fade-out animation

- [ ] **Toast Notifications**
  - Slide in from right (300ms)
  - Auto-dismiss with progress bar (3s)
  - Slide out animation

- [ ] **Loading States**
  - Skeleton screen shimmer effect
  - Spinner rotation
  - Progress bar fill

#### 1.8 Interactive Prototype
- [ ] **Complete User Flows**
  - Registration → Dashboard
  - Login → Dashboard
  - Create Task → Task List (with new task)
  - Edit Task → Updated Task
  - Delete Task → Confirmation → Task Removed
  - Mark Complete → Task State Change
  - Filter/Search Tasks → Filtered Results

- [ ] **Prototype Settings**
  - Start frame: Landing page
  - Device: Desktop (1440px) and Mobile (375px) versions
  - Hotspot hints: Enabled
  - Flows: Multiple user journeys

### Design Checklist
- [ ] All screens designed for desktop (1440px)
- [ ] All screens designed for mobile (375px)
- [ ] Tablet breakpoint (768px) considered
- [ ] All component states included (default, hover, active, disabled)
- [ ] Error states and validation messages designed
- [ ] Loading states and empty states designed
- [ ] Color contrast checked (WCAG AA: 4.5:1)
- [ ] Touch targets minimum 44x44px
- [ ] Interactive prototype created and tested
- [ ] Design aligns with backend API structure
- [ ] All text styles and color styles created
- [ ] Component library organized and documented

---

## Phase 2: Design Testing & Validation

### Objective
Validate designs meet requirements, are implementable, and provide good user experience.

### Testing Checklist

#### 2.1 Functional Testing
- [ ] All navigation flows work in prototype
- [ ] Forms can be filled out completely
- [ ] Modals open and close correctly
- [ ] All buttons have defined actions
- [ ] Error states are triggered appropriately
- [ ] Loading states are demonstrated

#### 2.2 Visual Testing
- [ ] Designs match brand guidelines
- [ ] Typography is consistent across all screens
- [ ] Color usage is consistent
- [ ] Spacing follows baseline grid
- [ ] Alignment is pixel-perfect
- [ ] Icons are consistent size and style

#### 2.3 Usability Testing
- [ ] User flows are intuitive
- [ ] Important actions are easily discoverable
- [ ] Error messages are helpful
- [ ] Success feedback is clear
- [ ] Navigation is consistent
- [ ] Mobile layouts are usable

#### 2.4 Accessibility Testing
- [ ] Color contrast ratios meet WCAG AA
- [ ] Interactive elements are large enough (44x44px)
- [ ] Focus states are visible
- [ ] Form labels are present
- [ ] Error messages are associated with fields

#### 2.5 Technical Validation
- [ ] Designs align with backend API structure
- [ ] All backend fields are represented in UI
- [ ] Data types are correctly displayed
- [ ] Enum values match backend (status, priority)
- [ ] Authentication flows match API endpoints

#### 2.6 Stakeholder Review
- [ ] Present prototype to team/stakeholders
- [ ] Gather feedback and iterate
- [ ] Document approved designs
- [ ] Export assets and specifications

---

## Phase 3: Frontend UI Implementation

### Objective
Build pixel-perfect, responsive UI components based on Figma designs using Next.js 16, Tailwind CSS v4, and Framer Motion.

### Implementation Strategy
Break implementation into small, scalable sections that can be developed and tested independently.

---

### 3.1 Foundation & Configuration

#### Setup Files
- [ ] **API Client** (`src/lib/api.ts`)
  ```typescript
  // Axios instance with interceptors
  // Base URL from env
  // JWT token injection
  // Error handling
  ```

- [ ] **Better Auth Setup** (`src/lib/auth.ts`)
  ```typescript
  // Better Auth client configuration
  // Auth helpers (login, register, logout)
  // Token management
  ```

- [ ] **Type Definitions** (`src/types/`)
  ```typescript
  // User types
  // Task types
  // API response types
  // Form types
  ```

- [ ] **Validation Schemas** (`src/lib/validations.ts`)
  ```typescript
  // Zod schemas for forms
  // Login schema
  // Register schema
  // Task schema
  ```

- [ ] **Utility Functions** (`src/lib/utils.ts`)
  ```typescript
  // cn() for className merging
  // Date formatters
  // Color utilities
  // Text truncation
  ```

#### Global Styles & Theme
- [ ] **Tailwind Configuration**
  - Import Figma color palette
  - Define spacing tokens
  - Add custom animations
  - Configure plugins

- [ ] **Global CSS** (`src/app/globals.css`)
  - Tailwind directives
  - Custom CSS variables
  - Dark mode styles
  - Font imports

- [ ] **Root Layout** (`src/app/layout.tsx`)
  - HTML structure
  - Metadata configuration
  - Font loading
  - TanStack Query provider
  - Toast provider

---

### 3.2 Component Library (shadcn/ui + Custom)

#### Base UI Components (shadcn/ui)
- [ ] **Button** - All variants (primary, secondary, tertiary, ghost, icon)
- [ ] **Input** - Text input with states
- [ ] **Label** - Form labels
- [ ] **Card** - Container component
- [ ] **Dialog** - Modal component
- [ ] **Dropdown Menu** - Dropdown component
- [ ] **Select** - Select input
- [ ] **Checkbox** - Checkbox input
- [ ] **Radio Group** - Radio buttons
- [ ] **Tabs** - Tab navigation
- [ ] **Toast** - Notification component
- [ ] **Form** - Form wrapper with react-hook-form
- [ ] **Avatar** - User avatar
- [ ] **Badge** - Status badges
- [ ] **Skeleton** - Loading placeholders

#### Custom Components
- [ ] **LoadingSpinner** (`src/components/ui/loading-spinner.tsx`)
  - Rotating spinner
  - Size variants (sm, md, lg)
  - Color variants

- [ ] **EmptyState** (`src/components/ui/empty-state.tsx`)
  - Illustration
  - Headline and description
  - Optional CTA button

- [ ] **ConfirmDialog** (`src/components/ui/confirm-dialog.tsx`)
  - Warning/question icon
  - Title and message
  - Cancel and confirm buttons
  - Destructive variant

---

### 3.3 Layout Components

#### Dashboard Layout
- [ ] **Sidebar** (`src/components/layout/Sidebar.tsx`)
  - Logo and app name
  - Navigation links with active states
  - User profile card
  - Collapse/expand functionality
  - Mobile: slide-out drawer
  - Framer Motion: slide animation

- [ ] **TopNav** (`src/components/layout/TopNav.tsx`)
  - Page title
  - Search bar (optional phase)
  - Notifications icon (future)
  - User dropdown menu
  - Mobile: hamburger menu

- [ ] **DashboardLayout** (`src/app/(dashboard)/layout.tsx`)
  - Sidebar + TopNav + Main content
  - Protected route logic
  - Responsive layout (flex/grid)

- [ ] **Footer** (`src/components/layout/Footer.tsx`)
  - Copyright
  - Links (Privacy, Terms)
  - Social media icons

---

### 3.4 Authentication Components & Pages

#### Components
- [ ] **LoginForm** (`src/components/auth/LoginForm.tsx`)
  - Email input with validation
  - Password input with show/hide
  - "Remember me" checkbox
  - Submit button with loading state
  - Error display
  - React Hook Form + Zod
  - Framer Motion: input focus animations

- [ ] **RegisterForm** (`src/components/auth/RegisterForm.tsx`)
  - Name, email, password inputs
  - Password strength indicator
  - Confirm password
  - Terms checkbox
  - Submit button with loading state
  - Error display
  - React Hook Form + Zod

#### Pages
- [ ] **Landing Page** (`src/app/page.tsx`)
  - Hero section
  - Features section
  - CTA buttons
  - Framer Motion: scroll animations

- [ ] **Login Page** (`src/app/(auth)/login/page.tsx`)
  - LoginForm component
  - Link to register
  - Framer Motion: page transition

- [ ] **Register Page** (`src/app/(auth)/register/page.tsx`)
  - RegisterForm component
  - Link to login
  - Framer Motion: page transition

---

### 3.5 Task Components

#### Task Display Components
- [ ] **TaskCard** (`src/components/tasks/TaskCard.tsx`)
  - Checkbox (mark complete)
  - Priority badge
  - Status badge
  - Title and description
  - Metadata (dates)
  - Action buttons (edit, delete)
  - Hover effects (Framer Motion)
  - Completed state styling
  - Props: task data, onEdit, onDelete, onComplete

- [ ] **TaskList** (`src/components/tasks/TaskList.tsx`)
  - Vertical stack of TaskCards
  - Loading state (skeletons)
  - Empty state
  - Framer Motion: staggered fade-in

- [ ] **TaskBoard** (`src/components/tasks/TaskBoard.tsx`)
  - Three columns (Pending, In Progress, Completed)
  - Drag & drop (framer-motion drag)
  - Compact task cards
  - Column headers with counts

#### Task Interaction Components
- [ ] **CreateTaskModal** (`src/components/tasks/CreateTaskModal.tsx`)
  - Dialog component (shadcn)
  - Title input (required)
  - Description textarea
  - Status selector
  - Priority selector
  - Save/Cancel buttons
  - React Hook Form + Zod
  - Framer Motion: modal slide-up

- [ ] **EditTaskModal** (`src/components/tasks/EditTaskModal.tsx`)
  - Same as CreateTaskModal but pre-filled
  - Delete button (destructive)
  - Props: task data, onSave, onDelete

- [ ] **DeleteTaskDialog** (`src/components/tasks/DeleteTaskDialog.tsx`)
  - ConfirmDialog component
  - Task title in message
  - Delete confirmation
  - Props: task title, onConfirm, onCancel

#### Task Filter Components
- [ ] **TaskFilters** (`src/components/tasks/TaskFilters.tsx`)
  - Status tabs (All, Pending, In Progress, Completed)
  - Priority dropdown
  - Sort dropdown (Date, Priority, Title)
  - Search input
  - Props: filters state, onChange handlers

---

### 3.6 Dashboard Pages

- [ ] **Dashboard Home** (`src/app/(dashboard)/page.tsx`)
  - Welcome header with user name
  - Quick stats cards (Total, Completed, In Progress, Due Today)
  - Recent tasks section
  - "+ New Task" button
  - Framer Motion: cards fade-in

- [ ] **Tasks Page** (`src/app/(dashboard)/tasks/page.tsx`)
  - Page header
  - TaskFilters component
  - View switcher (List/Board tabs)
  - TaskList or TaskBoard based on view
  - CreateTaskModal (triggered by button)
  - Loading and error states

---

### 3.7 Profile & Settings Pages

- [ ] **Profile Page** (`src/app/(dashboard)/profile/page.tsx`)
  - Profile header card
  - User information display
  - Edit mode toggle
  - Statistics section
  - Password change section

- [ ] **Settings Page** (`src/app/(dashboard)/settings/page.tsx`)
  - Settings sidebar
  - General settings (language, timezone)
  - Account settings (password, delete)
  - Appearance settings (theme toggle)

---

### 3.8 Hooks & State Management

#### Custom Hooks
- [ ] **useAuth** (`src/hooks/useAuth.ts`)
  ```typescript
  // Login, register, logout functions
  // Current user state
  // Loading states
  // Error handling
  ```

- [ ] **useTasks** (`src/hooks/useTasks.ts`)
  ```typescript
  // Fetch tasks (TanStack Query)
  // Create task mutation
  // Update task mutation
  // Delete task mutation
  // Toggle complete mutation
  // Optimistic updates
  ```

- [ ] **useToast** (`src/hooks/useToast.ts`)
  ```typescript
  // Show success/error/info toasts
  // Toast queue management
  ```

#### State Stores (Zustand)
- [ ] **authStore** (`src/store/authStore.ts`)
  ```typescript
  // User state
  // Token state
  // Login/logout actions
  // Persist to localStorage
  ```

---

### 3.9 Animations & Transitions (Framer Motion)

#### Page Transitions
- [ ] **Page Layout** with AnimatePresence
  - Fade transitions between routes
  - Exit animations

#### Component Animations
- [ ] **Button Hover/Press**
  - Scale up on hover (1.02)
  - Scale down on press (0.98)

- [ ] **Modal Enter/Exit**
  - Slide up + fade in (entrance)
  - Slide down + fade out (exit)
  - Backdrop fade

- [ ] **Task Card Animations**
  - Hover: lift effect (translateY -2px, shadow increase)
  - Mark complete: strikethrough animation
  - Delete: fade out + slide out
  - Add to list: fade in + slide down

- [ ] **Toast Notifications**
  - Slide in from right
  - Progress bar animation (width 100% to 0%)
  - Slide out on dismiss

- [ ] **Loading Skeletons**
  - Shimmer effect (gradient animation)

- [ ] **Staggered List Animations**
  - Task cards fade in with stagger delay

---

### 3.10 Responsive Design

#### Breakpoints (Tailwind)
```javascript
sm: '640px'   // Small tablets
md: '768px'   // Tablets
lg: '1024px'  // Laptops
xl: '1280px'  // Desktops
2xl: '1536px' // Large desktops
```

#### Responsive Patterns
- [ ] **Sidebar**
  - Desktop: Fixed 240px width
  - Tablet: Collapsed to icons (64px)
  - Mobile: Hidden, hamburger menu

- [ ] **Task Grid**
  - Desktop: 3 columns
  - Tablet: 2 columns
  - Mobile: 1 column

- [ ] **Modals**
  - Desktop: 600px centered
  - Mobile: Full-screen

- [ ] **Top Nav**
  - Desktop: Full elements visible
  - Mobile: Compact with hamburger

---

## Phase 4: API Integration

### Objective
Connect frontend components to backend API endpoints, handle authentication, and manage data flow.

---

### 4.1 API Client Setup

- [ ] **Axios Instance** (`src/lib/api.ts`)
  ```typescript
  import axios from 'axios';

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor: Add JWT token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor: Handle errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Redirect to login
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  export default api;
  ```

---

### 4.2 Authentication Integration

#### API Functions (`src/lib/auth.ts`)
- [ ] **Register**
  ```typescript
  export async function register(data: RegisterRequest) {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  }
  ```

- [ ] **Login**
  ```typescript
  export async function login(data: LoginRequest) {
    const response = await api.post('/api/auth/login', data);
    const { access_token, user } = response.data;

    // Store token
    localStorage.setItem('access_token', access_token);

    return { token: access_token, user };
  }
  ```

- [ ] **Logout**
  ```typescript
  export function logout() {
    localStorage.removeItem('access_token');
    window.location.href = '/login';
  }
  ```

#### Auth Hook (`src/hooks/useAuth.ts`)
- [ ] Implement login mutation
- [ ] Implement register mutation
- [ ] Implement logout function
- [ ] Handle loading and error states
- [ ] Redirect on success

#### Protected Routes (proxy.ts - Next.js 16)
- [ ] **Proxy** (`src/app/proxy.ts`)
  ```typescript
  // app/proxy.ts - Replaces middleware.ts in Next.js 16
  import { NextRequest, NextResponse } from "next/server";

  const publicPaths = ["/", "/login", "/register", "/api/auth"];
  const protectedPaths = ["/dashboard", "/tasks", "/profile", "/settings"];

  function isProtectedPath(pathname: string): boolean {
    return protectedPaths.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`)
    );
  }

  export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionToken = request.cookies.get("access_token");

    // Redirect authenticated users away from auth pages
    if (sessionToken && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect unauthenticated users to login
    if (!sessionToken && isProtectedPath(pathname)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  export const config = {
    matcher: ["/dashboard/:path*", "/tasks/:path*", "/profile/:path*", "/settings/:path*", "/login", "/register"],
  };
  ```

---

### 4.3 Task CRUD Integration

#### API Functions (`src/lib/api.ts`)
- [ ] **Get All Tasks**
  ```typescript
  export async function getTasks(filters?: TaskFilters) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/api/tasks?${params}`);
    return response.data;
  }
  ```

- [ ] **Get Single Task**
  ```typescript
  export async function getTask(id: number) {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  }
  ```

- [ ] **Create Task**
  ```typescript
  export async function createTask(data: CreateTaskRequest) {
    const response = await api.post('/api/tasks', data);
    return response.data;
  }
  ```

- [ ] **Update Task**
  ```typescript
  export async function updateTask(id: number, data: UpdateTaskRequest) {
    const response = await api.put(`/api/tasks/${id}`, data);
    return response.data;
  }
  ```

- [ ] **Mark Complete**
  ```typescript
  export async function toggleTaskComplete(id: number) {
    const response = await api.patch(`/api/tasks/${id}/complete`);
    return response.data;
  }
  ```

- [ ] **Delete Task**
  ```typescript
  export async function deleteTask(id: number) {
    await api.delete(`/api/tasks/${id}`);
  }
  ```

#### TanStack Query Integration (`src/hooks/useTasks.ts`)
- [ ] **useTasksQuery**
  ```typescript
  export function useTasks(filters?: TaskFilters) {
    return useQuery({
      queryKey: ['tasks', filters],
      queryFn: () => getTasks(filters),
    });
  }
  ```

- [ ] **useCreateTaskMutation**
  ```typescript
  export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: createTask,
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks']);
        toast.success('Task created successfully');
      },
      onError: (error) => {
        toast.error('Failed to create task');
      },
    });
  }
  ```

- [ ] **useUpdateTaskMutation**
- [ ] **useDeleteTaskMutation**
- [ ] **useToggleCompleteMutation**

#### Optimistic Updates
- [ ] Implement optimistic UI for task completion
- [ ] Implement optimistic UI for task deletion
- [ ] Revert on error

---

### 4.4 Error Handling

- [ ] **Global Error Handler**
  - Network errors
  - 400: Bad request
  - 401: Unauthorized → Redirect to login
  - 403: Forbidden
  - 404: Not found
  - 422: Validation errors → Show field errors
  - 500: Server error → Generic error message

- [ ] **Form Validation Errors**
  - Display backend validation errors inline
  - Map 422 errors to form fields

- [ ] **Toast Notifications**
  - Success messages
  - Error messages
  - Info messages

---

### 4.5 Loading States

- [ ] **Page-level Loading**
  - Skeleton screens for initial load
  - Loading spinner for data fetching

- [ ] **Component-level Loading**
  - Button loading states (spinner + disabled)
  - Input loading states

- [ ] **Suspense Boundaries**
  - Use React Suspense for async components
  - Fallback loading states

---

### 4.6 Data Synchronization

- [ ] **Auto-refetch**
  - Refetch tasks on window focus
  - Stale time configuration

- [ ] **Cache Management**
  - Set appropriate cache times
  - Invalidate queries on mutations

- [ ] **Real-time Updates (Future)**
  - WebSocket connection for live updates
  - Optimistic UI with server reconciliation

---

## Phase 5: Testing & Quality Assurance

### Manual Testing Checklist

#### Authentication Flow
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials → Show error
- [ ] Logout → Redirect to login
- [ ] Access protected route without token → Redirect to login
- [ ] Token expiration handling

#### Task CRUD
- [ ] Create task with all fields
- [ ] Create task with minimal fields
- [ ] View task list
- [ ] Filter tasks by status
- [ ] Filter tasks by priority
- [ ] Search tasks
- [ ] Sort tasks
- [ ] Edit task
- [ ] Mark task complete/incomplete
- [ ] Delete task with confirmation
- [ ] Cancel delete

#### Responsive Design
- [ ] Test on desktop (1440px)
- [ ] Test on tablet (768px)
- [ ] Test on mobile (375px)
- [ ] Sidebar behavior on different screens
- [ ] Modals behavior (full-screen on mobile)

#### Accessibility
- [ ] Keyboard navigation (Tab, Enter, Esc)
- [ ] Screen reader compatibility
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA

#### Performance
- [ ] Page load time < 3s
- [ ] Animations are smooth (60fps)
- [ ] Images are optimized
- [ ] Lighthouse score > 90

### Automated Testing (Future)
- [ ] Unit tests for utilities and hooks
- [ ] Component tests with Testing Library
- [ ] E2E tests with Playwright
- [ ] API integration tests

---

## Phase 6: Deployment & Optimization

### Pre-deployment Checklist
- [ ] Environment variables configured for production
- [ ] API URL points to production backend
- [ ] Remove console.logs and debug code
- [ ] Optimize images (next/image)
- [ ] Enable React strict mode
- [ ] Run production build locally
- [ ] Test production build

### Deployment (Vercel)
- [ ] Connect GitHub repository to Vercel
- [ ] Configure environment variables in Vercel
- [ ] Set up automatic deployments (main branch)
- [ ] Configure custom domain (optional)
- [ ] Enable analytics

### Post-deployment
- [ ] Verify production deployment
- [ ] Test all features in production
- [ ] Monitor errors (Sentry integration, optional)
- [ ] Check performance metrics

### Optimization
- [ ] Code splitting (dynamic imports)
- [ ] Image optimization
- [ ] Font optimization (next/font)
- [ ] Caching strategies
- [ ] Bundle size analysis

---

## Success Criteria

### Design Phase
✅ All screens designed in Figma (desktop + mobile)
✅ Interactive prototype created and tested
✅ Design system documented
✅ Stakeholder approval received

### Implementation Phase
✅ All components built and match Figma designs
✅ Responsive layouts work on all breakpoints
✅ Animations smooth and performant
✅ API integration complete and working
✅ Error handling comprehensive

### Quality Phase
✅ All manual tests pass
✅ Accessibility standards met
✅ Performance benchmarks achieved
✅ Cross-browser compatibility verified

### Deployment Phase
✅ Application deployed to production
✅ All features work in production
✅ Monitoring and analytics set up

---

## Resources & Documentation

### Design Resources
- **Figma Community Design**: [Link](https://www.figma.com/design/94mDWGXUYL9S0Qdmz1E3Vv/)
- **Color Palette Generator**: Coolors.co
- **Icon Library**: Lucide Icons, Heroicons
- **Illustrations**: unDraw, Storyset

### Development Resources
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS v4**: Use Context7 for latest docs
- **Framer Motion**: https://www.framer.com/motion/
- **shadcn/ui**: https://ui.shadcn.com/
- **TanStack Query**: https://tanstack.com/query/latest

### Backend Resources
- **API Documentation**: `https://naimalcreativityai-sdd-todo-app.hf.space/docs`
- **Backend CLAUDE.md**: `../backend/CLAUDE.md`
- **API Testing PHR**: `../history/prompts/003-backend-todo-app/0004-backend-deployment-and-testing.deployment.prompt.md`

### Skills & Agents
- **figma-expert-agent**: `.claude/agents/figma-expert-agent.md`
- **figma-modern-ui-design**: `.claude/skills/figma-modern-ui-design/SKILL.md`
- **figma-animations-prototypes**: `.claude/skills/figma-animations-prototypes/SKILL.md`
- **figma-backend-integration-design**: `.claude/skills/figma-backend-integration-design/SKILL.md`
- **figma-dashboard-components**: `.claude/skills/figma-dashboard-components/SKILL.md`
- **nextjs**: `.claude/skills/nextjs/SKILL.md` ⚠️ **IMPORTANT: Use for Next.js 16 patterns**
  - Uses `proxy.ts` instead of `middleware.ts`
  - `params` and `searchParams` are Promises (must be awaited)
  - See `reference/proxy.md` and `reference/dynamic-routes.md`
- **shadcn**: `.claude/skills/shadcn/SKILL.md`
- **framer-motion**: `.claude/skills/framer-motion/SKILL.md`

---

**Version**: 1.0.0
**Last Updated**: 2025-12-13
**Status**: Ready to Begin Phase 1 (Figma Design)
