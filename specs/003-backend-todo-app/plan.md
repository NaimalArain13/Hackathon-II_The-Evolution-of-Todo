# Implementation Plan: Backend Todo App API with Intermediate Features

**Branch**: `003-backend-todo-app` | **Date**: 2025-12-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-backend-todo-app/spec.md`

## Summary

This plan outlines the technical implementation of a RESTful Todo API with intermediate features including task priorities, categories, keyword search, multi-criteria filtering, and flexible sorting. The API builds upon existing Features 001 (Backend Setup) and 002 (JWT Authentication) by extending the Task model and implementing comprehensive query capabilities while maintaining user isolation and RESTful conventions.

**Core Technical Approach**:
- Extend existing SQLModel Task model with priority and category enum fields
- Implement query parameter-based filtering, searching, and sorting in FastAPI routes
- Maintain backward compatibility with existing database schema
- Leverage SQLModel's query building for complex filter combinations
- Use database indexes on commonly queried fields for performance
- Enforce user isolation through existing JWT middleware patterns

## Technical Context

**Language/Version**: Python 3.13+
**Primary Dependencies**:
- FastAPI 0.115.0+ (web framework)
- SQLModel 0.0.24+ (ORM - SQLAlchemy + Pydantic)
- Uvicorn 0.30.0+ (ASGI server)
- psycopg2-binary 2.9.9+ (PostgreSQL adapter)
- PyJWT 2.8.0+ (JWT token handling, from Feature 002)
- python-dotenv 1.0.0+ (environment management)

**Storage**: Neon Serverless PostgreSQL (cloud-hosted, already configured in Feature 001)

**Testing**:
- pytest 8.0.0+ (test framework)
- pytest-cov 4.1.0+ (coverage reporting)
- httpx 0.27.0+ (HTTP client for TestClient)
- SQLite in-memory database for test isolation

**Target Platform**: Linux server (WSL2 for development, Hugging Face Spaces or Railway for deployment)

**Project Type**: Web API (backend only, FastAPI monolithic application)

**Performance Goals**:
- Task creation: <1 second response time
- Task retrieval (up to 100 tasks): <1 second
- Search queries (up to 1000 tasks): <2 seconds
- Complex filter + sort queries: <500ms
- Support 100 concurrent requests without errors

**Constraints**:
- All endpoints require valid JWT authentication
- User isolation must be enforced (users cannot access other users' tasks)
- API follows RESTful conventions from Features 001 and 002
- All routes use `/api/{user_id}/tasks` prefix
- Database schema changes must be backward compatible
- Response times: <200ms p95 for simple queries

**Scale/Scope**:
- Support up to 10,000 tasks per user
- 47 functional requirements across 6 user stories
- 6 API endpoints (GET list, GET single, POST, PUT, PATCH, DELETE)
- Query parameter support: status, priority, category, search, sort, order

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Spec-Driven Development
✅ **PASS** - Implementation will be driven by specs/003-backend-todo-app/spec.md
- All 47 functional requirements mapped to implementation
- Claude Code will generate code from specifications
- Manual coding prohibited

### Principle II: Iterative Evolution & AI-Native Architecture
✅ **PASS** - Feature builds upon Phase II foundation
- Extends existing Backend Setup (Feature 001) and JWT Auth (Feature 002)
- Design considers future phases (Phase V event-driven with Kafka)
- Database schema changes are backward compatible

### Principle III: Clean Code & Python Project Structure
✅ **PASS** - Follows established backend structure
- Consistent with existing backend/ directory layout
- Separates concerns: models, routes, schemas, middleware
- Uses type hints and Pydantic models for validation

### Principle IV: Comprehensive Testing
✅ **PASS** - Testing strategy defined in spec
- Unit tests for each CRUD operation
- Integration tests for filter combinations
- Security tests for user isolation
- Edge case tests for invalid input
- Performance tests for large task lists

### Principle V: Documentation & Knowledge Capture
✅ **PASS** - Documentation complete
- Feature spec (spec.md) created
- Implementation plan (this file) in progress
- Will create quickstart.md, data-model.md, contracts/
- PHR will be created for planning phase

### Principle VI: Cloud-Native & Event-Driven Design
✅ **PASS** - Prepares for future cloud deployment
- Stateless API design (no server-side sessions beyond JWT)
- RESTful endpoints suitable for horizontal scaling
- Database indexes for query performance
- Future-ready for Kafka event streaming (Phase V)

**Constitution Status**: ✅ ALL GATES PASSED - Proceed to Phase 0 Research

## Project Structure

### Documentation (this feature)

```text
specs/003-backend-todo-app/
├── spec.md              # Feature specification (✅ complete)
├── plan.md              # This file (/sp.plan output)
├── research.md          # Phase 0: Technical decisions and patterns
├── data-model.md        # Phase 1: Enhanced Task model definition
├── quickstart.md        # Phase 1: Developer setup and testing guide
├── contracts/           # Phase 1: API contracts
│   └── openapi.yaml     # OpenAPI 3.0 specification for all endpoints
├── checklists/          # Quality validation
│   └── requirements.md  # Spec quality checklist (✅ complete)
└── tasks.md             # Phase 2: Generated by /sp.tasks (NOT by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── models.py            # ✅ Extend Task model with priority & category enums
├── routes/
│   ├── __init__.py      # ✅ Already exists
│   ├── auth.py          # ✅ Feature 002 (no changes)
│   └── tasks.py         # 🔨 NEW: Task CRUD endpoints with filtering/sorting
├── schemas/
│   ├── __init__.py      # ✅ Already exists
│   ├── auth.py          # ✅ Feature 002 (no changes)
│   └── tasks.py         # 🔨 NEW: Task request/response schemas
├── middleware/
│   ├── __init__.py      # ✅ Already exists
│   └── jwt.py           # ✅ Feature 002 (reuse for authentication)
├── lib/
│   └── query_builder.py # 🔨 NEW (optional): Helper for complex queries
├── tests/
│   ├── conftest.py      # ✅ Already exists (may need fixtures)
│   ├── test_db.py       # ✅ Feature 001 (no changes)
│   ├── test_auth.py     # ✅ Feature 002 (no changes)
│   └── test_tasks.py    # 🔨 NEW: Comprehensive task endpoint tests
├── main.py              # 🔨 UPDATE: Import and include tasks router
├── db.py                # ✅ Feature 001 (no changes)
├── pyproject.toml       # ✅ No new dependencies needed
└── README.md            # 🔨 UPDATE: Document new endpoints

Legend:
✅ Already exists (no changes or minor updates)
🔨 NEW or significant changes required
```

**Structure Decision**: Web application (Option 2) - Backend-only API service. Frontend will be implemented separately. This aligns with the monorepo structure established in Features 001 and 002, where backend/ contains the FastAPI application with clear separation of models, routes, schemas, middleware, and tests.

## Complexity Tracking

> All Constitution Check gates passed - no violations to justify.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None      | N/A        | N/A                                 |

**Complexity Justification**: This feature maintains the established patterns from Features 001 and 002. No architectural complexity is introduced. The implementation extends existing models and adds new route handlers following FastAPI best practices.

---

## Phase 0: Research & Technical Decisions

**Goal**: Resolve technical unknowns and establish implementation patterns.

### Research Tasks

1. **SQLModel Enum Field Patterns**
   - **Question**: Best practice for implementing enum fields (priority, category) in SQLModel?
   - **Research Areas**:
     - Python Enum vs String literal type hints
     - Database storage: String vs Integer enum values
     - Validation approaches (Pydantic validators vs SQLModel Field constraints)
     - Default value handling
   - **Expected Outcome**: Recommended pattern for priority/category enum implementation

2. **Query Parameter Filtering Patterns in FastAPI**
   - **Question**: How to implement multi-criteria filtering with optional query parameters?
   - **Research Areas**:
     - FastAPI Query parameter patterns (Optional types, default values)
     - SQLModel/SQLAlchemy query building for dynamic filters
     - Combining multiple WHERE clauses (AND logic)
     - Handling None/null values in filters
   - **Expected Outcome**: Pattern for flexible query parameter handling

3. **Search Implementation Strategy**
   - **Question**: Application-level vs database-level search for Phase II scope?
   - **Research Areas**:
     - Case-insensitive string matching in PostgreSQL (ILIKE vs LOWER)
     - OR logic for multi-field search (title OR description)
     - Performance implications for 1000+ tasks
     - Full-text search for future optimization (out of scope for Phase II)
   - **Expected Outcome**: Recommended search approach for Phase II

4. **Sorting Implementation with SQLModel**
   - **Question**: How to implement dynamic sorting with order direction (asc/desc)?
   - **Research Areas**:
     - SQLModel/SQLAlchemy order_by() patterns
     - Handling multiple sort fields
     - Enum field sorting (priority high > medium > low > none)
     - Default sort order when not specified
   - **Expected Outcome**: Pattern for flexible sorting implementation

5. **Database Indexing Strategy**
   - **Question**: Which fields should be indexed for optimal query performance?
   - **Research Areas**:
     - Index types (B-tree, partial indexes)
     - Composite index vs multiple single-column indexes
     - Index on foreign keys (user_id already indexed from Feature 002)
     - Index on enum fields (priority, category)
     - Index on timestamps (created_at, updated_at)
   - **Expected Outcome**: Recommended indexing strategy

6. **Backward Compatibility for Schema Changes**
   - **Question**: How to add new fields to existing Task model without breaking existing data?
   - **Research Areas**:
     - Database migration strategies with SQLModel
     - Default values for new columns
     - Alembic integration (if needed for Phase II)
     - Testing migration with existing data
   - **Expected Outcome**: Migration approach for adding priority and category fields

7. **Error Handling and Validation Patterns**
   - **Question**: How to validate enum values and provide clear error messages?
   - **Research Areas**:
     - Pydantic enum validation
     - FastAPI HTTPException patterns
     - Error response format consistency
     - HTTP status codes for validation errors (400 Bad Request)
   - **Expected Outcome**: Validation and error handling pattern

8. **Testing Strategy for Complex Queries**
   - **Question**: How to test all filter/sort combinations efficiently?
   - **Research Areas**:
     - Parameterized tests with pytest
     - Test data generation for multiple scenarios
     - Mocking vs integration tests for database queries
     - Test coverage for edge cases
   - **Expected Outcome**: Testing approach for comprehensive coverage

**Deliverable**: `research.md` with decisions and rationale for each research area.

---

## Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete with all technical decisions made.

### 1. Data Model Design (`data-model.md`)

**Task**: Extend existing Task model with intermediate features.

**Current Task Model** (from Feature 001):
```python
class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

**Enhanced Task Model** (for Feature 003):
```python
# Add enum definitions
class TaskPriority(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    NONE = "none"

class TaskCategory(str, Enum):
    WORK = "work"
    PERSONAL = "personal"
    SHOPPING = "shopping"
    HEALTH = "health"
    OTHER = "other"

class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(foreign_key="user.id", index=True)
    title: str = Field(max_length=200)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)

    # NEW: Intermediate features
    priority: TaskPriority = Field(default=TaskPriority.NONE, index=True)
    category: TaskCategory = Field(default=TaskCategory.OTHER, index=True)

    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

**Key Design Decisions** (to be validated in research.md):
- Priority and category as String enums (not integer) for readability
- Default values (none, other) for backward compatibility
- Indexes on priority, category, created_at for query performance
- user_id foreign key relationship maintained from Feature 001

**Deliverable**: `data-model.md` with complete model definition, field descriptions, validation rules, and index specifications.

### 2. API Contracts (`contracts/openapi.yaml`)

**Task**: Define OpenAPI 3.0 specification for all Task endpoints.

**Endpoints to Define**:

1. **GET /api/{user_id}/tasks** - List tasks with optional filters
   - Path parameters: `user_id` (string, required)
   - Query parameters:
     - `status` (string, optional): "all" | "pending" | "completed" (default: "all")
     - `priority` (string, optional): "high" | "medium" | "low" | "none"
     - `category` (string, optional): "work" | "personal" | "shopping" | "health" | "other"
     - `search` (string, optional): keyword to search in title and description
     - `sort_by` (string, optional): "created_at" | "updated_at" | "title" | "priority" | "status" (default: "created_at")
     - `order` (string, optional): "asc" | "desc" (default: "desc")
   - Responses:
     - 200: Array of Task objects
     - 401: Unauthorized (invalid/missing JWT)
     - 403: Forbidden (user_id mismatch)

2. **POST /api/{user_id}/tasks** - Create new task
   - Path parameters: `user_id` (string, required)
   - Request body: TaskCreate schema
   - Responses:
     - 201: Created Task object
     - 400: Bad Request (validation error)
     - 401: Unauthorized
     - 403: Forbidden

3. **GET /api/{user_id}/tasks/{task_id}** - Get single task
   - Path parameters: `user_id`, `task_id` (integer)
   - Responses:
     - 200: Task object
     - 401: Unauthorized
     - 403: Forbidden
     - 404: Not Found

4. **PUT /api/{user_id}/tasks/{task_id}** - Update task
   - Path parameters: `user_id`, `task_id`
   - Request body: TaskUpdate schema
   - Responses:
     - 200: Updated Task object
     - 400: Bad Request
     - 401: Unauthorized
     - 403: Forbidden
     - 404: Not Found

5. **DELETE /api/{user_id}/tasks/{task_id}** - Delete task
   - Path parameters: `user_id`, `task_id`
   - Responses:
     - 204: No Content
     - 401: Unauthorized
     - 403: Forbidden
     - 404: Not Found

6. **PATCH /api/{user_id}/tasks/{task_id}/complete** - Toggle completion
   - Path parameters: `user_id`, `task_id`
   - Responses:
     - 200: Updated Task object
     - 401: Unauthorized
     - 403: Forbidden
     - 404: Not Found

**Schema Definitions**:
- TaskCreate: title, description, priority, category
- TaskUpdate: title?, description?, priority?, category?, completed?
- TaskResponse: All fields including id, user_id, timestamps

**Deliverable**: `contracts/openapi.yaml` with complete OpenAPI 3.0 specification.

### 3. Quickstart Guide (`quickstart.md`)

**Task**: Create developer setup and testing guide.

**Content**:
1. Prerequisites (from Feature 001 & 002)
2. Environment setup (virtual environment, dependencies)
3. Database migration (adding priority and category fields)
4. Running the application
5. Testing endpoints with curl/httpx examples
6. Common query parameter combinations
7. Troubleshooting

**Deliverable**: `quickstart.md` with step-by-step instructions for developers.

### 4. Agent Context Update

**Task**: Update Claude Code agent context with new technologies.

```bash
.specify/scripts/bash/update-agent-context.sh claude
```

**Technologies to Add** (if not already present):
- SQLModel enum field patterns
- FastAPI query parameter filtering
- Multi-criteria search implementation
- Dynamic sorting with order_by

**Deliverable**: Updated `.claude/context.md` (or equivalent) with new patterns.

---

## Phase 2: Task Generation

**Note**: This phase is executed by the `/sp.tasks` command, NOT by `/sp.plan`.

The `/sp.tasks` command will generate `tasks.md` with:
- Dependency-ordered implementation tasks
- Test tasks for each feature
- Documentation tasks
- Each task with clear acceptance criteria

---

## Implementation Order (for /sp.tasks reference)

Based on user story priorities and dependencies:

### P1 Tasks (Foundation):
1. Extend Task model with priority and category enums
2. Create database migration (if needed)
3. Implement basic CRUD routes (POST, GET list, GET single, PUT, DELETE, PATCH)
4. Add TaskCreate, TaskUpdate, TaskResponse schemas
5. Test basic CRUD operations with user isolation

### P1 Tasks (Priority Feature):
6. Implement priority filtering (query parameter)
7. Implement priority sorting
8. Test priority filtering and sorting

### P2 Tasks (Category Feature):
9. Implement category filtering (query parameter)
10. Test category filtering

### P2 Tasks (Search Feature):
11. Implement keyword search (title and description)
12. Test search functionality with various queries

### P2 Tasks (Multi-Criteria Filtering):
13. Implement combined filters (status + priority + category)
14. Test filter combinations

### P3 Tasks (Sorting Feature):
15. Implement sorting by created_at, updated_at, title, status
16. Implement sort order (asc/desc)
17. Test all sorting options

### Final Tasks:
18. Add database indexes (priority, category, created_at)
19. Performance testing (100 concurrent requests)
20. Edge case testing
21. Update documentation (README, quickstart)
22. Integration testing (full workflow)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Database migration breaks existing data | Low | High | Use default values, test migration on copy of production data |
| Complex filter queries slow | Medium | Medium | Implement database indexes, test with 1000+ tasks |
| Enum validation errors unclear | Low | Low | Use Pydantic validators with clear error messages |
| Search performance degrades | Medium | Medium | Limit search to application layer for Phase II, optimize later |
| User isolation bypass | Low | Critical | Reuse proven JWT middleware from Feature 002, comprehensive security tests |
| Backward compatibility issues | Low | Medium | Ensure defaults for new fields, test with existing data |

---

## Success Metrics (from spec.md)

All 19 success criteria from spec.md must be validated:

### Functional Metrics:
- ✅ Task creation: <1 second response
- ✅ Task retrieval (100 tasks): <1 second
- ✅ Search (1000 tasks): <2 seconds
- ✅ 100% user isolation enforcement
- ✅ All filter combinations work correctly
- ✅ All sort options work correctly
- ✅ 95% operations succeed on first attempt

### Performance Metrics:
- ✅ 100 concurrent requests without errors
- ✅ Simple queries: <200ms
- ✅ Complex queries: <500ms

### Data Integrity Metrics:
- ✅ Referential integrity maintained
- ✅ Enum validation enforced
- ✅ Timestamps accurate

---

## Dependencies

### Technical Dependencies (from Feature 001 & 002):
- ✅ Backend Setup (Feature 001): FastAPI app, database connection, SQLModel models
- ✅ JWT Authentication (Feature 002): JWT middleware, user isolation patterns, auth routes

### New Dependencies:
- None required (all dependencies already in pyproject.toml from Feature 001 & 002)

### Integration Dependencies:
- Frontend (Next.js) will consume these endpoints in future feature
- Better Auth JWT tokens for authentication (from Feature 002)

---

## Notes

1. **Backward Compatibility**: Priority and category fields have defaults (none, other). Existing tasks without these fields will automatically get defaults when queried.

2. **Performance**: Database indexes on priority, category, and created_at are critical for query performance with 10,000+ tasks per user.

3. **Future Optimization**: For Phase V (event-driven), consider:
   - Publishing task events to Kafka on create/update/delete
   - Caching frequently accessed task lists
   - Full-text search with PostgreSQL tsvector

4. **Testing Strategy**: Use parameterized tests for filter combinations to ensure comprehensive coverage without test code duplication.

5. **Error Messages**: All validation errors should include helpful messages indicating which field failed and why.

6. **API Documentation**: FastAPI auto-generates Swagger UI at `/docs` - ensure all endpoints are properly documented with descriptions and examples.

---

**Status**: Ready for Phase 0 Research
**Next Command**: Continue with research phase to resolve technical decisions
**After Research**: Update this plan with concrete patterns from research.md
**Final Step**: Run `/sp.tasks` to generate implementation tasks
