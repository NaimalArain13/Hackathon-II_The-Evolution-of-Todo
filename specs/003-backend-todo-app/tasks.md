# Tasks: Backend Todo App API with Intermediate Features

**Input**: Design documents from `/specs/003-backend-todo-app/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/openapi.yaml ✅, quickstart.md ✅

**Tests**: Test tasks are included based on comprehensive testing requirements in spec.md (FR-037 to FR-043, SC-004, testing strategy section)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a web app project using the backend/ directory structure from Features 001 and 002.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database schema changes and project preparation

- [ ] T001 Run database migration to add priority column (VARCHAR(10), default 'none', indexed) to task table
- [ ] T002 Run database migration to add category column (VARCHAR(20), default 'other', indexed) to task table
- [ ] T003 Verify existing tasks have default values (priority='none', category='other') after migration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core model and schema infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [P] Add TaskPriority enum (high, medium, low, none) to backend/models.py
- [ ] T005 [P] Add TaskCategory enum (work, personal, shopping, health, other) to backend/models.py
- [ ] T006 Update Task model with priority field (default=TaskPriority.NONE, index=True) in backend/models.py
- [ ] T007 Update Task model with category field (default=TaskCategory.OTHER, index=True) in backend/models.py
- [ ] T008 Update Task model with completed field index (index=True) in backend/models.py
- [ ] T009 Update Task model with created_at field index (index=True) in backend/models.py
- [ ] T010 [P] Create TaskCreate schema with priority and category fields in backend/schemas/tasks.py
- [ ] T011 [P] Create TaskUpdate schema (all fields optional) in backend/schemas/tasks.py
- [ ] T012 [P] Create TaskResponse schema for API responses in backend/schemas/tasks.py
- [ ] T013 Create backend/routes/tasks.py file with API router setup and imports
- [ ] T014 Import and register tasks router in backend/main.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Task CRUD Operations (Priority: P1) 🎯 MVP

**Goal**: Users can create, read, update, delete, and toggle completion of tasks through the API

**Independent Test**: Call POST /api/{user_id}/tasks to create a task, GET to retrieve it, PUT to update it, PATCH to toggle completion, DELETE to remove it. Verify user isolation (user cannot access other users' tasks).

### Implementation for User Story 1

- [ ] T015 [US1] Implement POST /api/{user_id}/tasks endpoint in backend/routes/tasks.py (create task)
- [ ] T016 [US1] Implement GET /api/{user_id}/tasks endpoint in backend/routes/tasks.py (list all tasks, basic version)
- [ ] T017 [US1] Implement GET /api/{user_id}/tasks/{task_id} endpoint in backend/routes/tasks.py (get single task)
- [ ] T018 [US1] Implement PUT /api/{user_id}/tasks/{task_id} endpoint in backend/routes/tasks.py (update task)
- [ ] T019 [US1] Implement DELETE /api/{user_id}/tasks/{task_id} endpoint in backend/routes/tasks.py (delete task)
- [ ] T020 [US1] Implement PATCH /api/{user_id}/tasks/{task_id}/complete endpoint in backend/routes/tasks.py (toggle completion)
- [ ] T021 [US1] Add user isolation validation (verify user_id in path matches JWT token) to all endpoints in backend/routes/tasks.py
- [ ] T022 [US1] Add error handling for 404 Not Found, 401 Unauthorized, 403 Forbidden in backend/routes/tasks.py

### Tests for User Story 1

- [ ] T023 [P] [US1] Test task creation with valid data in backend/tests/test_tasks.py
- [ ] T024 [P] [US1] Test task creation with invalid data (empty title, too long title) in backend/tests/test_tasks.py
- [ ] T025 [P] [US1] Test GET all tasks returns user's tasks only in backend/tests/test_tasks.py
- [ ] T026 [P] [US1] Test GET single task by ID in backend/tests/test_tasks.py
- [ ] T027 [P] [US1] Test UPDATE task updates fields correctly in backend/tests/test_tasks.py
- [ ] T028 [P] [US1] Test DELETE task removes task from database in backend/tests/test_tasks.py
- [ ] T029 [P] [US1] Test PATCH toggle completion changes status in backend/tests/test_tasks.py
- [ ] T030 [P] [US1] Test user isolation - user cannot access other users' tasks in backend/tests/test_tasks.py
- [ ] T031 [P] [US1] Test 404 error when task ID does not exist in backend/tests/test_tasks.py
- [ ] T032 [P] [US1] Test 403 error when user_id mismatch with JWT token in backend/tests/test_tasks.py

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can perform basic CRUD operations on tasks.

---

## Phase 4: User Story 2 - Task Prioritization (Priority: P1)

**Goal**: Users can assign priority levels (high, medium, low, none) to tasks and filter/sort by priority

**Independent Test**: Create tasks with different priorities, filter by priority (GET /api/{user_id}/tasks?priority=high), sort by priority (GET /api/{user_id}/tasks?sort_by=priority), verify priority is persisted and returned correctly.

### Implementation for User Story 2

- [ ] T033 [US2] Add priority query parameter validation (high, medium, low, none) to GET /api/{user_id}/tasks endpoint in backend/routes/tasks.py
- [ ] T034 [US2] Implement priority filtering logic (WHERE Task.priority == priority) in GET /api/{user_id}/tasks endpoint in backend/routes/tasks.py
- [ ] T035 [US2] Implement priority sorting with custom order (high > medium > low > none) using SQLModel case() in backend/routes/tasks.py
- [ ] T036 [US2] Add priority field to TaskCreate schema validation in backend/schemas/tasks.py (if not already present)
- [ ] T037 [US2] Add priority field to TaskUpdate schema validation in backend/schemas/tasks.py (if not already present)

### Tests for User Story 2

- [ ] T038 [P] [US2] Test creating task with each priority level (high, medium, low, none) in backend/tests/test_tasks.py
- [ ] T039 [P] [US2] Test updating task priority in backend/tests/test_tasks.py
- [ ] T040 [P] [US2] Test filtering by priority returns only matching tasks in backend/tests/test_tasks.py
- [ ] T041 [P] [US2] Test invalid priority value returns 400 Bad Request in backend/tests/test_tasks.py
- [ ] T042 [P] [US2] Test sorting by priority orders tasks correctly (high, medium, low, none) in backend/tests/test_tasks.py
- [ ] T043 [P] [US2] Test priority defaults to 'none' when not specified in backend/tests/test_tasks.py

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Users can create, manage, and prioritize tasks.

---

## Phase 5: User Story 3 - Task Categorization (Priority: P2)

**Goal**: Users can assign categories (work, personal, shopping, health, other) to tasks and filter by category

**Independent Test**: Create tasks with different categories, filter by category (GET /api/{user_id}/tasks?category=work), verify category is persisted and displayed correctly.

### Implementation for User Story 3

- [ ] T044 [US3] Add category query parameter validation (work, personal, shopping, health, other) to GET /api/{user_id}/tasks endpoint in backend/routes/tasks.py
- [ ] T045 [US3] Implement category filtering logic (WHERE Task.category == category) in GET /api/{user_id}/tasks endpoint in backend/routes/tasks.py
- [ ] T046 [US3] Add category field to TaskCreate schema validation in backend/schemas/tasks.py (if not already present)
- [ ] T047 [US3] Add category field to TaskUpdate schema validation in backend/schemas/tasks.py (if not already present)

### Tests for User Story 3

- [ ] T048 [P] [US3] Test creating task with each category (work, personal, shopping, health, other) in backend/tests/test_tasks.py
- [ ] T049 [P] [US3] Test updating task category in backend/tests/test_tasks.py
- [ ] T050 [P] [US3] Test filtering by category returns only matching tasks in backend/tests/test_tasks.py
- [ ] T051 [P] [US3] Test invalid category value returns 400 Bad Request in backend/tests/test_tasks.py
- [ ] T052 [P] [US3] Test category defaults to 'other' when not specified in backend/tests/test_tasks.py
- [ ] T053 [P] [US3] Test each task displays its assigned category in response in backend/tests/test_tasks.py

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. Users can create, prioritize, and categorize tasks.

---

## Phase 6: User Story 4 - Task Search (Priority: P2)

**Goal**: Users can search tasks by keywords in title or description using case-insensitive matching

**Independent Test**: Create tasks with specific keywords in titles and descriptions, perform searches (GET /api/{user_id}/tasks?search=meeting), verify correct results are returned. Test case-insensitive matching and empty results.

### Implementation for User Story 4

- [ ] T054 [US4] Add search query parameter to GET /api/{user_id}/tasks endpoint in backend/routes/tasks.py
- [ ] T055 [US4] Implement case-insensitive search logic using PostgreSQL ILIKE for title field in backend/routes/tasks.py
- [ ] T056 [US4] Implement case-insensitive search logic using PostgreSQL ILIKE for description field in backend/routes/tasks.py
- [ ] T057 [US4] Combine title and description search with OR logic using SQLModel or_() in backend/routes/tasks.py
- [ ] T058 [US4] Add search string length validation (max 200 characters) in backend/routes/tasks.py
- [ ] T059 [US4] Handle empty search query (return all tasks) in backend/routes/tasks.py

### Tests for User Story 4

- [ ] T060 [P] [US4] Test search in title returns matching tasks in backend/tests/test_tasks.py
- [ ] T061 [P] [US4] Test search in description returns matching tasks in backend/tests/test_tasks.py
- [ ] T062 [P] [US4] Test search is case-insensitive (search 'Meeting' finds 'meeting') in backend/tests/test_tasks.py
- [ ] T063 [P] [US4] Test search with no matches returns empty list in backend/tests/test_tasks.py
- [ ] T064 [P] [US4] Test search with special characters is safe (no SQL injection) in backend/tests/test_tasks.py
- [ ] T065 [P] [US4] Test empty search query returns all tasks in backend/tests/test_tasks.py
- [ ] T066 [P] [US4] Test search with multiple matching tasks returns all in backend/tests/test_tasks.py

**Checkpoint**: At this point, User Stories 1-4 should all work independently. Users can create, prioritize, categorize, and search tasks.

---

## Phase 7: User Story 5 - Multi-Criteria Filtering (Priority: P2)

**Goal**: Users can combine multiple filters (status, priority, category) simultaneously using AND logic

**Independent Test**: Apply various filter combinations (GET /api/{user_id}/tasks?status=pending&priority=high&category=work) and verify only tasks matching ALL criteria are returned.

### Implementation for User Story 5

- [ ] T067 [US5] Add status query parameter validation (all, pending, completed) to GET /api/{user_id}/tasks endpoint in backend/routes/tasks.py
- [ ] T068 [US5] Implement status filtering logic (WHERE Task.completed == True/False) in backend/routes/tasks.py
- [ ] T069 [US5] Ensure multiple filters combine with AND logic in SQLModel query in backend/routes/tasks.py
- [ ] T070 [US5] Test filter combination builds correct SQL WHERE clauses in backend/routes/tasks.py

### Tests for User Story 5

- [ ] T071 [P] [US5] Test filtering by status only (pending, completed) in backend/tests/test_tasks.py
- [ ] T072 [P] [US5] Test filtering by status + priority combination in backend/tests/test_tasks.py
- [ ] T073 [P] [US5] Test filtering by status + category combination in backend/tests/test_tasks.py
- [ ] T074 [P] [US5] Test filtering by priority + category combination in backend/tests/test_tasks.py
- [ ] T075 [P] [US5] Test filtering by status + priority + category (all three) in backend/tests/test_tasks.py
- [ ] T076 [P] [US5] Test filter combination with no matches returns empty list in backend/tests/test_tasks.py
- [ ] T077 [P] [US5] Test invalid status value returns 400 Bad Request in backend/tests/test_tasks.py

**Checkpoint**: At this point, User Stories 1-5 should all work independently. Users can create, prioritize, categorize, search, and apply multiple filters.

---

## Phase 8: User Story 6 - Flexible Task Sorting (Priority: P3)

**Goal**: Users can sort task list by different fields (created_at, updated_at, title, priority, status) in ascending or descending order

**Independent Test**: Request task lists with different sort parameters (GET /api/{user_id}/tasks?sort_by=created_at&order=asc) and verify tasks are returned in correct order. Test all sort fields and both order directions.

### Implementation for User Story 6

- [ ] T078 [US6] Add sort_by query parameter validation (created_at, updated_at, title, priority, status) to GET /api/{user_id}/tasks endpoint in backend/routes/tasks.py
- [ ] T079 [US6] Add order query parameter validation (asc, desc) with default='desc' in backend/routes/tasks.py
- [ ] T080 [US6] Implement dynamic sorting using SQLModel asc() and desc() functions in backend/routes/tasks.py
- [ ] T081 [US6] Map sort_by='status' to Task.completed field in backend/routes/tasks.py
- [ ] T082 [US6] Set default sort behavior (sort_by=created_at, order=desc) when not specified in backend/routes/tasks.py

### Tests for User Story 6

- [ ] T083 [P] [US6] Test sorting by created_at ascending returns oldest to newest in backend/tests/test_tasks.py
- [ ] T084 [P] [US6] Test sorting by created_at descending returns newest to oldest in backend/tests/test_tasks.py
- [ ] T085 [P] [US6] Test sorting by title alphabetically (A-Z) in backend/tests/test_tasks.py
- [ ] T086 [P] [US6] Test sorting by priority orders correctly (high, medium, low, none) in backend/tests/test_tasks.py
- [ ] T087 [P] [US6] Test sorting by status groups by completion in backend/tests/test_tasks.py
- [ ] T088 [P] [US6] Test sorting by updated_at in backend/tests/test_tasks.py
- [ ] T089 [P] [US6] Test default sort (created_at desc) when no sort specified in backend/tests/test_tasks.py
- [ ] T090 [P] [US6] Test invalid sort_by value returns 400 Bad Request in backend/tests/test_tasks.py
- [ ] T091 [P] [US6] Test invalid order value returns 400 Bad Request in backend/tests/test_tasks.py

**Checkpoint**: All user stories (1-6) should now be independently functional. Full feature set complete.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Performance optimization, documentation, and comprehensive validation

- [ ] T092 [P] Run performance test - 100 concurrent task creation requests in backend/tests/test_tasks.py
- [ ] T093 [P] Run performance test - retrieve 100 tasks in <1 second in backend/tests/test_tasks.py
- [ ] T094 [P] Run performance test - search with 1000 tasks completes in <2 seconds in backend/tests/test_tasks.py
- [ ] T095 [P] Run performance test - complex filter + sort query in <500ms in backend/tests/test_tasks.py
- [ ] T096 [P] Test edge case - very long title (201 characters) returns 400 in backend/tests/test_tasks.py
- [ ] T097 [P] Test edge case - very long search query (500 characters) in backend/tests/test_tasks.py
- [ ] T098 [P] Test edge case - missing JWT token returns 401 in backend/tests/test_tasks.py
- [ ] T099 [P] Test edge case - expired JWT token returns 401 in backend/tests/test_tasks.py
- [ ] T100 Verify all database indexes exist (user_id, completed, priority, category, created_at) using database inspection
- [ ] T101 Update backend/README.md with new API endpoints documentation
- [ ] T102 Verify all 47 functional requirements from spec.md are implemented
- [ ] T103 Verify all 19 success criteria from spec.md are met
- [ ] T104 Run full test suite with coverage report (pytest --cov=backend)
- [ ] T105 Validate quickstart.md instructions work end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order: US1 (P1) → US2 (P1) → US3 (P2) → US4 (P2) → US5 (P2) → US6 (P3)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent)
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent)
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (independent)
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Builds on US2 and US3 filters but independently testable
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - Works with US2 priority sorting but independently testable

### Within Each User Story

- Implementation tasks before tests (write code first, verify with tests)
- Tests can run in parallel (all marked [P])
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup (Phase 1)**: Tasks T001, T002 can run in parallel (different columns)
- **Foundational (Phase 2)**: Tasks T004-T005 (enums), T010-T012 (schemas) can run in parallel
- **User Story Tests**: All test tasks within a story marked [P] can run in parallel
- **User Stories**: Once Foundational phase completes, ALL user stories (US1-US6) can start in parallel if team capacity allows
- **Polish (Phase 9)**: Tasks T092-T099 (all tests) can run in parallel

---

## Parallel Example: User Story 1

```bash
# After implementing US1 endpoints, launch all tests together:
Task: "Test task creation with valid data in backend/tests/test_tasks.py"
Task: "Test task creation with invalid data in backend/tests/test_tasks.py"
Task: "Test GET all tasks returns user's tasks only in backend/tests/test_tasks.py"
Task: "Test GET single task by ID in backend/tests/test_tasks.py"
Task: "Test UPDATE task in backend/tests/test_tasks.py"
Task: "Test DELETE task in backend/tests/test_tasks.py"
Task: "Test PATCH toggle completion in backend/tests/test_tasks.py"
Task: "Test user isolation in backend/tests/test_tasks.py"
Task: "Test 404 error in backend/tests/test_tasks.py"
Task: "Test 403 error in backend/tests/test_tasks.py"
```

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: "Test creating task with each priority level in backend/tests/test_tasks.py"
Task: "Test updating task priority in backend/tests/test_tasks.py"
Task: "Test filtering by priority in backend/tests/test_tasks.py"
Task: "Test invalid priority value in backend/tests/test_tasks.py"
Task: "Test sorting by priority in backend/tests/test_tasks.py"
Task: "Test priority defaults to 'none' in backend/tests/test_tasks.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (database migrations)
2. Complete Phase 2: Foundational (models, enums, schemas) - CRITICAL
3. Complete Phase 3: User Story 1 (basic CRUD)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo basic todo API

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP: Basic Todo API!)
3. Add User Story 2 → Test independently → Deploy/Demo (Priorities added!)
4. Add User Story 3 → Test independently → Deploy/Demo (Categories added!)
5. Add User Story 4 → Test independently → Deploy/Demo (Search added!)
6. Add User Story 5 → Test independently → Deploy/Demo (Multi-filter added!)
7. Add User Story 6 → Test independently → Deploy/Demo (Flexible sorting added!)
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (P1) - Basic CRUD
   - Developer B: User Story 2 (P1) - Priorities
   - Developer C: User Story 3 (P2) - Categories
   - Developer D: User Story 4 (P2) - Search
   - Developer E: User Story 5 (P2) - Multi-filter
   - Developer F: User Story 6 (P3) - Sorting
3. Stories complete and integrate independently
4. Final integration testing and polish

---

## Notes

- [P] tasks = different files/test cases, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- All tasks include exact file paths (backend/models.py, backend/routes/tasks.py, backend/schemas/tasks.py, backend/tests/test_tasks.py)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Follow research.md decisions for implementation patterns
- Use quickstart.md for testing guidance
- Refer to data-model.md for model structure
- Refer to contracts/openapi.yaml for endpoint specifications
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

**Total Tasks**: 105
**User Stories**: 6 (2 × P1, 3 × P2, 1 × P3)
**Endpoints**: 6 (GET list, GET single, POST, PUT, DELETE, PATCH)
**Parallel Opportunities**: 65+ tasks can run in parallel within their phases
**MVP Scope**: Phases 1-3 (User Story 1 only) = 35 tasks for basic functional todo API
