# Data Model: ChatKit Frontend Integration

## Key Entities

### Chat Session
Represents an active chat connection with the AI assistant, including the current conversation state, message history, and connection status. Each session belongs to a specific user and maintains context during the interaction.

**Fields**:
- `id`: string - Unique identifier for the session
- `userId`: string - ID of the authenticated user
- `currentConversationId`: number - ID of the active conversation
- `isActive`: boolean - Whether the session is currently active
- `connectionStatus`: 'connected' | 'connecting' | 'disconnected' - Current connection status
- `createdAt`: Date - When the session was created
- `lastActivityAt`: Date - Last interaction timestamp

### Conversation
Represents a thread of messages between the user and AI assistant with attributes for unique identifier, creation timestamp, last activity timestamp, title, and associated user. Conversations persist across browser sessions and can be resumed.

**Fields**:
- `id`: number - Unique identifier for the conversation
- `userId`: string - ID of the user who owns this conversation
- `title`: string - Generated title for the conversation
- `createdAt`: Date - When the conversation was created
- `updatedAt`: Date - Last updated timestamp
- `messageCount`: number - Total number of messages in the conversation
- `lastMessagePreview`: string - Preview of the last message

### Message
Represents an individual communication in a conversation with attributes for unique identifier, sender role (user or assistant), content text, creation timestamp, delivery status, and associated conversation. Messages are displayed chronically in the chat interface.

**Fields**:
- `id`: number - Unique identifier for the message
- `conversationId`: number - ID of the conversation this message belongs to
- `userId`: string - ID of the user who sent the message (for user messages)
- `role`: 'user' | 'assistant' - Role of the message sender
- `content`: string - Text content of the message
- `createdAt`: Date - When the message was created
- `status`: 'sent' | 'delivered' | 'read' | 'error' - Delivery status
- `streaming`: boolean - Whether the message is currently streaming

### Chat Widget State
Represents the current UI state of the chat widget including open/closed status, current conversation ID, loading states, error states, and user preferences (position, size, theme). This state controls the visual presentation and user interaction flow.

**Fields**:
- `isOpen`: boolean - Whether the chat interface is expanded
- `currentConversationId`: number | null - Currently selected conversation
- `isLoading`: boolean - Whether data is loading
- `error`: string | null - Current error message
- `isMinimized`: boolean - Whether widget is minimized
- `position`: 'bottom-right' | 'bottom-left' - Widget position preference
- `theme`: 'light' | 'dark' - Theme preference
- `unreadCount`: number - Number of unread messages

## Relationships

```
User (1) → (Many) ChatSession
ChatSession (1) → (Many) Conversation
Conversation (1) → (Many) Message
ChatSession (1) → (1) ChatWidgetState
```

## Validation Rules

### Conversation Validation
- Title must be between 1-100 characters
- Cannot create conversation without valid user ID
- Last activity timestamp must be updated on any conversation activity

### Message Validation
- Content must be between 1-5000 characters
- Role must be either 'user' or 'assistant'
- Message must belong to a valid conversation
- Created timestamp must be in the past or present

### Chat Session Validation
- User ID must match authenticated user
- Session must have valid connection status
- Cannot have multiple active sessions for same user

## State Transitions

### Chat Widget State Transitions
```
Initial → Closed → Open → Minimized → Closed → ...
    ↓         ↓        ↓         ↓
  Hidden   Visible  Expanded  Minimized
```

### Message Status Transitions
```
Draft → Sent → Delivered → Read
          ↓
        Error (retry possible)
```

### Connection Status Transitions
```
Disconnected → Connecting → Connected
       ↑           ↓           ↓
    Reconnecting ←--------- Disconnected
```