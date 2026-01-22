# Phase III: Todo AI Chatbot - Complete Reference

## Overview

**Objective:** Create an AI-powered chatbot interface for managing todos through natural language using MCP (Model Context Protocol) server architecture.

**Development Strategy:**
1. ✅ Backend infrastructure exists (Phase 2)
2. 🔄 Add database models for conversations and messages
3. 🔄 Build MCP Server with task operation tools
4. 🔄 Implement OpenAI Agent with MCP integration
5. 🔄 Create FastAPI chat endpoint
6. 🔄 Test backend completely
7. 🔄 Deploy backend
8. ⏳ Implement ChatKit frontend

**Current Phase Status:** Backend First - Adding Chat Infrastructure

---

## Available Skills

We have Claude Code skills ready for this phase:

| Skill | Location | Purpose |
|-------|----------|---------|
| **MCP Server** | `.claude/skills/mcp-server/` | Building MCP servers with Official MCP SDK |
| **ChatKit Python** | `.claude/skills/chatkit-python/` | FastAPI chat endpoint with SSE streaming |
| **OpenAI Agents SDK** | `.claude/skills/openai-agents-sdk/` | AI agent creation with MCP integration |
| **ChatKit JS** | `.claude/skills/chatkit-js/` | Frontend ChatKit React components |

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | OpenAI ChatKit (React) |
| Backend | Python FastAPI (existing) |
| AI Framework | OpenAI Agents SDK |
| MCP Server | Official MCP SDK (Python) |
| ORM | SQLModel (existing) |
| Database | Neon Serverless PostgreSQL (existing) |
| Authentication | Better Auth (existing) |

---

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────────────────────────────────┐     ┌─────────────────┐
│                 │     │              FastAPI Server                   │     │                 │
│                 │     │  ┌────────────────────────────────────────┐  │     │                 │
│  ChatKit UI     │────▶│  │         Chat Endpoint                  │  │     │    Neon DB      │
│  (Frontend)     │     │  │  POST /api/{user_id}/chat              │  │     │  (PostgreSQL)   │
│                 │     │  └───────────────┬────────────────────────┘  │     │                 │
│                 │     │                  │                           │     │  - tasks        │
│                 │     │                  ▼                           │     │  - conversations│
│                 │     │  ┌────────────────────────────────────────┐  │     │  - messages     │
│                 │◀────│  │      OpenAI Agents SDK                 │  │     │                 │
│                 │     │  │      (Agent + Runner)                  │  │     │                 │
│                 │     │  └───────────────┬────────────────────────┘  │     │                 │
│                 │     │                  │                           │     │                 │
│                 │     │                  ▼                           │     │                 │
│                 │     │  ┌────────────────────────────────────────┐  │     │                 │
│                 │     │  │         MCP Server                     │  │────▶│                 │
│                 │     │  │  (MCP Tools for Task Operations)       │  │     │                 │
│                 │     │  └────────────────────────────────────────┘  │◀────│                 │
└─────────────────┘     └──────────────────────────────────────────────┘     └─────────────────┘
```

---

## Database Models (Additional)

### Current Models (Phase 2)
- ✅ `User` (managed by Better Auth)
- ✅ `Task` (todo items)

### New Models Required (Phase 3)

#### 1. Conversation
Represents a chat session between user and AI assistant.

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Primary key |
| `user_id` | string | Foreign key → users.id |
| `created_at` | timestamp | When conversation started |
| `updated_at` | timestamp | Last message timestamp |

**Indexes:**
- `user_id` (for filtering by user)
- `updated_at` (for sorting conversations)

#### 2. Message
Represents individual messages in a conversation.

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Primary key |
| `conversation_id` | integer | Foreign key → conversations.id |
| `user_id` | string | Foreign key → users.id |
| `role` | string | "user" or "assistant" |
| `content` | text | Message text |
| `created_at` | timestamp | When message was created |

**Indexes:**
- `conversation_id` (for fetching conversation history)
- `created_at` (for message ordering)

---

## MCP Tools Specification

The MCP server must expose the following tools for the AI agent:

### 1. add_task

**Purpose:** Create a new task

| Property | Value |
|----------|-------|
| **Parameters** | `user_id` (string, required)<br>`title` (string, required)<br>`description` (string, optional) |
| **Returns** | `task_id`, `status`, `title` |
| **Example Input** | `{"user_id": "ziakhan", "title": "Buy groceries", "description": "Milk, eggs, bread"}` |
| **Example Output** | `{"task_id": 5, "status": "created", "title": "Buy groceries"}` |

### 2. list_tasks

**Purpose:** Retrieve tasks from the list

| Property | Value |
|----------|-------|
| **Parameters** | `user_id` (string, required)<br>`status` (string, optional: "all", "pending", "completed") |
| **Returns** | Array of task objects |
| **Example Input** | `{"user_id": "ziakhan", "status": "pending"}` |
| **Example Output** | `[{"id": 1, "title": "Buy groceries", "completed": false}, ...]` |

### 3. complete_task

**Purpose:** Mark a task as complete

| Property | Value |
|----------|-------|
| **Parameters** | `user_id` (string, required)<br>`task_id` (integer, required) |
| **Returns** | `task_id`, `status`, `title` |
| **Example Input** | `{"user_id": "ziakhan", "task_id": 3}` |
| **Example Output** | `{"task_id": 3, "status": "completed", "title": "Call mom"}` |

### 4. delete_task

**Purpose:** Remove a task from the list

| Property | Value |
|----------|-------|
| **Parameters** | `user_id` (string, required)<br>`task_id` (integer, required) |
| **Returns** | `task_id`, `status`, `title` |
| **Example Input** | `{"user_id": "ziakhan", "task_id": 2}` |
| **Example Output** | `{"task_id": 2, "status": "deleted", "title": "Old task"}` |

### 5. update_task

**Purpose:** Modify task title or description

| Property | Value |
|----------|-------|
| **Parameters** | `user_id` (string, required)<br>`task_id` (integer, required)<br>`title` (string, optional)<br>`description` (string, optional) |
| **Returns** | `task_id`, `status`, `title` |
| **Example Input** | `{"user_id": "ziakhan", "task_id": 1, "title": "Buy groceries and fruits"}` |
| **Example Output** | `{"task_id": 1, "status": "updated", "title": "Buy groceries and fruits"}` |

---

## Chat API Endpoint

### POST /api/{user_id}/chat

**Purpose:** Send message and get AI response

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `conversation_id` | integer | No | Existing conversation ID (creates new if not provided) |
| `message` | string | Yes | User's natural language message |

#### Response

| Field | Type | Description |
|-------|------|-------------|
| `conversation_id` | integer | The conversation ID |
| `response` | string | AI assistant's response |
| `tool_calls` | array | List of MCP tools invoked |

#### Example Request
```json
{
  "conversation_id": 42,
  "message": "Add a task to buy groceries"
}
```

#### Example Response
```json
{
  "conversation_id": 42,
  "response": "I've added 'Buy groceries' to your task list.",
  "tool_calls": [
    {
      "tool": "add_task",
      "parameters": {
        "user_id": "ziakhan",
        "title": "Buy groceries"
      },
      "result": {
        "task_id": 5,
        "status": "created"
      }
    }
  ]
}
```

---

## Agent Behavior Specification

The AI agent must understand and respond to the following behaviors:

| Behavior | Description |
|----------|-------------|
| **Task Creation** | When user mentions adding/creating/remembering something, use `add_task` |
| **Task Listing** | When user asks to see/show/list tasks, use `list_tasks` with appropriate filter |
| **Task Completion** | When user says done/complete/finished, use `complete_task` |
| **Task Deletion** | When user says delete/remove/cancel, use `delete_task` |
| **Task Update** | When user says change/update/rename, use `update_task` |
| **Confirmation** | Always confirm actions with friendly response |
| **Error Handling** | Gracefully handle task not found and other errors |

---

## Natural Language Commands

The chatbot should understand these natural language patterns:

| User Says | Agent Should |
|-----------|-------------|
| "Add a task to buy groceries" | Call `add_task` with title "Buy groceries" |
| "Show me all my tasks" | Call `list_tasks` with status "all" |
| "What's pending?" | Call `list_tasks` with status "pending" |
| "Mark task 3 as complete" | Call `complete_task` with task_id 3 |
| "Delete the meeting task" | Call `list_tasks` first, then `delete_task` |
| "Change task 1 to 'Call mom tonight'" | Call `update_task` with new title |
| "I need to remember to pay bills" | Call `add_task` with title "Pay bills" |
| "What have I completed?" | Call `list_tasks` with status "completed" |

---

## Conversation Flow (Stateless Request Cycle)

Each request to the chat endpoint follows this flow:

1. **Receive user message** from frontend
2. **Fetch conversation history** from database
   - If `conversation_id` provided: retrieve all messages
   - If not provided: create new conversation
3. **Build message array** for agent (history + new message)
4. **Store user message** in database
5. **Run agent** with MCP tools
6. **Agent invokes** appropriate MCP tool(s)
7. **Store assistant response** in database
8. **Return response** to client
9. **Server holds NO state** (ready for next request)

**Key Architecture Benefits:**
- ✅ Scalable: Any server instance can handle any request
- ✅ Resilient: Server restarts don't lose conversation state
- ✅ Horizontal scaling: Load balancer can route to any backend
- ✅ Testable: Each request is independent and reproducible

---

## Implementation Order

### Phase 3.1: Database Setup ✅ (Existing Backend)
- [x] User table (Better Auth)
- [x] Task table (Phase 2)
- [ ] Conversation table (NEW)
- [ ] Message table (NEW)

### Phase 3.2: MCP Server 🔄 (Current Focus)
- [ ] Set up MCP server project structure
- [ ] Implement `add_task` tool
- [ ] Implement `list_tasks` tool
- [ ] Implement `complete_task` tool
- [ ] Implement `delete_task` tool
- [ ] Implement `update_task` tool
- [ ] Test MCP tools independently

### Phase 3.3: OpenAI Agent Integration
- [ ] Create agent with OpenAI Agents SDK
- [ ] Connect agent to MCP server
- [ ] Configure agent behavior and prompts
- [ ] Test agent with MCP tools
- [ ] Handle conversation context

### Phase 3.4: FastAPI Chat Endpoint
- [ ] Create `/api/{user_id}/chat` endpoint
- [ ] Implement conversation history retrieval
- [ ] Integrate OpenAI Agent
- [ ] Store messages in database
- [ ] Return formatted responses
- [ ] Add error handling

### Phase 3.5: Backend Testing
- [ ] Unit tests for MCP tools
- [ ] Integration tests for agent
- [ ] API endpoint tests
- [ ] End-to-end conversation tests
- [ ] Error handling tests

### Phase 3.6: Backend Deployment
- [ ] Prepare deployment configuration
- [ ] Deploy to hosting platform
- [ ] Test deployed backend
- [ ] Verify MCP server accessibility

### Phase 3.7: Frontend Implementation ⏳
- [ ] Set up OpenAI ChatKit
- [ ] Configure domain allowlist
- [ ] Implement chat UI
- [ ] Connect to backend API
- [ ] Handle authentication
- [ ] Deploy frontend

---

## OpenAI ChatKit Setup (Frontend - Later)

### Domain Allowlist Configuration

Before deploying chatbot frontend, configure OpenAI's domain allowlist:

1. **Deploy frontend first** to get production URL:
   - Vercel: `https://your-app.vercel.app`
   - Custom domain: `https://yourdomain.com`

2. **Add domain to OpenAI's allowlist:**
   - Navigate to: https://platform.openai.com/settings/organization/security/domain-allowlist
   - Click "Add domain"
   - Enter frontend URL (without trailing slash)
   - Save changes

3. **Get ChatKit domain key:**
   - After adding domain, OpenAI provides a domain key
   - Pass this key to ChatKit configuration

### Environment Variables (Frontend)
```env
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=your-domain-key-here
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

---

## Requirements

### Functional Requirements
1. ✅ Implement conversational interface for all Basic Level features
2. 🔄 Use OpenAI Agents SDK for AI logic
3. 🔄 Build MCP server with Official MCP SDK that exposes task operations as tools
4. 🔄 Stateless chat endpoint that persists conversation state to database
5. 🔄 AI agents use MCP tools to manage tasks (MCP tools are stateless, store state in database)

### Non-Functional Requirements
- Stateless server architecture
- Database-backed conversation persistence
- Graceful error handling
- Friendly, conversational responses
- Secure user isolation (JWT authentication)

---

## Deliverables

### Backend Deliverables
1. Database migrations for Conversation and Message tables
2. MCP Server implementation with 5 task tools
3. OpenAI Agent with MCP integration
4. FastAPI chat endpoint (`POST /api/{user_id}/chat`)
5. Comprehensive backend tests
6. Deployed backend with accessible API

### Frontend Deliverables (After Backend)
1. ChatKit-based UI
2. Integration with backend chat API
3. Authentication integration
4. Deployed frontend application

### Documentation Deliverables
1. Specifications in `/specs` directory
2. API documentation
3. MCP tools documentation
4. Deployment instructions
5. Testing documentation

---

## Key Benefits of Phase 3 Architecture

| Aspect | Benefit |
|--------|---------|
| **MCP Tools** | Standardized interface for AI to interact with your app |
| **Single Endpoint** | Simpler API — AI handles routing to tools |
| **Stateless Server** | Scalable, resilient, horizontally scalable |
| **Tool Composition** | Agent can chain multiple tools in one turn |
| **Database State** | Conversations persist across server restarts |
| **User Isolation** | JWT ensures users only access their own tasks |

---

## Success Criteria

### Phase 3 is complete when:
- ✅ Backend can handle chat requests with conversation persistence
- ✅ MCP server successfully exposes all 5 task tools
- ✅ OpenAI Agent can manage tasks through natural language
- ✅ All backend tests pass
- ✅ Backend is deployed and accessible
- ✅ Frontend successfully integrates with backend
- ✅ Users can manage tasks conversationally
- ✅ Conversations persist and resume correctly
- ✅ Error handling works gracefully

---

## References

### Project Files
- Main Guide: `Hackathon II - Todo Spec-Driven Development.md`
- Constitution: `.specify/memory/constitution.md`
- Root Guidelines: `CLAUDE.md`
- Backend Guidelines: `backend/CLAUDE.md`
- Frontend Guidelines: `frontend/CLAUDE.md`

### Skills
- MCP Server: `.claude/skills/mcp-server/`
- ChatKit Python: `.claude/skills/chatkit-python/`
- OpenAI Agents SDK: `.claude/skills/openai-agents-sdk/`
- ChatKit JS: `.claude/skills/chatkit-js/`

### External Documentation
- OpenAI Agents SDK: https://github.com/openai/agent-sdk
- Official MCP SDK: https://github.com/modelcontextprotocol/python-sdk
- OpenAI ChatKit: https://platform.openai.com/docs/guides/chatkit
- FastAPI: https://fastapi.tiangolo.com/
- SQLModel: https://sqlmodel.tiangolo.com/

---

**Version:** 1.0.0
**Phase:** III - AI Chatbot
**Status:** Backend Development in Progress
**Last Updated:** 2025-12-15
