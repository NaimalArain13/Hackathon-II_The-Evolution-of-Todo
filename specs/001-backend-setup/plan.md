# Implementation Plan: Phase 2 Backend Project Initialization

**Branch**: `001-backend-setup` | **Date**: 2025-12-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-backend-setup/spec.md`

**Note**: This plan covers UV project initialization, virtual environment setup, dependency installation, Neon PostgreSQL connection, and SQLModel ORM configuration.

## Summary

Initialize Phase 2 backend infrastructure with UV-managed Python 3.13+ environment, establish secure Neon PostgreSQL database connectivity via SQLModel ORM, and implement session management pattern for all database operations. This creates the foundation for authentication and task API endpoints.

**Technical Approach**:
- Use UV package manager for reproducible dependency management with uv.lock
- Connect to Neon Serverless PostgreSQL via DATABASE_URL environment variable
- Implement SQLModel as ORM layer combining SQLAlchemy's power with Pydantic validation
- Auto-create database tables on startup via SQLModel.metadata.create_all()
- Provide session factory with dependency injection for automatic resource cleanup

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**:
- FastAPI (web framework)
- Uvicorn (ASGI server)
- SQLModel (ORM - combines SQLAlchemy + Pydantic)
- python-dotenv (environment variable management)
- psycopg2-binary (PostgreSQL adapter)

**Storage**: Neon Serverless PostgreSQL (cloud-hosted, accessed via connection string)
**Testing**: pytest (unit tests), TestClient from FastAPI (integration tests)
**Target Platform**: Linux/macOS/WSL2 development environment, deployable to any Python hosting (Hugging Face Spaces, Railway, Render, Fly.io)
**Project Type**: Web application (backend only for this feature - frontend is separate)
**Performance Goals**:
- Database connection establishment < 3 seconds
- Session creation/cleanup < 50ms per request
- Environment setup < 5 minutes for new developers

**Constraints**:
- Must use UV package manager (project convention)
- Must isolate virtual environment within backend/ folder
- Database credentials must never be committed to version control
- All database operations must use session management pattern (no direct engine access)
- Must work on WSL2 for Windows developers

**Scale/Scope**:
- Development environment (single developer initially)
- Neon free tier (3 GiB storage, 0.25 logical size limit)
- Small-scale deployment (< 100 concurrent users for Phase 2)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. Spec-Driven Development
- **Compliance**: This implementation plan follows spec-driven development process
- **Evidence**: Feature spec created first (`specs/001-backend-setup/spec.md`), plan references spec, implementation will be generated from plan via `/sp.tasks`

### ✅ II. Iterative Evolution & AI-Native Architecture
- **Compliance**: Design considers future phases (Phase 3 authentication, Phase 4 containerization)
- **Evidence**:
  - Session management pattern prepares for multi-user authentication (Phase 3)
  - Stateless backend design prepares for container orchestration (Phase 4)
  - Environment-based configuration supports multiple deployment targets

### ✅ III. Clean Code & Python Project Structure
- **Compliance**: Following established Python best practices and monorepo structure
- **Evidence**:
  - Separation of concerns (main.py, db.py, models.py)
  - Dependency injection for session management
  - Environment variable configuration
  - Proper .gitignore for sensitive files

### ✅ IV. Comprehensive Testing
- **Compliance**: Test strategy defined in spec with independent test scenarios for each user story
- **Evidence**:
  - P1 test: Verify UV creates .venv, activates, installs dependencies
  - P2 test: Test script connects to Neon and executes query
  - P3 test: Define model, create tables, verify in database

### ✅ V. Documentation & Knowledge Capture
- **Compliance**: Multiple documentation artifacts created
- **Evidence**:
  - Constitution maintained (`.specify/memory/constitution.md`)
  - Feature specification (`specs/001-backend-setup/spec.md`)
  - Implementation plan (this file)
  - PHR created for specification work

### ✅ VI. Cloud-Native & Event-Driven Design
- **Compliance**: Architecture decisions support future cloud-native deployment
- **Evidence**:
  - Stateless backend (no local state storage)
  - External database (Neon PostgreSQL cloud service)
  - Environment-based configuration (12-factor app principle)
  - Database connection pooling (scales horizontally)

**Overall Status**: ✅ All gates passed - no violations to justify

## Project Structure

### Documentation (this feature)

```text
specs/001-backend-setup/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (technology choices, patterns)
├── data-model.md        # Phase 1 output (database models for this feature)
├── quickstart.md        # Phase 1 output (setup instructions)
├── contracts/           # Phase 1 output (API schemas if applicable)
│   └── db-connection.yaml  # Database connection contract
├── checklists/
│   └── requirements.md  # Spec quality checklist (completed)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/                    # Backend application (target for this feature)
├── main.py                 # FastAPI application entry point (TO CREATE)
├── db.py                   # Database connection and session management (TO CREATE)
├── models.py               # SQLModel database models (TO CREATE - starter file)
├── routes/                 # API routes (future features)
│   ├── __init__.py
│   ├── auth.py            # Authentication routes (Feature 002)
│   └── tasks.py           # Task CRUD routes (Feature 003)
├── middleware/            # Custom middleware (future features)
│   ├── __init__.py
│   └── jwt.py             # JWT verification (Feature 002)
├── schemas/               # Pydantic request/response schemas (future features)
│   ├── __init__.py
│   ├── auth.py
│   └── tasks.py
├── tests/                 # Backend tests
│   ├── __init__.py
│   ├── test_db.py         # Database connection tests (TO CREATE)
│   └── conftest.py        # Pytest fixtures (TO CREATE)
├── .env                   # Environment variables (TO CREATE, not in version control)
├── .env.example           # Example environment file (TO CREATE)
├── .gitignore             # Git ignore file (TO CREATE/UPDATE)
├── pyproject.toml         # UV project configuration (TO CREATE)
├── uv.lock                # Locked dependencies (auto-generated by UV)
├── .venv/                 # Virtual environment (auto-generated, not in version control)
├── CLAUDE.md              # Backend guidelines (EXISTS)
└── README.md              # Backend documentation (EXISTS)

frontend/                  # Frontend application (out of scope for this feature)
├── [Next.js structure]

specs/                     # Specifications (this feature under 001-backend-setup/)
├── 001-backend-setup/
├── architecture.md
├── overview.md
└── [other spec folders]

.specify/                  # Spec-Kit configuration
├── memory/
│   └── constitution.md
└── templates/
```

**Structure Decision**: Web application (Option 2) with separate backend/ and frontend/ directories. This feature focuses exclusively on backend/ folder initialization. The backend follows FastAPI conventions with models, routes, middleware, and tests directories. Configuration managed via pyproject.toml with UV package manager.

## Complexity Tracking

**No violations - this section is empty.** All constitution checks passed without requiring justification for complexity.

---

## Phase 0: Research & Technology Choices

**Status**: Ready to execute

### Research Tasks

1. **UV Package Manager Best Practices**
   - Research: Modern Python dependency management with UV
   - Topics: Project initialization, virtual environment creation, dependency locking
   - Output: Recommended UV commands and workflow

2. **Neon PostgreSQL Connection Patterns**
   - Research: Best practices for connecting to Neon Serverless PostgreSQL
   - Topics: Connection string format, connection pooling, SSL requirements, environment variable management
   - Output: Recommended connection configuration

3. **SQLModel ORM Patterns**
   - Research: SQLModel usage patterns for FastAPI applications
   - Topics: Model definition, session management, dependency injection, table creation strategies
   - Output: Recommended session management pattern

4. **FastAPI Project Structure**
   - Research: Standard FastAPI project organization for scalable applications
   - Topics: Module organization, startup events, CORS configuration
   - Output: Recommended file structure and initialization pattern

5. **Testing Strategy for Database-Connected Applications**
   - Research: Testing patterns for applications with external database dependencies
   - Topics: Test fixtures, database mocking vs real database, test isolation
   - Output: Recommended pytest configuration and fixtures

### Research Output Location

All research findings will be consolidated in `specs/001-backend-setup/research.md` with sections for:
- UV Package Manager workflow
- Neon PostgreSQL connection configuration
- SQLModel session management pattern
- FastAPI application structure
- Testing approach

---

## Phase 1: Design & Contracts

**Status**: Pending (requires Phase 0 completion)

### Data Models

**Location**: `specs/001-backend-setup/data-model.md`

This feature establishes the infrastructure but doesn't define domain models yet. A starter User model will be created for testing purposes.

**Models to document**:
1. **User** (starter model for testing database connectivity)
   - Fields: id (string, primary key), email (string, unique), name (string), created_at (datetime)
   - Purpose: Validate SQLModel setup and table creation

Domain models (Task, etc.) will be defined in Feature 003 (Task API Endpoints).

### API Contracts

**Location**: `specs/001-backend-setup/contracts/`

This feature doesn't expose API endpoints. However, we'll document the database connection contract:

**`contracts/db-connection.yaml`**:
```yaml
# Database connection contract for Neon PostgreSQL
connection:
  provider: Neon Serverless PostgreSQL
  protocol: postgresql
  authentication: password
  ssl: required

configuration:
  environment_variable: DATABASE_URL
  format: "postgresql://user:password@host:port/database?sslmode=require"
  connection_pool:
    echo: true  # Development only
    pool_size: 5  # Default for SQLAlchemy
    max_overflow: 10

session_management:
  pattern: dependency_injection
  lifecycle: per_request
  auto_commit: false
  auto_flush: true
  expire_on_commit: false

startup_behavior:
  validate_connection: true
  create_tables: true  # SQLModel.metadata.create_all()
  fail_fast: true  # Exit if DATABASE_URL missing or connection fails
```

### Quickstart Guide

**Location**: `specs/001-backend-setup/quickstart.md`

Developer-facing guide for setting up the backend environment:

**Contents**:
1. Prerequisites (UV installed, Python 3.13+, Neon account)
2. Step-by-step setup (UV init, venv creation, dependency installation)
3. Environment configuration (.env setup with DATABASE_URL)
4. Verification steps (run test script, check database connection)
5. Troubleshooting common issues

### Agent Context Update

After completing Phase 1 design, run:
```bash
.specify/scripts/bash/update-agent-context.sh claude
```

This will update the Claude-specific context file with new technologies from this plan:
- UV package manager
- Neon PostgreSQL
- SQLModel ORM
- FastAPI startup patterns

---

## Implementation Sequence

**Note**: Actual implementation happens in `/sp.tasks` command. This section provides guidance for task ordering.

### Recommended Task Order

1. **Environment Setup** (Priority: P1 - User Story 1)
   - Task 1.1: Initialize UV project in backend/ folder
   - Task 1.2: Create virtual environment (.venv)
   - Task 1.3: Install core dependencies via UV
   - Task 1.4: Configure .gitignore for sensitive files
   - Task 1.5: Create .env.example template

2. **Database Connection** (Priority: P2 - User Story 2)
   - Task 2.1: Create db.py with engine configuration
   - Task 2.2: Implement get_session() dependency
   - Task 2.3: Implement create_db_and_tables() function
   - Task 2.4: Add startup event handler in main.py

3. **SQLModel ORM Setup** (Priority: P3 - User Story 3)
   - Task 3.1: Create models.py with starter User model
   - Task 3.2: Implement session management pattern
   - Task 3.3: Add database connection validation
   - Task 3.4: Test table creation in Neon database

4. **Testing & Verification**
   - Task 4.1: Create test fixtures (conftest.py)
   - Task 4.2: Write database connection test
   - Task 4.3: Write model creation test
   - Task 4.4: Write quickstart.md documentation

### Success Validation

Implementation complete when:
- [ ] UV project initialized with pyproject.toml
- [ ] Virtual environment created and activatable
- [ ] All dependencies installed without errors
- [ ] DATABASE_URL loaded from .env
- [ ] SQLModel engine connects to Neon PostgreSQL
- [ ] get_session() dependency available for routes
- [ ] Tables auto-created on startup
- [ ] Test User model created in database
- [ ] Connection validation fails fast for invalid DATABASE_URL
- [ ] All tests pass (pytest)
- [ ] Quickstart guide validated by fresh environment setup

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| UV not installed on developer machine | High (blocks all work) | Document in quickstart.md, check in setup script |
| Neon database unreachable during development | Medium (blocks testing) | Document offline development workarounds, use connection timeout |
| DATABASE_URL format mismatch | Medium (connection fails) | Provide .env.example with correct format, validate on startup |
| SQLModel version conflicts | Low (dependency resolution) | Lock dependencies with uv.lock, document known compatible versions |
| Windows path issues (native Windows, not WSL2) | Low (most developers use WSL2) | Document WSL2 requirement, provide Windows-specific notes if needed |

---

## Dependencies on Other Features

**This feature depends on**:
- None (this is the foundational feature)

**Other features depend on this**:
- Feature 002 (Authentication): Requires database connection and session management
- Feature 003 (Task API Endpoints): Requires SQLModel models and database session

---

## Appendix: Key Decisions

### Decision 1: UV Package Manager
**Chosen**: UV for dependency management
**Rationale**: Modern, fast Python package manager with better dependency resolution than pip. Supports lockfiles (uv.lock) for reproducibility.
**Alternatives Considered**:
- pip + venv (traditional, slower, no lockfile)
- Poetry (heavier, separate tool installation)

### Decision 2: SQLModel Auto-Create Tables
**Chosen**: Use SQLModel.metadata.create_all() on startup
**Rationale**: Simple for Phase 2 development, no migration complexity. Suitable for evolving schema.
**Alternatives Considered**:
- Alembic migrations (overkill for Phase 2, deferred to future)
- Manual SQL scripts (no ORM benefits, error-prone)

### Decision 3: Session Management Pattern
**Chosen**: Dependency injection via get_session() function
**Rationale**: FastAPI best practice, automatic cleanup, testable, prevents resource leaks.
**Alternatives Considered**:
- Context manager (manual cleanup in every route)
- Global session (not thread-safe, resource leaks)

### Decision 4: Fail-Fast Validation
**Chosen**: Validate DATABASE_URL at startup, exit immediately if invalid
**Rationale**: Catches configuration errors early, prevents runtime failures after deployment.
**Alternatives Considered**:
- Lazy connection (fails at first database operation, harder to debug)
- Default to SQLite fallback (not production-like, hides issues)

---

**Plan Status**: ✅ Ready for Phase 0 Research
**Next Command**: Begin Phase 0 research on UV patterns, Neon connection, SQLModel session management
