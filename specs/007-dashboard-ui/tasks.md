# Tasks: Dashboard UI and API Integration

**Input**: Design documents from `/specs/007-dashboard-ui/`
**Prerequisites**: plan.md, spec.md (10 user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL for this feature - not explicitly requested in specification. Tasks focus on implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Web app structure: `frontend/src/` for frontend code
- Backend: `backend/` (existing, no changes needed)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [x] T001 Install core dependencies (Next.js 16+, React 19+, TypeScript 5.x) via pnpm in frontend/
- [x] T002 [P] Install UI dependencies (@tanstack/react-query@^5.17.0, framer-motion@^11.0.0) in frontend/
- [x] T003 [P] Install form dependencies (react-hook-form@^7.49.0, zod@^3.22.0, @hookform/resolvers) in frontend/
- [x] T004 [P] Install utility dependencies (axios@^1.6.5, sonner@^1.3.0, lucide-react@^0.309.0, class-variance-authority@^0.7.0, clsx@^2.1.0, tailwind-merge@^2.2.0) in frontend/
- [x] T005 [P] Install optional dependency react-window@^1.8.10 for virtual scrolling in frontend/
- [x] T006 Install shadcn/ui components (button, input, select, checkbox, card, badge, dialog, alert-dialog, skeleton, tooltip, avatar, form, dropdown-menu, label, textarea, tabs, radio-group) in frontend/
- [x] T007 Create project directory structure (frontend/src/components/dashboard/, frontend/src/components/modals/, frontend/src/lib/hooks/, frontend/src/lib/validations/, frontend/src/services/, frontend/src/types/) per plan.md
- [x] T008 Verify environment variables in frontend/.env.local (NEXT_PUBLIC_API_URL)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T009 [P] Create TypeScript type definitions in frontend/src/types/task.ts (Task, TaskPriority, TaskCategory, TaskCreateInput, TaskUpdateInput enums and interfaces)
- [x] T010 [P] Create filter type definitions in frontend/src/types/filter.ts (TaskStatus, TaskFilters, defaultFilters)
- [x] T011 [P] Create sort type definitions in frontend/src/types/sort.ts (SortField, SortOrder, TaskSort, defaultSort)
- [x] T012 [P] Create form type definitions in frontend/src/types/forms.ts (CreateTaskFormData, EditTaskFormData, EditProfileFormData)
- [x] T013 Verify API client configuration in frontend/src/lib/api-client.ts (Axios instance with JWT interceptor, baseURL, timeout, error handling)
- [x] T014 Create task service layer in frontend/src/services/tasks.ts (getTasks, createTask, updateTask, deleteTask, toggleComplete functions with proper typing)
- [x] T015 [P] Create profile service layer in frontend/src/services/profile.ts (getProfile, updateProfile functions)
- [x] T016 Verify React Query provider setup in frontend/src/components/providers/query-provider.tsx (QueryClient with staleTime, gcTime, refetchOnWindowFocus configuration)
- [x] T017 Create Zod validation schema in frontend/src/lib/validations/task.ts (createTaskSchema, editTaskSchema with proper error messages)
- [x] T018 [P] Create profile validation schema in frontend/src/lib/validations/profile.ts (editProfileSchema)
- [x] T019 Create Next.js 16 proxy.ts for route protection in frontend/src/app/proxy.ts (check JWT token, redirect to /signin for /dashboard/* routes)
- [x] T020 Create dashboard route group layout in frontend/src/app/(dashboard)/layout.tsx (basic structure for sidebar + main content, authentication check)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View and Browse Tasks (Priority: P1) 🎯 MVP

**Goal**: Users can view all their tasks in a modern, card-based dashboard with smooth animations

**Independent Test**: Login as user, navigate to /dashboard, verify tasks load and display with fade-in animation. Verify empty state appears when no tasks exist.

### Implementation for User Story 1

- [x] T021 [P] [US1] Create DashboardHeader component in frontend/src/components/dashboard/DashboardHeader.tsx (page title, optional action button slot, responsive layout)
- [x] T022 [P] [US1] Create EmptyState component in frontend/src/components/dashboard/EmptyState.tsx (two variants: no-tasks and no-results, with friendly message and CTA button)
- [x] T023 [P] [US1] Create TaskCard component in frontend/src/components/dashboard/TaskCard.tsx (display task title, description preview, priority badge, category badge, completion checkbox, edit/delete buttons, hover effects)
- [x] T024 [US1] Create TaskList component in frontend/src/components/dashboard/TaskList.tsx (render TaskCard for each task, handle loading with Skeleton, handle empty state, responsive grid layout, fade-in animations with Framer Motion)
- [x] T025 [US1] Create useTasks custom hook in frontend/src/lib/hooks/useTasks.ts (useQuery for fetching tasks with filters, queryKey structure from data-model.md)
- [x] T026 [US1] Implement main dashboard page in frontend/src/app/(dashboard)/page.tsx (fetch tasks with useTasks, display TaskList, handle loading/error states, integrate DashboardHeader)

**Checkpoint**: At this point, User Story 1 should be fully functional - user can view their task list

---

## Phase 4: User Story 2 - Create New Tasks (Priority: P1)

**Goal**: Users can quickly create new tasks through an intuitive modal with real-time validation

**Independent Test**: Click "Create Task" button, fill form with valid/invalid data, verify validation, submit, verify task appears in list with animation and success notification.

### Implementation for User Story 2

- [x] T027 [US2] Create useCreateTask custom hook in frontend/src/lib/hooks/useTasks.ts (useMutation for creating tasks, invalidate queries on success, toast notifications)
- [x] T028 [US2] Create CreateTaskModal component in frontend/src/components/modals/CreateTaskModal.tsx (dialog with form using react-hook-form and zod validation, title/description/priority/category fields, loading state, error handling, smooth animations, auto-focus title field)
- [x] T029 [US2] Add "Create Task" button to DashboardHeader in frontend/src/app/(dashboard)/page.tsx (opens CreateTaskModal, integrates with useCreateTask hook)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - user can view and create tasks

---

## Phase 5: User Story 3 - Filter and Search Tasks (Priority: P1)

**Goal**: Users can find specific tasks quickly using filters (status, priority, category) and search by text

**Independent Test**: Apply various filter combinations, type in search box, verify results update instantly with smooth animations. Test "Clear Filters" button.

### Implementation for User Story 3

- [x] T030 [P] [US3] Create SearchBar component in frontend/src/components/dashboard/SearchBar.tsx (debounced input with 300ms delay, search icon, clear button, responsive width)
- [x] T031 [P] [US3] Create TaskFilters component in frontend/src/components/dashboard/TaskFilters.tsx (status dropdown, priority dropdown, category dropdown, active filter badges, clear all filters button, responsive layout)
- [x] T032 [US3] Create useFilters custom hook in frontend/src/lib/hooks/useFilters.ts (manage filter state, handle filter changes, clear filters function)
- [x] T033 [US3] Integrate filters and search into dashboard page in frontend/src/app/(dashboard)/page.tsx (connect useFilters with useTasks, render TaskFilters and SearchBar, update TaskList based on filtered results)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should work - user can view, create, and filter tasks

---

## Phase 6: User Story 8 - Navigate with Modern Sidebar (Priority: P2)

**Goal**: Users have a persistent, visually appealing sidebar for navigation with collapse/expand functionality

**Independent Test**: Click sidebar items, verify navigation and active state. Test collapse/expand button. On mobile, verify hamburger menu functionality.

### Implementation for User Story 8

- [x] T034 [P] [US8] Create Sidebar component in frontend/src/components/dashboard/Sidebar.tsx (navigation links for Dashboard/Tasks/Profile, user profile display, logout button, collapse/expand toggle, active section highlighting, smooth width transition animation)
- [x] T035 [US8] Integrate Sidebar into DashboardLayout in frontend/src/app/(dashboard)/layout.tsx (manage sidebar collapsed state, render sidebar on desktop ≥768px, handle responsive drawer on mobile <768px)
- [x] T036 [US8] Add mobile drawer functionality to Sidebar in frontend/src/components/dashboard/Sidebar.tsx (hamburger menu button, slide-in/out animation with Framer Motion)
- [ ] T037 [US8] Create Tasks page in frontend/src/app/(dashboard)/tasks/page.tsx (dedicated tasks view with same TaskList, filters, search functionality from dashboard)

**Checkpoint**: At this point, sidebar navigation should be fully functional across all screen sizes

---

## Phase 7: User Story 4 - Update and Edit Tasks (Priority: P2)

**Goal**: Users can modify task details through an edit modal pre-filled with current data

**Independent Test**: Click edit button on task, modify fields, save changes, verify task updates in list with highlight animation and success notification.

### Implementation for User Story 4

- [x] T038 [US4] Create useUpdateTask custom hook in frontend/src/lib/hooks/useTasks.ts (useMutation for updating tasks, invalidate queries on success, toast notifications)
- [x] T039 [US4] Create EditTaskModal component in frontend/src/components/modals/EditTaskModal.tsx (dialog with form pre-filled with task data, includes completed checkbox, same validation as CreateTaskModal, loading state, error handling, smooth animations)
- [x] T040 [US4] Add edit button handler to TaskCard in frontend/src/components/dashboard/TaskCard.tsx (opens EditTaskModal with selected task, integrates with useUpdateTask hook)

**Checkpoint**: At this point, user can view, create, filter, navigate, and edit tasks

---

## Phase 8: User Story 5 - Toggle Task Completion (Priority: P2)

**Goal**: Users can mark tasks as complete/incomplete with a single click and instant visual feedback

**Independent Test**: Click completion checkbox on task, verify status changes immediately with strikethrough animation, verify completed tasks have muted styling.

### Implementation for User Story 5

- [x] T041 [US5] Create useToggleComplete custom hook in frontend/src/lib/hooks/useTasks.ts (useMutation for toggling completion, optimistic UI update, invalidate queries on success)
- [x] T042 [US5] Add completion toggle functionality to TaskCard in frontend/src/components/dashboard/TaskCard.tsx (checkbox component, loading indicator, disable during API call, strikethrough animation on complete, muted styling for completed tasks)

**Checkpoint**: At this point, user can perform all core task operations except delete and sort

---

## Phase 9: User Story 6 - Delete Tasks (Priority: P2)

**Goal**: Users can permanently remove tasks with confirmation dialog to prevent accidental deletion

**Independent Test**: Click delete button, verify confirmation dialog appears, confirm deletion, verify task disappears with fade-out animation and success notification.

### Implementation for User Story 6

- [x] T043 [US6] Create useDeleteTask custom hook in frontend/src/lib/hooks/useTasks.ts (useMutation for deleting tasks, invalidate queries on success, toast notifications)
- [x] T044 [US6] Create DeleteConfirmDialog component in frontend/src/components/modals/DeleteConfirmDialog.tsx (alert dialog with task title in confirmation message, cancel and delete buttons, destructive styling for delete button, loading state)
- [x] T045 [US6] Add delete button handler to TaskCard in frontend/src/components/dashboard/TaskCard.tsx (opens DeleteConfirmDialog, integrates with useDeleteTask hook, fade-out animation on delete)

**Checkpoint**: At this point, all core CRUD operations (create, read, update, delete, toggle) are functional

---

## Phase 10: User Story 7 - Sort Tasks (Priority: P3)

**Goal**: Users can organize tasks by different criteria (priority, created date, updated date, title, status)

**Independent Test**: Select different sort options from dropdown, toggle ascending/descending, verify list reorders smoothly with animation.

### Implementation for User Story 7

- [ ] T046 [P] [US7] Create TaskSort component in frontend/src/components/dashboard/TaskSort.tsx (sort field dropdown with options: Priority, Created, Updated, Title, Status; order toggle button for asc/desc; active sort indicator)
- [ ] T047 [US7] Create useSort custom hook in frontend/src/lib/hooks/useSort.ts (manage sort state, handle sort changes, default sort configuration)
- [ ] T048 [US7] Integrate sorting into dashboard and tasks pages in frontend/src/app/(dashboard)/page.tsx and frontend/src/app/(dashboard)/tasks/page.tsx (connect useSort with useTasks query params, render TaskSort component, add smooth reordering animations in TaskList)

**Checkpoint**: At this point, users can sort their task list by any criteria

---

## Phase 11: User Story 9 - View and Update User Profile (Priority: P3)

**Goal**: Users can view their account information and update their name from the dashboard

**Independent Test**: Navigate to /dashboard/profile, verify profile data displays, click edit, update name, verify changes persist and reflect in sidebar.

### Implementation for User Story 9

- [ ] T049 [P] [US9] Create useProfile custom hook in frontend/src/lib/hooks/useProfile.ts (useQuery for fetching profile, useMutation for updating profile, invalidate queries on success, toast notifications)
- [ ] T050 [US9] Create Profile page in frontend/src/app/(dashboard)/profile/page.tsx (display user name, email, creation date, updated date in card layout; edit button that opens inline form or modal; form with name field and validation; save/cancel buttons)

**Checkpoint**: At this point, users can view and update their profile

---

## Phase 12: User Story 10 - Logout from Dashboard (Priority: P2)

**Goal**: Users can securely logout from their account with session cleared

**Independent Test**: Click logout button in sidebar, verify redirect to /signin, verify JWT token removed from localStorage, verify cannot access /dashboard without re-authentication.

### Implementation for User Story 10

- [x] T051 [US10] Add logout functionality to Sidebar in frontend/src/components/dashboard/Sidebar.tsx (logout button click handler, call logout API endpoint if exists, remove JWT from localStorage, clear React Query cache, redirect to /signin, success toast notification)

**Checkpoint**: At this point, all 10 user stories are implemented and functional

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that enhance the overall dashboard experience across all user stories

- [x] T052 [P] Add Framer Motion animations to all components (page transitions, modal open/close, sidebar collapse/expand, task card hover effects, list reordering animations) per contracts/components.yaml specifications
- [x] T053 [P] Implement loading skeletons for initial dashboard load in frontend/src/components/dashboard/TaskList.tsx and frontend/src/app/(dashboard)/page.tsx using Skeleton component
- [x] T054 [P] Add comprehensive error handling with error boundaries in frontend/src/app/(dashboard)/layout.tsx and toast notifications for all API failures
- [ ] T055 [P] Implement accessibility features (keyboard navigation for all interactive elements, ARIA labels, focus management for modals, skip to main content link, semantic HTML) across all components
- [x] T056 [P] Ensure mobile responsiveness (test on 320px, 768px, 1024px viewports; verify touch targets ≥44px; test hamburger menu, stacked filters, full-width modals on mobile) across all pages
- [ ] T057 [P] Add performance optimizations (implement virtual scrolling with react-window for >500 tasks in TaskList, memoize TaskCard with React.memo, optimize re-renders)
- [x] T058 Add consistent color styling for priority badges (red for high, yellow for medium, blue for low, gray for none) and category badges in TaskCard component
- [x] T059 Add debouncing to SearchBar input (300ms delay) using useMemo and debounce utility
- [x] T060 [P] Implement optimistic UI updates for task completion toggle (immediately update UI before API call, revert on error) in useToggleComplete hook
- [x] T061 Verify and test all navigation flows (landing → dashboard, direct /dashboard access when unauthenticated, logout flow) work correctly
- [ ] T062 Run through quickstart.md validation (verify all setup steps work, test common issues and solutions)
- [ ] T063 Test dashboard with 0 tasks, 1 task, 10 tasks, 100 tasks, 1000+ tasks scenarios to verify performance and UI scaling

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-12)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 13)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 8 (P2)**: Can start after Foundational (Phase 2) - Provides navigation framework for other stories
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Requires TaskCard from US1
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Requires TaskCard from US1
- **User Story 6 (P2)**: Can start after Foundational (Phase 2) - Requires TaskCard from US1
- **User Story 7 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 9 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 10 (P2)**: Can start after Foundational (Phase 2) - Requires Sidebar from US8

### Within Each User Story

- Components marked [P] can be built in parallel (different files)
- Hooks typically depend on service layer being complete
- Pages depend on components and hooks being complete
- Integration tasks happen after core implementation

### Parallel Opportunities

- All Setup tasks (T001-T008) can run in parallel if environment supports
- All Foundational type definitions (T009-T012) can run in parallel
- Service layer (T014-T015), validation schemas (T017-T018) can run in parallel
- Once Foundational phase completes:
  - US1, US2, US3, US7, US8, US9 can all start in parallel (different files)
  - US4, US5, US6, US10 can start after their dependencies (TaskCard from US1, Sidebar from US8)
- Polish tasks (T052-T062) are mostly independent and can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all parallel components for User Story 1 together:
Task T021: "Create DashboardHeader component in frontend/src/components/dashboard/DashboardHeader.tsx"
Task T022: "Create EmptyState component in frontend/src/components/dashboard/EmptyState.tsx"
Task T023: "Create TaskCard component in frontend/src/components/dashboard/TaskCard.tsx"

# Then sequential tasks after components complete:
Task T024: "Create TaskList component" (depends on T022, T023)
Task T025: "Create useTasks custom hook" (depends on service layer T014)
Task T026: "Implement main dashboard page" (depends on T021, T024, T025)
```

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 3 Only) - Recommended Start

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T020) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T021-T026)
4. Complete Phase 4: User Story 2 (T027-T029)
5. Complete Phase 5: User Story 3 (T030-T033)
6. **STOP and VALIDATE**: Test viewing, creating, and filtering tasks independently
7. Deploy/demo MVP if ready

### Incremental Delivery (Add P2 Features)

1. MVP complete (US1, US2, US3)
2. Add Phase 6: User Story 8 - Sidebar (T034-T037) → Test navigation
3. Add Phase 8: User Story 5 - Toggle Completion (T041-T042) → Test completion toggle
4. Add Phase 7: User Story 4 - Edit Tasks (T038-T040) → Test editing
5. Add Phase 9: User Story 6 - Delete Tasks (T043-T045) → Test deletion
6. Add Phase 12: User Story 10 - Logout (T051) → Test logout flow
7. Each story adds value without breaking previous stories

### Full Feature Set (Add P3 Features)

1. P1 + P2 features complete
2. Add Phase 10: User Story 7 - Sort Tasks (T046-T048) → Test sorting
3. Add Phase 11: User Story 9 - Profile (T049-T050) → Test profile management
4. Complete Phase 13: Polish (T052-T063) → Final polish and optimization

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T020)
2. Once Foundational is done:
   - Developer A: User Story 1 (T021-T026) + User Story 2 (T027-T029)
   - Developer B: User Story 3 (T030-T033) + User Story 8 (T034-T037)
   - Developer C: User Story 4 (T038-T040) + User Story 5 (T041-T042)
   - Developer D: User Story 6 (T043-T045) + User Story 7 (T046-T048)
3. Stories complete and integrate independently
4. Final developer or team completes Polish phase together

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label (e.g., [US1], [US2]) maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Priority order: P1 stories are MVP (US1, US2, US3), P2 stories add core functionality, P3 stories are enhancements
- All components follow contracts defined in specs/007-dashboard-ui/contracts/components.yaml
- All routes follow contracts defined in specs/007-dashboard-ui/contracts/routes.yaml
- All types follow definitions in specs/007-dashboard-ui/data-model.md
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- See quickstart.md for detailed setup instructions and common issues/solutions
