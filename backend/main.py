"""
FastAPI application entry point.

This module initializes the FastAPI application with:
- Database connection and table creation
- CORS middleware for frontend integration
- API routes and endpoints
"""

import contextlib
import os
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session
from starlette.routing import Mount

# Import models before db to ensure they're registered
import models  # noqa: F401
from db import create_db_and_tables, get_session

# Import routers
from routes import auth, tasks, chat

# Configure MCP server path (before creating FastAPI app)
# Import MCP server first to configure it
from src.mcp import mcp

# Note: Default streamable_http_path is "/mcp", so when mounted at "/api/mcp",
# the endpoint will be at "/api/mcp/mcp"

# Create FastAPI application with lifespan context manager
@contextlib.asynccontextmanager
async def lifespan(app: FastAPI):
    """
    FastAPI lifespan context manager.
    
    Handles:
    - Database table creation
    - MCP session manager initialization
    """
    # Startup: Create database tables
    create_db_and_tables()
    
    # Initialize MCP session manager
    async with mcp.session_manager.run():
        yield
    # Shutdown: Cleanup happens automatically

app = FastAPI(
    title="Todo API",
    description="RESTful API for Todo application with SQLModel and Neon PostgreSQL",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS for frontend integration
# For Hugging Face Spaces, allow all origins by default
# You can restrict this in production by setting ALLOW_ALL_ORIGINS=false
allow_all_origins = os.getenv("ALLOW_ALL_ORIGINS", "true").lower() == "true"

if allow_all_origins:
    cors_origins = ["*"]
else:
    # Specific origins (comma-separated in ALLOWED_ORIGINS env var)
    allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "")
    cors_origins = [
        origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()
    ]
    # Default to localhost if none specified
    if not cors_origins:
        cors_origins = [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Register API routers
app.include_router(auth.router, prefix="/api", tags=["authentication"])
app.include_router(tasks.router, prefix="/api", tags=["tasks"])
app.include_router(chat.router, prefix="/api", tags=["chat"])

# Mount MCP server at /api/mcp
# The MCP endpoint will be available at: http://localhost:8000/api/mcp/mcp
# Note: Default path is "/mcp", so mounting at "/api/mcp" creates endpoint at "/api/mcp/mcp"
# Note: streamable_http_app() creates an ASGI app that can be mounted in FastAPI
# Note: MCP endpoints use JSON-RPC protocol, so browser GET requests may not work properly
app.mount("/api/mcp", mcp.streamable_http_app())

# Type alias for database session dependency
SessionDep = Annotated[Session, Depends(get_session)]


@app.get("/api/mcp/info")
def mcp_info():
    """
    Information endpoint about the MCP server.
    
    Note: The actual MCP endpoint at /api/mcp/mcp uses JSON-RPC protocol
    and requires proper MCP client requests, not simple browser GET requests.
    
    Returns:
        dict: MCP server information and available tools
    """
    try:
        tools = list(mcp._tool_manager._tools.keys())
        return {
            "mcp_server": "Todo Task Manager",
            "endpoint": "http://localhost:8000/api/mcp/mcp",
            "protocol": "JSON-RPC (MCP)",
            "transport": "streamable-http",
            "available_tools": tools,
            "tool_count": len(tools),
            "note": "MCP endpoints require JSON-RPC protocol requests. Use an MCP client or test with proper JSON-RPC POST requests.",
        }
    except Exception as e:
        return {
            "error": "Failed to get MCP info",
            "message": str(e),
        }


@app.get("/")
def read_root():
    """
    Root endpoint - health check.

    Returns:
        dict: API status and version information
    """
    return {
        "message": "Todo API is running",
        "version": "1.0.0",
        "status": "healthy",
    }


@app.get("/health")
def health_check(session: SessionDep):
    """
    Health check endpoint with database connectivity test.

    Args:
        session: Database session (injected)

    Returns:
        dict: Health status including database connectivity
    """
    try:
        # Simple database query to verify connectivity
        session.exec("SELECT 1")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy",
        "database": db_status,
        "version": "1.0.0",
    }


# Test endpoints for User model validation (will be removed in Phase 6: Polish)


@app.post("/test/users")
def create_test_user(email: str, name: str, session: SessionDep):
    """
    Test endpoint to verify User model creation.

    This endpoint will be removed after validation (Task T049).

    Args:
        email: User's email address
        name: User's display name
        session: Database session (injected)

    Returns:
        dict: Created user data
    """
    from models import User

    user = User(email=email, name=name)
    session.add(user)
    session.commit()
    session.refresh(user)

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "created_at": user.created_at.isoformat(),
    }


@app.get("/test/users/{email}")
def get_test_user(email: str, session: SessionDep):
    """
    Test endpoint to verify User model query.

    This endpoint will be removed after validation (Task T049).

    Args:
        email: User's email address to search for
        session: Database session (injected)

    Returns:
        dict: User data if found, error otherwise
    """
    from sqlmodel import select

    from models import User

    statement = select(User).where(User.email == email)
    user = session.exec(statement).first()

    if not user:
        return {"error": "User not found"}

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "created_at": user.created_at.isoformat(),
    }
