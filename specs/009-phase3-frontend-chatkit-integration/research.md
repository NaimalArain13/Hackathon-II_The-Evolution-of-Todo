# Research: ChatKit Frontend Integration

## Decision: ChatKit Library Selection
**Rationale**: Selected @openai/chatkit-react for its comprehensive chat interface capabilities, built-in streaming support, and customization options that align with our requirements for a floating widget with natural language processing.

**Alternatives considered**:
- Custom-built chat interface: More control but requires significant development time
- Third-party chat widgets (Intercom, Drift): Less flexible for our specific NLP task management needs
- ChatUI libraries (react-chat-elements, react-simple-chat): Less feature-rich than ChatKit

## Decision: Backend API Integration Approach
**Rationale**: Direct integration with existing backend API endpoints (`/api/{user_id}/chat`, `/api/{user_id}/conversations`) to leverage existing authentication and task management infrastructure.

**Alternatives considered**:
- Separate chat microservice: Added complexity for Phase 3
- Third-party chat service (Firebase, SendBird): Would require data migration and wouldn't integrate with existing task system
- WebSocket implementation: SSE from existing backend is sufficient for current requirements

## Decision: Authentication Method
**Rationale**: Integration with existing Better Auth JWT system to maintain consistency with the application's authentication approach and leverage existing user sessions.

**Alternatives considered**:
- Separate chat authentication: Would create additional complexity
- Anonymous chat with later association: Doesn't meet security requirements
- OAuth providers: Overkill for internal task management feature

## Decision: Floating Widget Positioning
**Rationale**: Bottom-right corner placement following common chat widget patterns, with fixed positioning to remain accessible during scrolling.

**Alternatives considered**:
- Top-right corner: Could interfere with main navigation
- Center-right: Too obtrusive
- Different corners: Bottom-right is the standard for chat widgets

## Decision: State Management Approach
**Rationale**: Using React hooks and context for local state management with backend API as the source of truth, minimizing client-side complexity.

**Alternatives considered**:
- Redux/Zustand: Overkill for the relatively simple state requirements
- Full client-side state: Would complicate synchronization with backend
- LocalStorage caching: May lead to stale data issues

## Backend API Format Understanding
- **Chat endpoint**: POST `/api/{user_id}/chat` expects JSON with `{message: string, conversation_id?: number}`
- **Response**: Server-Sent Events (SSE) stream with JSON responses
- **Conversations endpoint**: GET `/api/{user_id}/conversations` returns list of conversations
- **Specific conversation**: GET `/api/{user_id}/conversations/{conversation_id}` returns conversation with messages
- **Authentication**: JWT token in Authorization header for all endpoints

## User ID Handling
- User ID comes from the authenticated session via Better Auth
- Passed as part of the URL path in API calls
- Ensures proper user isolation and task ownership

## Styling Approach
- Integration with existing Tailwind CSS setup
- Consistent with application's design system
- Responsive design for mobile and desktop
- Accessibility-compliant (WCAG 2.1 AA)