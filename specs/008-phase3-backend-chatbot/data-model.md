# Data Model: Phase 3 Backend - Conversation & Message Tables

**Feature**: Phase 3 Backend - AI Chatbot Infrastructure
**Date**: 2025-12-15
**Branch**: `phase3/backend`

## Purpose

This document defines the database schema for conversation and message persistence in Phase 3 chatbot backend. The design enables stateless server architecture while maintaining full conversation history across sessions.

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│       User          │
│  (existing - Phase 2│
│   managed by        │
│   Better Auth)      │
└──────────┬──────────┘
           │
           │ 1
           │
           │ N
┌──────────▼──────────┐
│   Conversation      │
│  - id (PK)          │
│  - user_id (FK)     │
│  - created_at       │
│  - updated_at       │
└──────────┬──────────┘
           │
           │ 1
           │
           │ N
┌──────────▼──────────┐
│     Message         │
│  - id (PK)          │
│  - conversation_id  │
│    (FK)             │
│  - user_id (FK)     │
│  - role             │
│  - content          │
│  - created_at       │
└─────────────────────┘

           Existing (Phase 2)
┌─────────────────────┐
│       Task          │
│  - id (PK)          │
│  - user_id (FK)     │
│  - title            │
│  - description      │
│  - completed        │
│  - created_at       │
│  - updated_at       │
└─────────────────────┘
```

---

## Conversation Entity

### Purpose
Represents a chat session between a user and the AI assistant. Acts as a container for related messages.

### Schema

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional

class Conversation(SQLModel, table=True):
    """
    Conversation model for chat sessions.

    A conversation represents a continuous chat session between a user
    and the AI assistant. Conversations persist across server restarts
    and enable users to resume previous discussions.
    """

    __tablename__ = "conversations"

    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)

    # Foreign Keys
    user_id: str = Field(
        foreign_key="users.id",
        index=True,
        nullable=False,
        description="User who owns this conversation",
    )

    # Timestamps
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        description="When conversation was created",
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        index=True,
        description="When conversation was last updated (last message time)",
    )

    # Indexes (defined via Field parameters above)
    # - user_id: For filtering user's conversations
    # - updated_at: For sorting by recency
```

### PostgreSQL DDL

```sql
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Foreign Keys
    CONSTRAINT fk_conversations_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    -- Indexes
    CREATE INDEX idx_conversations_user_id ON conversations(user_id),
    CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC)
);
```

### Field Descriptions

| Field | Type | Constraints | Purpose |
|-------|------|------------|---------|
| `id` | Integer | PRIMARY KEY, AUTO INCREMENT | Unique conversation identifier |
| `user_id` | String | NOT NULL, FOREIGN KEY → users.id | Owner of the conversation |
| `created_at` | Timestamp | NOT NULL, DEFAULT NOW() | When conversation started |
| `updated_at` | Timestamp | NOT NULL, DEFAULT NOW() | Last message timestamp |

### Relationships

- **Belongs to User**: `user_id` → `users.id` (many-to-one)
- **Has many Messages**: `id` ← `messages.conversation_id` (one-to-many)

### Indexes

1. **idx_conversations_user_id** (user_id)
   - **Purpose**: Fast lookup of user's conversations
   - **Query**: `SELECT * FROM conversations WHERE user_id = ?`
   - **Cardinality**: High (many conversations per user)

2. **idx_conversations_updated_at** (updated_at DESC)
   - **Purpose**: Sort conversations by recency
   - **Query**: `SELECT * FROM conversations WHERE user_id = ? ORDER BY updated_at DESC`
   - **Cardinality**: High (timestamp is unique per transaction)

### Constraints

1. **Foreign Key**: `user_id` references `users.id` with `ON DELETE CASCADE`
   - If user is deleted, all their conversations are deleted
   - Messages will cascade delete via conversation deletion

### Business Rules

1. Every conversation must have exactly one owner (user_id NOT NULL)
2. Conversations cannot exist without a user (foreign key constraint)
3. `updated_at` is updated whenever a message is added to conversation
4. Conversations are never explicitly deleted by users (soft delete can be added later)

### Sample Data

```sql
-- User alice has 2 conversations
INSERT INTO conversations (user_id, created_at, updated_at)
VALUES
    ('alice', '2025-12-15 10:00:00', '2025-12-15 10:15:00'),  -- Active conversation
    ('alice', '2025-12-14 09:00:00', '2025-12-14 09:30:00');  -- Older conversation

-- User bob has 1 conversation
INSERT INTO conversations (user_id, created_at, updated_at)
VALUES
    ('bob', '2025-12-15 11:00:00', '2025-12-15 11:05:00');
```

---

## Message Entity

### Purpose
Represents a single message in a conversation. Can be either a user message or an assistant response.

### Schema

```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
from enum import Enum

class MessageRole(str, Enum):
    """Valid message roles."""
    USER = "user"
    ASSISTANT = "assistant"

class Message(SQLModel, table=True):
    """
    Message model for chat messages.

    Messages belong to a conversation and can be from either the user
    or the AI assistant. Messages are immutable once created and form
    the conversation history.
    """

    __tablename__ = "messages"

    # Primary Key
    id: Optional[int] = Field(default=None, primary_key=True)

    # Foreign Keys
    conversation_id: int = Field(
        foreign_key="conversations.id",
        index=True,
        nullable=False,
        description="Conversation this message belongs to",
    )

    user_id: str = Field(
        foreign_key="users.id",
        index=True,
        nullable=False,
        description="User who owns this conversation (denormalized for faster queries)",
    )

    # Message Data
    role: MessageRole = Field(
        nullable=False,
        description="Who sent this message: 'user' or 'assistant'",
    )

    content: str = Field(
        max_length=5000,
        nullable=False,
        description="Message text content",
    )

    # Timestamp
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        index=True,
        description="When message was created",
    )

    # Indexes (defined via Field parameters above)
    # - conversation_id: For retrieving conversation history
    # - created_at: For chronological ordering
    # - user_id: For user message queries (optional, enables user-level filtering)
```

### PostgreSQL DDL

```sql
CREATE TYPE message_role AS ENUM ('user', 'assistant');

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL,
    user_id VARCHAR NOT NULL,
    role message_role NOT NULL,
    content VARCHAR(5000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    -- Foreign Keys
    CONSTRAINT fk_messages_conversation
        FOREIGN KEY (conversation_id)
        REFERENCES conversations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_messages_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    -- Constraints
    CONSTRAINT chk_message_content_length CHECK (LENGTH(content) <= 5000),

    -- Indexes
    CREATE INDEX idx_messages_conversation_id ON messages(conversation_id),
    CREATE INDEX idx_messages_created_at ON messages(created_at),
    CREATE INDEX idx_messages_user_id ON messages(user_id)
);
```

### Field Descriptions

| Field | Type | Constraints | Purpose |
|-------|------|------------|---------|
| `id` | Integer | PRIMARY KEY, AUTO INCREMENT | Unique message identifier |
| `conversation_id` | Integer | NOT NULL, FOREIGN KEY → conversations.id | Parent conversation |
| `user_id` | String | NOT NULL, FOREIGN KEY → users.id | Owner (denormalized) |
| `role` | Enum | NOT NULL, 'user' OR 'assistant' | Message sender |
| `content` | String | NOT NULL, MAX 5000 chars | Message text |
| `created_at` | Timestamp | NOT NULL, DEFAULT NOW() | When message was sent |

### Relationships

- **Belongs to Conversation**: `conversation_id` → `conversations.id` (many-to-one)
- **Belongs to User**: `user_id` → `users.id` (many-to-one)

### Indexes

1. **idx_messages_conversation_id** (conversation_id)
   - **Purpose**: Retrieve all messages in a conversation
   - **Query**: `SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at`
   - **Cardinality**: Medium (average 20 messages per conversation)

2. **idx_messages_created_at** (created_at)
   - **Purpose**: Chronological ordering within conversation
   - **Query**: Used with conversation_id filter for ordering
   - **Cardinality**: High (timestamp is unique)

3. **idx_messages_user_id** (user_id)
   - **Purpose**: Filter messages by user (enables user-level analytics)
   - **Query**: `SELECT * FROM messages WHERE user_id = ?`
   - **Cardinality**: High (many messages per user)

### Constraints

1. **Foreign Keys**:
   - `conversation_id` references `conversations.id` with `ON DELETE CASCADE`
   - `user_id` references `users.id` with `ON DELETE CASCADE`
   - Both foreign keys ensure referential integrity

2. **Content Length**: Maximum 5000 characters
   - Prevents database bloat
   - Encourages concise communication
   - Can be validated at API level before database insert

3. **Role Enum**: Only accepts 'user' or 'assistant'
   - Ensures data consistency
   - Prevents typos or invalid values

### Business Rules

1. Every message must belong to exactly one conversation
2. Message content cannot be empty (validated at API level)
3. Messages are immutable (no updates, only create/read/delete)
4. Messages are deleted when parent conversation is deleted (cascade)
5. Role must be either 'user' or 'assistant'
6. Content length limited to 5000 characters

### Sample Data

```sql
-- Conversation 1: alice asking about tasks
INSERT INTO messages (conversation_id, user_id, role, content, created_at)
VALUES
    (1, 'alice', 'user', 'Show me my pending tasks', '2025-12-15 10:00:00'),
    (1, 'alice', 'assistant', 'You have 3 pending tasks: 1) Buy groceries, 2) Call mom, 3) Finish report', '2025-12-15 10:00:05'),
    (1, 'alice', 'user', 'Mark task 2 as complete', '2025-12-15 10:01:00'),
    (1, 'alice', 'assistant', 'I''ve marked "Call mom" as complete. You now have 2 pending tasks.', '2025-12-15 10:01:03');

-- Conversation 2: bob creating a task
INSERT INTO messages (conversation_id, user_id, role, content, created_at)
VALUES
    (3, 'bob', 'user', 'I need to buy milk tomorrow', '2025-12-15 11:00:00'),
    (3, 'bob', 'assistant', 'I''ve added "Buy milk tomorrow" to your task list.', '2025-12-15 11:00:02');
```

---

## Database Migrations

### Migration 004: Add Conversations Table

**File**: `backend/alembic/versions/004_add_conversations.py`

```python
"""Add conversations table

Revision ID: 004
Revises: 003
Create Date: 2025-12-15

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers
revision = '004'
down_revision = '003'  # Previous migration
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create conversations table
    op.create_table(
        'conversations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    )

    # Create indexes
    op.create_index('idx_conversations_user_id', 'conversations', ['user_id'])
    op.create_index('idx_conversations_updated_at', 'conversations', ['updated_at'], postgresql_ops={'updated_at': 'DESC'})


def downgrade() -> None:
    op.drop_index('idx_conversations_updated_at')
    op.drop_index('idx_conversations_user_id')
    op.drop_table('conversations')
```

### Migration 005: Add Messages Table

**File**: `backend/alembic/versions/005_add_messages.py`

```python
"""Add messages table

Revision ID: 005
Revises: 004
Create Date: 2025-12-15

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = '005'
down_revision = '004'
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Create message_role enum
    message_role = sa.Enum('user', 'assistant', name='message_role')
    message_role.create(op.get_bind())

    # Create messages table
    op.create_table(
        'messages',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('conversation_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('role', message_role, nullable=False),
        sa.Column('content', sa.String(length=5000), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['conversation_id'], ['conversations.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.CheckConstraint('LENGTH(content) <= 5000', name='chk_message_content_length'),
    )

    # Create indexes
    op.create_index('idx_messages_conversation_id', 'messages', ['conversation_id'])
    op.create_index('idx_messages_created_at', 'messages', ['created_at'])
    op.create_index('idx_messages_user_id', 'messages', ['user_id'])


def downgrade() -> None:
    op.drop_index('idx_messages_user_id')
    op.drop_index('idx_messages_created_at')
    op.drop_index('idx_messages_conversation_id')
    op.drop_table('messages')
    sa.Enum(name='message_role').drop(op.get_bind())
```

---

## Query Patterns

### Common Queries

```sql
-- 1. Get all conversations for a user (ordered by recency)
SELECT * FROM conversations
WHERE user_id = 'alice'
ORDER BY updated_at DESC
LIMIT 10;

-- 2. Get conversation history (all messages in chronological order)
SELECT role, content, created_at
FROM messages
WHERE conversation_id = 1
ORDER BY created_at ASC;

-- 3. Get recent conversation history (last N messages)
SELECT role, content, created_at
FROM messages
WHERE conversation_id = 1
ORDER BY created_at DESC
LIMIT 50;
-- Note: Reverse in application code for chronological order

-- 4. Create new conversation
INSERT INTO conversations (user_id, created_at, updated_at)
VALUES ('alice', NOW(), NOW())
RETURNING id;

-- 5. Add message to conversation
INSERT INTO messages (conversation_id, user_id, role, content, created_at)
VALUES (1, 'alice', 'user', 'Show my tasks', NOW())
RETURNING id;

-- 6. Update conversation timestamp (when message added)
UPDATE conversations
SET updated_at = NOW()
WHERE id = 1;

-- 7. Delete conversation (cascades to messages)
DELETE FROM conversations WHERE id = 1;
```

### Performance Considerations

1. **Index Usage**:
   - All queries use indexes effectively
   - Composite index on (user_id, updated_at) could further optimize conversation listing
   - Consider partitioning if conversations exceed 1M rows

2. **Query Optimization**:
   - Limit conversation history to recent 50 messages (prevents large result sets)
   - Use `LIMIT` clauses where possible
   - Avoid `SELECT *` in production (specify needed columns)

3. **Write Pattern**:
   - Append-only for messages (no updates)
   - Minimal updates to conversations (only timestamp)
   - Low contention, good for concurrent writes

---

## Storage Estimates

### Assumptions
- Average conversation: 20 messages
- Average message: 100 characters
- 100 users
- 10 conversations per user

### Calculations

```
Conversations:
- Rows: 100 users × 10 conversations = 1,000 rows
- Size per row: ~50 bytes
- Total: ~50 KB

Messages:
- Rows: 1,000 conversations × 20 messages = 20,000 rows
- Size per row: ~200 bytes (includes content, timestamps, indexes)
- Total: ~4 MB

Total Database Size (Phase 3 tables only): ~4 MB
```

**Scalability**: At 10,000 users with same pattern = ~400 MB (well within PostgreSQL capacity)

---

## Testing Requirements

### Unit Tests (SQLModel)
- Test Conversation model creation
- Test Message model creation
- Test foreign key relationships
- Test cascade deletes
- Test enum validation (message role)
- Test content length constraint

### Integration Tests (Database)
- Test conversation creation with first message
- Test adding multiple messages to conversation
- Test retrieving conversation history
- Test updating conversation timestamp
- Test deleting conversation cascades messages
- Test user deletion cascades conversations and messages
- Test concurrent message insertion

### Performance Tests
- Test query performance with 1000 conversations
- Test query performance with 10,000 messages
- Test index effectiveness (EXPLAIN ANALYZE)
- Test concurrent write performance (50 simultaneous inserts)

---

## Security Considerations

1. **User Isolation**: Always filter by authenticated user_id
2. **Input Validation**: Enforce 5000 character limit before database insert
3. **SQL Injection**: Use parameterized queries (SQLModel handles this)
4. **Cascade Deletes**: Ensure user understands conversation deletion is permanent
5. **Access Control**: Validate conversation ownership before retrieval/modification

---

## Future Enhancements (Post-Phase 3)

1. **Soft Deletes**: Add `deleted_at` column for conversation archival
2. **Conversation Titles**: Add `title` column for user-friendly conversation names
3. **Conversation Sharing**: Add `shared_with` column for multi-user conversations
4. **Message Reactions**: Add `reactions` JSONB column for emoji reactions
5. **Message Edits**: Add `edited_at` column and edit history
6. **Conversation Tags**: Add `tags` array for categorization
7. **Read Receipts**: Add `read_at` column for message read status

---

**Data Model Status**: ✅ COMPLETE
**Migrations Ready**: YES (004, 005)
**Ready for Implementation**: YES
