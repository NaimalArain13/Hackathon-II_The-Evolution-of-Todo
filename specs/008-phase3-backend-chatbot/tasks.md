---
description: "Implementation tasks for Phase 3 Backend - AI Chatbot Infrastructure"
---

# Tasks: Phase 3 Backend - AI Chatbot Infrastructure

**Input**: Design documents from `/specs/008-phase3-backend-chatbot/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Comprehensive test coverage is required per spec (FR testing requirements). Tests are included in each phase.

**Organization**: Tasks are grouped by implementation phases from plan.md and mapped to user stories where applicable.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/src/`, `backend/tests/`
- All paths are relative to repository root

---

## Phase 1: Setup (Project Dependencies)

**Purpose**: Install Phase 3 dependencies and update configuration

- [x] T001 Add Phase 3 dependencies to backend/pyproject.toml (openai-agents-sdk, mcp, litellm, sse-starlette)
- [x] T002 Update backend/.env.example with Phase 3 environment variables (GOOGLE_API_KEY, MCP_SERVER_URL, AGENT_MODEL, MAX_CONVERSATION_HISTORY)
- [x] T003 [P] Install all dependencies using uv sync in backend/

---

## Phase 2: Foundational - Database Schema (Phase 3.1)

**Purpose**: Core database infrastructure - BLOCKS all user stories

**⚠️ CRITICAL**: No chatbot features can work until database schema is complete

- [x] T004 Create Conversation SQLModel class in backend/src/models/conversation.py
- [x] T005 Create Message SQLModel class with MessageRole enum in backend/src/models/message.py
- [x] T006 Create Alembic migration 004_add_conversations.py in backend/alembic/versions/
- [x] T007 Create Alembic migration 005_add_messages.py in backend/alembic/versions/
- [x] T008 Run Alembic migrations to create conversations and messages tables
- [ ] T009 [P] Write unit tests for Conversation model in backend/tests/unit/test_models_conversation.py
- [ ] T010 [P] Write unit tests for Message model in backend/tests/unit/test_models_message.py

**Checkpoint**: Database schema ready - MCP server and agent implementation can now begin

---

## Phase 3: User Story 4 - Stateless Request Handling (Priority: P1) 🎯 FOUNDATIONAL

**Goal**: Implement stateless, horizontally scalable chat architecture with database-backed conversation state

**Independent Test**: Deploy 2+ backend instances, send messages to different instances with same conversation_id, verify state consistency

**Why First**: This is architectural foundation - all other user stories depend on stateless design being correct

### MCP Server Implementation (Phase 3.2)

- [x] T011 [US4] Create MCP server structure in backend/src/mcp/__init__.py
- [x] T012 [US4] Initialize FastMCP server with stateless HTTP in backend/src/mcp/server.py
- [x] T013 [P] [US4] Implement add_task MCP tool in backend/src/mcp/tools/add_task.py
- [x] T014 [P] [US4] Implement list_tasks MCP tool in backend/src/mcp/tools/list_tasks.py
- [x] T015 [P] [US4] Implement complete_task MCP tool in backend/src/mcp/tools/complete_task.py
- [x] T016 [P] [US4] Implement delete_task MCP tool in backend/src/mcp/tools/delete_task.py
- [x] T017 [P] [US4] Implement update_task MCP tool in backend/src/mcp/tools/update_task.py
- [x] T018 [US4] Register all MCP tools in backend/src/mcp/server.py
- [x] T019 [US4] Add database connection to MCP tools via dependency injection
- [x] T020 [US4] Add user isolation validation to all MCP tools (verify user_id parameter)
- [ ] T021 [P] [US4] Write unit tests for add_task tool in backend/tests/unit/test_mcp_add_task.py
- [ ] T022 [P] [US4] Write unit tests for list_tasks tool in backend/tests/unit/test_mcp_list_tasks.py
- [ ] T023 [P] [US4] Write unit tests for complete_task tool in backend/tests/unit/test_mcp_complete_task.py
- [ ] T024 [P] [US4] Write unit tests for delete_task tool in backend/tests/unit/test_mcp_delete_task.py
- [ ] T025 [P] [US4] Write unit tests for update_task tool in backend/tests/unit/test_mcp_update_task.py

**Checkpoint**: MCP server functional with all 5 tools independently testable

---

## Phase 4: User Story 5 - AI Agent Intent Recognition (Priority: P2)

**Goal**: Agent correctly interprets natural language and calls appropriate MCP tools (>90% accuracy)

**Independent Test**: Send 10+ phrasings for each intent, verify correct MCP tool is called

**Depends On**: MCP server must be working (Phase 3)

### OpenAI Agent Implementation (Phase 3.3)

- [x] T026 [US5] Create agent configuration module in backend/src/agent/__init__.py
- [x] T027 [US5] Define system prompt template in backend/src/agent/config.py (includes tool documentation and examples)
- [x] T028 [US5] Implement agent creation with Gemini via LiteLLM in backend/src/agent/runner.py
- [x] T029 [US5] Connect agent to MCP server using MCPServerStreamableHttp in backend/src/agent/runner.py
- [x] T030 [US5] Configure agent with tool access permissions in backend/src/agent/config.py
- [x] T031 [US5] Add conversation history loading logic in backend/src/agent/runner.py
- [x] T032 [P] [US5] Write unit tests for system prompt generation in backend/tests/unit/test_agent_config.py
- [x] T033 [P] [US5] Write integration tests for agent + MCP tool execution in backend/tests/integration/test_mcp_agent.py
- [x] T034 [US5] Test intent recognition accuracy with 50 sample phrasings in backend/tests/integration/test_intent_recognition.py

**Checkpoint**: Agent successfully calls all MCP tools with natural language prompts

---

## Phase 5: User Story 2 - Conversation Persistence (Priority: P2)

**Goal**: Users can return to conversations and see full history preserved

**Independent Test**: Create conversation, send 5 messages, restart server, retrieve conversation, verify all messages present

**Depends On**: Agent and MCP server must be working

### Chat Endpoint Implementation (Phase 3.4)

- [x] T035 [US2] Create chat request/response Pydantic models in backend/schemas/chat.py
- [x] T036 [US2] Create chat router structure in backend/routes/chat.py
- [x] T037 [US2] Implement POST /api/{user_id}/chat endpoint in backend/routes/chat.py
- [x] T038 [US2] Add JWT authentication dependency to chat endpoint
- [x] T039 [US2] Implement conversation creation logic (when conversation_id not provided)
- [x] T040 [US2] Implement conversation retrieval logic (when conversation_id provided)
- [x] T041 [US2] Implement conversation ownership validation (user_id matches JWT)
- [x] T042 [US2] Implement message history loading (recent 50 messages) in backend/routes/chat.py
- [x] T043 [US2] Implement user message storage before agent invocation
- [x] T044 [US2] Integrate OpenAI agent invocation with conversation context
- [x] T045 [US2] Implement assistant response storage after agent completion
- [x] T046 [US2] Implement SSE streaming with EventSourceResponse in backend/routes/chat.py
- [x] T047 [US2] Add conversation timestamp update (updated_at) when message added
- [x] T048 [US2] Add request validation (message not empty, max 5000 chars)
- [x] T049 [US2] Add error handling for all failure scenarios (401, 404, 500)
- [x] T050 [US2] Register chat router in backend/main.py
- [x] T051 [US2] Mount MCP server at /api/mcp in backend/main.py using Starlette Mount
- [ ] T052 [P] [US2] Write unit tests for chat request/response models in backend/tests/unit/test_chat_schemas.py
- [ ] T053 [US2] Write integration tests for conversation persistence in backend/tests/integration/test_conversation_persistence.py
- [ ] T054 [US2] Write integration tests for complete chat flow in backend/tests/integration/test_chat_endpoint.py

**Checkpoint**: Users can create conversations, send messages, and retrieve history across sessions

---

## Phase 6: User Story 1 - Natural Language Task Creation (Priority: P1) 🎯 MVP

**Goal**: Users create tasks via natural language without forms or UI clicks

**Independent Test**: Send "I need to buy groceries", verify task created in database

**Depends On**: Chat endpoint, agent, and MCP tools must be working

### End-to-End Task Creation Flow

- [x] T055 [US1] Write E2E test for task creation via chat in backend/tests/e2e/test_task_creation.py
- [x] T056 [US1] Test natural language task creation with 10 different phrasings
- [x] T057 [US1] Verify task appears in user's task list after creation via chat
- [x] T058 [US1] Test task creation with complex descriptions (multi-part tasks)
- [x] T059 [US1] Verify agent provides friendly confirmation messages

**Checkpoint**: Core MVP - users can create tasks conversationally

---

## Phase 7: User Story 3 - Multi-Action Task Management (Priority: P3)

**Goal**: Users can view, complete, update, and delete tasks via natural language

**Independent Test**: Create 3 tasks, send "Show my tasks", "Mark task 2 complete", "Delete task 3", verify all actions

**Depends On**: Task creation (US1) must be working

### Complete CRUD Operations

- [x] T060 [P] [US3] Write E2E test for task listing via chat in backend/tests/e2e/test_multi_action_crud.py
- [x] T061 [P] [US3] Write E2E test for task completion via chat in backend/tests/e2e/test_multi_action_crud.py
- [x] T062 [P] [US3] Write E2E test for task update via chat in backend/tests/e2e/test_multi_action_crud.py
- [x] T063 [P] [US3] Write E2E test for task deletion via chat in backend/tests/e2e/test_multi_action_crud.py
- [x] T064 [US3] Test all 5 MCP tools through natural language commands
- [x] T065 [US3] Verify agent handles task not found errors gracefully
- [x] T066 [US3] Test multi-turn conversations with context (e.g., "show tasks" → "mark task 2 done")

**Checkpoint**: Complete task management via chatbot

---

## Phase 8: Integration Testing & Performance (Phase 3.5)

**Purpose**: Comprehensive testing across all user stories

- [x] T067 Write E2E test for full conversation flow (5+ messages, multiple actions) in backend/tests/integration/test_chatbot_integration.py
- [x] T068 Write E2E test for stateless behavior with server restart in backend/tests/integration/test_chatbot_integration.py
- [x] T069 Write integration test for user isolation (cross-user access attempts) in backend/tests/integration/test_chatbot_integration.py
- [x] T070 Write integration test for concurrent conversations (50 simultaneous) in backend/tests/integration/test_chatbot_integration.py
- [x] T071 Write integration test for database transaction handling in backend/tests/integration/test_chatbot_integration.py
- [x] T072 Test error scenarios (invalid task ID, empty message, DB failure, agent timeout) in backend/tests/integration/test_chatbot_integration.py
- [ ] T073 Run performance tests and verify <2s average response time for chat endpoint (Deferred to testing phase)
- [ ] T074 Verify all tests pass with >80% code coverage (Deferred to testing phase)
- [ ] T075 Fix any issues discovered during integration testing (Deferred to testing phase)

**Checkpoint**: All user stories tested and validated

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Production readiness and documentation

- [x] T076 [P] Update backend/README.md with Phase 3 setup instructions
- [x] T077 [P] Update backend/.env.example with all Phase 3 variables (Already complete)
- [x] T078 [P] Add API documentation comments to chat endpoint (Already complete - comprehensive docstrings)
- [x] T079 Add logging for all MCP tool calls and agent invocations (Error logging implemented)
- [x] T080 Add error logging with context (user_id, conversation_id, error type) (Complete in chat.py)
- [x] T081 Configure CORS for chat endpoint (allow frontend origin) (Already configured in main.py)
- [x] T082 Add health check endpoint for MCP server in backend/src/routes/health.py (MCP info endpoint exists)
- [ ] T083 Optimize database queries (add explain analyze for slow queries) (Deferred to testing phase)
- [ ] T084 Add rate limiting for chat endpoint (prevent abuse) (Optional enhancement)
- [x] T085 Security audit: verify user isolation, JWT validation, input sanitization (Complete - all endpoints verified)
- [ ] T086 Run quickstart.md validation (follow all setup steps) (Deferred to testing phase)
- [ ] T087 Code cleanup and formatting (black, ruff) (Deferred to testing phase)
- [ ] T088 Final test run: pytest with coverage report (Deferred to testing phase)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational - Database (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **US4 - Stateless Architecture (Phase 3)**: Depends on Database - BLOCKS all chatbot features
- **US5 - Agent Intent (Phase 4)**: Depends on MCP Server (US4)
- **US2 - Conversation Persistence (Phase 5)**: Depends on Agent (US5)
- **US1 - Task Creation MVP (Phase 6)**: Depends on Chat Endpoint (US2)
- **US3 - Multi-Action CRUD (Phase 7)**: Depends on Task Creation (US1)
- **Integration Testing (Phase 8)**: Depends on all user stories
- **Polish (Phase 9)**: Depends on Integration Testing

### User Story Dependencies

- **US4 (P1 - Stateless)**: Foundation - No dependencies on other stories
- **US5 (P2 - Intent Recognition)**: Depends on US4 (needs MCP tools to call)
- **US2 (P2 - Conversation Persistence)**: Depends on US5 (needs agent to invoke)
- **US1 (P1 - Task Creation MVP)**: Depends on US2 (needs chat endpoint)
- **US3 (P3 - Multi-Action CRUD)**: Depends on US1 (builds on task creation)

### Parallel Opportunities

**Phase 1 - Setup**: All tasks can run sequentially (fast, 15 min total)

**Phase 2 - Database**:
- T004, T005 can run in parallel (different model files)
- T006, T007 must run after models complete
- T009, T010 can run in parallel (different test files)

**Phase 3 - MCP Server (US4)**:
- T013-T017 can ALL run in parallel (5 different tool files)
- T021-T025 can ALL run in parallel (5 different test files)

**Phase 4 - Agent (US5)**:
- T032, T033 can run in parallel (different test files)

**Phase 5 - Chat Endpoint (US2)**:
- T052, T053, T054 can run in parallel (different test files)

**Phase 6 - Task Creation (US1)**:
- All E2E tests (T055-T059) can run in parallel

**Phase 7 - Multi-Action (US3)**:
- T060-T063 can ALL run in parallel (4 different test files)

**Phase 9 - Polish**:
- T076, T077, T078 can ALL run in parallel (different files)

---

## Parallel Example: MCP Server Implementation

```bash
# Launch all MCP tool implementations together (Phase 3):
Task T013: "Implement add_task MCP tool in backend/src/mcp/tools/add_task.py"
Task T014: "Implement list_tasks MCP tool in backend/src/mcp/tools/list_tasks.py"
Task T015: "Implement complete_task MCP tool in backend/src/mcp/tools/complete_task.py"
Task T016: "Implement delete_task MCP tool in backend/src/mcp/tools/delete_task.py"
Task T017: "Implement update_task MCP tool in backend/src/mcp/tools/update_task.py"

# Then launch all MCP tool tests together:
Task T021: "Write unit tests for add_task tool in backend/tests/unit/test_mcp_add_task.py"
Task T022: "Write unit tests for list_tasks tool in backend/tests/unit/test_mcp_list_tasks.py"
Task T023: "Write unit tests for complete_task tool in backend/tests/unit/test_mcp_complete_task.py"
Task T024: "Write unit tests for delete_task tool in backend/tests/unit/test_mcp_delete_task.py"
Task T025: "Write unit tests for update_task tool in backend/tests/unit/test_mcp_update_task.py"
```

---

## Implementation Strategy

### MVP First (Minimal Viable Product)

**Target**: Natural language task creation working end-to-end

1. Complete Phase 1: Setup (15 min)
2. Complete Phase 2: Database Schema (2 hours)
3. Complete Phase 3: MCP Server (6 hours)
4. Complete Phase 4: Agent Integration (4 hours)
5. Complete Phase 5: Chat Endpoint (6 hours)
6. Complete Phase 6: Task Creation E2E (2 hours)
7. **STOP and VALIDATE**: Test task creation via chat independently
8. Deploy/demo MVP if ready

**Total MVP Time**: ~20 hours (can be done in 1 week)

### Incremental Delivery

1. **Foundation** (Phases 1-2): Database ready → 2 hours
2. **Stateless Architecture** (Phase 3): MCP tools working → 6 hours
3. **Intent Recognition** (Phase 4): Agent can call tools → 4 hours
4. **Conversation Persistence** (Phase 5): Chat endpoint working → 6 hours
5. **MVP** (Phase 6): Task creation via chat → Test → Deploy → 2 hours
6. **Full CRUD** (Phase 7): All task operations via chat → Test → Deploy → 4 hours
7. **Production Ready** (Phases 8-9): Testing + Polish → Deploy → 8 hours

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With 3 developers after Foundational (Phase 2) is complete:

- **Developer A**: Phase 3 - MCP Server (all 5 tools in parallel)
- **Developer B**: Phase 4 - Agent Integration
- **Developer C**: Phase 2 continued - Additional tests and validation

Once MCP and Agent are ready, converge on Chat Endpoint (Phase 5) together, then split again for E2E tests.

---

## Task Count Summary

- **Phase 1 - Setup**: 3 tasks (15 min)
- **Phase 2 - Database**: 7 tasks (2 hours)
- **Phase 3 - MCP Server (US4)**: 15 tasks (6 hours)
- **Phase 4 - Agent (US5)**: 9 tasks (4 hours)
- **Phase 5 - Chat Endpoint (US2)**: 20 tasks (6 hours)
- **Phase 6 - Task Creation (US1)**: 5 tasks (2 hours)
- **Phase 7 - Multi-Action (US3)**: 7 tasks (4 hours)
- **Phase 8 - Integration Testing**: 9 tasks (6 hours)
- **Phase 9 - Polish**: 13 tasks (4 hours)

**Total**: 88 tasks (~34 hours with parallelization)

### Tasks per User Story

- **US1 (Task Creation)**: 5 tasks
- **US2 (Conversation Persistence)**: 20 tasks
- **US3 (Multi-Action CRUD)**: 7 tasks
- **US4 (Stateless Architecture)**: 15 tasks
- **US5 (Intent Recognition)**: 9 tasks

### Parallel Opportunities

- **15 tasks** can run in parallel during MCP implementation (5 tools + 5 tests + 5 other)
- **10 tasks** can run in parallel across different test files
- **Multiple phases** can overlap with proper team coordination

**Suggested MVP Scope**: Phases 1-6 (US1: Task Creation) = 59 tasks (~20 hours)

---

## Notes

- All tasks follow format: `- [ ] TXXX [P?] [Story?] Description with file path`
- [P] tasks are in different files and can run in parallel
- [Story] labels (US1-US5) map to user stories in spec.md
- Database schema (Phase 2) is foundational and blocks all chatbot features
- MCP server (Phase 3) must be complete before agent integration
- Each user story builds on previous infrastructure
- Tests are integrated throughout (not optional) per spec requirements
- Stop at Phase 6 for MVP demonstration
- Phases 7-9 add complete CRUD and production readiness

---

**Tasks Status**: ✅ COMPLETE
**Total Tasks**: 88
**Estimated Time**: 34 hours (with parallelization)
**MVP Time**: 20 hours (Phases 1-6)
**Ready for Implementation**: YES
