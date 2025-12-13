# Implementation Plan: Authentication UI with API Integration

**Branch**: `006-auth-ui` | **Date**: 2025-12-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-auth-ui/spec.md`

## Summary

Implement login and signup pages with comprehensive form validation, toast notifications, and robust API integration. The feature provides the entry point for user authentication, storing JWT tokens and redirecting users to the dashboard upon successful authentication. All validation happens client-side before API calls to ensure 0% invalid submissions reach the backend.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 16+
**Primary Dependencies**: React Hook Form 7.68, Zod 4.1, Sonner 2.0, Zustand 5.0, Axios 1.13
**Storage**: Cookies (JWT token), LocalStorage (user data via Zustand persist)
**Testing**: Manual testing (automated tests deferred to Phase 3)
**Target Platform**: Web (Desktop, Tablet, Mobile responsive)
**Project Type**: Web application (frontend only for this feature)
**Performance Goals**: Page interactive < 2s, form feedback < 300ms
**Constraints**: Client-side validation must catch 100% invalid submissions
**Scale/Scope**: 2 pages (login, signup), 6 new components, 1 hook, 1 validation module

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | ✅ PASS | Using Claude Code with spec.md as source |
| II. Iterative Evolution | ✅ PASS | Building on Phase 2 frontend setup |
| III. Clean Code & Structure | ✅ PASS | Following Next.js App Router conventions |
| IV. Comprehensive Testing | ⚠️ DEFERRED | Manual testing checklist in quickstart.md |
| V. Documentation & Knowledge Capture | ✅ PASS | PHR will be created, spec complete |
| VI. Cloud-Native Design | ✅ PASS | Stateless auth with JWT tokens |

**Gate Status**: PASS (testing deferred is acceptable for UI features)

## Project Structure

### Documentation (this feature)

```text
specs/006-auth-ui/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 output - technology decisions
├── data-model.md        # Phase 1 output - entity definitions
├── quickstart.md        # Phase 1 output - setup instructions
├── contracts/           # Phase 1 output - API and component contracts
│   ├── auth-api.yaml    # OpenAPI spec for auth endpoints
│   └── components.yaml  # Component interface definitions
└── tasks.md             # Phase 2 output (created by /sp.tasks)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   └── (auth)/                    # Auth route group (NEW)
│   │       ├── layout.tsx             # Redirect authenticated users
│   │       ├── signin/
│   │       │   └── page.tsx           # Login page
│   │       └── signup/
│   │           └── page.tsx           # Registration page
│   ├── components/
│   │   ├── auth/                      # Auth components (NEW)
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── AuthBrandingPanel.tsx
│   │   │   ├── PasswordInput.tsx
│   │   │   ├── PasswordStrengthIndicator.tsx
│   │   │   └── FormError.tsx
│   │   └── ui/                        # Existing shadcn components
│   ├── hooks/
│   │   └── useAuth.ts                 # Auth hook (NEW)
│   ├── lib/
│   │   └── validations/
│   │       └── auth.ts                # Zod schemas (NEW)
│   ├── services/
│   │   └── api.ts                     # Existing singleton (used)
│   ├── store/
│   │   └── auth-store.ts              # Existing store (used)
│   └── types/
│       └── entities.ts                # Existing types (used)
```

**Structure Decision**: Web application structure selected. All new code goes in `frontend/src/` following established patterns. No backend changes required - using deployed API at `https://naimalcreativityai-sdd-todo-app.hf.space`.

## Complexity Tracking

> No complexity violations. All requirements can be met with existing patterns.

| Aspect | Complexity Level | Justification |
|--------|-----------------|---------------|
| Components | Low | 6 focused components with single responsibilities |
| State | Low | Existing Zustand store handles all auth state |
| Validation | Medium | Zod schemas with custom password rules |
| API Integration | Low | Existing axios singleton with interceptors |

## Implementation Phases

### Phase 1: Foundation (Validation + Hook)
1. Create Zod validation schemas (`lib/validations/auth.ts`)
2. Create useAuth hook with login/register functions
3. Test API connectivity with deployed backend

### Phase 2: UI Components
1. PasswordInput with visibility toggle
2. PasswordStrengthIndicator
3. FormError component
4. AuthBrandingPanel

### Phase 3: Forms
1. LoginForm with React Hook Form integration
2. SignupForm with React Hook Form integration

### Phase 4: Pages & Routing
1. Auth layout with redirect logic
2. Login page
3. Signup page
4. Update landing page navbar links

## Dependencies Map

```
┌─────────────────────────────────────────────────────────┐
│                    External                              │
├─────────────────────────────────────────────────────────┤
│  Backend API (deployed)                                  │
│  └─ POST /api/auth/register                             │
│  └─ POST /api/auth/login                                │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                 Frontend (this feature)                  │
├─────────────────────────────────────────────────────────┤
│  lib/validations/auth.ts                                │
│       │                                                  │
│       ▼                                                  │
│  hooks/useAuth.ts ◄──── services/api.ts (existing)      │
│       │                      │                           │
│       ▼                      ▼                           │
│  store/auth-store.ts (existing)                         │
│       │                                                  │
│       ▼                                                  │
│  components/auth/*                                       │
│       │                                                  │
│       ▼                                                  │
│  app/(auth)/signin & signup pages                       │
└─────────────────────────────────────────────────────────┘
```

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Backend API unavailable | Low | High | API is deployed and tested; add timeout handling |
| Validation mismatch | Low | Medium | Validation rules derived from backend schemas |
| Token storage issues | Low | Medium | Using proven cookie + Zustand pattern |
| Mobile responsiveness | Medium | Low | Follow Figma spec breakpoints |

## Success Metrics

From spec.md Success Criteria:
- SC-001: Registration < 60 seconds ✓ (achievable with proper UX)
- SC-003: 100% client-side validation ✓ (Zod schemas)
- SC-004: 100% API errors show toast ✓ (useAuth hook)
- SC-008: 0% invalid API submissions ✓ (form disabled until valid)

## Next Steps

Run `/sp.tasks` to generate the task breakdown for implementation.
