# Implementation Plan: Phase 3 Backend - AI Chatbot Infrastructure

**Branch**: `phase3/backend` | **Date**: 2025-12-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/008-phase3-backend-chatbot/spec.md`

## Summary

Implement AI-powered chatbot backend for natural language task management. The system consists of four integrated layers: (1) Database persistence layer with Conversation and Message tables, (2) MCP Server exposing 5 task management tools using Official MCP SDK, (3) OpenAI Agent with MCP integration for natural language understanding, and (4) Stateless FastAPI chat endpoint. All components must be stateless, horizontally scalable, and maintain strict user isolation via JWT authentication. Implementation will leverage existing Phase 2 infrastructure (User, Task tables, Better Auth, Neon PostgreSQL) while adding conversational AI capabilities.

## Technical Context

**Language/Version**: Python 3.13+ (existing from Phase 2)
**Primary Dependencies**:
- FastAPI (existing)
- SQLModel (existing)
- OpenAI Agents SDK (new - for AI agent)
- Official MCP SDK (new - `mcp` package for MCP server)
- Better Auth JWT verification (existing)
- Neon PostgreSQL driver (existing)

**Storage**: Neon Serverless PostgreSQL (existing) - adding `conversations` and `messages` tables

**Testing**: pytest (existing) - extending with MCP tool tests, agent tests, chat endpoint tests

**Target Platform**: Linux server (existing) - backend deployed to Vercel/Railway/Render

**Project Type**: Web application - backend-only for this phase (frontend in Phase 3.7)

**Performance Goals**:
- Chat endpoint response time: <3s for 95% of requests (including agent processing)
- MCP tool execution: <1s per tool call
- Database queries: <200ms for conversation history retrieval
- Support 50 concurrent chat conversations without degradation

**Constraints**:
- Stateless architecture (no in-memory session storage)
- User isolation enforced at database and MCP tool level
- All components must work with existing JWT authentication
- MCP server runs within FastAPI application (not separate service)
- Conversation history must fit within agent context window (~8K tokens initial assumption)

**Scale/Scope**:
- Support up to 100 users initially
- Average 10 conversations per user
- Average 20 messages per conversation
- 5 MCP tools (add_task, list_tasks, complete_task, delete_task, update_task)
- Single chat endpoint (`POST /api/{user_id}/chat`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Spec-Driven Development
- **Status**: PASS
- **Evidence**: Complete specification exists at `specs/008-phase3-backend-chatbot/spec.md` with 53 functional requirements, 5 user stories, 10 success criteria
- **Compliance**: All implementation will be driven from spec, plan, and task breakdowns using Claude Code

### ✅ Iterative Evolution & AI-Native Architecture
- **Status**: PASS
- **Evidence**: Phase 3 builds on existing Phase 2 infrastructure (User, Task, Auth) and adds AI chatbot layer. Architecture designed for Phase 4 (Kubernetes) and Phase 5 (event-driven with Kafka)
- **Compliance**: Stateless design enables containerization; database-backed state supports horizontal scaling

### ✅ Clean Code & Python Project Structure
- **Status**: PASS
- **Evidence**: Following existing backend structure with proper separation: models, routes, middleware, tests
- **Compliance**: Will extend existing patterns, maintain PEP 8, use type hints, follow existing naming conventions

### ✅ Comprehensive Testing
- **Status**: PASS (planned)
- **Evidence**: Spec defines unit tests (database models, MCP tools, validation), integration tests (MCP-agent, database persistence, user isolation), E2E tests (conversation flow, stateless behavior)
- **Compliance**: All new components will have >80% test coverage; critical paths (user isolation, conversation persistence) will have 100% coverage

### ✅ Documentation & Knowledge Capture
- **Status**: PASS
- **Evidence**: This plan document, research.md, data-model.md, contracts/, quickstart.md will be created. PHR for spec stage completed, PHR for plan stage will be created
- **Compliance**: Following Spec-Kit structure with comprehensive documentation

### ✅ Cloud-Native & Event-Driven Design
- **Status**: PASS
- **Evidence**: Stateless architecture with database-backed state; no in-memory sessions; horizontally scalable design
- **Compliance**: Ready for Kubernetes deployment (Phase 4); conversation events can later be published to Kafka (Phase 5)

**Overall Assessment**: All constitution principles satisfied. No violations require justification.

## Project Structure

### Documentation (this feature)

```text
specs/008-phase3-backend-chatbot/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file - implementation plan
├── research.md          # Phase 0 output - technology research
├── data-model.md        # Phase 1 output - database schema design
├── quickstart.md        # Phase 1 output - developer setup guide
└── contracts/           # Phase 1 output - API contracts
    ├── chat-endpoint.json      # OpenAPI spec for chat endpoint
    ├── mcp-tools.json          # MCP tool definitions
    └── agent-config.yaml       # Agent configuration spec
```

### Source Code (repository root)

```text
backend/                         # Existing Phase 2 backend
├── alembic/                     # Database migrations (existing)
│   ├── versions/
│   │   ├── [existing migrations]
│   │   ├── 004_add_conversations.py    # NEW - Phase 3.1
│   │   └── 005_add_messages.py         # NEW - Phase 3.1
│   └── env.py
├── src/
│   ├── models/                  # SQLModel database models (existing)
│   │   ├── user.py              # Existing
│   │   ├── task.py              # Existing
│   │   ├── conversation.py      # NEW - Phase 3.1
│   │   └── message.py           # NEW - Phase 3.1
│   ├── routes/                  # API endpoints (existing)
│   │   ├── tasks.py             # Existing
│   │   ├── auth.py              # Existing
│   │   └── chat.py              # NEW - Phase 3.4
│   ├── mcp/                     # NEW - Phase 3.2 - MCP Server
│   │   ├── __init__.py
│   │   ├── server.py            # MCP server initialization
│   │   └── tools/
│   │       ├── __init__.py
│   │       ├── add_task.py      # MCP tool: add_task
│   │       ├── list_tasks.py    # MCP tool: list_tasks
│   │       ├── complete_task.py # MCP tool: complete_task
│   │       ├── delete_task.py   # MCP tool: delete_task
│   │       └── update_task.py   # MCP tool: update_task
│   ├── agent/                   # NEW - Phase 3.3 - OpenAI Agent
│   │   ├── __init__.py
│   │   ├── config.py            # Agent configuration & system prompt
│   │   └── runner.py            # Agent runner with MCP integration
│   ├── middleware/              # Middleware (existing)
│   │   └── auth.py              # JWT verification (existing)
│   ├── db.py                    # Database connection (existing)
│   └── main.py                  # FastAPI app (existing)
├── tests/                       # Tests (existing structure)
│   ├── unit/
│   │   ├── test_models_conversation.py    # NEW - Phase 3.1
│   │   ├── test_models_message.py         # NEW - Phase 3.1
│   │   ├── test_mcp_tools.py              # NEW - Phase 3.2
│   │   └── test_agent_config.py           # NEW - Phase 3.3
│   ├── integration/
│   │   ├── test_mcp_agent.py              # NEW - Phase 3.3
│   │   ├── test_chat_endpoint.py          # NEW - Phase 3.4
│   │   └── test_conversation_persistence.py # NEW - Phase 3.4
│   └── e2e/
│       └── test_chatbot_flow.py           # NEW - Phase 3.5
├── pyproject.toml               # Dependencies (existing - to be updated)
├── .env.example                 # Environment variables template (to be updated)
└── README.md                    # Setup instructions (to be updated)
```

**Structure Decision**: Extending existing Phase 2 backend structure with three new top-level modules: `mcp/` for MCP server, `agent/` for OpenAI agent, and new `routes/chat.py` for chat endpoint. This maintains separation of concerns while integrating with existing authentication and database infrastructure.

## Complexity Tracking

> **No violations - this section intentionally empty**

All architecture decisions align with constitution principles. No additional complexity layers required beyond what's specified in the feature requirements.

---

## Phase 0: Research & Technology Validation

### Research Questions

1. **OpenAI Agents SDK + MCP Integration Pattern**
   - Question: What's the recommended pattern for connecting OpenAI Agents SDK to MCP server?
   - Research needed: `.claude/skills/openai-agents-sdk/reference/mcp-integration.md`
   - Decision criteria: Must support stateless operation, tool calling, conversation history

2. **MCP Server FastAPI Integration**
   - Question: How should MCP server be integrated into existing FastAPI application?
   - Research needed: `.claude/skills/mcp-server/reference/fastapi-integration.md`
   - Decision criteria: Must run within same process, share database connection, support concurrent requests

3. **Conversation History Management**
   - Question: How to handle conversation history that might exceed context window?
   - Research needed: OpenAI API documentation on context limits
   - Decision criteria: Must support at least 20 messages per conversation initially

4. **Database Transaction Strategy**
   - Question: How to handle concurrent updates to same conversation?
   - Research needed: SQLModel/SQLAlchemy transaction patterns
   - Decision criteria: Must prevent race conditions, support optimistic locking

5. **Agent System Prompt Design**
   - Question: What's the optimal system prompt for task management chatbot?
   - Research needed: `.claude/skills/openai-agents-sdk/examples/todo-agent.md`
   - Decision criteria: Must achieve >90% intent recognition for common phrasings

### Research Tasks

**Task 1**: Study MCP Server Implementation Patterns
- Read: `.claude/skills/mcp-server/SKILL.md`
- Read: `.claude/skills/mcp-server/examples/todo-server.md`
- Read: `.claude/skills/mcp-server/reference/tools.md`
- Read: `.claude/skills/mcp-server/templates/mcp_server.py`
- Output: Document MCP server setup, tool definition patterns, database integration

**Task 2**: Study OpenAI Agent + MCP Integration
- Read: `.claude/skills/openai-agents-sdk/SKILL.md`
- Read: `.claude/skills/openai-agents-sdk/reference/mcp-integration.md`
- Read: `.claude/skills/openai-agents-sdk/examples/todo-agent.md`
- Read: `.claude/skills/openai-agents-sdk/templates/agent_mcp.py`
- Output: Document agent creation, MCP connection, system prompt patterns

**Task 3**: Study Chat Endpoint Patterns
- Read: `.claude/skills/chatkit-python/SKILL.md`
- Read: `.claude/skills/chatkit-python/templates/chat_router.py`
- Read: `.claude/skills/chatkit-python/templates/models.py`
- Output: Document chat endpoint structure, request/response models, conversation handling

**Task 4**: Review FastAPI Patterns for New Components
- Read: `.claude/skills/fastapi/SKILL.md`
- Read: `.claude/skills/fastapi/reference/` (routing, dependency injection, error handling)
- Output: Document FastAPI best practices for route organization, error handling, async patterns

**Task 5**: Database Schema Best Practices
- Research: PostgreSQL indexing strategies for conversation queries
- Research: Foreign key cascading delete vs soft delete for conversations
- Research: Database transaction isolation levels for concurrent chat requests
- Output: Document schema design decisions, index strategy, transaction approach

**Output**: `research.md` documenting all findings and technology decisions

---

## Phase 1: Data Model & API Contracts

### Data Model Design

**Entity 1: Conversation**
- Represents a chat session between user and AI assistant
- Fields: id, user_id, created_at, updated_at
- Relationships: belongs to User (many-to-one), has many Messages (one-to-many)
- Indexes: user_id (for user's conversations), updated_at (for sorting by recency)
- Constraints: user_id NOT NULL, foreign key to users table

**Entity 2: Message**
- Represents a single message in a conversation
- Fields: id, conversation_id, user_id, role, content, created_at
- Relationships: belongs to Conversation (many-to-one), belongs to User (many-to-one)
- Indexes: conversation_id (for fetching history), created_at (for chronological ordering)
- Constraints: conversation_id NOT NULL, user_id NOT NULL, role IN ('user', 'assistant')
- Validation: content length 1-5000 characters

**MCP Tool Interfaces** (5 tools):
1. `add_task(user_id, title, description?) → {task_id, status, title}`
2. `list_tasks(user_id, status?) → [{id, title, completed}]`
3. `complete_task(user_id, task_id) → {task_id, status, title}`
4. `delete_task(user_id, task_id) → {task_id, status, title}`
5. `update_task(user_id, task_id, title?, description?) → {task_id, status, title}`

**Chat Endpoint Interface**:
- Request: `POST /api/{user_id}/chat` with body `{message, conversation_id?}`
- Response: `{conversation_id, response, tool_calls[]}`

### API Contracts

**Contract 1: Chat Endpoint** (`contracts/chat-endpoint.json`)
- OpenAPI 3.0 specification for `POST /api/{user_id}/chat`
- Request schema: ChatRequest (message: string, conversation_id?: int)
- Response schema: ChatResponse (conversation_id: int, response: string, tool_calls: array)
- Error responses: 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error)
- Security: JWT bearer token required

**Contract 2: MCP Tool Definitions** (`contracts/mcp-tools.json`)
- MCP tool schema for each of 5 tools
- Input parameters with types and validation rules
- Output schema for each tool
- Error response format

**Contract 3: Agent Configuration** (`contracts/agent-config.yaml`)
- System prompt template
- Tool access permissions
- Model configuration (model name, temperature, max tokens)
- Conversation history limits

### Developer Quickstart

**Output**: `quickstart.md` with:
1. Prerequisites (Python 3.13+, Neon database, OpenAI API key)
2. Environment setup (`.env` variables)
3. Database migration steps
4. Running MCP server in development
5. Testing agent locally
6. Running chat endpoint
7. Example curl commands for testing
8. Troubleshooting common issues

### Agent Context Update

**Action**: Run `.specify/scripts/bash/update-agent-context.sh claude`

**Additions to agent context**:
- Technology: OpenAI Agents SDK
- Technology: Official MCP SDK
- Pattern: Stateless chat endpoint with database-backed conversation state
- Pattern: MCP tools for task management
- Architecture: Agent + MCP integration for natural language understanding

---

## Implementation Phases

### Phase 3.1: Database Schema (Week 1, Days 1-2)

**Objective**: Add Conversation and Message tables to database

**Steps**:
1. Create Alembic migration `004_add_conversations.py`
2. Create Alembic migration `005_add_messages.py`
3. Create SQLModel class `Conversation` in `src/models/conversation.py`
4. Create SQLModel class `Message` in `src/models/message.py`
5. Add relationships to existing User model
6. Run migrations on development database
7. Write unit tests for new models

**Acceptance Criteria**:
- Migrations run successfully without errors
- Foreign key relationships work correctly
- Indexes created on user_id, conversation_id, created_at, updated_at
- Cascade delete works (deleting conversation deletes messages)
- Unit tests pass for model creation, relationships, constraints

**Dependencies**: None (uses existing database infrastructure)

**Estimated Effort**: 4 hours

---

### Phase 3.2: MCP Server (Week 1, Days 3-5)

**Objective**: Implement MCP server with 5 task management tools

**Steps**:
1. Set up MCP server structure in `src/mcp/`
2. Implement `server.py` using Official MCP SDK
3. Implement `tools/add_task.py`
4. Implement `tools/list_tasks.py`
5. Implement `tools/complete_task.py`
6. Implement `tools/delete_task.py`
7. Implement `tools/update_task.py`
8. Add database connection to each tool
9. Add user isolation validation to each tool
10. Write unit tests for each tool

**Acceptance Criteria**:
- MCP server initializes without errors
- Each tool is registered and discoverable
- All 5 tools execute successfully with valid input
- Tools enforce user isolation (user A cannot access user B's tasks)
- Tools handle database errors gracefully
- All tool unit tests pass
- Tools can be tested independently without running full backend

**Dependencies**: Phase 3.1 (database schema)

**Estimated Effort**: 12 hours

**Reference Skills**:
- `.claude/skills/mcp-server/templates/mcp_server.py`
- `.claude/skills/mcp-server/templates/mcp_tools.py`
- `.claude/skills/mcp-server/examples/todo-server.md`

---

### Phase 3.3: OpenAI Agent Integration (Week 2, Days 1-2)

**Objective**: Create AI agent with MCP integration

**Steps**:
1. Set up agent structure in `src/agent/`
2. Create `config.py` with system prompt and agent settings
3. Create `runner.py` with agent initialization
4. Connect agent to MCP server
5. Configure tool access permissions
6. Test agent with sample prompts
7. Validate intent recognition accuracy
8. Write integration tests for agent + MCP

**Acceptance Criteria**:
- Agent initializes and connects to MCP server successfully
- Agent can call all 5 MCP tools
- Agent correctly interprets task creation intent (>90% accuracy on test set)
- Agent correctly interprets task listing intent
- Agent correctly interprets task completion intent
- Agent correctly interprets task update intent
- Agent correctly interprets task deletion intent
- Agent provides conversational responses (not raw JSON)
- Integration tests pass for agent + MCP tool execution

**Dependencies**: Phase 3.2 (MCP server)

**Estimated Effort**: 8 hours

**Reference Skills**:
- `.claude/skills/openai-agents-sdk/templates/agent_mcp.py`
- `.claude/skills/openai-agents-sdk/examples/todo-agent.md`
- `.claude/skills/openai-agents-sdk/reference/mcp-integration.md`

---

### Phase 3.4: Chat Endpoint (Week 2, Days 3-5)

**Objective**: Implement stateless chat endpoint

**Steps**:
1. Create `src/routes/chat.py`
2. Implement `POST /api/{user_id}/chat` endpoint
3. Add request validation (message not empty, <5000 chars)
4. Implement conversation creation logic
5. Implement conversation history retrieval
6. Implement message storage (user message)
7. Integrate OpenAI agent invocation
8. Implement message storage (assistant response)
9. Add JWT authentication middleware
10. Add error handling
11. Write endpoint tests

**Acceptance Criteria**:
- Endpoint accepts valid requests and returns correct response format
- New conversations are created when conversation_id not provided
- Existing conversations are retrieved correctly with full message history
- User messages are stored before agent invocation
- Assistant responses are stored after agent execution
- Endpoint validates user_id matches JWT token
- Endpoint enforces conversation ownership (user A cannot access user B's conversations)
- Endpoint handles errors gracefully (invalid input, database errors, agent errors)
- Endpoint is stateless (no in-memory state required)
- Integration tests pass for complete request flow

**Dependencies**: Phase 3.3 (agent integration)

**Estimated Effort**: 12 hours

**Reference Skills**:
- `.claude/skills/chatkit-python/templates/chat_router.py`
- `.claude/skills/fastapi/reference/` (routing, error handling)

---

### Phase 3.5: Integration Testing (Week 3, Days 1-2)

**Objective**: Comprehensive integration and E2E testing

**Steps**:
1. Write E2E test: Full conversation flow (create, send 5 messages, verify actions)
2. Write E2E test: Stateless behavior (simulate server restart)
3. Write E2E test: Multi-turn context (agent maintains context)
4. Write integration test: Concurrent conversations (50 concurrent requests)
5. Write integration test: User isolation (cross-user access attempts)
6. Write integration test: Error scenarios (invalid task ID, database failure, etc.)
7. Run all tests and achieve >80% coverage
8. Performance testing with load tool
9. Fix any issues discovered

**Acceptance Criteria**:
- All E2E tests pass
- All integration tests pass
- Test coverage >80% for new code
- No cross-user data access detected
- Performance tests show <2s average response time for 50 concurrent conversations
- All error scenarios handled gracefully

**Dependencies**: Phase 3.4 (chat endpoint)

**Estimated Effort**: 8 hours

---

### Phase 3.6: Deployment (Week 3, Days 3-5)

**Objective**: Deploy backend to production

**Steps**:
1. Update `.env.example` with new environment variables
2. Update `README.md` with Phase 3 setup instructions
3. Update deployment configuration (Railway/Render/Vercel)
4. Add OpenAI API key to environment secrets
5. Run database migrations on production database
6. Deploy to staging environment
7. Run smoke tests on staging
8. Deploy to production
9. Monitor performance and errors
10. Document deployment process

**Acceptance Criteria**:
- Deployment successful without errors
- All environment variables configured correctly
- Database migrations applied successfully
- Smoke tests pass on staging
- Production deployment stable
- Monitoring configured for errors and performance
- Documentation updated with deployment steps

**Dependencies**: Phase 3.5 (integration testing)

**Estimated Effort**: 6 hours

---

## Risk Management

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| MCP server integration complexity | Medium | High | Follow skill templates exactly; test MCP server independently before agent integration |
| Agent intent recognition accuracy below 90% | Medium | High | Use comprehensive system prompt from skill examples; iterate on prompt with test cases |
| Conversation history exceeds context window | Low | Medium | Implement truncation strategy; limit to 20 most recent messages initially |
| Database transaction concurrency issues | Low | High | Use database transaction isolation; add optimistic locking if needed |
| OpenAI API rate limits | Medium | Medium | Implement retry logic with exponential backoff; monitor usage |
| Performance degradation under load | Low | Medium | Load test early; optimize database queries; add caching if needed |

## Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Spec implementation completeness | 100% of 53 FRs | Manual review against spec checklist |
| Unit test coverage | >80% | pytest-cov report |
| Integration test pass rate | 100% | CI/CD pipeline |
| Intent recognition accuracy | >90% | Test set of 50 common phrasings |
| Chat endpoint response time | <2s average | Load testing with 50 concurrent requests |
| Conversation persistence | 100% accuracy | E2E test with server restart |
| User isolation | Zero cross-user access | Security testing with multiple user accounts |
| Deployment success | Zero downtime | Production deployment monitoring |

## Timeline

**Total Estimated Duration**: 3 weeks (15 working days, ~50 hours total)

- **Week 1**: Database schema (2 days) + MCP server (3 days)
- **Week 2**: Agent integration (2 days) + Chat endpoint (3 days)
- **Week 3**: Testing (2 days) + Deployment (3 days)

**Critical Path**: Database → MCP Server → Agent → Chat Endpoint → Testing → Deployment

Each phase depends on the previous phase completing successfully.

---

## Next Steps

1. ✅ Create this plan document
2. 🔄 Create `research.md` (Phase 0)
3. ⏳ Create `data-model.md` (Phase 1)
4. ⏳ Create API contracts in `contracts/` (Phase 1)
5. ⏳ Create `quickstart.md` (Phase 1)
6. ⏳ Run `/sp.tasks` to break down into actionable tasks

**Command to proceed**: `/sp.tasks` to generate task breakdown from this plan
