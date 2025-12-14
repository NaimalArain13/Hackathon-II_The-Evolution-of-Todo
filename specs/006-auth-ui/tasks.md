# Tasks: Authentication UI with API Integration

**Input**: Design documents from `/specs/006-auth-ui/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Manual testing only (automated tests deferred per plan.md)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` for all frontend code
- Backend API already deployed at `https://naimalcreativityai-sdd-todo-app.hf.space`

---

## Phase 1: Setup

**Purpose**: Create directory structure and foundational files

- [x] T001 Create auth components directory at `frontend/src/components/auth/`
- [x] T002 Create validations directory at `frontend/src/lib/validations/`
- [x] T003 Create auth route group directory at `frontend/src/app/(auth)/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core validation schemas and auth hook that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create Zod validation schemas (loginSchema, registerSchema) in `frontend/src/lib/validations/auth.ts`
- [x] T005 Create useAuth hook with login/register/logout functions in `frontend/src/hooks/useAuth.ts`
- [x] T006 [P] Create FormError component for inline validation errors in `frontend/src/components/auth/FormError.tsx`
- [x] T007 [P] Create AuthBrandingPanel component (right-side gradient panel) in `frontend/src/components/auth/AuthBrandingPanel.tsx`
- [x] T008 Create auth layout with redirect logic for authenticated users in `frontend/src/app/(auth)/layout.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - New User Registration (Priority: P1) 🎯 MVP

**Goal**: New visitors can create an account and be redirected to dashboard

**Independent Test**: Create a new account with valid credentials (name, email, password) and verify landing on dashboard with success toast

### Implementation for User Story 1

- [x] T009 [P] [US1] Create PasswordInput component with visibility toggle in `frontend/src/components/auth/PasswordInput.tsx`
- [x] T010 [P] [US1] Create PasswordStrengthIndicator component in `frontend/src/components/auth/PasswordStrengthIndicator.tsx`
- [x] T011 [US1] Create SignupForm component with React Hook Form integration in `frontend/src/components/auth/SignupForm.tsx`
- [x] T012 [US1] Create signup page with split-screen layout in `frontend/src/app/(auth)/signup/page.tsx`
- [x] T013 [US1] Add registration validation: name (1-100 chars), email (valid format), password (8+ chars, 1 number, 1 special char), confirmPassword (must match)
- [x] T014 [US1] Implement form submission with loading state, success toast, and redirect to /dashboard
- [x] T015 [US1] Implement error handling for API errors (409 email exists, network errors, server errors)

**Checkpoint**: At this point, User Story 1 should be fully functional - new users can register

---

## Phase 4: User Story 2 - Existing User Login (Priority: P1)

**Goal**: Existing users can sign in and be redirected to dashboard

**Independent Test**: Log in with valid credentials and verify landing on dashboard with success toast

### Implementation for User Story 2

- [x] T016 [US2] Create LoginForm component with React Hook Form integration in `frontend/src/components/auth/LoginForm.tsx`
- [x] T017 [US2] Create signin page with split-screen layout in `frontend/src/app/(auth)/signin/page.tsx`
- [x] T018 [US2] Add login validation: email (required, valid format), password (required)
- [x] T019 [US2] Implement form submission with loading state, success toast, and redirect to /dashboard
- [x] T020 [US2] Implement error handling for API errors (401 invalid credentials, network errors, server errors)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can register and login

---

## Phase 5: User Story 3 - Navigation Between Auth Pages (Priority: P2)

**Goal**: Users can navigate between login/signup pages and access them from landing page

**Independent Test**: Click navigation links and verify correct page transitions

### Implementation for User Story 3

- [x] T021 [US3] Add "Don't have an account? Sign up" link to LoginForm in `frontend/src/components/auth/LoginForm.tsx`
- [x] T022 [US3] Add "Already have an account? Sign in" link to SignupForm in `frontend/src/components/auth/SignupForm.tsx`
- [x] T023 [US3] Update LandingNavbar Login button to link to /signin in `frontend/src/components/landing/LandingNavbar.tsx`
- [x] T024 [US3] Update LandingNavbar Sign Up button to link to /signup in `frontend/src/components/landing/LandingNavbar.tsx`

**Checkpoint**: Users can navigate between auth pages and access from landing page

---

## Phase 6: User Story 4 - Password Visibility Toggle (Priority: P3)

**Goal**: Users can toggle password visibility on all password fields

**Independent Test**: Click eye icon and verify password text toggles between hidden and visible

### Implementation for User Story 4

- [x] T025 [US4] Ensure PasswordInput component includes Eye/EyeOff icon toggle in `frontend/src/components/auth/PasswordInput.tsx`
- [x] T026 [US4] Verify toggle works on signup password field
- [x] T027 [US4] Verify toggle works on signup confirmPassword field
- [x] T028 [US4] Verify toggle works on login password field

**Checkpoint**: All password fields have functional visibility toggle

---

## Phase 7: User Story 5 - Password Strength Indicator (Priority: P3)

**Goal**: Users see real-time password strength feedback during registration

**Independent Test**: Type passwords of varying strength and observe indicator changes (Weak/Medium/Strong)

### Implementation for User Story 5

- [x] T029 [US5] Ensure PasswordStrengthIndicator shows progress bar with 3 segments in `frontend/src/components/auth/PasswordStrengthIndicator.tsx`
- [x] T030 [US5] Implement strength calculation: Weak (missing requirements), Medium (partial), Strong (all requirements met)
- [x] T031 [US5] Add color coding: red (weak), yellow (medium), green (strong)
- [x] T032 [US5] Integrate PasswordStrengthIndicator into SignupForm below password field

**Checkpoint**: Password strength indicator provides real-time feedback

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T033 Verify responsive design: desktop (split-screen), tablet, mobile (form only) on all auth pages
- [ ] T034 Verify keyboard navigation and accessibility (tab order, aria labels, focus management)
- [ ] T035 Verify all error states show appropriate toast notifications
- [ ] T036 Run manual testing checklist from `specs/006-auth-ui/quickstart.md`
- [ ] T037 Verify Figma design spec compliance (colors, typography, spacing) per `frontend/FIGMA_DESIGN_SPEC.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 and US2 are both P1 and can proceed in parallel after Foundational
  - US3 depends on US1 and US2 form components existing
  - US4 and US5 are P3 enhancements that can be done after core functionality
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - Creates SignupForm, PasswordInput, PasswordStrengthIndicator
- **User Story 2 (P1)**: Can start after Foundational - Creates LoginForm, reuses PasswordInput
- **User Story 3 (P2)**: Depends on US1 and US2 forms existing - Adds navigation links
- **User Story 4 (P3)**: Depends on PasswordInput component - Verifies toggle functionality
- **User Story 5 (P3)**: Depends on PasswordStrengthIndicator component - Verifies indicator functionality

### Within Each User Story

- Components before forms
- Forms before pages
- Core implementation before error handling
- Story complete before moving to next priority

### Parallel Opportunities

- T001, T002, T003 (Setup) can run in parallel
- T006, T007 (FormError, AuthBrandingPanel) can run in parallel
- T009, T010 (PasswordInput, PasswordStrengthIndicator) can run in parallel
- US1 and US2 can be worked on in parallel after Foundational phase

---

## Parallel Example: Phase 2 Foundational

```bash
# After T004 and T005 complete, launch these in parallel:
Task: T006 "Create FormError component in frontend/src/components/auth/FormError.tsx"
Task: T007 "Create AuthBrandingPanel component in frontend/src/components/auth/AuthBrandingPanel.tsx"
```

## Parallel Example: User Story 1

```bash
# After Foundational complete, launch in parallel:
Task: T009 "Create PasswordInput component in frontend/src/components/auth/PasswordInput.tsx"
Task: T010 "Create PasswordStrengthIndicator component in frontend/src/components/auth/PasswordStrengthIndicator.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + 2)

1. Complete Phase 1: Setup (3 tasks)
2. Complete Phase 2: Foundational (5 tasks) - CRITICAL
3. Complete Phase 3: User Story 1 - Registration (7 tasks)
4. Complete Phase 4: User Story 2 - Login (5 tasks)
5. **STOP and VALIDATE**: Test both registration and login independently
6. Deploy/demo if ready - core auth functionality complete

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test registration → Users can sign up (MVP!)
3. Add User Story 2 → Test login → Users can sign in
4. Add User Story 3 → Navigation links work
5. Add User Story 4 + 5 → UX enhancements complete
6. Polish phase → Production ready

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| Phase 1: Setup | 3 | Directory structure |
| Phase 2: Foundational | 5 | Validation, hook, shared components |
| Phase 3: US1 Registration | 7 | Signup form and page |
| Phase 4: US2 Login | 5 | Login form and page |
| Phase 5: US3 Navigation | 4 | Auth page navigation |
| Phase 6: US4 Password Toggle | 4 | Visibility toggle verification |
| Phase 7: US5 Strength Indicator | 4 | Password strength feedback |
| Phase 8: Polish | 5 | Responsive, accessibility, testing |
| **Total** | **37** | |

### Tasks per User Story

- US1 (Registration): 7 tasks
- US2 (Login): 5 tasks
- US3 (Navigation): 4 tasks
- US4 (Password Toggle): 4 tasks
- US5 (Strength Indicator): 4 tasks

### MVP Scope

- **Minimum**: Phase 1-4 (20 tasks) - Users can register and login
- **Recommended**: Phase 1-5 (24 tasks) - Full navigation working

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Backend API already deployed - no backend tasks needed
- All validation rules match backend schemas exactly
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
