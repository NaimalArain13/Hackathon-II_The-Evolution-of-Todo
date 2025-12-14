# Quickstart: Authentication UI

**Feature Branch**: `006-auth-ui`
**Date**: 2025-12-13

## Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Backend API deployed at `https://naimalcreativityai-sdd-todo-app.hf.space`

## Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already done)
pnpm install

# Start development server
pnpm dev
```

## File Structure

After implementation, the following files will be created/modified:

```
frontend/src/
├── app/
│   └── (auth)/                      # Auth route group (NEW)
│       ├── layout.tsx               # Auth layout (redirect if authenticated)
│       ├── signin/
│       │   └── page.tsx             # Login page
│       └── signup/
│           └── page.tsx             # Registration page
├── components/
│   └── auth/                        # Auth components (NEW)
│       ├── LoginForm.tsx            # Login form component
│       ├── SignupForm.tsx           # Signup form component
│       ├── AuthBrandingPanel.tsx    # Right-side branding
│       ├── PasswordInput.tsx        # Password with toggle
│       ├── PasswordStrengthIndicator.tsx  # Strength meter
│       └── FormError.tsx            # Inline error display
├── lib/
│   └── validations/                 # Validation schemas (NEW)
│       └── auth.ts                  # Zod schemas for auth forms
└── hooks/
    └── useAuth.ts                   # Auth hook (NEW or MODIFIED)
```

## Implementation Order

1. **Validation Schemas** (`lib/validations/auth.ts`)
   - Zod schemas for login and registration forms
   - Password strength rules matching backend

2. **Auth Hook** (`hooks/useAuth.ts`)
   - Login and register API calls
   - Toast notifications for success/error
   - Auth store integration

3. **UI Components** (`components/auth/`)
   - PasswordInput with visibility toggle
   - PasswordStrengthIndicator
   - FormError component
   - AuthBrandingPanel

4. **Forms** (`components/auth/`)
   - LoginForm with React Hook Form
   - SignupForm with React Hook Form

5. **Pages** (`app/(auth)/`)
   - Auth layout with redirect logic
   - Login page
   - Signup page

## Testing Checklist

### Registration Flow
- [ ] Empty form shows validation errors on submit
- [ ] Name validation (required, max 100 chars)
- [ ] Email validation (required, valid format)
- [ ] Password validation (8+ chars, number, special char)
- [ ] Confirm password matches
- [ ] Password strength indicator updates
- [ ] Show/hide password works
- [ ] Success toast on registration
- [ ] Redirect to dashboard after success
- [ ] "Email already registered" error shows toast

### Login Flow
- [ ] Empty form shows validation errors on submit
- [ ] Email validation (required, valid format)
- [ ] Password validation (required)
- [ ] Show/hide password works
- [ ] Success toast on login
- [ ] Redirect to dashboard after success
- [ ] "Invalid email or password" error shows toast

### Navigation
- [ ] Link from login to signup works
- [ ] Link from signup to login works
- [ ] Landing page login/signup buttons work
- [ ] Authenticated users redirected from auth pages

### Error Handling
- [ ] Network error shows appropriate toast
- [ ] Server error (500) shows generic message
- [ ] No sensitive info in error messages

## API Endpoints

| Endpoint | Method | Request Body | Success Response |
|----------|--------|--------------|------------------|
| `/api/auth/register` | POST | `{ email, name, password }` | 201 + AuthResponse |
| `/api/auth/login` | POST | `{ email, password }` | 200 + AuthResponse |

## Design Reference

- See `frontend/FIGMA_DESIGN_SPEC.md` Section 5 (Authentication Pages)
- Split-screen layout (50/50)
- Primary colors: Indigo (#6366F1)
- Error colors: Red (#EF4444)
- Success colors: Green (#22C55E)

## Environment Variables

```env
# frontend/.env.local (development and production use same backend)
NEXT_PUBLIC_API_URL=https://naimalcreativityai-sdd-todo-app.hf.space
```

**Note**: The backend is already deployed and tested. No need to run a local backend server.
