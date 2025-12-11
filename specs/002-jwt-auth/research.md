# Research: JWT Authentication Implementation

**Feature**: 002-jwt-auth
**Created**: 2025-12-10
**Purpose**: Research technical implementation details for JWT-based authentication system

## Research Areas

### 1. JWT Token Generation & Validation

**Decision**: Use PyJWT library for backend, verify tokens with shared secret

**Rationale**:
- PyJWT is industry-standard Python library for JWT operations
- Well-maintained, secure, and actively developed
- Simple API for encoding/decoding tokens with shared secrets
- Supports HS256 algorithm (HMAC with SHA-256) for symmetric signing
- Handles expiration validation automatically

**Implementation Approach**:
- Backend generates JWT tokens on successful login/registration
- Token payload includes: `sub` (user ID), `email`, `iat` (issued at), `exp` (expiration)
- 7-day expiration from issuance (604800 seconds)
- Frontend stores token and includes in `Authorization: Bearer <token>` header
- Backend middleware validates token on protected routes

**Alternatives Considered**:
- `python-jose`: More feature-rich but heavier, includes unnecessary features
- `authlib`: Comprehensive but overly complex for simple JWT needs
- **Rejected because**: PyJWT provides exactly what's needed without extra complexity

**Code Pattern**:
```python
import jwt
from datetime import datetime, timedelta

# Generate token
def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

# Validate token
def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
```

---

### 2. Password Hashing Strategy

**Decision**: Use bcrypt via passlib library

**Rationale**:
- Bcrypt is specifically designed for password hashing (slow by design)
- Resistant to brute-force attacks due to configurable work factor
- passlib provides clean abstraction over bcrypt with sensible defaults
- Industry standard for password storage (OWASP recommended)
- Automatic salt generation and verification

**Implementation Approach**:
- Hash passwords with bcrypt on registration
- Store only hashed passwords in database (never plaintext)
- Verify passwords by comparing hash on login
- Use default rounds (12) for good security/performance balance

**Alternatives Considered**:
- argon2: More modern, winner of Password Hashing Competition
  - **Rejected because**: Requires native extensions, harder to deploy
- scrypt: Also secure but less widely adopted
  - **Rejected because**: Bcrypt is more battle-tested and simpler
- PBKDF2: Weaker than bcrypt against GPU attacks
  - **Rejected because**: Bcrypt is more secure

**Code Pattern**:
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Hash password
def hash_password(password: str) -> str:
    return pwd_context.hash(password)

# Verify password
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

---

### 3. Better Auth Integration Strategy

**Decision**: Use Better Auth SDK for frontend session management, custom backend for token generation

**Rationale**:
- Better Auth provides React hooks and session management out of the box
- Simplifies frontend auth state management
- Handles token storage (localStorage/cookies) automatically
- Backend maintains full control over JWT generation and validation
- Allows custom logic while benefiting from frontend conveniences

**Implementation Approach**:
- Backend: Custom FastAPI routes for `/api/auth/register`, `/api/auth/login`
- Backend: Generate JWT tokens with PyJWT
- Frontend: Better Auth React SDK for session state (`useUser()` hook)
- Frontend: Custom API calls to backend endpoints
- Shared secret between frontend and backend for token signing

**Alternatives Considered**:
- Full Better Auth integration (frontend + backend)
  - **Rejected because**: Reduces control over backend logic, adds unnecessary dependency
- No Better Auth (custom solution)
  - **Rejected because**: Reinvents wheel for frontend session management
- NextAuth.js
  - **Rejected because**: Spec explicitly mentions Better Auth, NextAuth is different framework

**Integration Points**:
```typescript
// Frontend: Better Auth config
import { betterAuth } from 'better-auth/react';

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
  apiURL: process.env.NEXT_PUBLIC_API_URL,
});

// Use in components
const { user, signIn, signOut } = useUser();
```

---

### 4. Token Storage Location (Frontend)

**Decision**: Use localStorage as primary storage with httpOnly cookie fallback consideration

**Rationale**:
- localStorage is simplest to implement for MVP
- Works across all modern browsers without CORS complexity
- Better Auth SDK handles storage automatically
- Easy to access for API requests
- Acceptable security for personal productivity app with 7-day expiration

**Trade-offs**:
- **Security**: Vulnerable to XSS attacks (mitigated by proper input sanitization)
- **Convenience**: Persists across browser tabs and sessions
- **Simplicity**: No CORS configuration needed for development

**Future Enhancement Path**:
- Phase III: Consider httpOnly cookies for production deployment
- Requires CORS configuration and SameSite settings
- Backend sets cookie, frontend automatically includes in requests
- More secure but adds deployment complexity

**Alternatives Considered**:
- httpOnly cookies: More secure but requires CORS setup
  - **Deferred to Phase III**: Added complexity not justified for MVP
- sessionStorage: Lost on tab close, poor UX
  - **Rejected because**: Breaks multi-tab usage, users must re-login frequently
- Memory only: Lost on page refresh
  - **Rejected because**: Terrible UX, users must re-login constantly

---

### 5. User Model Schema

**Decision**: Extend existing SQLModel User with authentication fields

**Rationale**:
- Leverage existing User model from feature 001
- SQLModel provides clean Pydantic + SQLAlchemy integration
- Database already configured with Neon PostgreSQL
- Maintains data integrity with type validation

**Schema Design**:
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid

class User(SQLModel, table=True):
    # Primary key and identification
    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True
    )
    email: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(max_length=100)

    # Authentication
    password_hash: str = Field(max_length=255)

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)
```

**Design Decisions**:
- UUID for user ID (better than auto-increment for distributed systems)
- Email as unique identifier for login
- Separate password_hash field (never store plaintext)
- Timestamps for auditing
- is_active flag for future account deactivation

---

### 6. API Endpoint Design

**Decision**: RESTful endpoints under `/api/auth/` prefix

**Rationale**:
- Follows REST conventions
- Clear separation from other API routes
- Consistent with existing backend structure
- Easy to add API versioning later (`/api/v1/auth/`)

**Endpoints**:

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| POST | `/api/auth/register` | Create new user account | No |
| POST | `/api/auth/login` | Authenticate and get token | No |
| POST | `/api/auth/logout` | Invalidate token (client-side) | Yes |
| GET | `/api/auth/profile` | Get current user profile | Yes |
| PUT | `/api/auth/profile` | Update user profile | Yes |

**Request/Response Patterns**:
```python
# Register
Request: {"email": "user@example.com", "name": "John", "password": "SecurePass123!"}
Response: {"access_token": "eyJ...", "user": {"id": "...", "email": "...", "name": "..."}}

# Login
Request: {"email": "user@example.com", "password": "SecurePass123!"}
Response: {"access_token": "eyJ...", "user": {"id": "...", "email": "...", "name": "..."}}

# Get Profile
Request: Headers: {"Authorization": "Bearer eyJ..."}
Response: {"id": "...", "email": "...", "name": "...", "created_at": "..."}

# Update Profile
Request: {"name": "John Updated"}
Headers: {"Authorization": "Bearer eyJ..."}
Response: {"id": "...", "email": "...", "name": "John Updated", ...}
```

---

### 7. Input Validation Strategy

**Decision**: Use Pydantic models for request validation

**Rationale**:
- Pydantic is native to FastAPI (automatic validation)
- Strong type checking
- Custom validators for complex rules
- Automatic error responses for invalid data

**Validation Rules**:
```python
from pydantic import BaseModel, EmailStr, Field, validator
import re

class UserRegister(BaseModel):
    email: EmailStr  # Automatic email format validation
    name: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=8, max_length=128)

    @validator('password')
    def password_strength(cls, v):
        if not re.search(r'\d', v):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', v):
            raise ValueError('Password must contain at least one special character')
        return v

    @validator('name')
    def name_not_whitespace(cls, v):
        if v.strip() == '':
            raise ValueError('Name cannot be empty or whitespace')
        return v.strip()
```

---

### 8. Error Handling & User Enumeration Prevention

**Decision**: Generic error messages for authentication failures

**Rationale**:
- Prevents attackers from determining if email exists
- OWASP security best practice
- Protects user privacy

**Error Response Pattern**:
```python
# DON'T: Reveals whether email exists
"Email not found" or "Incorrect password"

# DO: Generic message
"Invalid email or password"

# Implementation
@router.post("/login")
async def login(credentials: LoginRequest):
    user = get_user_by_email(credentials.email)
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"  # Same message for both cases
        )
```

**Timing Attack Prevention**:
- Always hash password even if user doesn't exist (constant time)
- Prevents timing-based user enumeration

---

### 9. Testing Strategy

**Decision**: Pytest with TestClient for backend, React Testing Library for frontend

**Backend Testing**:
- Unit tests for password hashing, JWT generation/validation
- Integration tests for auth endpoints
- Fixtures for test users and tokens

**Frontend Testing**:
- Component tests for auth forms
- Mock API responses
- Test user flows (registration, login, protected routes)

**Test Structure**:
```python
# backend/tests/conftest.py
@pytest.fixture
def test_user():
    return {"email": "test@example.com", "name": "Test User", "password": "TestPass123!"}

@pytest.fixture
def auth_token(test_user):
    # Create test user and return valid token
    pass

# backend/tests/test_auth.py
def test_register_success(client, test_user):
    response = client.post("/api/auth/register", json=test_user)
    assert response.status_code == 201
    assert "access_token" in response.json()

def test_login_invalid_credentials(client):
    response = client.post("/api/auth/login", json={
        "email": "wrong@example.com",
        "password": "wrong"
    })
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]
```

---

### 10. Environment Variable Management

**Decision**: Use `.env` files with python-dotenv (backend) and Next.js built-in env support (frontend)

**Required Variables**:

**Backend (.env)**:
```env
DATABASE_URL=postgresql://user:pass@host:5432/db  # From feature 001
BETTER_AUTH_SECRET=<generate-256-bit-secret>      # Shared with frontend
JWT_ALGORITHM=HS256                                 # Algorithm for JWT signing
```

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000          # Backend API base URL
BETTER_AUTH_SECRET=<same-as-backend>                # Must match backend
BETTER_AUTH_URL=http://localhost:3000               # Frontend URL
```

**Security Notes**:
- Generate BETTER_AUTH_SECRET: `openssl rand -hex 32` (256 bits)
- Never commit .env files to version control
- Use separate secrets for development/production
- Rotate secrets periodically

---

## Summary

All research areas resolved. Key decisions:

1. **JWT**: PyJWT library, HS256 algorithm, 7-day expiration
2. **Passwords**: bcrypt via passlib, 12 rounds
3. **Better Auth**: Frontend SDK only, custom backend
4. **Storage**: localStorage (MVP), httpOnly cookies (future)
5. **Database**: Extend existing User model with auth fields
6. **API**: RESTful `/api/auth/*` endpoints
7. **Validation**: Pydantic models with custom validators
8. **Security**: Generic error messages, timing attack prevention
9. **Testing**: Pytest + TestClient (backend), RTL (frontend)
10. **Secrets**: Shared 256-bit secret in environment variables

**Ready for Phase 1: Design & Contracts**
