# Research Document: Phase 3 Backend - Technology Decisions

**Feature**: Phase 3 Backend - AI Chatbot Infrastructure
**Date**: 2025-12-15
**Branch**: `phase3/backend`

## Purpose

This document consolidates research findings for implementing Phase 3 backend chatbot infrastructure. All technical decisions are based on analysis of Claude Code skills (mcp-server, openai-agents-sdk, chatkit-python, fastapi) and alignment with project requirements.

---

## Research Question 1: MCP Server Implementation Pattern

### Question
What's the recommended pattern for building MCP server with Official MCP SDK and integrating it with FastAPI?

### Research Sources
- `.claude/skills/mcp-server/SKILL.md`
- `.claude/skills/mcp-server/reference/tools.md`
- `.claude/skills/mcp-server/reference/fastapi-integration.md`
- `.claude/skills/mcp-server/examples/todo-server.md`
- `.claude/skills/mcp-server/templates/mcp_server.py`

### Findings

**Technology**: FastMCP (high-level API from Official MCP SDK)

**Architecture Decision**:
```python
from mcp.server.fastmcp import FastMCP

# Create MCP server instance
mcp = FastMCP("Todo MCP Server", stateless_http=True, json_response=True)

# Define tools with decorator
@mcp.tool()
def add_task(user_id: str, title: str, description: str = None) -> dict:
    """Add a new task to the todo list."""
    # Database operation here
    return {"task_id": 1, "status": "created", "title": title}
```

**Key Patterns**:

1. **Tool Definition**:
   - Use `@mcp.tool()` decorator
   - Function name becomes tool name
   - Docstring becomes tool description
   - Type hints define parameter schema
   - Return dict for JSON response

2. **FastAPI Integration**:
   ```python
   from starlette.applications import Starlette
   from starlette.routing import Mount
   from starlette.middleware.cors import CORSMiddleware
   import contextlib

   # Lifespan manager for session handling
   @contextlib.asynccontextmanager
   async def lifespan(app: Starlette):
       async with mcp.session_manager.run():
           yield

   # Mount MCP as Starlette sub-app
   app = Starlette(
       routes=[Mount("/mcp", app=mcp.streamable_http_app())],
       lifespan=lifespan,
   )

   # Add CORS
   app = CORSMiddleware(
       app,
       allow_origins=["*"],
       allow_methods=["GET", "POST", "DELETE"],
       expose_headers=["Mcp-Session-Id"],
   )
   ```

3. **Database Integration**:
   - MCP tools should directly access database
   - Use dependency injection or app context for database connection
   - Tools must be stateless (read from DB, write to DB, return result)

4. **User Isolation**:
   - Every tool must accept `user_id` parameter
   - Validate ownership before any database operation
   - Filter all queries by `user_id`

**Decision**: Use FastMCP with Starlette integration, mount at `/api/mcp` endpoint within existing FastAPI app using `Mount`. All tools will be stateless with explicit user_id parameter.

**Rationale**:
- FastMCP provides clean decorator-based API
- Stateless HTTP mode fits our horizontal scaling requirement
- Starlette Mount allows integration with existing FastAPI app
- JSON response mode simplifies client-server communication

**Alternatives Considered**:
- Separate MCP server process: Rejected - adds deployment complexity, network latency
- Custom MCP protocol implementation: Rejected - FastMCP provides production-ready solution

---

## Research Question 2: OpenAI Agent + MCP Integration

### Question
How to connect OpenAI Agents SDK to MCP server for tool access?

### Research Sources
- `.claude/skills/openai-agents-sdk/SKILL.md`
- `.claude/skills/openai-agents-sdk/reference/agents.md`
- `.claude/skills/openai-agents-sdk/reference/mcp-integration.md`
- `.claude/skills/openai-agents-sdk/examples/todo-agent.md`
- `.claude/skills/openai-agents-sdk/templates/agent_mcp.py`

### Findings

**Technology**: OpenAI Agents SDK with LiteLLM for Gemini support

**Architecture Decision**:
```python
import os
from agents import Agent, Runner, set_tracing_disabled
from agents.mcp import MCPServerStreamableHttp
from agents.extensions.models.litellm_model import LitellmModel

# Disable OpenAI tracing (we're using Gemini)
set_tracing_disabled(disabled=True)

# Create MCP connection
async with MCPServerStreamableHttp(
    name="Todo MCP Server",
    params={
        "url": "http://localhost:8000/api/mcp",
        "timeout": 30,
    },
    cache_tools_list=True,  # Important for performance
) as mcp_server:

    # Create agent with Gemini
    agent = Agent(
        name="Todo Assistant",
        instructions="""You are a task management assistant.
Use the MCP tools to help users:
- add_task: Create new tasks
- list_tasks: View tasks (filtered by status)
- complete_task: Mark tasks complete
- delete_task: Remove tasks
- update_task: Modify task details

Always pass the user_id parameter to every tool call.""",
        model=LitellmModel(
            model="gemini/gemini-2.0-flash",
            api_key=os.getenv("GOOGLE_API_KEY"),
        ),
        mcp_servers=[mcp_server],
    )

    # Run agent
    result = await Runner.run(agent, "Show my pending tasks")
```

**Key Patterns**:

1. **Model Selection**:
   - Use Gemini via LiteLLM: `gemini/gemini-2.0-flash`
   - Disable OpenAI tracing: `set_tracing_disabled(disabled=True)`
   - API key from environment: `GOOGLE_API_KEY`

2. **MCP Connection**:
   - Use `MCPServerStreamableHttp` for HTTP-based MCP
   - Enable tool caching: `cache_tools_list=True` (avoids repeated tool discovery)
   - Set reasonable timeout: 30 seconds

3. **System Prompt**:
   - Define agent role and personality
   - List all available tools with descriptions
   - Specify required parameters (e.g., user_id)
   - Provide usage examples

4. **Context Management**:
   - For conversation history: Build messages array from database
   - Pass full history to `Runner.run(agent, messages=[...])`
   - Agent maintains context within single run

**Decision**: Use Gemini 2.0 Flash via LiteLLM with MCPServerStreamableHttp connection. Agent will be created per request with user-specific context.

**Rationale**:
- Gemini 2.0 Flash offers good performance and cost ratio
- LiteLLM provides consistent interface across LLM providers
- Streamable HTTP is production-ready transport
- Per-request agent creation ensures statelessness

**Alternatives Considered**:
- OpenAI GPT-4: Higher cost, similar quality
- Persistent agent instance: Rejected - not stateless, complicates scaling
- SSE transport: Rejected - streamable-http better for server-to-server

---

## Research Question 3: Chat Endpoint with SSE Streaming

### Question
How to implement FastAPI chat endpoint with Server-Sent Events (SSE) streaming for ChatKit frontend?

### Research Sources
- `.claude/skills/chatkit-python/SKILL.md`
- `.claude/skills/chatkit-python/templates/chat_router.py`
- `.claude/skills/chatkit-python/templates/models.py`

### Findings

**Technology**: FastAPI + sse-starlette + EventSourceResponse

**Architecture Decision**:
```python
from fastapi import APIRouter, Depends, HTTPException
from sse_starlette.sse import EventSourceResponse
from pydantic import BaseModel
from typing import List, AsyncGenerator
import json

router = APIRouter(prefix="/api/{user_id}/chat", tags=["chat"])

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_id: int | None = None

class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: list[dict] = []

async def stream_response(
    agent: Agent,
    message: str,
) -> AsyncGenerator[str, None]:
    """Stream agent response as SSE events."""
    result = Runner.run_streamed(agent, message)

    # Stream partial responses
    async for event in result.stream_events():
        if hasattr(event, 'item') and event.item:
            yield f"data: {json.dumps({'content': str(event.item)})}\n\n"

    # Send completion
    yield f"data: {json.dumps({'done': True})}\n\n"

@router.post("")
async def chat_endpoint(
    user_id: str,
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
):
    """Chat endpoint with SSE streaming."""
    # Validate user_id matches authenticated user
    if user_id != current_user.id:
        raise HTTPException(403, "Forbidden")

    # Load or create conversation
    conversation = await get_or_create_conversation(user_id, request.conversation_id)

    # Load conversation history
    messages = await load_conversation_messages(conversation.id)

    # Save user message
    await save_message(conversation.id, "user", request.message)

    # Create agent with conversation context
    agent = create_agent(user_id)

    # Return streaming response
    return EventSourceResponse(
        stream_response(agent, request.message),
        media_type="text/event-stream",
    )
```

**Key Patterns**:

1. **SSE Event Format**:
   ```python
   # Content chunk
   yield f"data: {json.dumps({'content': 'text'})}\n\n"

   # Completion
   yield f"data: {json.dumps({'done': True})}\n\n"

   # Error
   yield f"data: {json.dumps({'error': 'message'})}\n\n"
   ```

2. **Request Flow**:
   - Validate authentication
   - Retrieve/create conversation
   - Load conversation history
   - Save user message to DB
   - Run agent (streams response)
   - Save assistant response to DB
   - Return SSE stream

3. **Conversation Persistence**:
   - Before agent invocation: Save user message
   - After agent completes: Save assistant response
   - Stateless: All state in database

4. **CORS Configuration**:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000", "https://app.vercel.app"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

**Decision**: Use EventSourceResponse with async generator for SSE streaming. Store messages before/after agent invocation. Return streaming response immediately.

**Rationale**:
- SSE provides better UX than polling
- EventSourceResponse handles SSE protocol correctly
- Async generators enable efficient streaming
- ChatKit frontend expects this format

**Alternatives Considered**:
- WebSockets: Rejected - more complex, SSE sufficient for one-way streaming
- Regular HTTP response: Rejected - poor UX, no streaming

---

## Research Question 4: FastAPI Project Structure

### Question
How to organize FastAPI code for maintainability and testing?

### Research Sources
- `.claude/skills/fastapi/SKILL.md`
- `.claude/skills/fastapi/reference/routing.md`
- `.claude/skills/fastapi/reference/dependencies.md`
- `.claude/skills/fastapi/templates/router.py`

### Findings

**Structure Decision**:
```
backend/
├── src/
│   ├── main.py                 # FastAPI app + MCP mount
│   ├── config.py               # Settings (Pydantic)
│   ├── database.py             # DB connection
│   ├── models/                 # SQLModel database models
│   │   ├── conversation.py
│   │   └── message.py
│   ├── schemas/                # Pydantic request/response schemas
│   │   └── chat.py
│   ├── routers/                # API route handlers
│   │   └── chat.py
│   ├── dependencies/           # Shared dependencies
│   │   └── auth.py             # JWT verification
│   ├── mcp/                    # MCP server
│   │   ├── server.py
│   │   └── tools/
│   │       ├── add_task.py
│   │       ├── list_tasks.py
│   │       ├── complete_task.py
│   │       ├── delete_task.py
│   │       └── update_task.py
│   └── agent/                  # OpenAI agent
│       ├── config.py           # System prompt
│       └── runner.py           # Agent creation
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

**Key Patterns**:

1. **Dependency Injection**:
   ```python
   from fastapi import Depends
   from sqlmodel import Session

   def get_session():
       with Session(engine) as session:
           yield session

   @router.get("/tasks")
   async def get_tasks(session: Session = Depends(get_session)):
       # Use session
       pass
   ```

2. **Router Organization**:
   ```python
   # routers/chat.py
   router = APIRouter(prefix="/api/{user_id}/chat", tags=["chat"])

   # main.py
   app.include_router(chat.router)
   ```

3. **Configuration**:
   ```python
   from pydantic_settings import BaseSettings
   from functools import lru_cache

   class Settings(BaseSettings):
       database_url: str
       google_api_key: str

       model_config = {"env_file": ".env"}

   @lru_cache
   def get_settings() -> Settings:
       return Settings()
   ```

4. **Error Handling**:
   ```python
   from fastapi import HTTPException

   if not task:
       raise HTTPException(status_code=404, detail="Task not found")
   ```

**Decision**: Use layered architecture with routers, dependencies, models, and schemas. Organize MCP and agent as separate modules.

**Rationale**:
- Clear separation of concerns
- Easy to test each layer independently
- Dependency injection enables flexible testing
- Configuration management via Pydantic

**Alternatives Considered**:
- Flat structure: Rejected - hard to maintain as project grows
- Service layer: Not needed for this phase - business logic is simple

---

## Research Question 5: Database Transaction Strategy

### Question
How to handle concurrent updates to same conversation without race conditions?

### Research Sources
- SQLModel documentation
- PostgreSQL transaction isolation documentation
- Existing Phase 2 database patterns

### Findings

**Technology**: SQLModel with PostgreSQL default isolation (READ COMMITTED)

**Strategy Decision**:
```python
from sqlmodel import Session, select
from contextlib import contextmanager

@contextmanager
def atomic_operation(session: Session):
    """Context manager for atomic database operations."""
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise

async def save_message_atomic(conversation_id: int, role: str, content: str):
    """Save message with transaction guarantee."""
    with Session(engine) as session:
        with atomic_operation(session):
            # Update conversation timestamp
            conversation = session.get(Conversation, conversation_id)
            conversation.updated_at = datetime.utcnow()

            # Create message
            message = Message(
                conversation_id=conversation_id,
                role=role,
                content=content,
            )
            session.add(message)
```

**Key Patterns**:

1. **Transaction Isolation**:
   - Use PostgreSQL default (READ COMMITTED)
   - Sufficient for our use case (append-only messages)
   - No need for SERIALIZABLE (higher overhead)

2. **Concurrency Handling**:
   - Multiple users: Different conversations - no conflict
   - Same user, same conversation: Unlikely (single user doesn't send messages simultaneously)
   - If conflict occurs: Last write wins (acceptable for chat)

3. **Optimistic Locking** (if needed later):
   ```python
   class Conversation(SQLModel, table=True):
       version: int = Field(default=1)

   # Update with version check
   statement = (
       update(Conversation)
       .where(Conversation.id == conv_id, Conversation.version == old_version)
       .values(version=old_version + 1)
   )
   ```

**Decision**: Use READ COMMITTED isolation with atomic operations. Implement optimistic locking only if concurrent update issues arise in testing.

**Rationale**:
- READ COMMITTED prevents dirty reads
- Append-only pattern (messages) reduces conflict risk
- Conversation updates are timestamp-only (low conflict)
- Simpler than SERIALIZABLE, adequate for requirements

**Alternatives Considered**:
- SERIALIZABLE isolation: Rejected - unnecessary performance overhead
- Distributed locking (Redis): Rejected - over-engineering for single database

---

## Research Question 6: Conversation History Context Window Management

### Question
How to handle conversation history that exceeds agent context window?

### Research Sources
- OpenAI Agents SDK documentation
- Gemini 2.0 Flash specifications (1M token context window)
- ChatKit best practices

### Findings

**Context Window**: Gemini 2.0 Flash supports ~1M tokens (~750K words)

**Strategy Decision**: Simple truncation strategy (Phase 3)

```python
MAX_MESSAGES_IN_CONTEXT = 50  # Conservative limit

async def load_conversation_context(conversation_id: int) -> List[ChatMessage]:
    """Load recent conversation history for agent context."""
    with Session(engine) as session:
        messages = session.exec(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at.desc())
            .limit(MAX_MESSAGES_IN_CONTEXT)
        ).all()

        # Reverse to chronological order
        return [
            ChatMessage(role=m.role, content=m.content)
            for m in reversed(messages)
        ]
```

**Key Patterns**:

1. **Message Limit**: Start with 50 most recent messages
2. **Token Estimation**: ~1000 tokens per message average = ~50K tokens (well under limit)
3. **Future Enhancement**: Implement summarization if needed

**Decision**: Load most recent 50 messages for context. Monitor token usage. Add summarization only if 50 messages prove insufficient.

**Rationale**:
- Gemini's 1M token window is very large
- 50 messages = typical long conversation
- Simple to implement and understand
- Can enhance later with summarization

**Alternatives Considered**:
- Load all messages: Rejected - unbounded growth risk
- Summarization from start: Rejected - premature optimization
- Sliding window with summarization: Deferred to Phase 4/5

---

## Research Question 7: Agent System Prompt Design

### Question
What system prompt achieves >90% intent recognition for task management?

### Research Sources
- `.claude/skills/openai-agents-sdk/examples/todo-agent.md`
- `.claude/skills/openai-agents-sdk/templates/agent_mcp.py`
- ChatGPT/Claude prompt engineering best practices

### Findings

**System Prompt Template**:

```python
SYSTEM_PROMPT = """You are a friendly and efficient task management assistant.

Your purpose is to help users manage their todo list through natural conversation.
You have access to the following tools via MCP:

**Task Management Tools:**

1. add_task(user_id, title, description)
   - Creates a new task
   - Use when: user wants to add, create, or remember something
   - Examples: "I need to...", "Remind me to...", "Add task..."

2. list_tasks(user_id, status)
   - Retrieves tasks (status: "all", "pending", or "completed")
   - Use when: user wants to see, show, view, or list tasks
   - Examples: "What do I need to do?", "Show my tasks", "What's pending?"

3. complete_task(user_id, task_id)
   - Marks a task as complete
   - Use when: user indicates task is done, complete, or finished
   - Examples: "I finished...", "Mark task X done", "Completed..."

4. delete_task(user_id, task_id)
   - Removes a task permanently
   - Use when: user wants to delete, remove, or cancel a task
   - Examples: "Delete task...", "Remove the...", "Cancel..."

5. update_task(user_id, task_id, title, description)
   - Modifies an existing task
   - Use when: user wants to change, update, or edit a task
   - Examples: "Change task to...", "Update the title...", "Edit..."

**Important Instructions:**

- ALWAYS pass user_id="{user_id}" to every tool call (this is the authenticated user)
- For ambiguous requests, list tasks first to help user identify task IDs
- Confirm actions with friendly, conversational responses
- If a task isn't found, suggest showing the task list
- Keep responses concise and helpful
- Use natural, conversational language (avoid technical jargon)

**Response Style:**
- Friendly and encouraging
- Confirm actions clearly ("I've added 'Buy groceries' to your list")
- Provide helpful context (e.g., "You have 3 pending tasks")
- Ask clarifying questions when needed

Current user: {user_id}
"""
```

**Key Patterns**:

1. **Role Definition**: Clear purpose statement
2. **Tool Documentation**: Each tool with description, use cases, examples
3. **Parameter Instructions**: Explicit user_id requirement
4. **Error Handling Guidance**: What to do when task not found
5. **Response Style**: Tone and formatting guidelines
6. **User Context**: Inject authenticated user_id

**Decision**: Use comprehensive system prompt with tool documentation, usage examples, and explicit parameter instructions.

**Rationale**:
- Examples improve intent recognition
- Explicit parameter rules prevent errors
- Response style guidelines ensure consistent UX
- User context injection enables personalization

**Alternatives Considered**:
- Minimal prompt: Rejected - lower accuracy
- Few-shot examples in messages: Rejected - consumes context window unnecessarily

---

## Summary of Decisions

| Component | Technology | Key Pattern | Rationale |
|-----------|-----------|-------------|-----------|
| **MCP Server** | FastMCP (Official SDK) | Stateless HTTP, mounted at `/api/mcp` | Clean API, production-ready, easy integration |
| **Agent** | OpenAI Agents SDK + Gemini via LiteLLM | Per-request creation with MCP connection | Stateless, cost-effective, good performance |
| **Chat Endpoint** | FastAPI + SSE (sse-starlette) | EventSourceResponse streaming | Better UX, ChatKit compatible |
| **Database** | PostgreSQL (READ COMMITTED) | Atomic operations, simple truncation | Sufficient isolation, simple, reliable |
| **Project Structure** | Layered (routers/dependencies/models) | Clear separation of concerns | Maintainable, testable, scalable |
| **Context Management** | Load recent 50 messages | Simple limit with future extensibility | Adequate for Phase 3, easy to enhance |
| **System Prompt** | Comprehensive with examples | Tool docs + use cases + response style | High intent recognition accuracy |

---

## Implementation Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| MCP server initialization failure | Add health check endpoint, validate at startup |
| Agent intent recognition <90% | Iterate on system prompt with test cases |
| SSE streaming breaks | Implement fallback to standard HTTP response |
| Database transaction conflicts | Monitor for conflicts, add optimistic locking if needed |
| OpenAI API rate limits | Implement exponential backoff retry logic |
| Conversation history too large | Monitor token usage, implement summarization if needed |

---

## Testing Strategy

1. **MCP Tools**: Test each tool independently with mocked database
2. **Agent Integration**: Test agent calling each tool with sample prompts
3. **Chat Endpoint**: Test complete request flow with mocked agent
4. **Concurrency**: Test 50 concurrent conversations for race conditions
5. **User Isolation**: Test cross-user access attempts fail
6. **Performance**: Measure response time under load

---

## Dependencies

```toml
# pyproject.toml additions
[project]
dependencies = [
    "fastapi>=0.104.0",
    "uvicorn[standard]>=0.24.0",
    "sqlmodel>=0.0.14",
    "mcp>=0.1.0",  # Official MCP SDK
    "openai-agents[litellm]>=0.1.0",  # Agents SDK with Gemini support
    "sse-starlette>=1.8.2",  # SSE streaming
    "python-jose[cryptography]>=3.3.0",  # JWT verification (existing)
]
```

---

## Environment Variables

```env
# Existing (Phase 2)
DATABASE_URL=postgresql://user:password@host/database
BETTER_AUTH_SECRET=your-shared-secret-key
JWT_ALGORITHM=HS256

# New (Phase 3)
GOOGLE_API_KEY=your-gemini-api-key
MCP_SERVER_URL=http://localhost:8000/api/mcp
CORS_ORIGINS=http://localhost:3000,https://your-app.vercel.app
```

---

## Next Steps

1. ✅ Research completed - all questions answered
2. ⏳ Create data-model.md with database schema design
3. ⏳ Create API contracts (OpenAPI specs)
4. ⏳ Create quickstart.md developer guide
5. ⏳ Run `/sp.tasks` to generate implementation tasks

---

**Research Status**: ✅ COMPLETE
**All NEEDS CLARIFICATION items**: RESOLVED
**Ready for Phase 1 (Design & Contracts)**: YES
