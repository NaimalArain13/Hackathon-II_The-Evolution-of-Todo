# Feature Specification: Frontend Project Setup

**Feature Branch**: `004-frontend-setup`
**Created**: 2025-12-13
**Status**: Draft
**Input**: User description: "Frontend project setup and installation including Next.js 16, Tailwind CSS, shadcn/ui, authentication store, and singleton axios service"

---

## Tech Stack & Dependencies

### Core Framework
| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16+ | React framework with App Router |
| React | 19+ | UI library |
| TypeScript | 5+ | Type-safe JavaScript |

### Styling & UI Components
| Package | Version | Purpose |
|---------|---------|---------|
| Tailwind CSS | v4 (latest) | Utility-first CSS framework |
| shadcn/ui | latest | Accessible component library |
| class-variance-authority | latest | Component variant management |
| clsx | latest | Conditional className utility |
| tailwind-merge | latest | Merge Tailwind classes safely |
| tailwindcss-animate | latest | Animation utilities for Tailwind |

### shadcn/ui Components to Install
| Component | Purpose |
|-----------|---------|
| Button | Primary action buttons with variants |
| Input | Text input fields |
| Label | Form labels |
| Card | Content containers |
| Dialog | Modal dialogs |
| Dropdown Menu | Action menus |
| Select | Selection dropdowns |
| Checkbox | Boolean inputs |
| Radio Group | Single-choice selection |
| Tabs | Tab navigation |
| Toast | Notification messages |
| Form | Form wrapper with validation |
| Avatar | User profile images |
| Badge | Status indicators |
| Skeleton | Loading placeholders |

### Radix UI Primitives (shadcn dependencies)
| Package | Purpose |
|---------|---------|
| @radix-ui/react-slot | Slot component for composition |
| @radix-ui/react-dialog | Dialog primitive |
| @radix-ui/react-dropdown-menu | Dropdown menu primitive |
| @radix-ui/react-select | Select primitive |
| @radix-ui/react-checkbox | Checkbox primitive |
| @radix-ui/react-radio-group | Radio group primitive |
| @radix-ui/react-tabs | Tabs primitive |
| @radix-ui/react-toast | Toast primitive |
| @radix-ui/react-tooltip | Tooltip primitive |

### Animation
| Package | Version | Purpose |
|---------|---------|---------|
| framer-motion | latest | Declarative animations, page transitions, gestures |

### Icons
| Package | Version | Purpose |
|---------|---------|---------|
| lucide-react | latest | Modern icon library (consistent with shadcn/ui) |

### Forms & Validation
| Package | Version | Purpose |
|---------|---------|---------|
| react-hook-form | latest | Performant form state management |
| @hookform/resolvers | latest | Validation resolver integration |
| zod | latest | Schema validation library |

### State Management & Data Fetching
| Package | Version | Purpose |
|---------|---------|---------|
| @tanstack/react-query | latest | Server state management, caching |
| @tanstack/react-query-devtools | latest | DevTools for React Query |
| zustand | latest | Lightweight client state management |

### API & HTTP
| Package | Version | Purpose |
|---------|---------|---------|
| axios | latest | HTTP client with interceptors |
| js-cookie | latest | Cookie management for token storage |
| jwt-decode | latest | JWT token decoding |

### Date & Time
| Package | Version | Purpose |
|---------|---------|---------|
| date-fns | latest | Date formatting and manipulation |

### Authentication
| Package | Version | Purpose |
|---------|---------|---------|
| better-auth | latest | Authentication library |

### Development Dependencies
| Package | Purpose |
|---------|---------|
| @types/node | Node.js type definitions |
| @types/react | React type definitions |
| @types/react-dom | React DOM type definitions |
| eslint | Code linting |
| eslint-config-next | Next.js ESLint config |
| prettier | Code formatting |
| prettier-plugin-tailwindcss | Tailwind class sorting |
| @typescript-eslint/parser | TypeScript ESLint parser |
| @typescript-eslint/eslint-plugin | TypeScript ESLint rules |

### Installation Commands

```bash
# Core dependencies
npm install next@latest react@latest react-dom@latest typescript@latest

# Styling & UI
npm install tailwindcss@next postcss autoprefixer
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate
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
npm install zustand

# API & HTTP
npm install axios js-cookie jwt-decode

# Date utilities
npm install date-fns

# Authentication
npm install better-auth

# Dev dependencies
npm install -D @types/node @types/react @types/react-dom @types/js-cookie
npm install -D eslint eslint-config-next
npm install -D prettier prettier-plugin-tailwindcss
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### shadcn/ui Installation Commands

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Install all required components
npx shadcn@latest add button input label card dialog dropdown-menu select checkbox radio-group tabs toast form avatar badge skeleton
```

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Initializes Frontend Project (Priority: P1)

As a developer, I want to initialize the frontend project with all necessary dependencies and configurations so that I can immediately start building UI components without setup friction.

**Why this priority**: This is the foundational setup that enables all subsequent development work. Without a properly configured project, no other features can be built.

**Independent Test**: Can be fully tested by running the development server and verifying all dependencies are installed and the project compiles without errors.

**Acceptance Scenarios**:

1. **Given** the frontend directory exists, **When** a developer runs the setup commands, **Then** a fully configured Next.js 16 project is created with App Router enabled
2. **Given** the project is initialized, **When** a developer runs the development server, **Then** the application starts successfully on localhost:3000
3. **Given** all dependencies are installed, **When** a developer imports any installed package, **Then** the imports resolve correctly without errors

---

### User Story 2 - Developer Uses Design System (Priority: P1)

As a developer, I want pre-configured design tokens (colors, typography, spacing) matching the TaskFlow design specification so that I can build consistent UI components.

**Why this priority**: Design consistency is essential for building a professional-looking application. This must be in place before any UI components are created.

**Independent Test**: Can be fully tested by creating a test component that uses the design tokens and verifying the correct colors/spacing are applied.

**Acceptance Scenarios**:

1. **Given** Tailwind CSS is configured, **When** a developer uses a primary color class (e.g., `bg-primary-500`), **Then** the correct brand color (#3ABEFF cyan) is applied
2. **Given** the design system is configured, **When** a developer uses spacing utilities, **Then** the 4px baseline grid spacing is available
3. **Given** typography is configured, **When** a developer uses text styles, **Then** the Inter font family is applied with correct weights

---

### User Story 3 - Developer Uses UI Component Library (Priority: P1)

As a developer, I want shadcn/ui components installed and configured so that I can rapidly build interfaces using pre-built, accessible components.

**Why this priority**: Pre-built components dramatically accelerate development and ensure accessibility standards are met from the start.

**Independent Test**: Can be fully tested by rendering each installed shadcn component in isolation and verifying they display and function correctly.

**Acceptance Scenarios**:

1. **Given** shadcn/ui is initialized, **When** a developer imports a Button component, **Then** the component renders with correct styling and variants
2. **Given** form components are installed, **When** a developer creates a form, **Then** Input, Label, Checkbox, and Select components are available and functional
3. **Given** feedback components are installed, **When** a developer triggers a toast notification, **Then** the Toast component displays correctly

---

### User Story 4 - Developer Makes API Requests (Priority: P2)

As a developer, I want a singleton API service configured with request/response interceptors so that I can make authenticated requests to the backend without repetitive boilerplate code.

**Why this priority**: API integration is essential for any feature that requires backend communication. A well-structured API service prevents code duplication and ensures consistent error handling.

**Independent Test**: Can be fully tested by making a test API request and verifying the request includes proper headers and handles responses/errors correctly.

**Acceptance Scenarios**:

1. **Given** the API service is configured, **When** a developer makes a GET request, **Then** the request is sent to the correct backend URL with proper Content-Type headers
2. **Given** an authentication token exists, **When** a developer makes any API request, **Then** the Authorization header is automatically included
3. **Given** a 401 response is received, **When** the interceptor processes the response, **Then** the user is redirected to the login page and tokens are cleared
4. **Given** the API service is imported in multiple components, **When** each component uses it, **Then** they all share the same singleton instance

---

### User Story 5 - Developer Manages Authentication State (Priority: P2)

As a developer, I want an authentication store that persists user session state so that I can build protected routes and display user-specific content.

**Why this priority**: Authentication state management is required before building any protected features or user-specific functionality.

**Independent Test**: Can be fully tested by setting/getting auth state and verifying it persists across page refreshes.

**Acceptance Scenarios**:

1. **Given** the auth store is implemented, **When** a developer stores a user token, **Then** the token is persisted and retrievable across the application
2. **Given** a user is authenticated, **When** a developer checks authentication status, **Then** the current user data and authentication state are available
3. **Given** token persistence is enabled, **When** the page is refreshed, **Then** the authentication state is restored from storage

---

### User Story 6 - Developer Uses Type Definitions (Priority: P2)

As a developer, I want TypeScript type definitions for all API entities (User, Task) so that I can write type-safe code with IDE autocompletion.

**Why this priority**: Type safety catches errors at compile time and improves developer productivity through better IDE support.

**Independent Test**: Can be fully tested by using type definitions in code and verifying TypeScript compilation succeeds with proper type checking.

**Acceptance Scenarios**:

1. **Given** type definitions exist, **When** a developer imports User type, **Then** all user properties (id, email, name, created_at) are available with correct types
2. **Given** Task type is defined, **When** a developer creates a task object, **Then** TypeScript validates status must be 'pending' | 'in_progress' | 'completed'
3. **Given** API response types exist, **When** a developer handles an API response, **Then** the response data is properly typed

---

### User Story 7 - Developer Runs Development Server (Priority: P3)

As a developer, I want environment variables properly configured so that I can run the application locally with the correct API endpoint and secrets.

**Why this priority**: Environment configuration is necessary for local development and testing against the backend API.

**Independent Test**: Can be fully tested by starting the development server and making a test API call to verify environment variables are loaded.

**Acceptance Scenarios**:

1. **Given** environment variables are configured, **When** the application starts, **Then** NEXT_PUBLIC_API_URL points to the backend API
2. **Given** .env.local exists with proper values, **When** accessing process.env, **Then** all required variables are available

---

### Edge Cases

- What happens when dependencies fail to install? The developer should receive clear error messages and installation should be retryable.
- What happens when the backend API is unavailable? The API service should handle network errors gracefully and provide meaningful error messages.
- What happens when authentication tokens expire? The API interceptor should detect 401 responses and redirect to login.
- What happens when localStorage is unavailable (e.g., private browsing)? The auth store should handle storage failures gracefully with in-memory fallback.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST initialize a Next.js 16+ project with App Router enabled and TypeScript configuration
- **FR-002**: System MUST install and configure Tailwind CSS with the TaskFlow design token color palette (primary: Cyan #3ABEFF, danger: Red/Coral #FF6767, neutral: Custom grays #F8F8FB, #F8F8F8, #F5F8FF, #A1A3AB, #000000)
- **FR-003**: System MUST configure typography using Inter font family with the specified type scale (12px to 48px)
- **FR-004**: System MUST install and configure shadcn/ui with the following components: Button, Input, Label, Card, Dialog, Dropdown Menu, Select, Checkbox, Radio Group, Tabs, Toast, Form, Avatar, Badge, Skeleton
- **FR-005**: System MUST create a singleton API service using Axios with request interceptor for JWT token injection
- **FR-006**: System MUST implement response interceptor that handles 401 errors by clearing tokens and redirecting to login
- **FR-007**: System MUST create an authentication store using Zustand with token persistence to cookies
- **FR-008**: System MUST define TypeScript interfaces for User, Task, API responses, and form data
- **FR-009**: System MUST configure environment variables for API URL (NEXT_PUBLIC_API_URL) and authentication secret (BETTER_AUTH_SECRET)
- **FR-010**: System MUST create the project folder structure as defined in the ROADMAP (src/app, src/components, src/lib, src/hooks, src/types, src/store, src/services, src/constants)
- **FR-011**: System MUST install animation library (Framer Motion) for UI animations
- **FR-012**: System MUST install form handling libraries (React Hook Form, Zod) for form validation
- **FR-013**: System MUST install data fetching library (TanStack Query) for server state management
- **FR-014**: System MUST configure path aliases (@/*) for clean imports
- **FR-015**: System MUST install icon library (Lucide React) for consistent iconography

### Key Entities

- **User**: Represents an authenticated user with properties: id (number), email (string), name (string), created_at (timestamp)
- **Task**: Represents a todo item with properties: id (number), title (string), description (string), status (pending | in_progress | completed), priority (low | medium | high), user_id (number), created_at (timestamp), updated_at (timestamp)
- **AuthState**: Represents authentication state with properties: user (User | null), token (string | null), isAuthenticated (boolean)
- **ApiResponse**: Generic wrapper for API responses with properties: data (T), error (string | null), status (number)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can start the development server within 30 seconds of cloning the repository (after npm install)
- **SC-002**: All 14 specified shadcn/ui components are installed and importable without errors
- **SC-003**: Design tokens match the TaskFlow design specification with 100% color accuracy
- **SC-004**: The singleton API service correctly injects authentication tokens in 100% of authenticated requests
- **SC-005**: Authentication state persists across browser sessions when remember-me is enabled
- **SC-006**: TypeScript compilation completes without type errors for all defined entities
- **SC-007**: The project structure contains all 8 required directories (app, components, lib, hooks, types, store, services, constants)
- **SC-008**: Development server hot-reloads changes within 2 seconds

## Assumptions

- The backend API at `https://naimalcreativityai-sdd-todo-app.hf.space/` is operational and follows the documented API contract
- Developers have Node.js 18+ and npm installed on their development machines
- The project will be deployed to Vercel, so Next.js conventions should be followed
- Cookie-based token storage is preferred over localStorage for better security (using js-cookie library)
- The authentication will use JWT tokens issued by the backend API

## Dependencies

- **Backend API**: `https://naimalcreativityai-sdd-todo-app.hf.space/` - Must be operational for API integration testing
- **Design Specification**: `frontend/FIGMA_DESIGN_SPEC.md` - Defines all design tokens and component specifications
- **Previous Features**: This is a foundational feature with no dependencies on other features

## Out of Scope

- Implementation of actual UI pages (landing, login, dashboard) - covered in separate features
- Backend authentication logic - already implemented in backend
- Deployment configuration - will be covered in a deployment feature
- Testing framework setup - deferred to a future phase
- Dark mode implementation - will be added as an enhancement
