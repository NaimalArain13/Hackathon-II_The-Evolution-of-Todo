# Implementation Plan: Dashboard UI and API Integration

**Branch**: `007-dashboard-ui` | **Date**: 2025-12-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-dashboard-ui/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a modern, responsive dashboard UI for the todo application that integrates with all existing backend APIs. The dashboard provides comprehensive task management capabilities including CRUD operations, filtering, searching, sorting, and user profile management. The interface features a collapsible sidebar navigation, smooth animations, and a mobile-first responsive design following 2025 dashboard design trends. All 85 functional requirements from the spec will be implemented using Next.js 16+, shadcn/ui components, Tailwind CSS, and Framer Motion for animations.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 16+ (App Router)
**Primary Dependencies**:
- Next.js 16+ (App Router, Server/Client Components)
- React 19+
- shadcn/ui component library
- Tailwind CSS 3.4+
- Framer Motion 11+ (animations)
- React Query / TanStack Query (API state management)
- Zod (form validation)
- Axios (HTTP client with JWT injection)

**Storage**: Client-side state management (React Query cache, localStorage for JWT tokens)
**Testing**: Jest + React Testing Library for unit/integration tests, Playwright for E2E tests
**Target Platform**: Modern web browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+), Mobile-first responsive (320px - 2560px viewports)
**Project Type**: Web application (frontend only, integrates with existing FastAPI backend)
**Performance Goals**:
- Initial page load <1 second (broadband)
- Filter/search response <300ms
- 60fps smooth animations
- Support 1000+ tasks without UI lag

**Constraints**:
- All API responses <5 seconds (timeout)
- Touch targets ≥44px on mobile
- Keyboard navigation for all interactive elements
- WCAG 2.1 Level AA accessibility compliance

**Scale/Scope**:
- 10 user stories (P1-P3 prioritized)
- 85 functional requirements
- 15+ UI components (sidebar, task cards, modals, forms, filters, etc.)
- 6+ pages/sections (dashboard, tasks, profile)
- Support for concurrent users with individual authentication

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Spec-Driven Development ✅
- **Status**: PASS
- **Evidence**: Complete feature specification exists at `specs/007-dashboard-ui/spec.md` with 10 user stories, 85 functional requirements, and 15 success criteria
- **Implementation**: Will use Claude Code to implement from spec, plan, and tasks artifacts

### Principle II: Iterative Evolution & AI-Native Architecture ✅
- **Status**: PASS
- **Evidence**: Dashboard builds on Phase II (Full-Stack Web Application) foundation, integrating with existing authentication and backend APIs
- **Future Compatibility**: Design supports Phase III (AI Chatbot) by maintaining clean separation between UI and API client layer

### Principle III: Clean Code & Structure ✅
- **Status**: PASS
- **Evidence**: Following Next.js 16+ best practices with:
  - Server Components by default
  - Client Components only when needed (interactivity, hooks)
  - Organized component structure
  - Reusable UI components with shadcn/ui
  - Type-safe API client with TypeScript

### Principle IV: Comprehensive Testing ✅
- **Status**: PASS
- **Plan**:
  - Unit tests for utility functions and hooks
  - Component tests for UI components
  - Integration tests for API integration
  - E2E tests for critical user flows (create task, filter, edit, delete)

### Principle V: Documentation & Knowledge Capture ✅
- **Status**: PASS
- **Evidence**:
  - Feature spec: `specs/007-dashboard-ui/spec.md`
  - Implementation plan: `specs/007-dashboard-ui/plan.md` (this file)
  - PHR created: `history/prompts/007-dashboard-ui/0001-...`
  - Will generate: research.md, data-model.md, quickstart.md, contracts/

### Principle VI: Cloud-Native & Event-Driven Design ✅
- **Status**: PASS
- **Considerations**:
  - Stateless frontend (all state in backend)
  - JWT-based authentication (ready for distributed systems)
  - RESTful API integration (can evolve to event-driven in Phase V)
  - Containerization-ready (can be Dockerized for Phase IV)

**Overall Gate Status**: ✅ PASS - All principles satisfied, no violations requiring justification

## Project Structure

### Documentation (this feature)

```text
specs/007-dashboard-ui/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command - NEXT)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   ├── components.yaml  # UI component contracts
│   └── routes.yaml      # Frontend routing contracts
├── checklists/
│   └── requirements.md  # Spec quality validation (completed)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Option 2: Web application (frontend + existing backend)
frontend/
├── src/
│   ├── app/                    # Next.js 16+ App Router
│   │   ├── (dashboard)/        # Dashboard route group
│   │   │   ├── layout.tsx      # Dashboard layout with sidebar
│   │   │   ├── page.tsx        # Main dashboard page
│   │   │   ├── tasks/          # Tasks section
│   │   │   │   └── page.tsx
│   │   │   └── profile/        # Profile section
│   │   │       └── page.tsx
│   │   ├── (auth)/             # Auth route group (existing)
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page (existing)
│   │   └── globals.css         # Global styles
│   ├── components/             # React components
│   │   ├── dashboard/          # Dashboard-specific components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── TaskList.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskFilters.tsx
│   │   │   ├── TaskSort.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── modals/             # Modal components
│   │   │   ├── CreateTaskModal.tsx
│   │   │   ├── EditTaskModal.tsx
│   │   │   └── DeleteConfirmDialog.tsx
│   │   ├── ui/                 # shadcn/ui components (existing)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── ... (other shadcn components)
│   │   └── providers/          # Context providers (existing)
│   │       ├── query-provider.tsx
│   │       └── auth-provider.tsx
│   ├── lib/                    # Utilities and configurations
│   │   ├── api-client.ts       # Axios client with JWT injection (existing)
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useTasks.ts     # Task CRUD operations
│   │   │   ├── useFilters.ts   # Filter state management
│   │   │   ├── useProfile.ts   # Profile operations
│   │   │   └── useAuth.ts      # Auth operations (existing)
│   │   ├── validations/        # Zod schemas
│   │   │   └── task.ts         # Task validation schemas
│   │   └── utils.ts            # Utility functions (existing)
│   ├── types/                  # TypeScript type definitions
│   │   ├── task.ts             # Task entity types
│   │   ├── filter.ts           # Filter state types
│   │   └── api.ts              # API response types (existing)
│   └── services/               # API service layer
│       ├── tasks.ts            # Task API calls
│       └── profile.ts          # Profile API calls
├── tests/                      # Test files
│   ├── components/             # Component tests
│   │   ├── TaskCard.test.tsx
│   │   ├── TaskFilters.test.tsx
│   │   └── Sidebar.test.tsx
│   ├── hooks/                  # Hook tests
│   │   ├── useTasks.test.ts
│   │   └── useFilters.test.ts
│   └── e2e/                    # End-to-end tests
│       ├── dashboard.spec.ts
│       ├── task-crud.spec.ts
│       └── filters.spec.ts
├── public/                     # Static assets (existing)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
└── CLAUDE.md                   # Frontend-specific guidelines (existing)

backend/                        # Existing FastAPI backend (no changes)
├── routes/
│   ├── tasks.py               # Task endpoints (existing)
│   └── auth.py                # Auth endpoints (existing)
└── ... (other backend files)
```

**Structure Decision**: Using existing frontend/ directory with Next.js 16+ App Router. The dashboard will be implemented as a new route group `(dashboard)/` within `src/app/` to leverage Next.js layout nesting and protect routes with authentication middleware. Components are organized by domain (dashboard, modals, ui) for maintainability. All new code follows the patterns established in `frontend/CLAUDE.md`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All constitution principles are satisfied without requiring exceptions or complexity justifications.
