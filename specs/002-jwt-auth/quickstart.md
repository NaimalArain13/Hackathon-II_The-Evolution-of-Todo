# Quickstart: JWT Authentication Implementation

**Feature**: 002-jwt-auth
**Created**: 2025-12-10
**Purpose**: Quick reference guide for implementing JWT authentication

## Overview

This guide provides step-by-step instructions for implementing the JWT authentication system across backend and frontend.

## Prerequisites

- Backend: Python 3.13+, UV package manager, PostgreSQL (Neon) configured
- Frontend: Node.js 18+, npm/pnpm, Next.js 16+
- Existing feature 001 (database setup) completed

## Backend Implementation

### 1. Install Dependencies

```bash
cd backend
uv add pyjwt passlib[bcrypt] python-jose[cryptography]
```

### 2. Environment Configuration

Add to `backend/.env`:
```env
BETTER_AUTH_SECRET=<generate-with-openssl-rand-hex-32>
JWT_ALGORITHM=HS256
```

Generate secret:
```bash
openssl rand -hex 32
```

### 3. Update User Model

Extend `backend/models.py`:
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
import uuid

class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    name: str = Field(max_length=100)
    password_hash: str = Field(max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    is_active: bool = Field(default=True)
```

### 4. Create Utility Libraries

**backend/lib/password.py**:
```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

**backend/lib/jwt_utils.py**:
```python
import jwt
from datetime import datetime, timedelta
import os

SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
```

### 5. Create Request/Response Schemas

Create `backend/schemas/auth.py` with Pydantic models (see data-model.md for full schemas).

### 6. Create JWT Middleware

Create `backend/middleware/jwt.py`:
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from lib.jwt_utils import verify_token
import jwt

security = HTTPBearer()

def get_current_user_id(credentials: HTTPAuthCredentials = Depends(security)) -> str:
    try:
        payload = verify_token(credentials.credentials)
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="User ID not found in token")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### 7. Create Authentication Routes

Create `backend/routes/auth.py`:
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from schemas.auth import UserRegisterRequest, UserLoginRequest, AuthResponse, UserResponse
from models import User
from db import get_session
from lib.password import hash_password, verify_password
from lib.jwt_utils import create_access_token
from middleware.jwt import get_current_user_id

router = APIRouter()

@router.post("/register", response_model=AuthResponse, status_code=201)
def register(user_data: UserRegisterRequest, session: Session = Depends(get_session)):
    # Check if email exists
    existing = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    # Create user
    user = User(
        email=user_data.email,
        name=user_data.name,
        password_hash=hash_password(user_data.password)
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    # Generate token
    token = create_access_token(user.id, user.email)

    return AuthResponse(access_token=token, user=user)

@router.post("/login", response_model=AuthResponse)
def login(credentials: UserLoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == credentials.email)).first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user.id, user.email)
    return AuthResponse(access_token=token, user=user)

@router.get("/profile", response_model=UserResponse)
def get_profile(
    user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

### 8. Register Routes in Main App

Update `backend/main.py`:
```python
from routes import auth

app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
```

### 9. Run Backend

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --port 8000
```

Test endpoints:
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"Test1234!"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!"}'
```

---

## Frontend Implementation

### 1. Install Dependencies

```bash
cd frontend
npm install better-auth axios
```

### 2. Environment Configuration

Add to `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=<same-as-backend>
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Add TypeScript Types

Extend `frontend/lib/types.ts` (see data-model.md for full types).

### 4. Configure Better Auth

Create `frontend/lib/auth.ts`:
```typescript
import { betterAuth } from 'better-auth/react';

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  apiURL: process.env.NEXT_PUBLIC_API_URL,
});

export const { useUser, signIn, signOut } = auth;
```

### 5. Extend API Service

Update `frontend/services/api.ts`:
```typescript
import { apiService } from './api';
import type { RegisterRequest, LoginRequest, AuthResponse, User } from '@/lib/types';

// Auth methods
export const authAPI = {
  register: (data: RegisterRequest) =>
    apiService.post<AuthResponse>('/api/auth/register', data),

  login: (data: LoginRequest) =>
    apiService.post<AuthResponse>('/api/auth/login', data),

  logout: () =>
    apiService.post('/api/auth/logout'),

  getProfile: () =>
    apiService.get<User>('/api/auth/profile'),

  updateProfile: (data: { name?: string }) =>
    apiService.put<User>('/api/auth/profile', data),
};
```

### 6. Create Auth Components

**frontend/components/auth/SignUpForm.tsx**:
```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/services/api';
import { apiService } from '@/services/api';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await authAPI.register({ email, name, password });
      apiService.setToken(response.access_token);
      localStorage.setItem('token', response.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded">{error}</div>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
        Sign Up
      </button>
    </form>
  );
}
```

Similar pattern for SignInForm.tsx.

### 7. Create Auth Pages

**frontend/app/(auth)/signup/page.tsx**:
```tsx
import { SignUpForm } from '@/components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
        <SignUpForm />
      </div>
    </div>
  );
}
```

### 8. Create Protected Layout

**frontend/app/(dashboard)/layout.tsx**:
```tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get('token')?.value;

  if (!token) {
    redirect('/signin');
  }

  return <div>{children}</div>;
}
```

### 9. Run Frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000/signup` to test.

---

## Testing

### Backend Tests

```bash
cd backend
pytest tests/test_auth.py -v
```

### Frontend Tests

```bash
cd frontend
npm test
```

---

## Common Issues & Solutions

### Issue: "Invalid token"
- **Solution**: Ensure BETTER_AUTH_SECRET is identical in both .env files
- Verify token is included in Authorization header as `Bearer <token>`

### Issue: "Email already registered"
- **Solution**: Use different email or delete test user from database

### Issue: CORS errors
- **Solution**: Check CORS configuration in backend/main.py includes frontend URL

### Issue: Password validation fails
- **Solution**: Ensure password has 8+ chars, 1 number, 1 special character

---

## Next Steps

1. Run `/sp.tasks` to generate implementation tasks
2. Implement tasks sequentially
3. Test each endpoint as implemented
4. Create integration tests for full auth flow
5. Deploy to staging environment

---

## Reference Links

- [Spec Document](./spec.md)
- [Data Model](./data-model.md)
- [API Contract](./contracts/openapi.yaml)
- [Research](./research.md)
