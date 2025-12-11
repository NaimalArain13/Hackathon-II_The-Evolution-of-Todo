"""
Database connection and session management module.

This module provides:
- SQLModel engine configuration for Neon PostgreSQL
- Database session management with dependency injection
- Automatic table creation on startup
"""

import os
from typing import Generator

from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, create_engine

# Import models to register them with SQLModel metadata
# This ensures tables are created on startup
import models  # noqa: F401

# Load environment variables from .env file
load_dotenv()

# Get DATABASE_URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Validate DATABASE_URL exists
if not DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable is not set. "
        "Please create a .env file with your Neon PostgreSQL connection string. "
        "Format: postgresql://user:password@host:port/database?sslmode=require"
    )

# Validate DATABASE_URL format (basic check)
if not DATABASE_URL.startswith("postgresql://"):
    raise ValueError(
        f"Invalid DATABASE_URL format. Expected postgresql:// URL, got: {DATABASE_URL[:20]}... "
        "Format: postgresql://user:password@host:port/database?sslmode=require"
    )

# Optional: Get database configuration from environment
DB_ECHO = os.getenv("DB_ECHO", "false").lower() == "true"
DB_POOL_SIZE = int(os.getenv("DB_POOL_SIZE", "5"))
DB_MAX_OVERFLOW = int(os.getenv("DB_MAX_OVERFLOW", "10"))

# Create SQLModel engine with connection pool configuration
engine = create_engine(
    DATABASE_URL,
    echo=DB_ECHO,  # Log SQL statements (development only)
    pool_size=DB_POOL_SIZE,  # Base connection pool size
    max_overflow=DB_MAX_OVERFLOW,  # Additional connections beyond pool_size
    pool_pre_ping=True,  # Verify connections before using them
)


def create_db_and_tables():
    """
    Create all database tables defined by SQLModel models.

    This function should be called during application startup.
    It will create tables for all models that inherit from SQLModel
    and have table=True.

    Example:
        @app.on_event("startup")
        def on_startup():
            create_db_and_tables()
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Database session dependency for FastAPI route handlers.

    This function provides a database session with automatic cleanup.
    Use it with FastAPI's Depends() for dependency injection.

    The session is created before the request and automatically closed
    after the request completes, ensuring no resource leaks.

    Example:
        from typing import Annotated
        from fastapi import Depends
        from sqlmodel import Session

        SessionDep = Annotated[Session, Depends(get_session)]

        @app.get("/users")
        def get_users(session: SessionDep):
            users = session.exec(select(User)).all()
            return users

    Yields:
        Session: SQLModel database session

    Note:
        - Session is automatically committed on success
        - Session is automatically rolled back on exception
        - Session is automatically closed after request
    """
    with Session(engine) as session:
        yield session
