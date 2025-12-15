# Agent Creation Reference

Create AI agents with custom instructions, tools, and model configurations.

## Basic Agent

```python
from agents import Agent
from agents.extensions.models.litellm_model import LitellmModel

agent = Agent(
    name="My Agent",
    instructions="You are a helpful assistant.",
    model=LitellmModel(
        model="gemini/gemini-2.0-flash",
        api_key="your-api-key",
    ),
)
```

## Agent Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | str | Agent name (required) |
| `instructions` | str | System prompt for the agent |
| `model` | Model | LLM model to use |
| `tools` | list | Function tools available to agent |
| `mcp_servers` | list | MCP servers to connect |
| `handoffs` | list | Agents to hand off to |
| `model_settings` | ModelSettings | Model configuration |
| `handoff_description` | str | Description for handoff tool |

## Agent with All Options

```python
from agents import Agent, ModelSettings, function_tool
from agents.extensions.models.litellm_model import LitellmModel

@function_tool
def my_tool(param: str) -> str:
    """Tool description."""
    return f"Result: {param}"

agent = Agent(
    name="Full Agent",
    instructions="""You are a comprehensive assistant.

Available capabilities:
- Use tools to perform actions
- Hand off to specialists when needed
- Access MCP server resources""",
    model=LitellmModel(
        model="gemini/gemini-2.0-flash",
        api_key="your-api-key",
    ),
    tools=[my_tool],
    mcp_servers=[],  # Add MCP servers here
    handoffs=[],     # Add handoff agents here
    model_settings=ModelSettings(
        include_usage=True,
        tool_choice="auto",
    ),
    handoff_description="A general-purpose assistant",
)
```

## Running Agents

### Basic Run

```python
from agents import Runner

result = await Runner.run(agent, "Hello, how are you?")
print(result.final_output)
```

### Run with Context

```python
result = await Runner.run(
    agent,
    input="Process this request",
    context={"user_id": "user123"},
)
```

### Streamed Run

```python
result = Runner.run_streamed(agent, "Generate a story")

async for event in result.stream_events():
    if event.type == "run_item_stream_event":
        print(event.item, end="", flush=True)

print("\n" + result.final_output)
```

## Model Configuration

### LiteLLM for Gemini

```python
from agents.extensions.models.litellm_model import LitellmModel

# Gemini Flash (fast, efficient)
model = LitellmModel(
    model="gemini/gemini-2.0-flash",
    api_key="your-google-api-key",
)

# Gemini Pro (more capable)
model = LitellmModel(
    model="gemini/gemini-1.5-pro",
    api_key="your-google-api-key",
)
```

### Model Settings

```python
from agents import ModelSettings

settings = ModelSettings(
    include_usage=True,     # Track token usage
    tool_choice="auto",     # auto, required, none
    temperature=0.7,        # Creativity level
    max_tokens=1000,        # Max response length
)

agent = Agent(
    name="Agent",
    model=model,
    model_settings=settings,
)
```

## Conversation Management

### Multi-turn Conversations

```python
from agents import Runner

# First turn
result = await Runner.run(agent, "My name is Alice")

# Continue conversation with history
result = await Runner.run(
    agent,
    "What's my name?",
    context=result.context,  # Pass previous context
)
```

### Access Agent State

```python
result = await Runner.run(agent, "Hello")

# Check which agent responded
print(f"Agent: {result.current_agent.name}")

# Get token usage (if enabled)
if result.context_wrapper.usage:
    print(f"Tokens: {result.context_wrapper.usage.total_tokens}")
```

## Agent Instructions Best Practices

```python
agent = Agent(
    name="Task Assistant",
    instructions="""You are a task management assistant.

## Your Role
Help users create, organize, and complete tasks efficiently.

## Available Tools
- add_task: Create new tasks with title, description, priority
- list_tasks: View tasks filtered by status or priority
- complete_task: Mark tasks as done
- delete_task: Remove tasks

## Guidelines
1. Always confirm actions with the user
2. Summarize changes after performing actions
3. Suggest task organization when appropriate
4. Be concise but helpful

## Response Style
- Use bullet points for lists
- Keep responses focused and actionable
- Ask for clarification if needed""",
    model=model,
)
```

## Error Handling

```python
from agents import Runner

try:
    result = await Runner.run(agent, "Hello")
    print(result.final_output)
except Exception as e:
    print(f"Error: {e}")
    # Handle gracefully
```

## Disable Tracing (for non-OpenAI models)

```python
from agents import set_tracing_disabled

# Disable tracing when not using OpenAI
set_tracing_disabled(disabled=True)

# Now create and run agents without tracing overhead
```
