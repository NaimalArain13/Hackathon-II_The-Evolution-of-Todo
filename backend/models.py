"""
SQLModel database models.

This module defines database models using SQLModel (SQLAlchemy + Pydantic).
All models with table=True are automatically registered and created on startup.
"""

import uuid
from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    """
    User authentication model.

    Stores user accounts with hashed passwords for secure authentication.
    Email serves as unique login identifier.

    Security Features:
    - UUID primary key (better distribution than auto-increment)
    - Email unique constraint and index (fast login lookups)
    - Password hash storage only (never plaintext)
    - Timestamps for audit trail
    - Account status flag for soft deletion

    Attributes:
        id: UUID v4, unique user identifier
        email: User's email address (login identifier)
        name: User's display name
        password_hash: Bcrypt hashed password (60 chars, never plaintext)
        created_at: Account creation timestamp (UTC)
        updated_at: Last profile update timestamp (UTC)
        is_active: Account status flag (for soft deletion)
    """

    # Identification
    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        description="Unique user identifier (UUID v4)",
    )

    email: str = Field(
        unique=True,
        index=True,
        max_length=255,
        description="User's email address (login identifier)",
    )

    name: str = Field(
        max_length=100, description="User's display name"
    )

    # Authentication
    password_hash: str = Field(
        max_length=255,
        description="Bcrypt hashed password (never store plaintext)",
    )

    # Metadata
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Account creation timestamp (UTC)",
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp (UTC)",
    )

    is_active: bool = Field(
        default=True, description="Account active status"
    )

    class Config:
        """Pydantic configuration for JSON serialization"""

        json_encoders = {datetime: lambda v: v.isoformat()}
