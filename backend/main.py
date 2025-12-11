"""
FastAPI application entry point.

This module initializes the FastAPI application with:
- Database connection and table creation
- CORS middleware for frontend integration
- API routes and endpoints
"""

from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

# Import models before db to ensure they're registered
import models  # noqa: F401
from db import create_db_and_tables, get_session

# Import routers
from routes import auth

# Create FastAPI application
app = FastAPI(
    title="Todo API",
    description="RESTful API for Todo application with SQLModel and Neon PostgreSQL",
    version="1.0.0",
)

# Configure CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js development server
        "http://127.0.0.1:3000",  # Alternative localhost
        # Add production frontend URL when deployed
        # "https://your-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Register API routers
app.include_router(auth.router, prefix="/api", tags=["authentication"])

# Type alias for database session dependency
SessionDep = Annotated[Session, Depends(get_session)]


@app.on_event("startup")
def on_startup():
    """
    Application startup event handler.

    Creates all database tables on startup.
    Fails fast if DATABASE_URL is missing or invalid.
    """
    create_db_and_tables()


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
