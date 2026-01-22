# Phase 3 Backend Quickstart Guide

**Feature**: AI Chatbot Infrastructure
**Branch**: `phase3/backend`
**Date**: 2025-12-15

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Development Setup](#development-setup)
5. [Running the Application](#running-the-application)
6. [Testing the Chatbot](#testing-the-chatbot)
7. [Troubleshooting](#troubleshooting)
8. [Development Workflow](#development-workflow)

---

## Prerequisites

Before starting, ensure you have:

### Required Software
- **Python 3.13+** (check with `python --version`)
- **uv** (Python package manager) - Install: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **PostgreSQL Client** (for testing queries) - Optional but recommended
- **curl** or **Postman** (for API testing)
- **Git** (for version control)

### Required Accounts & API Keys
- **Neon Database Account** (existing from Phase 2)
  - Connection string from Neon console
  - Database should already have `users` and `tasks` tables
- **Google AI API Key** (for Gemini 2.0 Flash)
  - Get from: https://makersuite.google.com/app/apikey
  - Free tier sufficient for development

### Existing Infrastructure (Phase 2)
- ✅ Neon PostgreSQL database with `users` and `tasks` tables
- ✅ Better Auth JWT authentication system
- ✅ FastAPI backend running on port 8000
- ✅ User authentication middleware

---

## Environment Setup

### Step 1: Clone Repository & Navigate to Backend

```bash
cd backend
```

### Step 2: Create Python Virtual Environment

```bash
# Create virtual environment
uv venv

# Activate virtual environment
# On Linux/macOS:
source .venv/bin/activate

# On Windows:
.venv\Scripts\activate
```

### Step 3: Install Dependencies

The Phase 3 dependencies will be added to `pyproject.toml`:

```bash
# Install Phase 2 dependencies (if not already done)
uv sync

# Install Phase 3 specific dependencies
uv add openai-agents-sdk mcp litellm
```

**Required packages**:
- `fastapi` (existing)
- `sqlmodel` (existing)
- `openai-agents-sdk` - NEW (OpenAI Agents SDK for AI agent)
- `mcp` - NEW (Official MCP SDK for tool server)
- `litellm` - NEW (Multi-model LLM proxy for Gemini)
- `better-auth` (existing, for JWT verification)
- `neon-serverless` (existing, for database)

### Step 4: Configure Environment Variables

Create or update `.env` file in `backend/` directory:

```bash
# Copy example if not exists
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database (existing from Phase 2)
DATABASE_URL=postgresql://user:password@your-neon-host.neon.tech/todo_db?sslmode=require

# Authentication (existing from Phase 2)
BETTER_AUTH_SECRET=your-shared-secret-key-here
JWT_ALGORITHM=HS256

# Phase 3: AI Agent Configuration (NEW)
GOOGLE_API_KEY=your-google-api-key-here

# Phase 3: MCP Server Configuration (NEW)
MCP_SERVER_URL=http://localhost:8000/api/mcp
MCP_TIMEOUT_SECONDS=30

# Phase 3: Agent Settings (NEW)
AGENT_MODEL=gemini/gemini-2.0-flash
AGENT_TEMPERATURE=0.7
AGENT_MAX_TOKENS=1000
MAX_CONVERSATION_HISTORY=50
```

**Important Notes**:
- `DATABASE_URL` should be your existing Neon connection string
- `BETTER_AUTH_SECRET` must match frontend's secret (for JWT verification)
- `GOOGLE_API_KEY` is required for Gemini model access
- All Phase 3 variables are new additions

---

## Database Setup

### Step 1: Verify Existing Schema

Ensure Phase 2 tables exist:

```bash
# Connect to database (replace with your connection string)
psql $DATABASE_URL

# Check existing tables
\dt

# Expected output should include:
# - users
# - tasks
# - alembic_version

# Exit psql
\q
```

### Step 2: Create Alembic Migrations

Phase 3 adds two new tables: `conversations` and `messages`.

#### Generate Migration for Conversations Table

```bash
# From backend/ directory
alembic revision --autogenerate -m "Add conversations table"
```

This creates `backend/alembic/versions/004_add_conversations.py`. Verify it contains:

```python
def upgrade() -> None:
    op.create_table(
        'conversations',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('NOW()')),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
    )
    op.create_index('idx_conversations_user_id', 'conversations', ['user_id'])
    op.create_index('idx_conversations_updated_at', 'conversations', ['updated_at'])
```

#### Generate Migration for Messages Table

```bash
alembic revision --autogenerate -m "Add messages table"
```

This creates `backend/alembic/versions/005_add_messages.py`. Verify it contains:

```python
def upgrade() -> None:
    # Create enum
    message_role = sa.Enum('user', 'assistant', name='message_role')
    message_role.create(op.get_bind())

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
    )
    op.create_index('idx_messages_conversation_id', 'messages', ['conversation_id'])
    op.create_index('idx_messages_created_at', 'messages', ['created_at'])
    op.create_index('idx_messages_user_id', 'messages', ['user_id'])
```

### Step 3: Run Migrations

```bash
# Run all pending migrations
alembic upgrade head

# Expected output:
# INFO [alembic.runtime.migration] Running upgrade 003 -> 004, Add conversations table
# INFO [alembic.runtime.migration] Running upgrade 004 -> 005, Add messages table
```

### Step 4: Verify New Tables

```bash
# Connect to database
psql $DATABASE_URL

# List all tables
\dt

# Expected output should now include:
# - users (existing)
# - tasks (existing)
# - conversations (NEW)
# - messages (NEW)
# - alembic_version

# Verify conversations table
\d conversations

# Verify messages table
\d messages

# Exit
\q
```

---

## Development Setup

### Project Structure

After Phase 3 implementation, your backend should have:

```
backend/
├── src/
│   ├── models/
│   │   ├── user.py              # Existing
│   │   ├── task.py              # Existing
│   │   ├── conversation.py      # NEW - Phase 3.1
│   │   └── message.py           # NEW - Phase 3.1
│   ├── routes/
│   │   ├── tasks.py             # Existing
│   │   ├── auth.py              # Existing
│   │   └── chat.py              # NEW - Phase 3.4
│   ├── mcp/                     # NEW - Phase 3.2
│   │   ├── __init__.py
│   │   ├── server.py            # MCP server initialization
│   │   └── tools/
│   │       ├── __init__.py
│   │       ├── add_task.py
│   │       ├── list_tasks.py
│   │       ├── complete_task.py
│   │       ├── delete_task.py
│   │       └── update_task.py
│   ├── agent/                   # NEW - Phase 3.3
│   │   ├── __init__.py
│   │   ├── config.py            # Agent configuration
│   │   └── runner.py            # Agent runner
│   ├── middleware/
│   │   └── auth.py              # Existing
│   ├── db.py                    # Existing
│   └── main.py                  # Updated with chat routes
├── tests/
│   ├── unit/
│   │   ├── test_models_conversation.py    # NEW
│   │   ├── test_models_message.py         # NEW
│   │   ├── test_mcp_tools.py              # NEW
│   │   └── test_agent_config.py           # NEW
│   ├── integration/
│   │   ├── test_mcp_agent.py              # NEW
│   │   ├── test_chat_endpoint.py          # NEW
│   │   └── test_conversation_persistence.py # NEW
│   └── e2e/
│       └── test_chatbot_flow.py           # NEW
├── alembic/
│   └── versions/
│       ├── 004_add_conversations.py       # NEW
│       └── 005_add_messages.py            # NEW
├── .env
├── pyproject.toml
└── README.md
```

### Install Development Tools

```bash
# Install testing and linting tools
uv add --dev pytest pytest-asyncio pytest-cov httpx

# Install code quality tools
uv add --dev black ruff mypy
```

---

## Running the Application

### Step 1: Start FastAPI Server

```bash
# From backend/ directory
uvicorn main:app --reload --port 8000

# Expected output:
# INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
# INFO:     Started reloader process [xxxxx] using StatReload
# INFO:     Started server process [xxxxx]
# INFO:     Waiting for application startup.
# INFO:     Application startup complete.
```

### Step 2: Verify Server is Running

```bash
# In a new terminal window
curl http://localhost:8000/

# Expected response:
# {"message": "Todo API - Phase 3"}
```

### Step 3: Check API Documentation

Open your browser and navigate to:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

You should see the new chat endpoint:
- `POST /api/{user_id}/chat`

### Step 4: Verify MCP Server

```bash
# Check MCP server health
curl http://localhost:8000/api/mcp/health

# Expected response:
# {"status": "healthy", "tools": 5}
```

---

## Testing the Chatbot

### Prerequisite: Get Authentication Token

You need a valid JWT token from Better Auth.

#### Option 1: Use Existing User Token

If you have the frontend running, log in and copy the token from browser DevTools:

1. Open Frontend at http://localhost:3000
2. Log in with your credentials
3. Open DevTools → Application → Cookies
4. Copy the `better-auth.session_token` value

#### Option 2: Create Test User via API

```bash
# Register a new user (if registration endpoint exists)
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# Log in to get token
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# Response will include JWT token
```

### Test 1: Start New Conversation

```bash
# Set your token
export TOKEN="your-jwt-token-here"
export USER_ID="your-user-id-here"

# Send first message
curl -X POST "http://localhost:8000/api/${USER_ID}/chat" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Show me my pending tasks"
  }'

# Expected SSE stream response:
# data: {"content":"You"}
# data: {"content":" have"}
# data: {"content":" 3"}
# data: {"content":" pending"}
# data: {"content":" tasks"}
# data: {"done":true,"conversation_id":1}
```

### Test 2: Continue Existing Conversation

```bash
# Use conversation_id from previous response
curl -X POST "http://localhost:8000/api/${USER_ID}/chat" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Add a task to buy groceries",
    "conversation_id": 1
  }'

# Expected response:
# data: {"content":"I've"}
# data: {"content":" added"}
# data: {"content":" 'Buy"}
# data: {"content":" groceries'"}
# data: {"content":" to"}
# data: {"content":" your"}
# data: {"content":" list"}
# data: {"done":true,"conversation_id":1}
```

### Test 3: Complete a Task

```bash
curl -X POST "http://localhost:8000/api/${USER_ID}/chat" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Mark task 1 as complete",
    "conversation_id": 1
  }'
```

### Test 4: Update a Task

```bash
curl -X POST "http://localhost:8000/api/${USER_ID}/chat" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Change task 2 to 'Buy milk and eggs'",
    "conversation_id": 1
  }'
```

### Test 5: Delete a Task

```bash
curl -X POST "http://localhost:8000/api/${USER_ID}/chat" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Delete task 3",
    "conversation_id": 1
  }'
```

### Test 6: Multi-Turn Conversation

```bash
# Message 1: Ask about tasks
curl -X POST "http://localhost:8000/api/${USER_ID}/chat" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"message": "What are my tasks?"}'

# Message 2: Add task (use conversation_id from previous response)
curl -X POST "http://localhost:8000/api/${USER_ID}/chat" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"message": "Add buy milk", "conversation_id": 2}'

# Message 3: Mark as done
curl -X POST "http://localhost:8000/api/${USER_ID}/chat" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"message": "Actually, I already bought it, mark it done", "conversation_id": 2}'
```

---

## Running Tests

### Unit Tests

```bash
# Run all unit tests
pytest tests/unit/ -v

# Run specific test file
pytest tests/unit/test_mcp_tools.py -v

# Run with coverage
pytest tests/unit/ --cov=src --cov-report=html
```

### Integration Tests

```bash
# Run all integration tests
pytest tests/integration/ -v

# Run specific test
pytest tests/integration/test_chat_endpoint.py -v
```

### End-to-End Tests

```bash
# Run E2E tests (requires running server)
pytest tests/e2e/ -v
```

### All Tests

```bash
# Run all tests with coverage
pytest --cov=src --cov-report=html --cov-report=term

# Open coverage report
open htmlcov/index.html  # macOS
xdg-open htmlcov/index.html  # Linux
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Error**: `sqlalchemy.exc.OperationalError: (psycopg2.OperationalError) connection to server failed`

**Solution**:
```bash
# Verify DATABASE_URL in .env
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL -c "SELECT 1;"

# Check Neon dashboard for database status
```

#### 2. Google API Key Invalid

**Error**: `litellm.exceptions.AuthenticationError: Invalid API key`

**Solution**:
```bash
# Verify GOOGLE_API_KEY in .env
echo $GOOGLE_API_KEY

# Test API key
curl -X POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$GOOGLE_API_KEY \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

#### 3. MCP Server Not Starting

**Error**: `MCP server unavailable`

**Solution**:
```bash
# Check if MCP server is initialized in main.py
grep -r "mcp.server" src/main.py

# Verify MCP tools are registered
curl http://localhost:8000/api/mcp/tools

# Check logs for MCP initialization errors
```

#### 4. JWT Token Invalid

**Error**: `401 Unauthorized - Invalid or expired token`

**Solution**:
```bash
# Verify BETTER_AUTH_SECRET matches frontend
echo $BETTER_AUTH_SECRET

# Check token expiration (decode JWT at jwt.io)
# Generate new token by logging in again
```

#### 5. Conversation Not Found

**Error**: `404 Not Found - Conversation not found`

**Solution**:
```bash
# Verify conversation exists and belongs to user
psql $DATABASE_URL -c "SELECT * FROM conversations WHERE user_id = 'your-user-id';"

# Check user_id in path matches JWT token user_id
```

#### 6. Agent Response Timeout

**Error**: `503 Service Unavailable - Agent timeout`

**Solution**:
```bash
# Increase timeout in .env
# MCP_TIMEOUT_SECONDS=60

# Check Gemini API status
curl https://generativelanguage.googleapis.com/v1beta/models

# Reduce conversation history if context too large
# MAX_CONVERSATION_HISTORY=20
```

---

## Development Workflow

### Daily Development Cycle

1. **Start Development Environment**
   ```bash
   # Terminal 1: Backend server
   cd backend
   source .venv/bin/activate
   uvicorn main:app --reload --port 8000

   # Terminal 2: Testing
   pytest --watch tests/
   ```

2. **Make Code Changes**
   - Edit files in `src/`
   - Server auto-reloads on file changes

3. **Test Changes**
   ```bash
   # Run relevant tests
   pytest tests/unit/test_mcp_tools.py -v

   # Test via API
   curl -X POST "http://localhost:8000/api/${USER_ID}/chat" \
     -H "Authorization: Bearer ${TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{"message": "test message"}'
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: implement MCP tool for task completion"
   git push origin phase3/backend
   ```

### Database Changes

When modifying database schema:

```bash
# 1. Update SQLModel classes in src/models/

# 2. Generate migration
alembic revision --autogenerate -m "Description of change"

# 3. Review generated migration in alembic/versions/

# 4. Apply migration
alembic upgrade head

# 5. Test changes
pytest tests/integration/
```

### Adding New MCP Tools

```bash
# 1. Create tool file
touch src/mcp/tools/new_tool.py

# 2. Implement tool following pattern:
"""
@mcp.tool()
def new_tool(user_id: str, param: str) -> dict:
    # Implementation
    pass
"""

# 3. Register in src/mcp/server.py

# 4. Add unit tests
touch tests/unit/test_new_tool.py

# 5. Update agent config if needed
vim src/agent/config.py
```

### Debugging Agent Behavior

```bash
# Enable verbose logging
export LOG_LEVEL=DEBUG

# Check agent logs
tail -f logs/agent.log

# Test system prompt
python -c "from src.agent.config import get_system_prompt; print(get_system_prompt('test_user'))"

# Test intent recognition
pytest tests/unit/test_agent_config.py::test_intent_recognition -v
```

---

## Performance Monitoring

### Check Response Times

```bash
# Install hyperfine for benchmarking
brew install hyperfine  # macOS
sudo apt install hyperfine  # Linux

# Benchmark chat endpoint
hyperfine --warmup 3 \
  'curl -X POST "http://localhost:8000/api/${USER_ID}/chat" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"message\":\"Show my tasks\"}"'

# Target: <2s average response time
```

### Monitor Database Performance

```bash
# Check slow queries
psql $DATABASE_URL -c "
  SELECT query, mean_exec_time, calls
  FROM pg_stat_statements
  ORDER BY mean_exec_time DESC
  LIMIT 10;
"

# Check index usage
psql $DATABASE_URL -c "
  SELECT schemaname, tablename, indexname, idx_scan
  FROM pg_stat_user_indexes
  ORDER BY idx_scan;
"
```

### Load Testing

```bash
# Install Apache Bench
sudo apt install apache2-utils  # Linux
brew install httpie  # macOS includes ab

# Test with 50 concurrent requests
ab -n 100 -c 50 -T 'application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -p request.json \
  "http://localhost:8000/api/${USER_ID}/chat"

# request.json:
# {"message": "Show my tasks"}
```

---

## Next Steps

After completing quickstart setup:

1. ✅ Verify all tests pass: `pytest`
2. ✅ Test all 5 MCP tools via chat endpoint
3. ✅ Verify conversation persistence across server restarts
4. ✅ Check user isolation (create multiple test users)
5. ⏳ Proceed to Phase 3.7: Frontend Integration

---

## Additional Resources

- **API Contracts**: See `specs/008-phase3-backend-chatbot/contracts/`
- **Data Model**: See `specs/008-phase3-backend-chatbot/data-model.md`
- **Research Notes**: See `specs/008-phase3-backend-chatbot/research.md`
- **Implementation Plan**: See `specs/008-phase3-backend-chatbot/plan.md`

---

## Support

If you encounter issues not covered in this guide:

1. Check error logs in backend console
2. Review database state with psql
3. Verify environment variables in `.env`
4. Check API documentation at http://localhost:8000/docs
5. Consult Phase 3 specification in `specs/008-phase3-backend-chatbot/spec.md`

---

**Quickstart Status**: ✅ COMPLETE
**Ready for Phase 3 Implementation**: YES
**Last Updated**: 2025-12-15
