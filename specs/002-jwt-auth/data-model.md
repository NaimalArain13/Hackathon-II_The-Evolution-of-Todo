# Data Model: JWT Authentication

**Feature**: 002-jwt-auth
**Created**: 2025-12-10
**Purpose**: Define database schema and data structures for authentication system

## Database Entities

### User Table

**Purpose**: Store registered user accounts with authentication credentials

**Table Name**: `user`

**Schema**:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | VARCHAR(36) | PRIMARY KEY | UUID v4, unique user identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | User's email address (login identifier) |
| `name` | VARCHAR(100) | NOT NULL | User's display name |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hash of password (never plaintext) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp (UTC) |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last profile update timestamp (UTC) |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Account status flag |

**Indexes**:
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email` (for fast login lookups and preventing duplicates)

**Validation Rules**:
- `email`: Must be valid email format (validated by Pydantic EmailStr)
- `name`: 1-100 characters, non-empty after trim
- `password_hash`: Always 60 characters (bcrypt format: `$2b$12$...`)
- `email` and `name`: Cannot be NULL or empty strings

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid

class User(SQLModel, table=True):
    """
    User authentication model.

    Stores user accounts with hashed passwords for secure authentication.
    Email serves as unique login identifier.
    """
    __tablename__ = "user"

    # Identification
    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        description="Unique user identifier (UUID v4)"
    )

    email: str = Field(
        unique=True,
        index=True,
        max_length=255,
        description="User's email address (login identifier)"
    )

    name: str = Field(
        max_length=100,
        description="User's display name"
    )

    # Authentication
    password_hash: str = Field(
        max_length=255,
        description="Bcrypt hashed password (never store plaintext)"
    )

    # Metadata
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Account creation timestamp (UTC)"
    )

    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp (UTC)"
    )

    is_active: bool = Field(
        default=True,
        description="Account active status"
    )
```

**Design Notes**:
- UUID for `id` provides better distribution than auto-increment integers
- Separate `created_at` and `updated_at` for audit trail
- `is_active` flag allows soft deletion (future feature)
- No password field - only `password_hash` to enforce security
- `email` index optimizes login query performance

---

## Domain Models (Python/TypeScript)

### Backend Request/Response Schemas

**Pydantic Models** (backend/schemas/auth.py):

```python
from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
import re

# ===== Request Schemas =====

class UserRegisterRequest(BaseModel):
    """Request body for user registration"""
    email: EmailStr
    name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=128)

    @validator('password')
    def validate_password_strength(cls, v):
        """Enforce password requirements: number + special char"""
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v

    @validator('name')
    def validate_name_not_whitespace(cls, v):
        """Prevent whitespace-only names"""
        if v.strip() == '':
            raise ValueError('Name cannot be empty or whitespace only')
        return v.strip()

    class Config:
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "name": "John Doe",
                "password": "SecurePass123!"
            }
        }


class UserLoginRequest(BaseModel):
    """Request body for user login"""
    email: EmailStr
    password: str

    class Config:
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "SecurePass123!"
            }
        }


class UserProfileUpdateRequest(BaseModel):
    """Request body for profile updates"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)

    @validator('name')
    def validate_name_if_provided(cls, v):
        """Validate name only if provided"""
        if v is not None and v.strip() == '':
            raise ValueError('Name cannot be empty or whitespace only')
        return v.strip() if v else None

    class Config:
        schema_extra = {
            "example": {
                "name": "John Updated"
            }
        }


# ===== Response Schemas =====

class UserResponse(BaseModel):
    """User data in API responses (excludes password_hash)"""
    id: str
    email: str
    name: str
    created_at: datetime
    updated_at: datetime
    is_active: bool

    class Config:
        orm_mode = True  # Enable ORM mode for SQLModel conversion
        schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "email": "user@example.com",
                "name": "John Doe",
                "created_at": "2025-12-10T12:00:00Z",
                "updated_at": "2025-12-10T12:00:00Z",
                "is_active": True
            }
        }


class AuthResponse(BaseModel):
    """Response after successful login/registration"""
    access_token: str = Field(description="JWT access token (7-day expiration)")
    token_type: str = Field(default="bearer", description="Token type (always 'bearer')")
    user: UserResponse

    class Config:
        schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user": {
                    "id": "123e4567-e89b-12d3-a456-426614174000",
                    "email": "user@example.com",
                    "name": "John Doe",
                    "created_at": "2025-12-10T12:00:00Z",
                    "updated_at": "2025-12-10T12:00:00Z",
                    "is_active": True
                }
            }
        }


class ErrorResponse(BaseModel):
    """Standard error response format"""
    detail: str

    class Config:
        schema_extra = {
            "example": {
                "detail": "Invalid email or password"
            }
        }
```

---

### Frontend TypeScript Types

**Type Definitions** (frontend/lib/types.ts):

```typescript
// ===== User Types =====

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;  // ISO 8601 timestamp
  updated_at: string;  // ISO 8601 timestamp
  is_active: boolean;
}

// ===== Authentication Types =====

export interface AuthTokens {
  access_token: string;
  token_type: string;  // Always "bearer"
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ===== Request Types =====

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ProfileUpdateRequest {
  name?: string;
}

// ===== JWT Token Payload (decoded) =====

export interface JWTPayload {
  sub: string;        // User ID
  email: string;      // User email
  iat: number;        // Issued at (Unix timestamp)
  exp: number;        // Expiration (Unix timestamp)
}

// ===== API Error Response =====

export interface APIError {
  detail: string;
}
```

---

## State Transitions

### User Account Lifecycle

```
[Unregistered]
    |
    | POST /api/auth/register
    | (email, name, password)
    ↓
[Registered + Active]
    |
    | is_active = true
    | can login
    ↓
[Authenticated Session]
    |
    | JWT token valid (7 days)
    | can access protected routes
    ↓
[Session Expired / Logged Out]
    |
    | token expired OR
    | POST /api/auth/logout
    ↓
[Unauthenticated]
    |
    | POST /api/auth/login
    | (email, password)
    ↓
[Authenticated Session]
```

### Profile Update Flow

```
[User wants to update profile]
    |
    | PUT /api/auth/profile
    | (name)
    | Authorization: Bearer <token>
    ↓
[Verify JWT token]
    |
    | valid? → continue
    | invalid? → 401 Unauthorized
    ↓
[Update user record]
    |
    | Update name field
    | Set updated_at = NOW()
    ↓
[Return updated user data]
```

---

## Validation Summary

### Email Validation
- Format: RFC 5322 compliant (Pydantic EmailStr)
- Example valid: `user@example.com`, `john.doe+test@company.co.uk`
- Example invalid: `user@`, `@example.com`, `user.example.com`

### Name Validation
- Length: 1-100 characters after trimming
- Cannot be whitespace only
- Trimmed before storage
- Example valid: `John Doe`, `María García`, `李明`
- Example invalid: `""`, `"   "`, (empty string)

### Password Validation
- Length: 8-128 characters
- Must contain: at least 1 number
- Must contain: at least 1 special character `!@#$%^&*(),.?":{}|<>`
- Example valid: `SecurePass123!`, `MyP@ssw0rd`, `Test1234!`
- Example invalid: `short`, `NoNumbers!`, `NoSpecial123`

### Security Rules
- Passwords never stored in plaintext
- Passwords never returned in API responses
- Passwords always hashed with bcrypt (12 rounds)
- Failed login attempts return generic "Invalid email or password"
- No user enumeration through error messages

---

## Database Migration

**Migration Script** (for reference, SQLModel auto-creates):

```sql
-- Create user table
CREATE TABLE user (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create index on email for fast lookups
CREATE INDEX idx_user_email ON user(email);

-- Add trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON user
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Summary

- **1 Database Table**: `user` with 7 columns
- **4 Request Schemas**: Register, Login, Profile Update, (Logout is simple DELETE)
- **3 Response Schemas**: User, Auth (with token), Error
- **Validation**: Email format, password strength, name non-empty
- **Security**: Bcrypt hashing, no plaintext passwords, generic error messages
- **Indexes**: Primary key on `id`, unique index on `email`
- **State Transitions**: Registration → Authentication → Session Management

**Ready for API Contract Generation**
