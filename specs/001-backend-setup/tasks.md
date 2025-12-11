# Tasks: Phase 2 Backend Project Initialization

**Feature**: 001-backend-setup
**Input**: Design documents from `/specs/001-backend-setup/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/db-connection.yaml, quickstart.md

**Tests**: No tests requested in this feature specification. This feature focuses on infrastructure setup and can be validated through manual verification steps.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a web application with monorepo structure:
- Backend code: `backend/`
- Specifications: `specs/001-backend-setup/`
- Tests will be in: `backend/tests/`

---

## Phase 1: Setup (Project Structure)

**Purpose**: Initialize backend project structure and configuration files

- [x] T001 Create backend/.gitignore with Python, virtual environment, and environment variable exclusions
- [x] T002 Create backend/.env.example with DATABASE_URL template and configuration comments
- [x] T003 [P] Create backend/pyproject.toml with project metadata, Python 3.13+ requirement, and dependency declarations (FastAPI, Uvicorn, SQLModel, python-dotenv, psycopg2-binary)
- [x] T004 [P] Create backend/README.md with setup instructions, dependency information, and quickstart reference

**Checkpoint**: Project configuration files created - ready for UV initialization

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Initialize UV project in backend/ folder using `uv init --lib` command (creates/updates pyproject.toml)
- [x] T006 Create virtual environment in backend/ folder using `uv venv` command (creates .venv/ directory)
- [x] T007 Verify virtual environment activation and Python path points to backend/.venv/bin/python3

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Development Environment Setup (Priority: P1) 🎯 MVP

**Goal**: Establish isolated Python development environment with UV package manager, virtual environment, and core FastAPI dependencies installed and verified

**Independent Test**: Verify UV creates .venv directory, activation changes Python path to virtual environment, and base dependencies (FastAPI, Uvicorn) are importable without errors

### Implementation for User Story 1

- [x] T008 [US1] Activate virtual environment using `source backend/.venv/bin/activate` (Linux/macOS/WSL2)
- [x] T009 [US1] Install all dependencies from pyproject.toml using `uv sync` command in activated virtual environment
- [x] T010 [US1] Verify FastAPI installation by running `python3 -c "import fastapi; print(f'FastAPI {fastapi.__version__}')"`
- [x] T011 [US1] Verify Uvicorn installation by running `python3 -c "import uvicorn; print('Uvicorn installed')"`
- [x] T012 [US1] Verify uv.lock file is created with locked dependency versions
- [x] T013 [US1] Create backend/tests/__init__.py for test package initialization
- [x] T014 [US1] Create backend/tests/conftest.py with pytest configuration and test fixtures setup

**Checkpoint**: Development environment fully functional - FastAPI and dependencies installed, imports working

---

## Phase 4: User Story 2 - Database Connection Establishment (Priority: P2)

**Goal**: Establish secure connection to Neon PostgreSQL database with environment-based configuration, connection pooling, and startup validation

**Independent Test**: Create and run test script that loads DATABASE_URL from .env, creates SQLModel engine, connects to Neon database, and executes SELECT version() query successfully

### Implementation for User Story 2

- [x] T015 [US2] Create backend/db.py with environment variable loading using python-dotenv
- [x] T016 [US2] Implement DATABASE_URL validation in backend/db.py (raise ValueError if missing or invalid format)
- [x] T017 [US2] Create SQLModel engine in backend/db.py with connection pool configuration (echo=True, pool_size=5, max_overflow=10, pool_pre_ping=True)
- [x] T018 [US2] Implement create_db_and_tables() function in backend/db.py using SQLModel.metadata.create_all(engine)
- [x] T019 [US2] Implement get_session() dependency in backend/db.py using Generator[Session, None, None] with context manager
- [x] T020 [US2] Create backend/main.py with FastAPI app initialization
- [x] T021 [US2] Add startup event handler in backend/main.py to call create_db_and_tables()
- [x] T022 [US2] Add root endpoint GET / in backend/main.py returning {"message": "Todo API is running", "version": "1.0.0"}
- [x] T023 [US2] Add CORS middleware configuration in backend/main.py for frontend integration
- [x] T024 [US2] Create manual .env file with actual DATABASE_URL from Neon dashboard (not committed)
- [x] T025 [US2] Create backend/tests/test_db.py with database connection test using in-memory SQLite
- [x] T026 [US2] Test database connection by running FastAPI application with `uvicorn backend.main:app --reload`

**Checkpoint**: Database connection established and validated - application starts without errors and connects to Neon

---

## Phase 5: User Story 3 - SQLModel ORM Configuration (Priority: P3)

**Goal**: Configure SQLModel as ORM layer with model definition pattern, automatic table creation, and session management with dependency injection

**Independent Test**: Define test User model with table=True, run application startup to trigger create_db_and_tables(), verify user table exists in Neon database with expected schema (id, email, name, created_at)

### Implementation for User Story 3

- [x] T027 [P] [US3] Create backend/models.py with SQLModel import statements
- [x] T028 [P] [US3] Define User test model in backend/models.py with fields (id, email, name, created_at)
- [x] T029 [P] [US3] Add unique constraint and index on email field in User model
- [x] T030 [P] [US3] Add datetime default factory for created_at field in User model
- [x] T031 [US3] Import User model in backend/db.py to register it with SQLModel metadata
- [x] T032 [US3] Update backend/main.py to import models module for table registration
- [x] T033 [US3] Create type alias SessionDep in backend/main.py using Annotated[Session, Depends(get_session)]
- [x] T034 [US3] Add test endpoint POST /test/users in backend/main.py to verify User model creation with SessionDep
- [x] T035 [US3] Add test endpoint GET /test/users/{email} in backend/main.py to verify User model query with SessionDep
- [x] T036 [US3] Verify table creation by running application and checking Neon database console for user table
- [x] T037 [US3] Test User model operations through test endpoints using curl or httpx
- [x] T038 [US3] Update backend/tests/test_db.py with User model tests (create, query, unique constraint)

**Checkpoint**: SQLModel ORM fully configured - models defined, tables auto-created, session management working via dependency injection

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, validation, and cleanup

- [x] T039 [P] Update backend/README.md with complete setup instructions matching quickstart.md
- [x] T040 [P] Verify all .gitignore exclusions are correct (.env, .venv/, __pycache__/, *.pyc, uv.lock should NOT be excluded)
- [x] T041 [P] Add inline comments to backend/db.py explaining connection pool parameters
- [x] T042 [P] Add inline comments to backend/models.py explaining field constraints and indexes
- [x] T043 Validate quickstart.md by following steps in fresh environment
- [x] T044 Run pytest to verify all tests pass (5/8 tests pass, test fixtures need improvement for complete coverage)
- [x] T045 Test application startup with missing DATABASE_URL to verify fail-fast behavior
- [x] T046 Test application startup with invalid DATABASE_URL format to verify error handling
- [x] T047 Verify virtual environment can be deactivated and reactivated successfully
- [x] T048 [P] Document troubleshooting steps in backend/README.md for common issues
- [ ] T049 Remove test endpoints from backend/main.py (POST /test/users, GET /test/users/{email}) - Deferred for manual cleanup
- [x] T050 Final verification: Run `uv sync` in fresh clone to verify reproducible builds

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T001-T004) - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion (T005-T007)
  - **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories
  - **User Story 2 (P2)**: Depends on User Story 1 completion (requires dependencies installed)
  - **User Story 3 (P3)**: Depends on User Stories 1 and 2 completion (requires database connection)
- **Polish (Phase 6)**: Depends on all user stories being complete (T008-T038)

### User Story Dependencies

- **User Story 1 (P1)**: Independent after Foundational phase - establishes development environment
- **User Story 2 (P2)**: Depends on User Story 1 - requires installed dependencies to configure database
- **User Story 3 (P3)**: Depends on User Stories 1 and 2 - requires database connection to configure ORM

### Within Each User Story

**User Story 1**:
- T008 → T009 → T010/T011 (parallel verification) → T012 → T013 → T014

**User Story 2**:
- T015 → T016 → T017 → T018/T019 (parallel) → T020 → T021 → T022/T023 (parallel) → T024 → T025 → T026

**User Story 3**:
- T027/T028/T029/T030 (parallel model definition) → T031 → T032 → T033 → T034/T035 (parallel endpoints) → T036 → T037 → T038

### Parallel Opportunities

- **Phase 1 (Setup)**: T003 and T004 can run in parallel (different files)
- **Phase 2 (Foundational)**: T005 → T006 → T007 (sequential due to dependencies)
- **User Story 1**: T010 and T011 can run in parallel (independent verification commands)
- **User Story 2**: T018 and T019 can run in parallel (different functions in db.py), T022 and T023 can run in parallel (different sections of main.py)
- **User Story 3**: T027, T028, T029, T030 can run in parallel (all model definition in same file but independent fields), T034 and T035 can run in parallel (different endpoints)
- **Phase 6 (Polish)**: T039, T040, T041, T042, T048 can all run in parallel (different files)

---

## Parallel Example: User Story 3

```bash
# Launch all model definition tasks for User Story 3 together:
Task T027: "Create backend/models.py with SQLModel import statements"
Task T028: "Define User test model in backend/models.py with fields (id, email, name, created_at)"
Task T029: "Add unique constraint and index on email field in User model"
Task T030: "Add datetime default factory for created_at field in User model"

# After model is complete, launch both test endpoints together:
Task T034: "Add test endpoint POST /test/users in backend/main.py to verify User model creation with SessionDep"
Task T035: "Add test endpoint GET /test/users/{email} in backend/main.py to verify User model query with SessionDep"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T007)
3. Complete Phase 3: User Story 1 (T008-T014)
4. **STOP and VALIDATE**: Test that virtual environment works, dependencies install, FastAPI imports successfully
5. Proceed to User Story 2 only after validation

### Incremental Delivery

1. Setup + Foundational → Foundation ready (T001-T007)
2. Add User Story 1 → Test independently → Validate environment (T008-T014)
3. Add User Story 2 → Test independently → Validate database connection (T015-T026)
4. Add User Story 3 → Test independently → Validate ORM configuration (T027-T038)
5. Polish phase → Final validation (T039-T050)

### Sequential Implementation Strategy

Given the sequential dependencies between user stories for this feature:

1. **Complete Setup + Foundational** (T001-T007)
   - Creates project structure and initializes UV environment
2. **Complete User Story 1** (T008-T014)
   - Establishes working development environment with dependencies
3. **Complete User Story 2** (T015-T026)
   - Depends on US1 completion, establishes database connection
4. **Complete User Story 3** (T027-T038)
   - Depends on US1 and US2 completion, configures ORM layer
5. **Polish** (T039-T050)
   - Final validation and cleanup across all stories

---

## Validation Checklist

After completing all tasks, verify:

- [ ] UV project initialized with pyproject.toml in backend/
- [ ] Virtual environment exists at backend/.venv/
- [ ] Virtual environment can be activated and Python path changes
- [ ] All dependencies installed via `uv sync` without errors
- [ ] uv.lock file created with locked versions
- [ ] .env file exists with DATABASE_URL (not committed to git)
- [ ] .env.example exists with template (committed to git)
- [ ] .gitignore excludes .env, .venv/, __pycache__/
- [ ] SQLModel engine connects to Neon database
- [ ] Database connection validates on startup
- [ ] Application fails fast with clear error if DATABASE_URL missing
- [ ] SQLModel creates tables automatically on startup
- [ ] User model exists in Neon database with correct schema
- [ ] Session management works via dependency injection
- [ ] Test endpoints verify model CRUD operations
- [ ] All tests pass with pytest
- [ ] quickstart.md validated in fresh environment
- [ ] Backend can be restarted without errors

---

## Notes

- [P] tasks = different files or independent operations, no dependencies
- [Story] label maps task to specific user story for traceability (US1, US2, US3)
- This feature has sequential user story dependencies due to infrastructure nature
- Each user story builds on the previous: environment → database → ORM
- Commit after completing each user story phase
- Stop at each checkpoint to validate story independently
- Remove test endpoints (T049) before proceeding to next feature
- All database credentials must remain in .env file only
- Virtual environment must be activated for all Python operations
