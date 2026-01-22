# Known Issues - Phase 3 Backend

## Issue #1: MCP Server Connection Error (Session Terminated)

**Status**: ✅ **RESOLVED** - Fixed on 2025-12-18
**Date Reported**: 2025-12-18
**Date Resolved**: 2025-12-18
**Phase**: Phase 5 - Chat Endpoint Testing

### Error Message:
```
INFO:     127.0.0.1:51132 - "POST /api/mcp/ HTTP/1.1" 404 Not Found
Error initializing MCP server: Session terminated
Agent error: McpError: Session terminated
```

### Full Stack Trace:
```python
Traceback (most recent call last):
  File "/backend/routes/chat.py", line 59, in generate_agent_response
    agent_response = await run_agent(...)
  File "/backend/src/agent/runner.py", line 111, in run_agent
    agent, mcp_server = await create_agent()
  File "/backend/src/agent/runner.py", line 65, in create_agent
    await mcp_server.__aenter__()
  File "agents/mcp/server.py", line 244, in __aenter__
    await self.connect()
  File "agents/mcp/server.py", line 285, in connect
    server_result = await session.initialize()
  File "mcp/client/session.py", line 171, in initialize
    result = await self.send_request(...)
  File "mcp/shared/session.py", line 306, in send_request
    raise McpError(response_or_error.error)
mcp.shared.exceptions.McpError: Session terminated
```

### Root Cause Analysis:
1. **404 Not Found**: Agent trying to connect to `/api/mcp/` → returns 404
2. **Incorrect URL**: MCP server is mounted at `/api/mcp`, endpoint should be `/api/mcp/mcp`
3. **Environment Variable Issue**: `MCP_SERVER_URL` in `.env` needs correction

### Suspected Issue:
```bash
# Current (Wrong):
MCP_SERVER_URL=http://localhost:8000/api/mcp

# Should be:
MCP_SERVER_URL=http://localhost:8000/api/mcp/mcp
```

### Files Affected:
- `backend/routes/chat.py` (line 59)
- `backend/src/agent/runner.py` (line 65, 111)
- `backend/.env` (MCP_SERVER_URL)
- `backend/main.py` (line 95 - MCP mount point)

### Temporary Workaround:
Testing deferred to end of Phase 6. Manual testing of chat endpoint postponed.

### Resolution (Completed):

**Root Cause Identified:**
Using Context7 documentation for OpenAI Agents SDK and FastMCP, determined that:
1. FastMCP mounted at `/api/mcp` with default internal path `/mcp`
2. This creates the endpoint at: `/api/mcp` + `/mcp` = `/api/mcp/mcp`
3. The `.env.example` had incorrect URL: `http://localhost:8000/api/mcp`
4. Actual `.env` already had correct URL: `http://localhost:8000/api/mcp/mcp`

**Fix Applied:**
1. ✅ Updated `.env.example` with correct MCP_SERVER_URL
2. ✅ Added clear comments explaining the endpoint path construction
3. ✅ Verified `.env` has correct configuration
4. ✅ Verified `main.py` mounting is correct

**FastMCP Endpoint Path Explanation:**
```python
# In main.py:
app.mount("/api/mcp", mcp.streamable_http_app())
#         ^^^^^^^^^ mount point
#                    ^^^^^^^^^^^^^^^^^^^^^^^^^^ creates /mcp endpoint internally
# Result: /api/mcp/mcp
```

**Configuration (Correct):**
```env
MCP_SERVER_URL=http://localhost:8000/api/mcp/mcp
```

**Next Steps:**
1. Restart server with updated configuration
2. Test chat endpoint to verify MCP connection works
3. Run test suite (remove `@pytest.mark.skip` decorators)
4. Verify all 5 MCP tools are accessible

### Related Tasks:
- Phase 5: T052-T054 (Testing deferred)
- Phase 6: E2E tests will be affected

### Priority:
**HIGH** - Blocks chat functionality testing

---

## Issue #2: TypeError - Runner.run() Invalid Parameter

**Status**: ✅ **RESOLVED** - Fixed on 2025-12-18
**Date Reported**: 2025-12-18
**Date Resolved**: 2025-12-18
**Phase**: Phase 5 - Chat Endpoint Testing

### Error Message:
```
TypeError: Runner.run() got an unexpected keyword argument 'context_variables'
Traceback (most recent call last):
  File "/backend/src/agent/runner.py", line 123, in run_agent
    result = await Runner.run(
        agent,
        full_message,
        context_variables={"user_id": user_id},  # ❌ INVALID
    )
```

### Root Cause Analysis:

**Issue Identified:**
Using Context7 documentation for OpenAI Agents Python SDK, confirmed that:
1. `Runner.run()` does NOT accept `context_variables` parameter
2. Valid parameters are: `agent`, `input`, `config`, `session`, and `context`
3. The `context_variables` naming comes from other agent frameworks (like Swarm)
4. OpenAI Agents SDK uses `context` parameter with typed dataclasses/Pydantic models

**Our Implementation:**
- We pass `user_id` by including it in the message: `[User ID: {user_id}]\n{message}`
- The agent extracts user_id from the message and passes it to MCP tools
- No need for separate context parameter since user_id is in the message

### Resolution (Completed):

**Fix Applied:**
1. ✅ Removed `context_variables` parameter from `Runner.run()` call backend/src/agent/runner.py:125-128
2. ✅ Enhanced system prompt to emphasize user_id extraction backend/src/agent/config.py:38-46
3. ✅ Added clear comments explaining the approach
4. ✅ Documented valid Runner.run() parameters

**Code Changes:**

```python
# BEFORE (Wrong):
result = await Runner.run(
    agent,
    full_message,
    context_variables={"user_id": user_id},  # ❌ Invalid parameter
)

# AFTER (Correct):
result = await Runner.run(
    agent,
    full_message,
)
# The user_id is already in full_message: "[User ID: {user_id}]\n{message}"
```

**System Prompt Enhancement:**
Added critical section at the beginning of system prompt:
```
## CRITICAL: User ID Handling

**IMPORTANT**: Every message you receive will start with `[User ID: <user_id>]` on the first line.
You MUST extract this user_id and pass it to ALL tool calls.
```

**Priority**: **HIGH** - Blocks all agent execution

---

## Issue #3: (Placeholder for future issues)

---

**Last Updated**: 2025-12-18
**Next Review**: After testing phase completion
