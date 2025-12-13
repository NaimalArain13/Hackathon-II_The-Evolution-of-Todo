# Data Model: Authentication UI

**Feature Branch**: `006-auth-ui`
**Date**: 2025-12-13

## Overview

This document defines the data entities, validation rules, and state transitions for the Authentication UI feature.

---

## 1. Entities

### 1.1 User (Server-side)

The User entity is managed by the backend. Frontend receives this data after authentication.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | string (UUID) | Required, unique | User's unique identifier |
| email | string | Required, unique, valid email | User's email address |
| name | string | Required, 1-100 chars | User's display name |
| created_at | string (ISO 8601) | Required | Account creation timestamp |
| updated_at | string (ISO 8601) | Required | Last update timestamp |
| is_active | boolean | Default: true | Account active status |

### 1.2 AuthResponse (API Response)

Response structure from login/register endpoints.

| Field | Type | Description |
|-------|------|-------------|
| access_token | string | JWT token for authenticated requests |
| token_type | string | Always "bearer" |
| user | User | User data object |

### 1.3 RegisterFormData (Frontend)

Form data for user registration.

| Field | Type | Validation Rules |
|-------|------|------------------|
| name | string | Required, 1-100 characters |
| email | string | Required, valid email format |
| password | string | Required, 8-72 chars, 1 number, 1 special char |
| confirmPassword | string | Required, must match password |

### 1.4 LoginFormData (Frontend)

Form data for user login.

| Field | Type | Validation Rules |
|-------|------|------------------|
| email | string | Required, valid email format |
| password | string | Required |

### 1.5 ValidationError (Frontend)

Error object for form field validation.

| Field | Type | Description |
|-------|------|-------------|
| field | string | Field name with error |
| message | string | Human-readable error message |

### 1.6 AuthState (Frontend Store)

Zustand store state for authentication.

| Field | Type | Description |
|-------|------|-------------|
| user | User \| null | Current authenticated user |
| token | string \| null | JWT access token |
| isAuthenticated | boolean | Whether user is authenticated |

---

## 2. Validation Rules

### 2.1 Name Validation

```typescript
const nameSchema = z.string()
  .min(1, 'Name is required')
  .max(100, 'Name must be 100 characters or less')
  .trim();
```

### 2.2 Email Validation

```typescript
const emailSchema = z.string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();
```

### 2.3 Password Validation

```typescript
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be 72 characters or less')
  .regex(/\d/, 'Password must contain at least 1 number')
  .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least 1 special character');
```

### 2.4 Special Characters Allowed

The following special characters are valid for passwords (matching backend):
```
! @ # $ % ^ & * ( ) , . ? " : { } | < >
```

---

## 3. State Transitions

### 3.1 Registration Flow

```
[Initial]
    → User fills form
    → [Form Valid?]
        → No: Show inline errors, remain on form
        → Yes: [Submit]
            → Show loading state
            → [API Call Success?]
                → No: Show error toast, remain on form
                → Yes: Store token + user, redirect to dashboard
```

### 3.2 Login Flow

```
[Initial]
    → User fills form
    → [Form Valid?]
        → No: Show inline errors, remain on form
        → Yes: [Submit]
            → Show loading state
            → [API Call Success?]
                → No: Show error toast, remain on form
                → Yes: Store token + user, redirect to dashboard
```

### 3.3 Auth State Machine

```
States:
  - UNAUTHENTICATED: No user/token
  - AUTHENTICATING: API call in progress
  - AUTHENTICATED: User and token present
  - ERROR: Authentication failed

Transitions:
  UNAUTHENTICATED → AUTHENTICATING: Form submitted
  AUTHENTICATING → AUTHENTICATED: API success
  AUTHENTICATING → ERROR: API failure
  ERROR → AUTHENTICATING: Retry
  AUTHENTICATED → UNAUTHENTICATED: Logout / Token expired
```

---

## 4. Error Codes

### 4.1 API Error Responses

| HTTP Status | Error Detail | User Message |
|-------------|--------------|--------------|
| 409 | Email already registered | "Email already registered" |
| 401 | Invalid email or password | "Invalid email or password" |
| 422 | Validation error | "Please check your input" |
| 500 | Internal server error | "Something went wrong. Please try again later." |
| Network Error | - | "Network error. Please check your connection." |

### 4.2 Validation Error Messages

| Field | Condition | Message |
|-------|-----------|---------|
| name | Empty | "Name is required" |
| name | > 100 chars | "Name must be 100 characters or less" |
| email | Empty | "Email is required" |
| email | Invalid format | "Please enter a valid email address" |
| password | Empty | "Password is required" |
| password | < 8 chars | "Password must be at least 8 characters" |
| password | No number | "Password must contain at least 1 number" |
| password | No special char | "Password must contain at least 1 special character" |
| confirmPassword | Empty | "Please confirm your password" |
| confirmPassword | No match | "Passwords do not match" |

---

## 5. Relationships

```
┌─────────────────────────────────────┐
│           Frontend                   │
├─────────────────────────────────────┤
│  RegisterFormData ───┐              │
│  LoginFormData ──────┼──► API       │
│                      │              │
│  AuthState ◄─────────┤              │
│    - user            │              │
│    - token           │              │
│    - isAuthenticated │              │
└─────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────┐
│           Backend API               │
├─────────────────────────────────────┤
│  POST /api/auth/register            │
│    Request: { email, name, password }│
│    Response: AuthResponse           │
│                                     │
│  POST /api/auth/login               │
│    Request: { email, password }     │
│    Response: AuthResponse           │
└─────────────────────────────────────┘
```
