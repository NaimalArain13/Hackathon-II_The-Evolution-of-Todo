# Data Models: Phase 2 Backend Project Initialization

**Feature**: 001-backend-setup
**Date**: 2025-12-10
**Purpose**: Document database models for backend infrastructure setup

---

## Overview

This feature establishes the backend infrastructure but doesn't define full domain models. A starter **User** model is created for testing database connectivity and SQLModel setup.

Domain models for the Todo application (Task, etc.) will be defined in **Feature 003** (Task API Endpoints).

---

## Model: User (Test Model)

### Purpose
Validate SQLModel setup, database connectivity, and table creation functionality.

### Entity Description
Represents a user account in the system. This is a minimal model for testing Phase 2 backend infrastructure.

### Fields

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | `int` | Primary key, auto-increment | Unique identifier for user |
| `email` | `str` | Unique, indexed, required | User's email address |
| `name` | `str` | Required | User's display name |
| `created_at` | `datetime` | Default: current timestamp | Account creation timestamp |

### Relationships
None (this is a standalone test model)

### Indexes
- Primary key index on `id` (automatic)
- Unique index on `email` (for fast lookups and constraint enforcement)

### Validation Rules
- **email**: Must be unique across all users
- **name**: Cannot be empty
- **created_at**: Automatically set to current UTC time on creation

---

## SQLModel Implementation

### Model Definition

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class User(SQLModel, table=True):
    """
    User model for testing database connectivity.

    This model validates:
    - SQLModel table creation
    - Database connection
    - Primary key generation
    - Unique constraints
    - Datetime field handling
    """
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(max_length=200)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        # Enable JSON serialization for datetime
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }
```

### Request/Response Schemas

```python
class UserCreate(SQLModel):
    """Schema for creating a new user"""
    email: str = Field(max_length=255)
    name: str = Field(max_length=200)

class UserPublic(SQLModel):
    """Schema for user responses (excludes sensitive fields)"""
    id: int
    email: str
    name: str
    created_at: datetime
```

---

## Database Schema (SQL)

### Table: `user`

```sql
CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_email ON user(email);
```

**Note**: SQLModel automatically generates this schema via `SQLModel.metadata.create_all(engine)`.

---

## Example Usage

### Creating a User

```python
from sqlmodel import Session
from models import User

def create_test_user(session: Session):
    """Create a test user"""
    user = User(
        email="test@example.com",
        name="Test User"
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
```

### Querying Users

```python
from sqlmodel import select

def get_user_by_email(session: Session, email: str):
    """Find user by email"""
    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()
    return user
```

---

## Testing Considerations

### Test Scenarios

1. **Table Creation**: Verify `user` table is created in database
2. **Insert**: Create user and verify ID is auto-generated
3. **Unique Constraint**: Attempt to create duplicate email, expect error
4. **Query**: Retrieve user by email using index
5. **Datetime**: Verify `created_at` is automatically set

### Test Fixtures

```python
import pytest
from sqlmodel import Session, create_engine, SQLModel
from models import User

@pytest.fixture
def test_user(session: Session):
    """Fixture providing a test user"""
    user = User(email="fixture@example.com", name="Fixture User")
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
```

---

## Migration Notes

### Phase 2 Approach
- **Auto-create tables**: Use `SQLModel.metadata.create_all(engine)` on startup
- **Schema changes**: Drop and recreate tables during development (non-production)
- **No migration files**: Suitable for Phase 2 iterative development

### Future Considerations (Phase 3+)
- **Alembic Integration**: For production-grade schema migrations
- **Migration Scripts**: Track schema changes over time
- **Rollback Support**: Ability to revert schema changes

---

## Domain Models (Future Features)

The following models will be defined in later features:

### Feature 003: Task API Endpoints

**Task Model**:
- `id`: Primary key
- `user_id`: Foreign key to User
- `title`: Task title
- `description`: Task description
- `completed`: Boolean status
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

**Task Relationships**:
- Many-to-one: Task → User

---

## Data Model Evolution Plan

| Phase | Models | Purpose |
|-------|--------|---------|
| **Phase 2** | User (test) | Validate infrastructure |
| **Feature 002** | User (full) | Authentication and user management |
| **Feature 003** | Task | Core todo functionality |
| **Phase 3** | Conversation, Message | AI chatbot state |
| **Phase 5** | Advanced fields (priorities, tags, due dates, recurrence) | Enhanced todo features |

---

## Validation & Constraints Summary

| Constraint Type | Field | Rule | Error Message |
|----------------|-------|------|---------------|
| Primary Key | `id` | Auto-increment | N/A |
| Unique | `email` | No duplicates | "Email already exists" |
| Not Null | `email`, `name` | Required | "Field is required" |
| Max Length | `email` | 255 chars | "Email too long" |
| Max Length | `name` | 200 chars | "Name too long" |
| Default | `created_at` | UTC now | N/A |

---

## Security Considerations

### For Test Model (User)
- **No password field**: Authentication handled in Feature 002
- **Email uniqueness**: Enforced at database level
- **No sensitive data**: This is a test model only

### Future Security Requirements (Feature 002)
- Password hashing (bcrypt/argon2)
- Email verification
- Account lockout after failed attempts
- Secure session management

---

**Data Model Status**: ✅ Complete (Test Model)
**Next Steps**: Domain models in Feature 003 (Task CRUD)
