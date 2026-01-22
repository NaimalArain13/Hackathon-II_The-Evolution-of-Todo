"""
Message model for chat messages.

This module defines the Message SQLModel and MessageRole enum for Phase 3 chatbot functionality.
Messages belong to a conversation and can be from either the user or the AI assistant.
"""

from datetime import datetime
from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel


class MessageRole(str, Enum):
    """
    Valid message roles.

    Defines who sent a message in a conversation:
    - USER: Message from the user
    - ASSISTANT: Message from the AI assistant
    """

    USER = "user"
    ASSISTANT = "assistant"


class Message(SQLModel, table=True):
    """
    Message model for chat messages.

    Messages belong to a conversation and can be from either the user
    or the AI assistant. Messages are immutable once created and form
    the conversation history.

    Relationships:
    - Belongs to Conversation (via conversation_id foreign key)
    - Belongs to User (via user_id foreign key - denormalized for faster queries)

    Indexes:
    - conversation_id: For retrieving conversation history
    - created_at: For chronological ordering
    - user_id: For user message queries

    Business Rules:
    - Messages are immutable (no updates, only create/read/delete)
    - Content limited to 5000 characters
    - Role must be either 'user' or 'assistant'
    """

    __tablename__ = "messages"

    # Primary Key
    id: Optional[int] = Field(
        default=None,
        primary_key=True,
        description="Unique message identifier",
    )

    # Foreign Keys
    conversation_id: int = Field(
        foreign_key="conversations.id",
        index=True,
        nullable=False,
        description="Conversation this message belongs to",
    )

    user_id: str = Field(
        foreign_key="user.id",
        index=True,
        nullable=False,
        description="User who owns this conversation (denormalized for faster queries)",
    )

    # Message Data
    role: MessageRole = Field(
        nullable=False,
        description="Who sent this message: 'user' or 'assistant'",
    )

    content: str = Field(
        max_length=5000,
        nullable=False,
        description="Message text content",
    )

    # Timestamp
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        nullable=False,
        index=True,
        description="When message was created",
    )

    class Config:
        """Pydantic configuration for JSON serialization"""

        json_encoders = {datetime: lambda v: v.isoformat()}
