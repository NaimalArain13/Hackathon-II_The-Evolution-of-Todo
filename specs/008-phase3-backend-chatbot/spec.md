# Feature Specification: Phase 3 Backend - AI Chatbot Infrastructure

**Feature Branch**: `phase3/backend`
**Created**: 2025-12-15
**Status**: Draft
**Input**: User description: "Create specs for phase 3 backend to add new database tables, create MCP server, implement OpenAI agent, and build chat endpoint. All features must be implemented using Claude Code skills: mcp-server, openai-agents-sdk, chatkit-python, and fastapi."

**Phase**: Phase III - AI Chatbot Backend
**Reference Document**: `specs/PHASE-3-REFERENCE.md`

## User Scenarios & Testing

### User Story 1 - Natural Language Task Creation (Priority: P1)

As a user, I want to create tasks by simply telling the chatbot what I need to do in natural language, so I can quickly capture tasks without filling out forms or clicking through UI elements.

**Why this priority**: This is the core value proposition of the AI chatbot - natural language interaction. Without this, the chatbot offers no advantage over the existing UI. This delivers immediate value and can be independently demonstrated.

**Independent Test**: User can send a message like "I need to buy groceries" and verify that a new task is created in the database. Can be tested by:
1. Sending chat message via API
2. Checking database for new task record
3. Verifying task appears in user's task list

**Acceptance Scenarios**:

1. **Given** user is authenticated and has an active conversation, **When** user sends message "Add task to buy groceries", **Then** system creates new task with title "Buy groceries" and returns confirmation message
2. **Given** user sends "Remind me to call mom tomorrow", **When** agent processes the message, **Then** system creates task with title "Call mom tomorrow" and stores it with user's ID
3. **Given** user sends complex task "Buy milk, eggs, and bread from the store", **When** agent extracts task information, **Then** system creates task with full description and returns friendly confirmation

---

### User Story 2 - Conversation Persistence Across Sessions (Priority: P2)

As a user, I want my chat conversations to be saved, so I can return later and continue where I left off, seeing the full history of what the assistant helped me with.

**Why this priority**: Enables continuity and builds trust. Users can reference past interactions and see their task management history. Depends on P1 working first but adds significant UX value.

**Independent Test**: User can create a conversation, send messages, close the application, return later, and see the full conversation history preserved. Can be tested by:
1. Creating conversation and sending 3-5 messages
2. Simulating session end
3. Re-opening conversation by ID
4. Verifying all messages are retrieved in order

**Acceptance Scenarios**:

1. **Given** user starts new conversation, **When** user sends first message, **Then** system creates new conversation record with unique ID and stores first message
2. **Given** existing conversation with 5 messages, **When** user returns and provides conversation_id, **Then** system retrieves all 5 messages in chronological order for context
3. **Given** server restarts during active conversation, **When** user sends new message with conversation_id, **Then** system retrieves full history from database and continues conversation seamlessly

---

### User Story 3 - Multi-Action Task Management Commands (Priority: P3)

As a user, I want to manage my existing tasks through natural language (view, complete, update, delete), so I can handle all task operations conversationally without switching to the UI.

**Why this priority**: Completes the chatbot's task management capabilities. While valuable, creating tasks (P1) is more critical. This builds on the foundation and allows full CRUD operations via chat.

**Independent Test**: User can view pending tasks, mark specific tasks complete, update task titles, and delete tasks all through natural language commands. Can be tested by:
1. Creating 3 test tasks
2. Sending "Show my pending tasks" and verifying list
3. Sending "Mark task 2 complete" and verifying status change
4. Sending "Delete task 3" and verifying removal

**Acceptance Scenarios**:

1. **Given** user has 5 pending tasks, **When** user sends "What tasks do I have?", **Then** system returns list of all 5 tasks with IDs and titles
2. **Given** user has task ID 3 titled "Buy groceries", **When** user sends "Mark task 3 as done", **Then** system updates task status to complete and confirms action
3. **Given** user wants to modify existing task, **When** user sends "Change task 1 title to 'Call mom tonight'", **Then** system updates task title and confirms change
4. **Given** user has completed task they want to remove, **When** user sends "Delete the grocery task", **Then** system finds matching task, deletes it, and confirms deletion

---

### User Story 4 - Stateless Request Handling (Priority: P1)

As a system operator, I want the chat endpoint to be stateless and horizontally scalable, so we can handle high traffic by adding more server instances without complex state synchronization.

**Why this priority**: Critical architecture requirement. Ensures the system can scale and is resilient to failures. Must be designed from the start - cannot be retrofitted easily.

**Independent Test**: Send multiple chat requests to different server instances with the same conversation_id, and verify all instances retrieve the same conversation history and correctly update the database. Can be tested by:
1. Deploying 2+ backend instances
2. Load balancing requests across instances
3. Verifying conversation state remains consistent
4. Confirming no in-memory state is required

**Acceptance Scenarios**:

1. **Given** two backend server instances running, **When** user sends message to instance A then next message to instance B, **Then** both instances retrieve same conversation history from database and continue conversation correctly
2. **Given** backend server crashes mid-conversation, **When** new server instance starts and receives next message, **Then** system retrieves full conversation from database without data loss
3. **Given** high traffic with 100 concurrent conversations, **When** requests are distributed across 3 server instances, **Then** all conversations maintain correct state and no cross-talk occurs between users

---

### User Story 5 - AI Agent Intent Recognition (Priority: P2)

As a user, I want the AI agent to correctly understand my intent from natural language and choose the appropriate action (add, list, complete, update, delete), so I don't have to use specific command syntax.

**Why this priority**: Delivers on the "natural language" promise. Users should not need to memorize commands. Builds on P1 (task creation) and enables P3 (multi-action management).

**Independent Test**: Send various phrasings of the same intent and verify the agent calls the correct MCP tool. Can be tested by:
1. Testing 5+ different phrasings for "add task"
2. Verifying all result in `add_task` tool call
3. Testing ambiguous inputs and checking clarification
4. Measuring intent recognition accuracy

**Acceptance Scenarios**:

1. **Given** user sends "I need to remember to pay bills", **When** agent processes intent, **Then** agent calls `add_task` tool with title "Pay bills"
2. **Given** user sends "What's on my plate?", **When** agent interprets casual language, **Then** agent calls `list_tasks` tool with status "all"
3. **Given** user sends "I finished the shopping", **When** agent recognizes completion intent, **Then** agent calls `list_tasks` to find shopping task then `complete_task` with correct ID
4. **Given** user sends ambiguous message "task 5", **When** agent cannot determine intent, **Then** agent asks clarifying question like "What would you like to do with task 5?"

---

### Edge Cases

- **What happens when user references non-existent task ID?** System gracefully handles error, agent responds with "I couldn't find task [ID]. Would you like to see your task list?"
- **What happens when conversation_id is invalid?** System creates new conversation and informs user via agent response
- **What happens when user sends empty message?** System validates input and returns error without calling agent
- **What happens when MCP server is unreachable?** Chat endpoint returns error response indicating service unavailable, with retry suggestion
- **What happens when database connection fails?** System returns 503 error with appropriate error message, logs incident for monitoring
- **What happens when two requests update same task simultaneously?** Database transaction handles concurrency, last write wins with optimistic locking
- **What happens when agent makes multiple tool calls in single turn?** System executes all tool calls in sequence, stores results, and returns comprehensive response
- **What happens when user's JWT token expires mid-conversation?** System returns 401 Unauthorized, frontend handles re-authentication
- **What happens when conversation history exceeds context window?** Agent uses summarization or only most recent N messages (implementation detail for later)
- **What happens when user sends very long message (>5000 chars)?** System validates message length, returns error if exceeds limit

## Requirements

### Functional Requirements

#### Database Layer

- **FR-001**: System MUST add `Conversation` table with fields: id (PK), user_id (FK to users), created_at, updated_at
- **FR-002**: System MUST add `Message` table with fields: id (PK), conversation_id (FK to conversations), user_id (FK to users), role (user|assistant), content (text), created_at
- **FR-003**: System MUST create database index on `conversations.user_id` for efficient user conversation lookup
- **FR-004**: System MUST create database index on `conversations.updated_at` for sorting conversations by recency
- **FR-005**: System MUST create database index on `messages.conversation_id` for retrieving conversation history
- **FR-006**: System MUST create database index on `messages.created_at` for chronological message ordering
- **FR-007**: System MUST enforce foreign key constraints to maintain referential integrity between conversations, messages, and users
- **FR-008**: System MUST cascade delete messages when parent conversation is deleted

#### MCP Server Layer (using `.claude/skills/mcp-server/`)

- **FR-009**: System MUST implement MCP server using Official MCP SDK (Python) following patterns from `.claude/skills/mcp-server/`
- **FR-010**: System MUST expose `add_task` tool that accepts user_id (string), title (string), description (optional string) and returns task_id, status, title
- **FR-011**: System MUST expose `list_tasks` tool that accepts user_id (string), status (optional: "all"|"pending"|"completed") and returns array of task objects
- **FR-012**: System MUST expose `complete_task` tool that accepts user_id (string), task_id (integer) and returns task_id, status, title
- **FR-013**: System MUST expose `delete_task` tool that accepts user_id (string), task_id (integer) and returns task_id, status, title
- **FR-014**: System MUST expose `update_task` tool that accepts user_id (string), task_id (integer), title (optional string), description (optional string) and returns task_id, status, title
- **FR-015**: All MCP tools MUST be stateless and interact directly with database for state persistence
- **FR-016**: All MCP tools MUST validate user_id and enforce user isolation (users can only access their own tasks)
- **FR-017**: All MCP tools MUST handle database errors gracefully and return appropriate error responses
- **FR-018**: MCP server MUST follow integration pattern from `.claude/skills/mcp-server/reference/fastapi-integration.md`

#### OpenAI Agent Layer (using `.claude/skills/openai-agents-sdk/`)

- **FR-019**: System MUST create AI agent using OpenAI Agents SDK following patterns from `.claude/skills/openai-agents-sdk/`
- **FR-020**: Agent MUST connect to MCP server to access task management tools following `.claude/skills/openai-agents-sdk/reference/mcp-integration.md`
- **FR-021**: Agent MUST understand natural language intent for: task creation, task listing, task completion, task updating, task deletion
- **FR-022**: Agent MUST use `add_task` tool when user expresses intent to create/add/remember a task
- **FR-023**: Agent MUST use `list_tasks` tool when user asks to see/show/list tasks, with appropriate status filter
- **FR-024**: Agent MUST use `complete_task` tool when user indicates a task is done/complete/finished
- **FR-025**: Agent MUST use `delete_task` tool when user wants to remove/delete/cancel a task
- **FR-026**: Agent MUST use `update_task` tool when user wants to change/update/modify a task
- **FR-027**: Agent MUST provide friendly, conversational responses confirming actions taken
- **FR-028**: Agent MUST handle errors gracefully with user-friendly error messages (e.g., "I couldn't find that task")
- **FR-029**: Agent MUST be configured with system prompt defining its role, capabilities, and tone
- **FR-030**: Agent MUST follow implementation pattern from `.claude/skills/openai-agents-sdk/examples/todo-agent.md`

#### Chat API Endpoint Layer (using `.claude/skills/chatkit-python/` and `.claude/skills/fastapi/`)

- **FR-031**: System MUST create `POST /api/{user_id}/chat` endpoint following patterns from `.claude/skills/chatkit-python/` and `.claude/skills/fastapi/`
- **FR-032**: Chat endpoint MUST accept request body with: message (required string), conversation_id (optional integer)
- **FR-033**: Chat endpoint MUST validate that authenticated user's ID matches {user_id} in URL path
- **FR-034**: Chat endpoint MUST create new conversation if conversation_id not provided
- **FR-035**: Chat endpoint MUST retrieve existing conversation and all messages if conversation_id provided
- **FR-036**: Chat endpoint MUST validate that conversation belongs to authenticated user before retrieving history
- **FR-037**: Chat endpoint MUST store user's message in database with role="user" before invoking agent
- **FR-038**: Chat endpoint MUST build message array from conversation history + new message for agent context
- **FR-039**: Chat endpoint MUST invoke OpenAI agent with message array and MCP tool access
- **FR-040**: Chat endpoint MUST store agent's response in database with role="assistant"
- **FR-041**: Chat endpoint MUST return response containing: conversation_id, response text, tool_calls array
- **FR-042**: Chat endpoint MUST be stateless - no in-memory session storage required
- **FR-043**: Chat endpoint MUST handle concurrent requests to same conversation using database transactions
- **FR-044**: Chat endpoint MUST return appropriate HTTP error codes: 400 (bad request), 401 (unauthorized), 404 (conversation not found), 500 (server error)
- **FR-045**: Chat endpoint MUST follow response format from `.claude/skills/chatkit-python/templates/chat_router.py`

#### Authentication & Authorization

- **FR-046**: All chat endpoints MUST require valid JWT token (reusing existing Better Auth integration)
- **FR-047**: System MUST extract user_id from JWT token for user isolation
- **FR-048**: System MUST enforce that users can only access their own conversations and messages
- **FR-049**: MCP tools MUST validate user_id against task ownership before any CRUD operation

#### Error Handling & Validation

- **FR-050**: System MUST validate message content is not empty and does not exceed 5000 characters
- **FR-051**: System MUST validate conversation_id exists and belongs to user before retrieving history
- **FR-052**: System MUST return clear error messages for: invalid input, authentication failures, database errors, MCP server errors
- **FR-053**: System MUST log all errors with sufficient context for debugging (user_id, conversation_id, error type, timestamp)

### Key Entities

- **Conversation**: Represents a chat session between user and AI assistant. Contains: unique ID, owning user ID, creation timestamp, last update timestamp. Related to User (many-to-one) and Messages (one-to-many).

- **Message**: Represents a single message in a conversation. Contains: unique ID, parent conversation ID, owning user ID, role (user or assistant), message content, creation timestamp. Related to Conversation (many-to-one) and User (many-to-one).

- **Task**: Existing entity from Phase 2. Enhanced with conversational access via MCP tools. Contains: unique ID, owning user ID, title, description, completion status, timestamps.

- **User**: Existing entity managed by Better Auth. Acts as owner for conversations, messages, and tasks.

### Non-Functional Requirements

- **NFR-001**: Chat endpoint response time MUST be under 3 seconds for 95% of requests (including agent processing)
- **NFR-002**: System MUST support at least 50 concurrent chat conversations without degradation
- **NFR-003**: MCP server MUST be independently testable without running full backend
- **NFR-004**: All components (MCP server, agent, chat endpoint) MUST follow existing backend patterns from Phase 2
- **NFR-005**: Database schema changes MUST use Alembic migrations for version control
- **NFR-006**: All code MUST follow PEP 8 style guidelines and pass type checking (mypy)

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can create tasks via natural language chat in under 10 seconds from sending message to receiving confirmation
- **SC-002**: System correctly interprets task creation intent for at least 90% of common phrasings (e.g., "I need to...", "Remind me to...", "Add task...")
- **SC-003**: Conversation history is successfully retrieved and preserved across server restarts with 100% accuracy
- **SC-004**: All 5 MCP tools (add, list, complete, delete, update) execute successfully and return correct results when tested independently
- **SC-005**: Chat endpoint handles 50 concurrent conversations with average response time under 2 seconds
- **SC-006**: Users can successfully complete task creation, viewing, updating, completion, and deletion entirely through chat interface
- **SC-007**: Agent provides friendly, conversational responses for at least 95% of user interactions (measured by response containing confirmations like "I've added..." rather than raw JSON)
- **SC-008**: System maintains user isolation with zero instances of cross-user data access in testing
- **SC-009**: All integration tests pass with 100% success rate covering conversation creation, message storage, agent invocation, and tool execution
- **SC-010**: Backend can be deployed and handle production traffic without manual state management or session configuration

## Testing Requirements

### Unit Tests Required

- **Database Models**: Test Conversation and Message model creation, relationships, and constraints
- **MCP Tools**: Test each of 5 tools independently with mocked database
- **Agent Configuration**: Test agent system prompt and tool registration
- **Validation Logic**: Test input validation for message length, conversation_id, user authentication

### Integration Tests Required

- **MCP Server Integration**: Test agent successfully calling each MCP tool and receiving correct responses
- **Database Persistence**: Test conversation creation, message storage, and retrieval across multiple requests
- **Chat Endpoint Flow**: Test complete request flow: receive message → fetch history → call agent → store response → return result
- **User Isolation**: Test that user A cannot access user B's conversations or tasks via any endpoint

### End-to-End Tests Required

- **Full Conversation Flow**: Create conversation, send 5 messages with different intents, verify all actions executed correctly
- **Stateless Behavior**: Simulate server restart mid-conversation, verify conversation continues without data loss
- **Multi-Turn Context**: Test agent maintaining context across multiple turns (e.g., "Add task to buy milk", "Add eggs too", "Show me both")
- **Error Scenarios**: Test graceful handling of: invalid task ID, empty message, database failure, MCP server unavailable

## Implementation Dependencies

### Required Skills

All implementation MUST use the following Claude Code skills:

1. **`.claude/skills/mcp-server/`**: For building MCP server with Official MCP SDK
   - Reference: `reference/tools.md` for tool definition patterns
   - Reference: `reference/fastapi-integration.md` for FastAPI integration
   - Template: `templates/mcp_server.py` for server structure
   - Template: `templates/mcp_tools.py` for tool implementation patterns
   - Example: `examples/todo-server.md` for task management MCP server patterns

2. **`.claude/skills/openai-agents-sdk/`**: For AI agent creation with MCP integration
   - Reference: `reference/agents.md` for agent creation patterns
   - Reference: `reference/mcp-integration.md` for connecting agent to MCP server
   - Reference: `reference/function-tools.md` for tool usage patterns
   - Template: `templates/agent_mcp.py` for agent+MCP setup
   - Example: `examples/todo-agent.md` for task management agent

3. **`.claude/skills/chatkit-python/`**: For FastAPI chat endpoint patterns
   - Template: `templates/chat_router.py` for chat endpoint structure
   - Template: `templates/models.py` for request/response models

4. **`.claude/skills/fastapi/`**: For FastAPI implementation patterns
   - Reference: `reference/` for routing, dependency injection, error handling patterns
   - Template: `templates/` for endpoint structure

### Existing Dependencies

- ✅ User authentication (Better Auth + JWT) - Phase 2
- ✅ Task model and CRUD operations - Phase 2
- ✅ Database connection (Neon PostgreSQL) - Phase 2
- ✅ FastAPI application structure - Phase 2

### New Dependencies Required

- OpenAI Agents SDK (`pip install openai-agents-sdk`)
- Official MCP SDK (`pip install mcp`)
- Updated database schema (Alembic migration)

## Implementation Order

### Phase 3.1: Database Schema (First)
1. Create Alembic migration for `conversations` table
2. Create Alembic migration for `messages` table
3. Create SQLModel classes for Conversation and Message
4. Test models and relationships
5. Run migrations on development database

### Phase 3.2: MCP Server (Second)
1. Set up MCP server project structure using `.claude/skills/mcp-server/`
2. Implement `add_task` tool
3. Implement `list_tasks` tool
4. Implement `complete_task` tool
5. Implement `delete_task` tool
6. Implement `update_task` tool
7. Write unit tests for each tool
8. Integration test with test database

### Phase 3.3: OpenAI Agent (Third)
1. Set up OpenAI Agents SDK using `.claude/skills/openai-agents-sdk/`
2. Create agent configuration with system prompt
3. Connect agent to MCP server
4. Configure tool access and permissions
5. Test agent with sample prompts
6. Validate intent recognition accuracy

### Phase 3.4: Chat Endpoint (Fourth)
1. Create chat router using `.claude/skills/chatkit-python/` and `.claude/skills/fastapi/`
2. Implement conversation creation logic
3. Implement conversation history retrieval
4. Implement message storage
5. Integrate OpenAI agent invocation
6. Add JWT authentication middleware
7. Add error handling
8. Write endpoint tests

### Phase 3.5: Integration Testing (Fifth)
1. Test complete conversation flow end-to-end
2. Test stateless behavior with multiple server instances
3. Test user isolation and security
4. Test error scenarios and edge cases
5. Performance testing with concurrent requests
6. Load testing to validate scalability

### Phase 3.6: Deployment (Sixth)
1. Update deployment configuration
2. Add environment variables for OpenAI API key, MCP server config
3. Deploy to staging environment
4. Run smoke tests on staging
5. Deploy to production
6. Monitor performance and errors

## Assumptions

1. **OpenAI API Access**: Assuming developer has OpenAI API key and sufficient quota for agent usage
2. **Database Performance**: Assuming Neon database can handle additional conversation/message tables without performance degradation
3. **MCP Server Deployment**: Assuming MCP server runs as part of backend application (not separate service) for Phase 3
4. **Context Window**: Assuming conversation history fits within agent context window (can add truncation/summarization later if needed)
5. **Message Length**: Assuming 5000 character limit is sufficient for user messages (can adjust based on testing)
6. **Tool Execution Time**: Assuming MCP tools complete within 1 second each for 95% of operations
7. **Concurrent Conversations**: Assuming 50 concurrent conversations is sufficient for initial deployment (can scale horizontally)
8. **Error Recovery**: Assuming transient errors (network, database) can be handled with retries at application level

## Open Questions

None - all critical decisions have reasonable defaults or are specified above.

## Related Documents

- **Phase 3 Reference**: `specs/PHASE-3-REFERENCE.md`
- **Hackathon Guide**: `Hackathon II - Todo Spec-Driven Development.md` (Phase III section)
- **Backend Guidelines**: `backend/CLAUDE.md`
- **Database Schema**: `specs/database/schema.md` (to be updated with new tables)
- **API Endpoints**: `specs/api/rest-endpoints.md` (to be updated with chat endpoint)

## Skills Reference

All implementation must follow patterns from:
- `.claude/skills/mcp-server/` - MCP server implementation
- `.claude/skills/openai-agents-sdk/` - AI agent creation
- `.claude/skills/chatkit-python/` - Chat endpoint patterns
- `.claude/skills/fastapi/` - FastAPI patterns

---

**Next Steps**: Run `/sp.plan` to create technical implementation plan, then `/sp.tasks` to break down into actionable tasks.
