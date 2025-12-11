# Tasks: JWT Authentication System (Backend Only)

**Input**: Design documents from `/specs/002-jwt-auth/`
**Prerequisites**: plan.md (backend-only), spec.md (5 user stories), research.md (technical decisions), data-model.md (schemas), contracts/openapi.yaml (API spec)

**Scope**: Backend-only implementation (FastAPI + JWT + PostgreSQL)
**Tests**: Included as per Principle IV (Comprehensive Testing) of constitution

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/` prefix for all paths
- **Models**: `backend/models.py`
- **Routes**: `backend/routes/`
- **Middleware**: `backend/middleware/`
- **Utilities**: `backend/lib/`
- **Schemas**: `backend/schemas/`
- **Tests**: `backend/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [X] T001 Install backend dependencies using UV: pyjwt, passlib[bcrypt], python-dotenv in backend/pyproject.toml
- [X] T002 [P] Generate 256-bit shared secret using openssl rand -hex 32 for BETTER_AUTH_SECRET
- [X] T003 [P] Configure environment variables in backend/.env: BETTER_AUTH_SECRET, JWT_ALGORITHM=HS256
- [X] T004 Verify Neon PostgreSQL database connection from feature 001 is working in backend/db.py

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Create backend/lib/ directory with __init__.py package file
- [X] T006 Create backend/schemas/ directory with __init__.py package file
- [X] T007 Create backend/routes/ directory with __init__.py package file
- [X] T008 Create backend/middleware/ directory with __init__.py package file
- [X] T009 [P] Implement password hashing utilities in backend/lib/password.py using passlib with bcrypt
- [X] T010 [P] Implement JWT token generation and validation utilities in backend/lib/jwt_utils.py using PyJWT
- [X] T011 Update User model in backend/models.py with auth fields: id (UUID), email (unique, indexed), name, password_hash, created_at, updated_at, is_active
- [X] T012 [P] Create base Pydantic error response schema in backend/schemas/auth.py: ErrorResponse
- [X] T013 Run database migration or SQLModel table creation to apply User model changes

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration (Priority: P1) 🎯 MVP

**Goal**: Enable new users to create accounts with email, name, and password

**Independent Test**: Submit registration form with valid credentials, verify account is created in database and JWT token is returned

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T014 [P] [US1] Unit test for password validation in backend/tests/test_password.py: valid passwords pass, weak passwords fail
- [ ] T015 [P] [US1] Integration test for successful registration in backend/tests/test_auth.py: POST /api/auth/register with valid data returns 201 and token
- [ ] T016 [P] [US1] Integration test for duplicate email registration in backend/tests/test_auth.py: registering same email twice returns 409 error
- [ ] T017 [P] [US1] Integration test for invalid email format in backend/tests/test_auth.py: invalid email returns 400 validation error
- [ ] T018 [P] [US1] Integration test for weak password in backend/tests/test_auth.py: password without number/special char returns 400 error

### Implementation for User Story 1

- [ ] T019 [US1] Create UserRegisterRequest Pydantic schema in backend/schemas/auth.py with email, name, password validation
- [ ] T020 [US1] Create UserResponse Pydantic schema in backend/schemas/auth.py excluding password_hash field
- [ ] T021 [US1] Create AuthResponse Pydantic schema in backend/schemas/auth.py with access_token, token_type, user fields
- [ ] T022 [US1] Implement POST /api/auth/register endpoint in backend/routes/auth.py: validate input, check email uniqueness, hash password, create user, generate JWT token
- [ ] T023 [US1] Register auth router in backend/main.py with /api/auth prefix and authentication tag
- [ ] T024 [US1] Add error handling for duplicate email (409) and validation errors (400) in registration endpoint
- [ ] T025 [US1] Verify all User Story 1 tests pass and registration flow works end-to-end

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - User Login (Priority: P1)

**Goal**: Enable existing users to authenticate with email and password

**Independent Test**: Create test user, attempt login with correct credentials, verify JWT token is returned and valid

### Tests for User Story 2

- [ ] T026 [P] [US2] Integration test for successful login in backend/tests/test_auth.py: POST /api/auth/login with correct credentials returns 200 and token
- [ ] T027 [P] [US2] Integration test for incorrect password in backend/tests/test_auth.py: login with wrong password returns 401 with generic error
- [ ] T028 [P] [US2] Integration test for non-existent email in backend/tests/test_auth.py: login with unregistered email returns 401 with generic error
- [ ] T029 [P] [US2] Security test for timing attack prevention in backend/tests/test_auth.py: verify response times are consistent for valid/invalid emails

### Implementation for User Story 2

- [ ] T030 [US2] Create UserLoginRequest Pydantic schema in backend/schemas/auth.py with email and password fields
- [ ] T031 [US2] Implement POST /api/auth/login endpoint in backend/routes/auth.py: validate credentials, verify password, generate JWT token
- [ ] T032 [US2] Add generic error message handling in login endpoint to prevent user enumeration: "Invalid email or password"
- [ ] T033 [US2] Implement timing attack prevention by always hashing password even if user doesn't exist in backend/routes/auth.py
- [ ] T034 [US2] Verify all User Story 2 tests pass and login flow works end-to-end

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 4 - Secure API Communication (Priority: P1)

**Goal**: Ensure all protected API endpoints verify JWT tokens and reject unauthorized requests

**Independent Test**: Make API requests with valid token (should succeed), invalid token (should fail with 401), expired token (should fail with 401)

### Tests for User Story 4

- [ ] T035 [P] [US4] Unit test for JWT token generation in backend/tests/test_jwt.py: create token, verify payload contains sub, email, iat, exp
- [ ] T036 [P] [US4] Unit test for JWT token validation in backend/tests/test_jwt.py: valid token returns payload, expired token raises exception, invalid token raises exception
- [ ] T037 [P] [US4] Integration test for protected route with valid token in backend/tests/test_auth.py: request with Bearer token succeeds
- [ ] T038 [P] [US4] Integration test for protected route without token in backend/tests/test_auth.py: request without Authorization header returns 401
- [ ] T039 [P] [US4] Integration test for protected route with expired token in backend/tests/test_auth.py: request with expired token returns 401
- [ ] T040 [P] [US4] Integration test for protected route with tampered token in backend/tests/test_auth.py: request with invalid signature returns 401

### Implementation for User Story 4

- [ ] T041 [US4] Implement JWT verification middleware in backend/middleware/jwt.py: extract Bearer token from header, verify signature, validate expiration
- [ ] T042 [US4] Create get_current_user_id dependency function in backend/middleware/jwt.py: decode token and return user ID
- [ ] T043 [US4] Add HTTPBearer security scheme to FastAPI app in backend/middleware/jwt.py
- [ ] T044 [US4] Handle JWT exceptions in middleware: ExpiredSignatureError (401 "Token has expired"), InvalidTokenError (401 "Invalid token")
- [ ] T045 [US4] Verify all User Story 4 tests pass and token validation works correctly

**Checkpoint**: At this point, token-based authentication is fully functional and secure

---

## Phase 6: User Story 3 - Session Persistence (Priority: P2)

**Goal**: Allow users to maintain active sessions, logout explicitly, and handle session expiration

**Independent Test**: Login, navigate between pages (simulated by multiple API calls), verify session persists; then logout and verify session is terminated

### Tests for User Story 3

- [ ] T046 [P] [US3] Integration test for logout in backend/tests/test_auth.py: POST /api/auth/logout with valid token returns 200 success message
- [ ] T047 [P] [US3] Integration test for session persistence in backend/tests/test_auth.py: make multiple authenticated requests with same token, all succeed
- [ ] T048 [P] [US3] Integration test for expired session in backend/tests/test_auth.py: use expired token, verify access is denied with appropriate error

### Implementation for User Story 3

- [ ] T049 [US3] Implement POST /api/auth/logout endpoint in backend/routes/auth.py: accept valid token, return success message (client handles token removal)
- [ ] T050 [US3] Add endpoint documentation for logout explaining client-side token removal responsibility
- [ ] T051 [US3] Verify token expiration behavior (7 days) is correctly configured in JWT utility functions
- [ ] T052 [US3] Verify all User Story 3 tests pass and session management works as expected

**Checkpoint**: Session management is complete - users can maintain sessions and logout

---

## Phase 7: User Story 5 - User Profile Access (Priority: P3)

**Goal**: Allow authenticated users to view and update their profile information

**Independent Test**: Login as user, GET /api/auth/profile (verify data returned), PUT /api/auth/profile with new name (verify update persists)

### Tests for User Story 5

- [ ] T053 [P] [US5] Integration test for get profile in backend/tests/test_auth.py: GET /api/auth/profile with valid token returns user data
- [ ] T054 [P] [US5] Integration test for get profile unauthorized in backend/tests/test_auth.py: GET /api/auth/profile without token returns 401
- [ ] T055 [P] [US5] Integration test for update profile in backend/tests/test_auth.py: PUT /api/auth/profile with valid token and new name returns updated user
- [ ] T056 [P] [US5] Integration test for update profile validation in backend/tests/test_auth.py: PUT with empty name returns 400 validation error

### Implementation for User Story 5

- [ ] T057 [US5] Create UserProfileUpdateRequest Pydantic schema in backend/schemas/auth.py with optional name field
- [ ] T058 [US5] Implement GET /api/auth/profile endpoint in backend/routes/auth.py: use get_current_user_id dependency, fetch user from DB, return UserResponse
- [ ] T059 [US5] Implement PUT /api/auth/profile endpoint in backend/routes/auth.py: validate input, update user name, set updated_at timestamp, return UserResponse
- [ ] T060 [US5] Add error handling for user not found (404) in profile endpoints
- [ ] T061 [US5] Verify all User Story 5 tests pass and profile management works correctly

**Checkpoint**: All user stories should now be independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and overall code quality

- [ ] T062 [P] Create pytest fixtures in backend/tests/conftest.py: test_user, auth_token, authenticated_client
- [ ] T063 [P] Add comprehensive integration test in backend/tests/test_auth.py: full flow from registration → login → profile access → logout
- [ ] T064 [P] Update backend/README.md with authentication setup instructions and API endpoint documentation
- [ ] T065 Code cleanup: remove any debug print statements, ensure consistent error handling across all routes
- [ ] T066 [P] Security audit: verify all passwords are hashed, no plaintext passwords logged, generic error messages used
- [ ] T067 [P] Add database indexes verification: ensure email index exists on User table for fast lookups
- [ ] T068 Run all tests with pytest -v and ensure 100% pass rate for authentication module
- [ ] T069 Validate implementation against quickstart.md: ensure all setup steps work as documented
- [ ] T070 [P] Update backend/main.py CORS configuration if needed for frontend integration readiness

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - Phase 3 (US1) can start after Phase 2
  - Phase 4 (US2) can start after Phase 2 (independent of US1)
  - Phase 5 (US4) can start after Phase 2 (independent of US1, US2)
  - Phase 6 (US3) should start after Phase 4 (US2) as it extends login functionality
  - Phase 7 (US5) should start after Phase 5 (US4) as it uses JWT middleware
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - Registration**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1) - Login**: Can start after Foundational (Phase 2) - Independent but logically tested after US1
- **User Story 4 (P1) - Secure API**: Can start after Foundational (Phase 2) - Independent but needed for US3 and US5
- **User Story 3 (P2) - Session Persistence**: Can start after US2 and US4 - Extends login with logout functionality
- **User Story 5 (P3) - Profile Access**: Can start after US4 - Requires JWT middleware from US4

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Schemas before routes
- Routes before integration
- Error handling after core implementation
- Story complete and tested before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup)**: T002 and T003 can run in parallel after T001

**Phase 2 (Foundational)**: T005-T008 (directory creation) can all run in parallel, then T009-T010 (utilities) can run in parallel, then T011-T012 can run in parallel

**Phase 3 (US1) Tests**: T014-T018 can all be written in parallel

**Phase 3 (US1) Implementation**: T019-T021 (schemas) can be created in parallel

**Phase 4 (US2) Tests**: T026-T029 can all be written in parallel

**Phase 5 (US4) Tests**: T035-T040 can all be written in parallel

**Phase 6 (US3) Tests**: T046-T048 can be written in parallel

**Phase 7 (US5) Tests**: T053-T056 can be written in parallel

**Phase 8 (Polish)**: T062, T063, T064, T066, T067, T069 can all run in parallel

**User Stories After Foundation**: With multiple developers, after Phase 2 completes:
- Developer A: US1 (Phase 3)
- Developer B: US2 (Phase 4)
- Developer C: US4 (Phase 5)
Then Developer A can move to US3, Developer B to US5

---

## Parallel Example: User Story 1

```bash
# Launch all test files for User Story 1 together:
Task: "Unit test for password validation in backend/tests/test_password.py"
Task: "Integration test for successful registration in backend/tests/test_auth.py"
Task: "Integration test for duplicate email registration in backend/tests/test_auth.py"
Task: "Integration test for invalid email format in backend/tests/test_auth.py"
Task: "Integration test for weak password in backend/tests/test_auth.py"

# Launch all schemas for User Story 1 together:
Task: "Create UserRegisterRequest Pydantic schema in backend/schemas/auth.py"
Task: "Create UserResponse Pydantic schema in backend/schemas/auth.py"
Task: "Create AuthResponse Pydantic schema in backend/schemas/auth.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T013) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T014-T025)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo registration capability

### Core Authentication (P1 Stories)

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Registration) → Test independently → Basic signup works
3. Add User Story 2 (Login) → Test independently → Full auth cycle works
4. Add User Story 4 (Secure API) → Test independently → Protected routes work
5. **STOP and VALIDATE**: Core authentication is production-ready

### Full Feature (All Stories)

1. Core Authentication (above) complete
2. Add User Story 3 (Session Persistence) → Test independently → Session management complete
3. Add User Story 5 (Profile Access) → Test independently → User management complete
4. Polish (Phase 8) → Code quality and production readiness
5. Deploy complete backend authentication system

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T013)
2. Once Foundational is done:
   - Developer A: User Story 1 (T014-T025)
   - Developer B: User Story 2 (T026-T034)
   - Developer C: User Story 4 (T035-T045)
3. Then:
   - Developer A or B: User Story 3 (T046-T052)
   - Developer C: User Story 5 (T053-T061)
4. Team: Polish together (T062-T070)

---

## Task Summary

**Total Tasks**: 70

**By Phase**:
- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 9 tasks
- Phase 3 (US1 - Registration): 12 tasks (5 tests, 7 implementation)
- Phase 4 (US2 - Login): 9 tasks (4 tests, 5 implementation)
- Phase 5 (US4 - Secure API): 11 tasks (6 tests, 5 implementation)
- Phase 6 (US3 - Session Persistence): 7 tasks (3 tests, 4 implementation)
- Phase 7 (US5 - Profile Access): 9 tasks (4 tests, 5 implementation)
- Phase 8 (Polish): 9 tasks

**By User Story**:
- US1 (Registration): 12 tasks
- US2 (Login): 9 tasks
- US4 (Secure API): 11 tasks
- US3 (Session Persistence): 7 tasks
- US5 (Profile Access): 9 tasks

**Parallel Opportunities**: 36 tasks marked [P] can be parallelized within their phases

**MVP Scope (Minimal)**: Phases 1-3 only (25 tasks) - Registration capability
**MVP Scope (Recommended)**: Phases 1-5 (54 tasks) - Core authentication (registration, login, secure API)

---

## Notes

- **Backend-Only**: All tasks are backend implementation (no frontend work in this phase)
- **Test-Driven**: Tests are written first for each user story before implementation
- **Independent Stories**: Each user story can be tested independently after completion
- **Security Focus**: Generic error messages, timing attack prevention, password hashing, JWT validation
- **Constitution Compliance**: Follows all 6 principles (spec-driven, iterative, clean code, comprehensive testing, documentation, cloud-native)
- **[P] tasks**: Different files, no dependencies within their phase - can run in parallel
- **[Story] labels**: Maps each task to specific user story for traceability and independent delivery
- Verify tests fail before implementing (red-green-refactor)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence

---

## Format Validation

✅ All tasks follow checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`
✅ All task IDs are sequential (T001-T070)
✅ All [P] markers indicate parallelizable tasks
✅ All [Story] labels map to user stories from spec.md (US1-US5)
✅ All file paths are absolute and use `backend/` prefix
✅ All tests are marked with their story labels
✅ All implementation tasks include specific file locations
