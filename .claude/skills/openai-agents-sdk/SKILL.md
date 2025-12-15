---
name: openai-agents-sdk
description: Build AI agents using OpenAI Agents SDK with MCP server integration. Supports Gemini via LiteLLM for non-OpenAI models. Covers agent creation, function tools, handoffs, MCP server connections, and conversation management.
---

# OpenAI Agents SDK Skill

Build AI agents using OpenAI Agents SDK with support for Gemini and other LLMs via LiteLLM.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        OpenAI Agents SDK                                │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                         Agent                                     │   │
│  │  model: LitellmModel("gemini/gemini-2.0-flash")                  │   │
│  │  tools: [function_tool, ...]                                      │   │
│  │  mcp_servers: [MCPServerStreamableHttp(...)]                      │   │
│  │  handoffs: [specialized_agent, ...]                               │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              │ MCP Protocol
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    MCP Server (FastMCP)                                 │
│              @mcp.tool() for task operations                            │
└─────────────────────────────────────────────────────────────────────────┘
```

## Quick Start

### Installation

```bash
# With LiteLLM support for non-OpenAI models
pip install "openai-agents[litellm]"

# Or with uv
uv add "openai-agents[litellm]"
```

### Environment Variables

```env
# For Gemini
GOOGLE_API_KEY=your-gemini-api-key

# For OpenAI (optional, for tracing)
OPENAI_API_KEY=your-openai-api-key
```

## Using Gemini via LiteLLM

The SDK supports Gemini and other non-OpenAI models through LiteLLM.

```python
import os
from agents import Agent, Runner
from agents.extensions.models.litellm_model import LitellmModel

# Create agent with Gemini
agent = Agent(
    name="Todo Assistant",
    instructions="You are a helpful task management assistant.",
    model=LitellmModel(
        model="gemini/gemini-2.0-flash",
        api_key=os.getenv("GOOGLE_API_KEY"),
    ),
)

# Run the agent
result = await Runner.run(agent, "Help me organize my tasks")
print(result.final_output)
```

## Reference

| Pattern | Guide |
|---------|-------|
| **Agent Creation** | [reference/agents.md](reference/agents.md) |
| **Function Tools** | [reference/function-tools.md](reference/function-tools.md) |
| **MCP Integration** | [reference/mcp-integration.md](reference/mcp-integration.md) |
| **Handoffs** | [reference/handoffs.md](reference/handoffs.md) |

## Examples

| Example | Description |
|---------|-------------|
| [examples/todo-agent.md](examples/todo-agent.md) | Complete todo agent with MCP tools |
| [examples/gemini-agent.md](examples/gemini-agent.md) | Agent using Gemini via LiteLLM |

## Templates

| Template | Purpose |
|----------|---------|
| [templates/agent_gemini.py](templates/agent_gemini.py) | Basic Gemini agent template |
| [templates/agent_mcp.py](templates/agent_mcp.py) | Agent with MCP server integration |

## Basic Agent with Function Tools

```python
import asyncio
from agents import Agent, Runner, function_tool
from agents.extensions.models.litellm_model import LitellmModel

@function_tool
def get_weather(city: str) -> str:
    """Get the weather for a city."""
    return f"The weather in {city} is sunny."

async def main():
    agent = Agent(
        name="Assistant",
        instructions="You are a helpful assistant.",
        model=LitellmModel(
            model="gemini/gemini-2.0-flash",
            api_key="your-api-key",
        ),
        tools=[get_weather],
    )

    result = await Runner.run(agent, "What's the weather in Tokyo?")
    print(result.final_output)

asyncio.run(main())
```

## Agent with MCP Server

Connect your agent to an MCP server to access tools, resources, and prompts.

```python
import asyncio
import os
from agents import Agent, Runner
from agents.mcp import MCPServerStreamableHttp
from agents.extensions.models.litellm_model import LitellmModel

async def main():
    async with MCPServerStreamableHttp(
        name="Todo MCP Server",
        params={
            "url": "http://localhost:8000/api/mcp",
            "timeout": 30,
        },
        cache_tools_list=True,
    ) as mcp_server:
        agent = Agent(
            name="Todo Assistant",
            instructions="""You are a task management assistant.
Use the MCP tools to help users manage their tasks:
- add_task: Create new tasks
- list_tasks: View existing tasks
- complete_task: Mark tasks as done
- delete_task: Remove tasks
- update_task: Modify tasks""",
            model=LitellmModel(
                model="gemini/gemini-2.0-flash",
                api_key=os.getenv("GOOGLE_API_KEY"),
            ),
            mcp_servers=[mcp_server],
        )

        result = await Runner.run(
            agent,
            "Show me my pending tasks",
        )
        print(result.final_output)

asyncio.run(main())
```

## Agent Handoffs

Create specialized agents that hand off conversations.

```python
from agents import Agent, handoff
from agents.extensions.models.litellm_model import LitellmModel
from agents.extensions.handoff_prompt import prompt_with_handoff_instructions

# Specialized agents
task_agent = Agent(
    name="Task Agent",
    instructions=prompt_with_handoff_instructions(
        "You specialize in task management. Help users create, update, and complete tasks."
    ),
    model=LitellmModel(model="gemini/gemini-2.0-flash", api_key="..."),
)

help_agent = Agent(
    name="Help Agent",
    instructions=prompt_with_handoff_instructions(
        "You provide help and instructions about using the todo app."
    ),
    model=LitellmModel(model="gemini/gemini-2.0-flash", api_key="..."),
)

# Triage agent
triage_agent = Agent(
    name="Triage Agent",
    instructions=prompt_with_handoff_instructions(
        """Route users to the appropriate agent:
- Task Agent: for creating, viewing, or managing tasks
- Help Agent: for questions about how to use the app"""
    ),
    model=LitellmModel(model="gemini/gemini-2.0-flash", api_key="..."),
    handoffs=[task_agent, help_agent],
)
```

## Streaming Responses

```python
from agents import Runner

result = Runner.run_streamed(agent, "List my tasks")

async for event in result.stream_events():
    if event.type == "run_item_stream_event":
        print(event.item, end="", flush=True)

print(result.final_output)
```

## Model Settings

```python
from agents import Agent, ModelSettings
from agents.extensions.models.litellm_model import LitellmModel

agent = Agent(
    name="Assistant",
    model=LitellmModel(model="gemini/gemini-2.0-flash", api_key="..."),
    model_settings=ModelSettings(
        include_usage=True,  # Track token usage
        tool_choice="auto",  # or "required", "none"
    ),
)

result = await Runner.run(agent, "Hello!")
print(f"Tokens used: {result.context_wrapper.usage.total_tokens}")
```

## Tracing with Non-OpenAI Models

Use OpenAI tracing with Gemini (requires OpenAI API key):

```python
import os
from agents import set_tracing_export_api_key, Agent
from agents.extensions.models.litellm_model import LitellmModel

# Enable tracing (optional)
set_tracing_export_api_key(os.environ["OPENAI_API_KEY"])

# Or disable tracing
from agents import set_tracing_disabled
set_tracing_disabled(disabled=True)
```

## LiteLLM Model Formats

| Provider | Model Format |
|----------|--------------|
| **Gemini** | `gemini/gemini-2.0-flash`, `gemini/gemini-1.5-pro` |
| **Anthropic** | `anthropic/claude-3-5-sonnet-20240620` |
| **OpenAI** | `gpt-4`, `gpt-4o-mini` |
| **Ollama** | `ollama/llama2`, `ollama/mistral` |

## MCP Connection Types

| Type | Use Case | Class |
|------|----------|-------|
| **Streamable HTTP** | Production, low-latency | `MCPServerStreamableHttp` |
| **SSE** | Web clients, real-time | `MCPServerSse` |
| **Stdio** | Local processes | `MCPServerStdio` |
| **Hosted** | OpenAI-hosted MCP | `HostedMCPTool` |

## Error Handling

```python
from agents import Runner, AgentError

try:
    result = await Runner.run(agent, "Hello")
    print(result.final_output)
except AgentError as e:
    print(f"Agent error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
```

## Best Practices

1. **Use LiteLLM** for non-OpenAI models (Gemini, Claude, etc.)
2. **Cache MCP tools** with `cache_tools_list=True` for performance
3. **Use handoffs** for specialized functionality
4. **Enable usage tracking** to monitor costs
5. **Disable tracing** in production if not using OpenAI
6. **Handle errors gracefully** with try/except
7. **Use streaming** for better user experience

## Troubleshooting

### LiteLLM not found
```bash
pip install "openai-agents[litellm]"
```

### MCP connection fails
- Check MCP server is running
- Verify URL is correct
- Check timeout settings

### Gemini API errors
- Verify GOOGLE_API_KEY is set
- Check model name format: `gemini/gemini-2.0-flash`
- Ensure API quota is not exceeded
