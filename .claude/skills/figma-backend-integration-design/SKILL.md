# Figma Backend Integration Design Skill

## Skill Overview
**Skill Name**: figma-backend-integration-design
**Category**: Design & API Integration
**Purpose**: Analyze backend API routes, data schemas, and response structures to create frontend designs that perfectly align with the backend architecture and data flow.

## When to Use This Skill
- Starting a new feature that requires backend integration
- Designing forms that match backend request schemas
- Creating data displays that map to API response structures
- Designing error states based on backend error responses
- Planning authentication and authorization UI flows
- Mapping CRUD operations to UI interactions
- Creating designs for real-time data updates

## Core Capabilities

### 1. API Route Analysis
- Inspect FastAPI endpoint definitions and route handlers
- Understand request/response schemas (Pydantic models)
- Map HTTP methods to UI actions (GET → Read, POST → Create, etc.)
- Identify required vs. optional fields for form design
- Analyze authentication requirements (JWT tokens, headers)
- Document API contracts for design reference

### 2. Data Schema Mapping
- Convert backend data models to UI component structures
- Design form fields matching backend validation rules
- Create table/list views displaying API response data
- Plan for nested data structures and relationships
- Handle nullable fields and default values in UI
- Design for data types (strings, numbers, dates, enums)

### 3. Error Handling Design
- Map HTTP status codes to UI error messages
- Design validation error displays (422 responses)
- Create authentication error states (401, 403)
- Design not found states (404)
- Handle server errors gracefully (500)
- Show network error states (timeout, offline)

### 4. State Management Design
- Design loading states for async operations
- Create success feedback for mutations
- Plan optimistic updates for better UX
- Design data refetching and cache invalidation patterns
- Handle pagination and infinite scroll
- Plan for real-time updates (WebSocket connections)

## Backend API Analysis

### Base URL
```
Production: https://naimalcreativityai-sdd-todo-app.hf.space/
Local Development: http://localhost:8000/
```

### Authentication Routes

#### POST /api/auth/register
```typescript
// Request Schema
interface RegisterRequest {
  email: string;           // Valid email format, required
  password: string;        // Min 8 chars, required
  name: string;           // Required
}

// Success Response (201 Created)
interface RegisterResponse {
  id: number;
  email: string;
  name: string;
  created_at: string;     // ISO 8601 datetime
}

// Error Responses
400: Invalid input format
422: Validation errors (email format, password strength)
409: Email already registered
500: Internal server error
```

**Design Implications:**
- Registration form needs: email, password, name inputs
- Email validation: check format client-side + server-side
- Password: show strength indicator, min 8 chars requirement
- Error handling: show field-specific errors inline
- Success: auto-login and redirect to dashboard

#### POST /api/auth/login
```typescript
// Request Schema
interface LoginRequest {
  email: string;          // Required
  password: string;       // Required
}

// Success Response (200 OK)
interface LoginResponse {
  access_token: string;   // JWT token for authorization
  token_type: "bearer";
  user: {
    id: number;
    email: string;
    name: string;
  };
}

// Error Responses
400: Invalid credentials format
401: Invalid email or password
422: Validation errors
500: Internal server error
```

**Design Implications:**
- Login form: email + password inputs
- Error handling: show generic "Invalid credentials" (don't specify which field)
- Success: store token, show user info, redirect to dashboard
- Loading state: disable form during authentication
- "Remember me" option: for local storage vs session storage

### Task Routes (Protected - Require JWT Token)

#### GET /api/tasks
```typescript
// Request: No body, JWT in Authorization header
// Query Parameters (optional):
status?: 'pending' | 'in_progress' | 'completed'
priority?: 'low' | 'medium' | 'high'

// Success Response (200 OK)
interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  user_id: number;
  created_at: string;
  updated_at: string;
}

type GetTasksResponse = Task[];

// Error Responses
401: Missing or invalid token
500: Internal server error
```

**Design Implications:**
- Task list view: display all task properties
- Filters: dropdown/tabs for status and priority
- Empty state: "No tasks yet" when array is empty
- Loading state: skeleton cards while fetching
- Error state: "Failed to load tasks" with retry button
- Sort options: by created_at, priority

#### POST /api/tasks
```typescript
// Request Schema
interface CreateTaskRequest {
  title: string;          // Required, non-empty
  description: string;    // Optional
  status?: 'pending' | 'in_progress' | 'completed';  // Default: 'pending'
  priority?: 'low' | 'medium' | 'high';              // Default: 'medium'
}

// Success Response (201 Created)
type CreateTaskResponse = Task;

// Error Responses
400: Invalid input
401: Unauthorized (no token)
422: Validation errors (title empty, invalid status/priority)
500: Internal server error
```

**Design Implications:**
- Create modal/page: title (required), description (optional textarea)
- Status selector: default to "pending", allow selection
- Priority selector: default to "medium", visual indicators (colors)
- Form validation: highlight required fields, show errors inline
- Success: show toast, add task to list, close modal
- Loading: show spinner on submit button

#### GET /api/tasks/{task_id}
```typescript
// Success Response (200 OK)
type GetTaskResponse = Task;

// Error Responses
401: Unauthorized
404: Task not found or doesn't belong to user
500: Internal server error
```

**Design Implications:**
- Task detail view: show all task properties
- Not found: "Task not found" error page
- Edit button: opens edit modal/page
- Delete button: confirmation dialog

#### PUT /api/tasks/{task_id}
```typescript
// Request Schema (all fields required)
interface UpdateTaskRequest {
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

// Success Response (200 OK)
type UpdateTaskResponse = Task;

// Error Responses
400: Invalid input
401: Unauthorized
404: Task not found
422: Validation errors
500: Internal server error
```

**Design Implications:**
- Edit modal: pre-fill with current values
- All fields must be sent (not partial update)
- Validation: same as create
- Success: update task in list, close modal, show toast

#### PATCH /api/tasks/{task_id}/complete
```typescript
// Request: No body, just task_id in URL
// Success Response (200 OK)
type CompleteTaskResponse = Task;  // status changed to 'completed'

// Error Responses
401: Unauthorized
404: Task not found
500: Internal server error
```

**Design Implications:**
- Checkbox/toggle on task card
- Click → instant UI update (optimistic)
- If fails → revert + show error toast
- Visual feedback: strikethrough, fade, move to completed section

#### DELETE /api/tasks/{task_id}
```typescript
// Success Response (204 No Content)
// No response body

// Error Responses
401: Unauthorized
404: Task not found
500: Internal server error
```

**Design Implications:**
- Delete button: destructive color (red)
- Confirmation dialog: "Are you sure? This cannot be undone"
- Success: remove task from UI, show toast
- Optimistic delete: fade out immediately, revert if fails

### Profile Routes (Future - Design Ahead)

#### GET /api/users/me
```typescript
// Success Response (200 OK)
interface User {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

// Error Responses
401: Unauthorized
500: Internal server error
```

**Design Implications:**
- Profile page: display user info
- Avatar: use first letter of name or gravatar
- Created date: "Member since {date}"

## Design Patterns by API Operation

### CREATE Operations (POST)
1. **Modal/Page with Form**
   - Input fields matching request schema
   - Required field indicators (asterisk)
   - Client-side validation matching backend rules
   - Submit button with loading state

2. **Success Flow**
   - Close modal
   - Add item to list (optimistic or after response)
   - Show success toast
   - Clear form for next entry

3. **Error Handling**
   - Field-level errors (422) shown inline
   - General errors (500) shown as toast
   - Network errors: retry button

### READ Operations (GET)
1. **List View**
   - Loading state: skeleton screens
   - Empty state: helpful message + CTA
   - Data display: cards, table, or list
   - Filters and search (if query params available)

2. **Detail View**
   - Full data display
   - Related actions (edit, delete)
   - Breadcrumbs for navigation

3. **Error Handling**
   - Not found (404): "Item not found" page
   - Unauthorized (401): redirect to login
   - Server error (500): error message + retry

### UPDATE Operations (PUT/PATCH)
1. **Edit Form**
   - Pre-filled with current values
   - Same validation as create
   - "Save" and "Cancel" buttons

2. **Success Flow**
   - Update item in list/view
   - Close edit mode
   - Show success feedback

3. **Optimistic Updates**
   - Update UI immediately
   - Revert if API call fails
   - Show loading indicator

### DELETE Operations (DELETE)
1. **Confirmation Dialog**
   - Clear warning message
   - "Cancel" and "Delete" buttons
   - Destructive button styling (red)

2. **Success Flow**
   - Remove item from UI
   - Show success toast
   - Update counts/stats

3. **Optimistic Delete**
   - Fade out immediately
   - Undo option in toast
   - Revert if fails

## Authentication Flow Design

### Registration Flow
```
1. Landing Page
   └── Click "Sign Up"

2. Registration Page/Modal
   ├── Email input (with format validation)
   ├── Password input (with strength indicator)
   ├── Name input
   ├── Submit button
   └── "Already have an account? Login"

3. On Submit:
   ├── Validate client-side
   ├── Show loading state
   ├── POST /api/auth/register
   └── Handle response:
       ├── Success (201):
       │   ├── Auto-login (use returned token)
       │   ├── Store token in localStorage/cookie
       │   └── Redirect to dashboard
       └── Error:
           ├── 422: Show field errors inline
           ├── 409: "Email already registered"
           └── 500: "Server error, try again"
```

### Login Flow
```
1. Login Page/Modal
   ├── Email input
   ├── Password input
   ├── "Remember me" checkbox (optional)
   ├── Submit button
   └── "Don't have account? Sign up"

2. On Submit:
   ├── POST /api/auth/login
   └── Handle response:
       ├── Success (200):
       │   ├── Store token + user info
       │   └── Redirect to dashboard
       └── Error (401):
           └── Show "Invalid credentials"
```

### Protected Routes
```
Every API call to protected routes:
1. Get token from localStorage/cookie
2. Add to Authorization header: "Bearer {token}"
3. If 401 response:
   ├── Clear stored token
   ├── Redirect to login
   └── Show "Session expired" message
```

## Data Type Design Mapping

### Enums → UI Components
```typescript
// Backend enum
status: 'pending' | 'in_progress' | 'completed'

// UI Design:
- Radio buttons or segmented control
- Color coding: pending (gray), in_progress (blue), completed (green)
- Icons: pending (clock), in_progress (spinner), completed (check)

priority: 'low' | 'medium' | 'high'

// UI Design:
- Dropdown select or radio buttons
- Color badges: low (green), medium (yellow), high (red)
- Visual indicators: low (1 flag), medium (2 flags), high (3 flags)
```

### Dates → Formatted Display
```typescript
created_at: "2025-12-13T10:30:00Z"

// UI Design:
- Relative time: "2 hours ago", "Yesterday", "3 days ago"
- Absolute: "Dec 13, 2025 at 10:30 AM"
- Use Intl.DateTimeFormat or date-fns library
```

### Long Text → Truncation
```typescript
description: string  // Can be very long

// UI Design:
- Card view: truncate to 2 lines with ellipsis
- Full view: expand on click or show in detail page
- Character limit indicator in forms
```

## Form Design Checklist

Based on backend schema, every form should have:
- [ ] All required fields marked with asterisk (*)
- [ ] Input types matching data types (email, text, number, date)
- [ ] Validation matching backend rules
- [ ] Character counters for limited fields
- [ ] Placeholder text with examples
- [ ] Helper text explaining requirements
- [ ] Error messages matching backend errors
- [ ] Success states and feedback
- [ ] Loading states on submit
- [ ] Keyboard shortcuts (Enter to submit, Esc to cancel)

## API Testing for Design Validation

Before finalizing designs, test API endpoints:
```bash
# Get API documentation
curl https://naimalcreativityai-sdd-todo-app.hf.space/docs

# Test endpoints with sample data
# (See PHR 0004 for full testing guide)
```

Ensure designs account for:
- All possible response codes
- Edge cases (empty lists, null values)
- Error scenarios
- Loading states
- Success states

## Design Deliverables

1. **API-Design Mapping Document**
   - List all endpoints used
   - Map request/response to UI components
   - Document error handling for each endpoint

2. **Form Designs**
   - All input fields labeled with backend schema field names
   - Validation rules documented
   - Error states shown

3. **Data Display Designs**
   - Show how each API field is displayed
   - Handle null/undefined values
   - Format dates, numbers appropriately

4. **Flow Diagrams**
   - Show API calls in user flows
   - Document state changes
   - Show error recovery paths

---

**Backend API**: `https://naimalcreativityai-sdd-todo-app.hf.space/`
**API Documentation**: `https://naimalcreativityai-sdd-todo-app.hf.space/docs`
**Version**: 1.0.0
