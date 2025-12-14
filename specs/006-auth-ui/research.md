# Research: Authentication UI with API Integration

**Feature Branch**: `006-auth-ui`
**Date**: 2025-12-13
**Status**: Complete

## Research Summary

This document captures technical decisions and research findings for implementing the Authentication UI feature.

---

## 1. Form Library Selection

### Decision: React Hook Form + Zod

**Rationale**:
- Already installed in project (`react-hook-form@7.68.0`, `zod@4.1.13`, `@hookform/resolvers@5.2.2`)
- Excellent TypeScript support with type inference
- Minimal re-renders with uncontrolled components
- Native integration with Zod for schema validation
- Debounced validation support via mode: "onChange"

**Alternatives Considered**:
| Alternative | Rejected Because |
|------------|------------------|
| Formik | Heavier bundle, less TypeScript integration |
| Native React forms | Manual validation logic, more boilerplate |
| React Final Form | Less ecosystem support |

---

## 2. Validation Strategy

### Decision: Client-side validation before API call

**Rationale**:
- Spec requires 0% invalid submissions reaching backend (SC-008)
- React Hook Form with Zod validates on change/blur
- Toast shown for invalid submission attempts (FR-026)
- Backend validation as fallback for security

**Validation Rules** (matching backend/schemas/auth.py):
```
Name: 1-100 characters, required
Email: Valid email format (EmailStr equivalent)
Password: min 8 chars, at least 1 number, at least 1 special char (!@#$%^&*(),.?":{}|<>)
Confirm Password: Must match password field (frontend only)
```

**Debounce Strategy**:
- Use React Hook Form `mode: "onChange"` with 300ms debounce
- Validate on blur for immediate feedback after field exit

---

## 3. Toast Notification System

### Decision: Sonner

**Rationale**:
- Already installed in project (`sonner@2.0.7`)
- Already has Sonner component at `frontend/src/components/ui/sonner.tsx`
- Supports success, error, warning, info variants
- Customizable duration and position
- Good accessibility support

**Usage Pattern**:
```typescript
import { toast } from 'sonner';

// Success
toast.success('Account created successfully!');

// Error
toast.error('Invalid email or password');

// With description
toast.error('Registration failed', { description: 'Email already registered' });
```

---

## 4. State Management for Auth

### Decision: Zustand (existing auth-store.ts)

**Rationale**:
- Already implemented at `frontend/src/store/auth-store.ts`
- Provides `setAuth`, `clearAuth`, `restoreAuth`, `updateUser` methods
- Uses cookies for token storage (7-day expiry)
- Persists user data to localStorage

**Integration Pattern**:
```typescript
import { useAuthStore } from '@/store/auth-store';

const { setAuth, clearAuth, isAuthenticated, user } = useAuthStore();

// After successful login/register
setAuth(userData, token);
```

---

## 5. API Integration

### Decision: Singleton API Service (existing)

**Rationale**:
- Already implemented at `frontend/src/services/api.ts`
- Automatic JWT injection via request interceptor
- 401 handling redirects to login
- Base URL configured via environment variable

**Auth Endpoints**:
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/register` | POST | Create new user account |
| `/api/auth/login` | POST | Authenticate existing user |

**Request/Response Types** (from backend/schemas/auth.py):
```typescript
// Register Request
{ email: string, name: string, password: string }

// Login Request
{ email: string, password: string }

// Auth Response
{
  access_token: string,
  token_type: "bearer",
  user: { id, email, name, created_at, updated_at, is_active }
}
```

---

## 6. Page Layout Design

### Decision: Split-screen layout (50/50)

**Rationale**:
- Follows FIGMA_DESIGN_SPEC.md Section 5 (Authentication Pages)
- Left panel: Form content (max-width 400px, centered)
- Right panel: Branding with gradient background
- Mobile: Single column (form only)

**Responsive Breakpoints**:
- Desktop (1440px+): Split screen 50/50
- Tablet (768px-1439px): Split screen with reduced right panel
- Mobile (<768px): Full-width form, hide branding panel

---

## 7. Password Strength Indicator

### Decision: Custom component with visual feedback

**Rationale**:
- Spec requires real-time feedback (FR-013)
- Show strength based on requirements met
- Color coding: red (weak) → yellow (medium) → green (strong)

**Strength Calculation**:
```
Weak: < 8 chars OR missing number OR missing special char
Medium: 8+ chars AND (has number OR has special char) but not both
Strong: 8+ chars AND has number AND has special char
```

**Visual Component**:
- Progress bar with 3 segments
- Text label: "Weak", "Medium", "Strong"
- Requirement checklist below (optional enhancement)

---

## 8. Error Handling Strategy

### Decision: Layered error handling

**Rationale**:
- Spec requires 100% of API errors show toast (SC-004)
- Different error types need different handling

**Error Layers**:
1. **Validation errors**: Inline display below fields, toast for submit attempts
2. **API errors (4xx)**: Extract `detail` from response, show toast
3. **Network errors**: Generic "Network error" toast with retry suggestion
4. **Server errors (5xx)**: Generic "Something went wrong" toast

**Error Response Parsing**:
```typescript
try {
  const response = await api.post('/api/auth/register', data);
} catch (error) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.detail || 'An error occurred';
    toast.error(message);
  } else {
    toast.error('Network error. Please try again.');
  }
}
```

---

## 9. Route Protection

### Decision: Middleware-based redirect

**Rationale**:
- Spec requires authenticated users redirected from auth pages (FR-028)
- Check auth state on page mount
- Use Next.js router for client-side navigation

**Implementation Pattern**:
```typescript
// In auth pages (login/signup)
const { isAuthenticated } = useAuthStore();
const router = useRouter();

useEffect(() => {
  if (isAuthenticated) {
    router.replace('/dashboard');
  }
}, [isAuthenticated]);
```

---

## 10. Accessibility Considerations

### Decision: WCAG 2.1 AA compliance

**Rationale**:
- Spec requires 100% keyboard navigation (SC-006)
- Form inputs must have proper labels
- Error messages linked to inputs via aria-describedby

**Implementation Checklist**:
- [ ] All inputs have visible labels
- [ ] Error messages use `aria-live="polite"`
- [ ] Focus management on form submission
- [ ] Color contrast meets 4.5:1 ratio
- [ ] Button states clearly distinguishable
- [ ] Tab order logical and complete

---

## Dependencies Confirmed

All required dependencies are already installed:
- `react-hook-form@7.68.0` - Form state management
- `@hookform/resolvers@5.2.2` - Zod resolver
- `zod@4.1.13` - Schema validation
- `sonner@2.0.7` - Toast notifications
- `zustand@5.0.9` - State management
- `axios@1.13.2` - HTTP client
- `lucide-react@0.561.0` - Icons (Eye, EyeOff, Loader2)
- `framer-motion@12.23.26` - Animations (optional)

No new dependencies required.
