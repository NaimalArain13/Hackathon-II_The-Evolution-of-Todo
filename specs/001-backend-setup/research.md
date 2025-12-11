# Research Findings: Phase 2 Backend Project Initialization

**Feature**: 001-backend-setup
**Date**: 2025-12-10
**Status**: Complete

This document consolidates research findings for UV package management, Neon PostgreSQL connectivity, SQLModel ORM patterns, FastAPI project structure, and testing strategies.

---

## 1. UV Package Manager Best Practices

### Decision: Use UV for Python Dependency Management

**What is UV**: UV is a modern, extremely fast Python package installer and resolver written in Rust. It's designed as a drop-in replacement for pip with better dependency resolution and lockfile support.

### Key Features
- **Fast**: 10-100x faster than pip for dependency resolution and installation
- **Lockfiles**: Generates `uv.lock` file for reproducible installs (similar to Poetry's poetry.lock)
- **Virtual Environment Management**: Built-in venv creation and management
- **Compatibility**: Works with existing pip-compatible packages from PyPI

### Recommended Workflow

#### Project Initialization
```bash
# Initialize UV project in backend folder
cd backend
uv init --lib  # Creates pyproject.toml

# Or manually create pyproject.toml with content:
# [project]
# name = "backend"
# version = "0.1.0"
# requires-python = ">=3.13"
# dependencies = [
#     "fastapi",
#     "uvicorn[standard]",
#     "sqlmodel",
#     "python-dotenv",
#     "psycopg2-binary",
# ]
```

#### Virtual Environment Setup
```bash
# Create virtual environment
uv venv

# Activate (Linux/macOS)
source .venv/bin/activate

# Activate (Windows WSL2)
source .venv/bin/activate

# Activate (Windows native - if needed)
.venv\Scripts\activate
```

#### Dependency Management
```bash
# Install all dependencies from pyproject.toml
uv sync

# Add new dependency
uv add package-name

# Add dev dependency
uv add --dev pytest

# Update dependencies
uv sync --upgrade

# Lock dependencies (creates/updates uv.lock)
uv lock
```

### Key Files
- **pyproject.toml**: Project metadata and dependency declarations
- **uv.lock**: Locked dependency versions (commit to version control)
- **.venv/**: Virtual environment directory (add to .gitignore)

### Alternatives Considered
- **pip + venv**: Traditional approach, slower, no lockfile support
- **Poetry**: Feature-rich but heavier, requires separate installation, slower than UV

**Rationale for UV**: Modern tool aligned with Python packaging standards (PEP 621), extremely fast, built-in lockfile support for reproducibility, simpler workflow than Poetry.

---

## 2. Neon PostgreSQL Connection Patterns

### Decision: Use Environment-Based Connection String with SQLModel Engine

**What is Neon**: Neon is a serverless PostgreSQL platform that automatically scales, pauses during inactivity, and provides instant branching for development workflows.

### Connection String Format
```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

**Example**:
```
postgresql://username:password@ep-cool-name-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### Recommended Pattern: Environment Variable Configuration

**`.env` file** (not committed to version control):
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
```

**`.env.example`** (committed to version control):
```env
DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
```

### SQLModel Engine Configuration

```python
import os
from sqlmodel import create_engine

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Get DATABASE_URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    echo=True,  # Set to False in production for performance
    pool_size=5,  # Default connection pool size
    max_overflow=10,  # Max connections beyond pool_size
    pool_pre_ping=True,  # Verify connections before using them
)
```

### Key Configuration Parameters

| Parameter | Purpose | Development | Production |
|-----------|---------|-------------|------------|
| `echo` | Log all SQL statements | `True` | `False` |
| `pool_size` | Base connection pool size | `5` | `10-20` |
| `max_overflow` | Additional connections allowed | `10` | `20-30` |
| `pool_pre_ping` | Test connections before use | `True` | `True` |

### Security Best Practices
1. **Never commit DATABASE_URL** to version control
2. **Use SSL/TLS** (sslmode=require in connection string)
3. **Rotate credentials** periodically
4. **Use read-only users** for query-only operations (future consideration)

### Alternatives Considered
- **Hardcoded connection string**: Insecure, not portable
- **Config file (config.yaml)**: Still needs to be excluded from version control, environment variables are simpler
- **Cloud secrets manager**: Overkill for Phase 2, consider for production

**Rationale**: Environment variables are the industry standard (12-factor app), work seamlessly with deployment platforms, secure when properly managed.

---

## 3. SQLModel ORM Patterns with FastAPI

### Decision: Use Dependency Injection for Session Management

SQLModel combines SQLAlchemy's power with Pydantic's validation, making it ideal for FastAPI applications.

### Recommended Session Management Pattern

#### Database Module (`db.py`)

```python
from sqlmodel import create_engine, SQLModel, Session
from typing import Generator
import os

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create engine
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """Create database tables on startup"""
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator[Session, None, None]:
    """Dependency for getting database session"""
    with Session(engine) as session:
        yield session
```

#### FastAPI Application (`main.py`)

```python
from fastapi import FastAPI, Depends
from sqlmodel import Session
from typing import Annotated
from db import create_db_and_tables, get_session

app = FastAPI()

# Type alias for cleaner dependency injection
SessionDep = Annotated[Session, Depends(get_session)]

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/")
def root(session: SessionDep):
    # Session automatically managed - created before request, closed after
    return {"message": "Database connected"}
```

### Key Patterns

#### 1. Model Definition
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class User(SQLModel, table=True):
    """User model for testing database connectivity"""
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

#### 2. Automatic Table Creation
```python
# Called once at application startup
SQLModel.metadata.create_all(engine)
```

#### 3. Session Usage in Routes
```python
@app.post("/users/", response_model=UserPublic)
def create_user(user: UserCreate, session: SessionDep):
    db_user = User.model_validate(user)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user
```

### Benefits of This Pattern

| Benefit | Description |
|---------|-------------|
| **Automatic Cleanup** | Session closed automatically after request completes |
| **Type Safety** | Full type hints and IDE autocomplete |
| **Testability** | Easy to mock session dependency in tests |
| **No Resource Leaks** | Context manager ensures connections are released |
| **DRY Principle** | Session dependency reused across all routes |

### Alternatives Considered
- **Context Manager in Each Route**: Requires manual `with Session(engine)` in every function, repetitive
- **Global Session**: Not thread-safe, causes resource leaks
- **Manual Session Management**: Error-prone, easy to forget cleanup

**Rationale**: Dependency injection is FastAPI best practice, provides automatic cleanup, testable, prevents resource leaks.

---

## 4. FastAPI Project Structure

### Decision: Follow Standard FastAPI Conventions

Recommended structure for scalable FastAPI applications with SQLModel.

### Project Layout

```
backend/
├── main.py              # Application entry point, FastAPI app instance
├── db.py                # Database connection and session management
├── models.py            # SQLModel database models
├── routes/              # API route handlers (feature-based organization)
│   ├── __init__.py
│   ├── auth.py          # Authentication endpoints (future)
│   └── tasks.py         # Task CRUD endpoints (future)
├── middleware/          # Custom middleware
│   ├── __init__.py
│   └── jwt.py           # JWT verification (future)
├── schemas/             # Pydantic request/response schemas
│   ├── __init__.py
│   ├── auth.py
│   └── tasks.py
├── tests/               # Test files
│   ├── __init__.py
│   ├── conftest.py      # Pytest fixtures
│   ├── test_db.py       # Database connection tests
│   └── test_routes.py   # API endpoint tests
├── .env                 # Environment variables (not in version control)
├── .env.example         # Example environment file
├── .gitignore           # Git ignore configuration
├── pyproject.toml       # Project metadata and dependencies
├── uv.lock              # Locked dependencies
└── README.md            # Documentation
```

### Main Application Pattern

```python
# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import create_db_and_tables

app = FastAPI(
    title="Todo API",
    description="RESTful API for Todo application",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev
        "https://your-frontend.vercel.app"  # Production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Health check
@app.get("/")
def read_root():
    return {"message": "Todo API is running", "version": "1.0.0"}

# Include routers (future)
# from routes import auth, tasks
# app.include_router(auth.router, prefix="/api", tags=["authentication"])
# app.include_router(tasks.router, prefix="/api", tags=["tasks"])
```

### Configuration Best Practices

1. **Separation of Concerns**: Each module has single responsibility
   - `main.py`: Application initialization and middleware
   - `db.py`: Database connection logic
   - `models.py`: Database models only
   - `routes/`: Endpoint handlers organized by feature

2. **Environment-Based Configuration**: Use environment variables for deployment-specific settings

3. **Modular Design**: Easy to add new features without modifying existing code

### Alternatives Considered
- **Flat Structure**: All files in root, hard to scale
- **Domain-Driven Design**: Too complex for Phase 2, better for large applications

**Rationale**: Standard FastAPI convention, widely documented, easy for new developers to understand, scales well.

---

## 5. Testing Strategy for Database-Connected Applications

### Decision: Use Pytest with FastAPI TestClient

### Testing Approach

#### Test Fixtures (`tests/conftest.py`)

```python
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel
from sqlmodel.pool import StaticPool
from main import app
from db import get_session

# In-memory SQLite database for tests
@pytest.fixture(name="session")
def session_fixture():
    """Create a fresh database for each test"""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(session: Session):
    """Create TestClient with overridden session dependency"""
    def get_session_override():
        yield session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()
```

#### Database Connection Test (`tests/test_db.py`)

```python
from sqlmodel import Session, select
from models import User

def test_create_user(session: Session):
    """Test creating a user in the database"""
    user = User(email="test@example.com", name="Test User")
    session.add(user)
    session.commit()
    session.refresh(user)

    assert user.id is not None
    assert user.email == "test@example.com"

def test_database_connection(session: Session):
    """Test database connection is working"""
    # Execute a simple query
    result = session.exec(select(User)).all()
    assert isinstance(result, list)
```

#### API Endpoint Test (`tests/test_routes.py`)

```python
from fastapi.testclient import TestClient

def test_read_root(client: TestClient):
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Todo API is running", "version": "1.0.0"}
```

### Testing Strategy

| Test Type | Purpose | Tools |
|-----------|---------|-------|
| **Unit Tests** | Test individual functions and models | pytest, SQLModel Session |
| **Integration Tests** | Test database operations | pytest, in-memory SQLite |
| **API Tests** | Test HTTP endpoints | FastAPI TestClient |
| **Connection Tests** | Verify database connectivity | pytest, Neon database (optional) |

### Key Testing Principles

1. **Isolated Tests**: Each test uses fresh database (in-memory SQLite)
2. **Dependency Override**: Replace production database with test database
3. **Fast Execution**: In-memory database makes tests run quickly
4. **No External Dependencies**: Tests don't require Neon connection

### Running Tests

```bash
# Run all tests
pytest

# Run specific test file
pytest tests/test_db.py

# Run with coverage
pytest --cov=. --cov-report=html

# Run with verbose output
pytest -v
```

### Alternatives Considered
- **Test Against Real Neon Database**: Slower, requires network, costs money, harder to clean up
- **Docker PostgreSQL**: Adds complexity, slower startup, not needed for Phase 2
- **No Testing**: Unacceptable, violates constitution requirement

**Rationale**: In-memory SQLite provides fast, isolated tests. TestClient makes API testing straightforward. Can always add real database tests later if needed.

---

## Summary of Key Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Dependency Management** | UV with lockfiles | Fast, modern, reproducible builds |
| **Database Connection** | Environment variables + SQLModel engine | Secure, portable, industry standard |
| **Session Management** | FastAPI dependency injection with yield | Automatic cleanup, testable, no leaks |
| **Project Structure** | Standard FastAPI conventions | Scalable, well-documented, maintainable |
| **Testing** | Pytest + in-memory SQLite | Fast, isolated, no external dependencies |
| **Table Creation** | SQLModel.metadata.create_all() on startup | Simple for Phase 2, suitable for evolving schema |

---

## Implementation Notes

### Phase 1 Next Steps
1. Create `data-model.md` documenting User model schema
2. Create `contracts/db-connection.yaml` specifying database connection contract
3. Create `quickstart.md` with step-by-step developer setup guide
4. Update agent context with UV, Neon, SQLModel technologies

### Future Considerations (Out of Scope for Phase 2)
- **Database Migrations**: Consider Alembic for schema evolution in Phase 3+
- **Connection Pooling Optimization**: Fine-tune pool sizes based on production load
- **Read Replicas**: For scaling read-heavy workloads
- **Query Optimization**: Add database indexes as needed
- **Monitoring**: Integrate database performance monitoring

---

**Research Status**: ✅ Complete
**Next Phase**: Phase 1 - Design & Contracts
