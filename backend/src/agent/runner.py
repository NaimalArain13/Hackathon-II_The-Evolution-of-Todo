"""
Agent Runner for Todo Chatbot

This module handles:
- Creating the OpenAI Agent with Groq (gpt-oss-20b) via OpenRouter
- Connecting to the MCP server
- Loading conversation history
- Running the agent with user messages
"""

import os
import asyncio
from typing import List, Dict, Any, Optional
from sqlmodel import Session, select

from agents import AsyncOpenAI, OpenAIChatCompletionsModel, Agent, Runner
from agents.mcp import MCPServerStreamableHttp
from agents.run import RunConfig

from .config import (
    get_system_prompt,
    get_agent_config,
    format_conversation_history,
)
from ..models.message import Message


async def create_agent(
    mcp_server_url: Optional[str] = None,
) -> tuple[Agent, MCPServerStreamableHttp, RunConfig]:
    """
    Create the Todo Assistant agent with MCP server connection.

    Args:
        mcp_server_url: Optional MCP server URL (uses env var if not provided)

    Returns:
        Tuple of (Agent instance, MCP server connection, RunConfig)

    Raises:
        ValueError: If OPENROUTER_API_KEY is not set
    """
    # Get configuration
    config = get_agent_config()
    server_url = mcp_server_url or config["mcp_server_url"]

    # Verify API key
    api_key = os.getenv("OPENROUTER_API_KEY")
    print(f"OpenRouter API key configured: {bool(api_key)}")
    if not api_key:
        raise ValueError(
            "OPENROUTER_API_KEY environment variable is required for OpenRouter integration"
        )

    # Get model from config (defaults to openai/gpt-oss-20b)
    model_name = config["model"]
    print(f"Using model: {model_name}")

    # Setup OpenRouter client
    external_provider = AsyncOpenAI(
        api_key=api_key,
        base_url="https://openrouter.ai/api/v1",
        default_headers={
            "HTTP-Referer": os.getenv("OPENROUTER_APP_URL", "http://localhost:8000"),
            "X-Title": os.getenv("OPENROUTER_APP_NAME", "Todo Hackathon App"),
        }
    )

    # Create model
    model = OpenAIChatCompletionsModel(
        openai_client=external_provider,
        model=model_name,
    )

    # Create run configuration
    run_config = RunConfig(
        model=model,
        model_provider=external_provider,
        tracing_disabled=True
    )

    # Create MCP server connection
    mcp_server = MCPServerStreamableHttp(
        name="Todo MCP Server",
        params={
            "url": server_url,
            "timeout": config["mcp_timeout_seconds"],
        },
        cache_tools_list=True,  # Cache for performance
    )

    # Initialize MCP connection
    await mcp_server.__aenter__()

    # Create agent (model specified in run_config)
    agent = Agent(
        name="Todo Assistant",
        instructions=get_system_prompt(),
        mcp_servers=[mcp_server],
    )

    return agent, mcp_server, run_config


async def run_agent(
    user_id: str,
    message: str,
    conversation_history: Optional[List[Message]] = None,
    session: Optional[Session] = None,
) -> str:
    """
    Run the agent with a user message and conversation context.

    Args:
        user_id: The user's ID (passed to MCP tools)
        message: The user's message
        conversation_history: Optional list of previous messages for context
        session: Optional database session for loading history

    Returns:
        Agent's response text

    Example:
        response = await run_agent(
            user_id="user123",
            message="Add a task to buy groceries",
            conversation_history=messages
        )
    """
    agent = None
    mcp_server = None
    run_config = None

    try:
        # Create agent, MCP connection, and config
        agent, mcp_server, run_config = await create_agent()

        # Format conversation history
        history = []
        if conversation_history:
            history = format_conversation_history(conversation_history)

        # Include user_id in the message so agent knows which user to operate on
        # The agent will extract the user_id and pass it to all MCP tool calls
        full_message = f"[User ID: {user_id}]\n{message}"

        # Run the agent with config
        result = await Runner.run(
            agent,
            full_message,
            run_config=run_config,  # Pass config for Gemini integration
        )

        return result.final_output

    finally:
        # Cleanup MCP connection
        if mcp_server:
            try:
                await mcp_server.__aexit__(None, None, None)
            except Exception as e:
                print(f"Error closing MCP server: {e}")


async def run_agent_streamed(
    user_id: str,
    message: str,
    conversation_history: Optional[List[Message]] = None,
):
    """
    Run the agent with streaming responses.

    Args:
        user_id: The user's ID
        message: The user's message
        conversation_history: Optional conversation history

    Yields:
        Agent response chunks as they are generated

    Example:
        async for chunk in run_agent_streamed(user_id, message, history):
            print(chunk, end="", flush=True)
    """
    agent = None
    mcp_server = None
    run_config = None

    try:
        # Create agent, MCP connection, and config
        agent, mcp_server, run_config = await create_agent()

        # Format conversation history
        history = []
        if conversation_history:
            history = format_conversation_history(conversation_history)

        # Prepare message with user_id context
        full_message = f"[User ID: {user_id}]\n{message}"

        # Run agent with streaming and config
        result = Runner.run_streamed(
            agent,
            full_message,
            config=run_config,  # Pass config for Gemini integration
            context_variables={"user_id": user_id},
        )

        # Stream events
        async for event in result.stream_events():
            if event.type == "run_item_stream_event":
                yield event.item

        # Yield final output if needed
        if result.final_output:
            yield result.final_output

    finally:
        # Cleanup
        if mcp_server:
            try:
                await mcp_server.__aexit__(None, None, None)
            except Exception:
                pass


def load_conversation_history(
    conversation_id: int,
    session: Session,
    limit: int = 50,
) -> List[Message]:
    """
    Load recent conversation history from database.

    Args:
        conversation_id: The conversation ID
        session: Database session
        limit: Maximum number of messages to load (default: 50)

    Returns:
        List of Message objects ordered by created_at (oldest first)

    Example:
        messages = load_conversation_history(
            conversation_id=123,
            session=db_session,
            limit=50
        )
    """
    # Query messages for this conversation, ordered by creation time
    statement = (
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc())
        .limit(limit)
    )

    messages = session.exec(statement).all()

    # Reverse to get chronological order (oldest first)
    return list(reversed(messages))


# Synchronous wrapper for testing/CLI usage
def run_agent_sync(user_id: str, message: str) -> str:
    """
    Synchronous wrapper for run_agent (for testing/CLI).

    Args:
        user_id: User's ID
        message: User's message

    Returns:
        Agent's response
    """
    return asyncio.run(run_agent(user_id, message))
