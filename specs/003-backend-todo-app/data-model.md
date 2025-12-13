# Data Model: Backend Todo App API

**Feature**: 003-backend-todo-app
**Created**: 2025-12-12
**Status**: Complete
**Purpose**: Define database schema and models for task management with intermediate features

---

## Overview

This data model extends the existing backend architecture (Features 001 and 002) to support intermediate todo app features including task priorities, categories, search, filtering, and sorting capabilities.

**Key Changes from Baseline**:
- Add `TaskPriority` enum (high, medium, low, none)
- Add `TaskCategory` enum (work, personal, shopping, health, other)
- Add priority and category fields to Task model
- Add database indexes for query performance

**Design Principles**:
- Backward compatible with existing tasks (via default values)
- Type-safe with Python enums
- Optimized for common query patterns
- RESTful API conventions

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│       User          │
│ (from Feature 002)  │
├─────────────────────┤
│ id: UUID (PK)       │
│ email: str          │
│ password_hash: str  │
│ created_at: datetime│
│ updated_at: datetime│
└─────────────────────┘
          │
          │ 1:N (one user has many tasks)
          │
          ▼
┌─────────────────────────────┐
│          Task               │
│    (Feature 003 - NEW)      │
├─────────────────────────────┤
│ id: int (PK)                │
│ user_id: UUID (FK) [indexed]│
│ title: str(200)             │
│ description: str(1000)?     │
│ completed: bool [indexed]   │
│ priority: TaskPriority      │ ← NEW
│   [indexed]                 │
│ category: TaskCategory      │ ← NEW
│   [indexed]                 │
│ created_at: datetime        │
│   [indexed]                 │
│ updated_at: datetime        │
└─────────────────────────────┘
```

---

## Enumerations

### TaskPriority

**Purpose**: Represent task priority levels for user organization and filtering

**Implementation**:
```python
from enum import Enum

class TaskPriority(str, Enum):
    """Task priority levels for organizing workload"""
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    NONE = "none"
```

**Values**:
| Value | Description | Use Case |
|-------|-------------|----------|
| `high` | Urgent, time-sensitive tasks | Critical deadlines, important meetings |
| `medium` | Moderate importance | Regular work tasks, appointments |
| `low` | Can be delayed | Nice-to-have items, future planning |
| `none` | No priority assigned | Default for tasks without explicit priority |

**Database Storage**: VARCHAR(10)
**Default Value**: `TaskPriority.NONE`
**Validation**: Pydantic automatically validates enum values

**API Representation**:
```json
{
  "priority": "high"
}
```

---

### TaskCategory

**Purpose**: Categorize tasks by life area or context for organization

**Implementation**:
```python
from enum import Enum

class TaskCategory(str, Enum):
    """Task categories for organizing by life domain"""
    WORK = "work"
    PERSONAL = "personal"
    SHOPPING = "shopping"
    HEALTH = "health"
    OTHER = "other"
```

**Values**:
| Value | Description | Use Case |
|-------|-------------|----------|
| `work` | Professional tasks | Work projects, meetings, emails |
| `personal` | Personal life tasks | Hobbies, family activities, personal goals |
| `shopping` | Shopping and errands | Groceries, purchases, errands |
| `health` | Health and wellness | Gym, medical appointments, self-care |
| `other` | Uncategorized tasks | Default for tasks that don't fit other categories |

**Database Storage**: VARCHAR(20)
**Default Value**: `TaskCategory.OTHER`
**Validation**: Pydantic automatically validates enum values

**API Representation**:
```json
{
  "category": "work"
}
```

---

## Entities

### Task

**Purpose**: Represent a todo item belonging to a specific user

**Table Name**: `task`

**SQLModel Definition**:
```python
from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class Task(SQLModel, table=True):
    """
    Task model with intermediate features (priorities, categories).

    Relationships:
    - Belongs to one User (via user_id foreign key)

    Indexes:
    - user_id: For user isolation and performance
    - completed: For status filtering
    - priority: For priority filtering and sorting
    - category: For category filtering
    - created_at: For date-based sorting
    """
    __tablename__ = "task"

    # Primary Key
    id: Optional[int] = Field(
        default=None,
        primary_key=True,
        description="Unique task identifier"
    )

    # Foreign Key - User Relationship
    user_id: str = Field(
        foreign_key="user.id",
        index=True,
        description="Owner user ID (UUID)"
    )

    # Core Task Data
    title: str = Field(
        max_length=200,
        min_length=1,
        description="Task title (required, 1-200 characters)"
    )

    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Task description (optional, max 1000 characters)"
    )

    completed: bool = Field(
        default=False,
        index=True,
        description="Task completion status"
    )

    # Intermediate Features (Phase II)
    priority: TaskPriority = Field(
        default=TaskPriority.NONE,
        index=True,
        description="Task priority level (high, medium, low, none)"
    )

    category: TaskCategory = Field(
        default=TaskCategory.OTHER,
        index=True,
        description="Task category (work, personal, shopping, health, other)"
    )

    # Timestamps
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        index=True,
        description="Task creation timestamp (UTC)"
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp (UTC)"
    )

    class Config:
        """Pydantic configuration"""
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "title": "Complete project proposal",
                "description": "Draft and submit Q1 project proposal to management",
                "completed": False,
                "priority": "high",
                "category": "work",
                "created_at": "2025-12-12T10:30:00Z",
                "updated_at": "2025-12-12T10:30:00Z"
            }
        }
```

**Field Specifications**:

| Field | Type | Constraints | Indexed | Default | Required | Description |
|-------|------|-------------|---------|---------|----------|-------------|
| `id` | int | Primary Key | Yes (PK) | Auto | No | Unique identifier |
| `user_id` | str (UUID) | Foreign Key | Yes | None | Yes | Owner reference |
| `title` | str | 1-200 chars | No | None | Yes | Task title |
| `description` | str | Max 1000 chars | No | null | No | Task details |
| `completed` | bool | None | Yes | false | No | Completion status |
| `priority` | TaskPriority | Enum | Yes | "none" | No | Priority level |
| `category` | TaskCategory | Enum | Yes | "other" | No | Task category |
| `created_at` | datetime | UTC | Yes | now() | No | Creation time |
| `updated_at` | datetime | UTC | No | now() | No | Last update time |

**Indexes**:
- **Primary Key**: `id`
- **Foreign Key**: `user_id` → `user.id`
- **Performance Indexes**:
  - `ix_task_user_id` - User isolation (every query filters by user_id)
  - `ix_task_completed` - Status filtering (pending/completed)
  - `ix_task_priority` - Priority filtering and sorting
  - `ix_task_category` - Category filtering
  - `ix_task_created_at` - Date-based sorting (default sort field)

**Constraints**:
- `user_id` references `user.id` (foreign key)
- `title` NOT NULL, length >= 1
- `completed` NOT NULL, default false
- `priority` NOT NULL, default 'none'
- `category` NOT NULL, default 'other'
- `created_at` NOT NULL, default CURRENT_TIMESTAMP
- `updated_at` NOT NULL, default CURRENT_TIMESTAMP

---

## Pydantic Schemas

### TaskCreate (Request Body)

**Purpose**: Validate data when creating a new task

```python
from pydantic import BaseModel, Field as PydanticField
from typing import Optional

class TaskCreate(BaseModel):
    """Schema for creating a new task"""
    title: str = PydanticField(
        min_length=1,
        max_length=200,
        description="Task title (required)",
        examples=["Buy groceries"]
    )

    description: Optional[str] = PydanticField(
        default=None,
        max_length=1000,
        description="Task description (optional)",
        examples=["Milk, eggs, bread, vegetables"]
    )

    priority: TaskPriority = PydanticField(
        default=TaskPriority.NONE,
        description="Task priority (optional, defaults to 'none')",
        examples=["high"]
    )

    category: TaskCategory = PydanticField(
        default=TaskCategory.OTHER,
        description="Task category (optional, defaults to 'other')",
        examples=["shopping"]
    )

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Complete project proposal",
                "description": "Draft and submit Q1 proposal",
                "priority": "high",
                "category": "work"
            }
        }
```

**Validation Rules**:
- `title`: Required, 1-200 characters
- `description`: Optional, max 1000 characters
- `priority`: Optional, must be valid TaskPriority enum value (auto-validated by Pydantic)
- `category`: Optional, must be valid TaskCategory enum value (auto-validated by Pydantic)

---

### TaskUpdate (Request Body)

**Purpose**: Validate data when updating an existing task

```python
from pydantic import BaseModel
from typing import Optional

class TaskUpdate(BaseModel):
    """Schema for updating an existing task (all fields optional)"""
    title: Optional[str] = PydanticField(
        default=None,
        min_length=1,
        max_length=200,
        description="Updated task title"
    )

    description: Optional[str] = PydanticField(
        default=None,
        max_length=1000,
        description="Updated task description"
    )

    completed: Optional[bool] = PydanticField(
        default=None,
        description="Updated completion status"
    )

    priority: Optional[TaskPriority] = PydanticField(
        default=None,
        description="Updated priority level"
    )

    category: Optional[TaskCategory] = PydanticField(
        default=None,
        description="Updated category"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "priority": "medium",
                "completed": True
            }
        }
```

**Validation Rules**:
- All fields optional (partial updates supported)
- Only provided fields are updated
- `title` if provided: 1-200 characters
- `description` if provided: max 1000 characters
- `priority` if provided: must be valid TaskPriority enum
- `category` if provided: must be valid TaskCategory enum

---

### TaskResponse (API Response)

**Purpose**: Standardize task data in API responses

```python
from pydantic import BaseModel
from datetime import datetime

class TaskResponse(BaseModel):
    """Schema for task in API responses"""
    id: int
    user_id: str
    title: str
    description: Optional[str]
    completed: bool
    priority: TaskPriority
    category: TaskCategory
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # Enable ORM mode for SQLModel compatibility
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "title": "Complete project proposal",
                "description": "Draft and submit Q1 proposal",
                "completed": False,
                "priority": "high",
                "category": "work",
                "created_at": "2025-12-12T10:30:00Z",
                "updated_at": "2025-12-12T10:30:00Z"
            }
        }
```

**Field Mapping**:
- All Task model fields are included
- Timestamps formatted as ISO 8601 strings
- Enums serialized as string values ("high", "work", etc.)

---

## Database Migration

### Migration Strategy

**Goal**: Add priority and category fields to existing task table without downtime or data loss

**Migration Steps**:

```sql
-- Step 1: Add priority column with default
ALTER TABLE task
ADD COLUMN priority VARCHAR(10) NOT NULL DEFAULT 'none';

-- Step 2: Add category column with default
ALTER TABLE task
ADD COLUMN category VARCHAR(20) NOT NULL DEFAULT 'other';

-- Step 3: Create indexes for query performance
CREATE INDEX ix_task_priority ON task (priority);
CREATE INDEX ix_task_category ON task (category);

-- Step 4: (Optional) Add check constraints for enum validation
ALTER TABLE task
ADD CONSTRAINT check_priority
CHECK (priority IN ('high', 'medium', 'low', 'none'));

ALTER TABLE task
ADD CONSTRAINT check_category
CHECK (category IN ('work', 'personal', 'shopping', 'health', 'other'));
```

**Rollback Plan** (if needed):
```sql
-- Remove constraints
ALTER TABLE task DROP CONSTRAINT IF EXISTS check_priority;
ALTER TABLE task DROP CONSTRAINT IF EXISTS check_category;

-- Drop indexes
DROP INDEX IF EXISTS ix_task_priority;
DROP INDEX IF EXISTS ix_task_category;

-- Remove columns
ALTER TABLE task DROP COLUMN IF EXISTS priority;
ALTER TABLE task DROP COLUMN IF EXISTS category;
```

**Migration Characteristics**:
- **Downtime**: Zero (columns added with defaults)
- **Data Loss**: None (existing tasks get default values)
- **Backward Compatibility**: Existing code without priority/category continues to work
- **Performance Impact**: Minimal (PostgreSQL adds columns instantly with defaults)

---

## Query Patterns

### Common Queries

**1. List all user tasks** (basic):
```python
statement = select(Task).where(Task.user_id == user_id)
```

**2. Filter by status**:
```python
# Pending tasks only
statement = select(Task).where(
    Task.user_id == user_id,
    Task.completed == False
)
```

**3. Filter by priority**:
```python
statement = select(Task).where(
    Task.user_id == user_id,
    Task.priority == TaskPriority.HIGH
)
```

**4. Filter by category**:
```python
statement = select(Task).where(
    Task.user_id == user_id,
    Task.category == TaskCategory.WORK
)
```

**5. Multi-criteria filter**:
```python
statement = select(Task).where(
    Task.user_id == user_id,
    Task.completed == False,
    Task.priority == TaskPriority.HIGH,
    Task.category == TaskCategory.WORK
)
```

**6. Search by keyword** (title or description):
```python
from sqlmodel import col, or_

statement = select(Task).where(
    Task.user_id == user_id,
    or_(
        col(Task.title).ilike(f"%{search}%"),
        col(Task.description).ilike(f"%{search}%")
    )
)
```

**7. Sort by created date** (default):
```python
from sqlmodel import desc

statement = (
    select(Task)
    .where(Task.user_id == user_id)
    .order_by(desc(Task.created_at))
)
```

**8. Sort by priority**:
```python
from sqlmodel import case, desc

# Custom sort order: high > medium > low > none
priority_order = case(
    (Task.priority == TaskPriority.HIGH, 1),
    (Task.priority == TaskPriority.MEDIUM, 2),
    (Task.priority == TaskPriority.LOW, 3),
    (Task.priority == TaskPriority.NONE, 4)
)

statement = (
    select(Task)
    .where(Task.user_id == user_id)
    .order_by(desc(priority_order))
)
```

---

## Performance Considerations

### Index Strategy

**Indexed Fields** (for query optimization):
1. `user_id` - Every query filters by user (security + performance)
2. `completed` - Frequently filtered (pending vs completed)
3. `priority` - Common filter and sort field
4. `category` - Common filter field
5. `created_at` - Default sort field

**Expected Query Performance** (for 10,000 tasks):
- Single filter (indexed): < 50ms
- Multi-filter (all indexed): < 100ms
- Search with filter: < 200ms
- Complex query (filter + search + sort): < 500ms

### Scalability

**Current Design Supports**:
- Up to 10,000 tasks per user (Phase II target)
- < 500ms response time for complex queries (SC-016)
- Concurrent requests from multiple users

**Future Optimizations** (Phase V):
- Composite indexes: `(user_id, priority, category)` for multi-filter queries
- Partial indexes: `WHERE completed = false` for pending tasks
- PostgreSQL full-text search: tsvector for advanced search features

---

## Data Integrity Rules

### Validation Rules

1. **Title**:
   - Required (NOT NULL)
   - Length: 1-200 characters
   - Validated at Pydantic layer

2. **Description**:
   - Optional (nullable)
   - Max length: 1000 characters
   - Validated at Pydantic layer

3. **Priority**:
   - Required (NOT NULL)
   - Default: TaskPriority.NONE
   - Enum validated by Pydantic automatically
   - Database constraint (optional): CHECK IN ('high', 'medium', 'low', 'none')

4. **Category**:
   - Required (NOT NULL)
   - Default: TaskCategory.OTHER
   - Enum validated by Pydantic automatically
   - Database constraint (optional): CHECK IN ('work', 'personal', 'shopping', 'health', 'other')

5. **Timestamps**:
   - `created_at`: Set automatically on insert, immutable
   - `updated_at`: Set automatically on insert, updated on every change

### Referential Integrity

**Foreign Key Constraint**:
```sql
FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
```

**Behavior**:
- When a user is deleted, all their tasks are deleted automatically
- Tasks cannot be created with non-existent user_id
- Enforces user isolation at database level

---

## API Integration Examples

### Create Task
```json
POST /api/{user_id}/tasks
Content-Type: application/json

{
  "title": "Complete project proposal",
  "description": "Draft and submit Q1 proposal",
  "priority": "high",
  "category": "work"
}

Response: 201 Created
{
  "id": 1,
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project proposal",
  "description": "Draft and submit Q1 proposal",
  "completed": false,
  "priority": "high",
  "category": "work",
  "created_at": "2025-12-12T10:30:00Z",
  "updated_at": "2025-12-12T10:30:00Z"
}
```

### List Tasks with Filters
```
GET /api/{user_id}/tasks?status=pending&priority=high&category=work&sort_by=created_at&order=desc

Response: 200 OK
[
  {
    "id": 1,
    "title": "Complete project proposal",
    "priority": "high",
    "category": "work",
    "completed": false,
    ...
  },
  {
    "id": 5,
    "title": "Review budget report",
    "priority": "high",
    "category": "work",
    "completed": false,
    ...
  }
]
```

### Update Task Priority
```json
PUT /api/{user_id}/tasks/1
Content-Type: application/json

{
  "priority": "medium",
  "category": "personal"
}

Response: 200 OK
{
  "id": 1,
  "priority": "medium",
  "category": "personal",
  "updated_at": "2025-12-12T11:00:00Z",
  ...
}
```

---

## Data Model Status

✅ **Complete and Ready for Implementation**

**Validation**:
- All entities defined with SQLModel syntax
- All enums specified with valid values
- All relationships documented
- All indexes identified for performance
- Migration strategy defined
- Backward compatibility ensured

**Next Steps**:
1. Create OpenAPI contract (contracts/openapi.yaml)
2. Implement model in backend/models.py
3. Create database migration
4. Implement API routes
5. Write comprehensive tests

---

**Version**: 1.0
**Last Updated**: 2025-12-12
**Status**: Complete - Ready for API Contract Definition
