# ChatBot Frontend Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [API Endpoints](#api-endpoints)
3. [Chat Widget Interface](#chat-widget-interface)
4. [Full Chatbot Page Interface](#full-chatbot-page-interface)
5. [Implementation Guide](#implementation-guide)
6. [Payload Variations](#payload-variations)
7. [Response Handling](#response-handling)
8. [Error Handling](#error-handling)

---

## Overview

This guide documents the complete frontend integration for the chatbot functionality, including:
- **Chat Widget**: A floating chatbot interface available on all pages
- **Full Chatbot Page**: A dedicated `/chatbot/{userId}` route with ChatGPT-like interface
- **Three Main API Endpoints**: For conversations management and chat messaging

**Base URL**: `https://naimalcreativityai-sdd-todo-app.hf.space/api`

---

## API Endpoints

### 1. Get All Conversations

Retrieves all conversations for a specific user.

**Endpoint**: `GET /{userId}/conversations`

**Full URL Example**: 
```
https://naimalcreativityai-sdd-todo-app.hf.space/api/ea60eb16-a5e9-4943-84ff-a2f5c550c7aa/conversations
```

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
Accept: application/json
```

**Response Example**:
```json
[
  {
    "id": 17,
    "userId": "ea60eb16-a5e9-4943-84ff-a2f5c550c7aa",
    "title": "Picnic Planning",
    "createdAt": "2026-01-29T10:30:00Z",
    "updatedAt": "2026-01-29T11:45:00Z",
    "messageCount": 5,
    "lastMessagePreview": "I want to go for picnic"
  },
  {
    "id": 18,
    "userId": "ea60eb16-a5e9-4943-84ff-a2f5c550c7aa",
    "title": "Task Management",
    "createdAt": "2026-01-28T09:15:00Z",
    "updatedAt": "2026-01-28T14:30:00Z",
    "messageCount": 12,
    "lastMessagePreview": "show me my task list"
  }
]
```

**Usage in Frontend**:
```typescript
async function fetchConversations(userId: string, token: string) {
  const response = await fetch(
    `https://naimalcreativityai-sdd-todo-app.hf.space/api/${userId}/conversations`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch conversations: ${response.statusText}`);
  }
  
  return await response.json();
}
```

---

### 2. Get Specific Conversation

Retrieves a specific conversation with all its messages.

**Endpoint**: `GET /{userId}/conversations/{conversationId}`

**Full URL Example**: 
```
https://naimalcreativityai-sdd-todo-app.hf.space/api/ea60eb16-a5e9-4943-84ff-a2f5c550c7aa/conversations/17
```

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
Accept: application/json
```

**Response Example**:
```json
{
  "id": 17,
  "user_id": "ea60eb16-a5e9-4943-84ff-a2f5c550c7aa",
  "created_at": "2026-01-29T10:00:07.024402",
  "updated_at": "2026-01-29T10:04:21.835453"
}
```

**Note**: The current API implementation returns only the conversation metadata. Messages are not included in this response. The message history is built up from the chat interactions in the `/chat` endpoint.

**Usage in Frontend**:
```typescript
async function fetchConversation(userId: string, conversationId: number, token: string) {
  const response = await fetch(
    `https://naimalcreativityai-sdd-todo-app.hf.space/api/${userId}/conversations/${conversationId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch conversation: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  // API returns only conversation metadata, not messages
  // Messages need to be tracked from chat interactions
  return {
    conversation: data,
    messages: [] // Messages are built from chat history
  };
}
```

---

### 3. Send Chat Message

Sends a message to the chatbot. This endpoint supports two variations:
- **New Conversation**: Only includes the message
- **Existing Conversation**: Includes both message and conversation_id

**Endpoint**: `POST /{userId}/chat`

**Full URL Example**: 
```
https://naimalcreativityai-sdd-todo-app.hf.space/api/ea60eb16-a5e9-4943-84ff-a2f5c550c7aa/chat
```

**Headers**:
```http
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
Accept: application/json
```

#### Variation 1: New Conversation

**Request Payload**:
```json
{
  "message": "I want to go for picnic"
}
```

**cURL Example**:
```bash
curl -X 'POST' \
  'https://naimalcreativityai-sdd-todo-app.hf.space/api/ea60eb16-a5e9-4943-84ff-a2f5c550c7aa/chat' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYTYwZWIxNi1hNWU5LTQ5NDMtODRmZi1hMmY1YzU1MGM3YWEiLCJlbWFpbCI6ImdodWxhbUBnbWFpbC5jb20iLCJpYXQiOjE3Njk2ODA4NzksImV4cCI6MTc3MDI4NTY3OX0.opPxfi3eq5K82bUHGwW1vbOvWeDVtlcd09M6TOaLhl0' \
  -H 'Content-Type: application/json' \
  -d '{
  "message": "I want to go for picnic"
}'
```

**Frontend Implementation**:
```typescript
async function sendNewMessage(userId: string, message: string, token: string) {
  const response = await fetch(
    `https://naimalcreativityai-sdd-todo-app.hf.space/api/${userId}/chat`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message: message
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }
  
  return response; // Returns SSE stream
}
```

#### Variation 2: Continuing Existing Conversation

**Request Payload**:
```json
{
  "conversation_id": 17,
  "message": "show me my task list"
}
```

**cURL Example**:
```bash
curl -X 'POST' \
  'https://naimalcreativityai-sdd-todo-app.hf.space/api/ea60eb16-a5e9-4943-84ff-a2f5c550c7aa/chat' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlYTYwZWIxNi1hNWU5LTQ5NDMtODRmZi1hMmY1YzU1MGM3YWEiLCJlbWFpbCI6ImdodWxhbUBnbWFpbC5jb20iLCJpYXQiOjE3Njk2ODA4NzksImV4cCI6MTc3MDI4NTY3OX0.opPxfi3eq5K82bUHGwW1vbOvWeDVtlcd09M6TOaLhl0' \
  -H 'Content-Type: application/json' \
  -d '{
  "conversation_id": 17,
  "message": "show me my task list"
}'
```

**Frontend Implementation**:
```typescript
async function sendMessageToConversation(
  userId: string, 
  message: string, 
  conversationId: number,
  token: string
) {
  const response = await fetch(
    `https://naimalcreativityai-sdd-todo-app.hf.space/api/${userId}/chat`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        message: message
      })
    }
  );
  
  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }
  
  return response; // Returns SSE stream
}
```

---

## Chat Widget Interface

The chat widget is a floating interface that appears on all pages where users are authenticated.

### Features
1. **Floating Button**: Positioned at bottom-right corner
2. **Expandable Interface**: Opens chat when clicked
3. **"My Conversations" Button**: New button to redirect to full chatbot page
4. **Chat Functionality**: Send messages and receive responses
5. **Persistent State**: Maintains chat state across page navigation

### UI Structure

```
┌─────────────────────────────────────┐
│  AI Task Assistant            [X]   │  ← Header with Close button
├─────────────────────────────────────┤
│                                     │
│  [Message Bubbles Display Area]    │  ← Messages area
│                                     │
│                                     │
├─────────────────────────────────────┤
│  [Input Field]           [Send]    │  ← Message composer
├─────────────────────────────────────┤
│  [My Conversations Button]         │  ← NEW: Redirect button
└─────────────────────────────────────┘
```

### Implementation Changes

**Add "My Conversations" Button to ChatWidget.tsx**:

```typescript
// In ChatWidget.tsx, add this button in the chat interface
<div className="border-t border-gray-200 p-4 mt-auto">
  <Button
    variant="outline"
    className="w-full"
    onClick={() => {
      // Redirect to full chatbot page
      window.location.href = `/chatbot/${userId}`;
    }}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5 mr-2" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
      />
    </svg>
    My Conversations
  </Button>
</div>
```

**Key Points**:
- Button should be placed above the message composer
- Uses the same styling as other UI buttons
- Navigates to `/chatbot/{userId}` when clicked
- Shows icon + text for better UX

---

## Full Chatbot Page Interface

The full chatbot page (`/chatbot/{userId}`) provides a ChatGPT-like experience with a sidebar showing all conversations.

### Page Structure

```
┌──────────────────────────────────────────────────────────────┐
│                       Header                                  │
├──────────────┬───────────────────────────────────────────────┤
│              │                                                │
│  Sidebar     │           Chat Interface                      │
│              │                                                │
│  [+ New]     │  ┌──────────────────────────────────────┐   │
│              │  │                                        │   │
│  Conv 1      │  │   Messages Display Area               │   │
│  Conv 2      │  │                                        │   │
│  Conv 3 ✓    │  │                                        │   │
│  Conv 4      │  │                                        │   │
│              │  └──────────────────────────────────────┘   │
│              │  ┌──────────────────────────────────────┐   │
│              │  │ [Input]                    [Send]    │   │
│              │  └──────────────────────────────────────┘   │
└──────────────┴───────────────────────────────────────────────┘
```

### Features

1. **Sidebar** (Left Panel - 20-25% width):
   - Shows all conversations
   - Displays conversation titles
   - Highlights selected conversation
   - Shows last message preview (optional)
   - "New Conversation" button at top
   - Scrollable if many conversations

2. **Chat Area** (Right Panel - 75-80% width):
   - Displays messages from selected conversation
   - Message input field at bottom
   - Auto-scrolls to latest message
   - Shows loading states
   - Displays streaming responses

### Implementation Structure

**File: `app/chatbot/[userId]/page.tsx`**

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { chatApiService } from '@/services/chatApi';
import { Conversation, Message } from '@/types/chat';
import { useChatAuth } from '@/hooks/useChatAuth';

export default function ChatbotPage() {
  const params = useParams();
  const userId = params.userId as string;
  const { token } = useChatAuth();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Load all conversations on mount
  useEffect(() => {
    if (userId && token) {
      loadConversations();
    }
  }, [userId, token]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversationId && userId && token) {
      loadConversationMessages(selectedConversationId);
    }
  }, [selectedConversationId, userId, token]);

  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true);
      chatApiService.setToken(token);
      const convos = await chatApiService.getConversations(userId);
      setConversations(convos);
      
      // Auto-select first conversation if available
      if (convos.length > 0 && !selectedConversationId) {
        setSelectedConversationId(convos[0].id);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadConversationMessages = async (conversationId: number) => {
    try {
      setIsLoadingMessages(true);
      chatApiService.setToken(token);
      const data = await chatApiService.getConversation(userId, conversationId);
      setMessages(data.messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    try {
      setIsSending(true);
      chatApiService.setToken(token);
      
      // Send message with or without conversation_id
      const response = await chatApiService.sendMessage(
        userId, 
        inputValue, 
        selectedConversationId || undefined
      );

      // Handle SSE stream response
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        let assistantMessage = '';
        let done = false;
        
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          
          if (value) {
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.substring(6);
                if (dataStr.trim()) {
                  try {
                    const data = JSON.parse(dataStr);
                    
                    if (data.type === 'content_block_delta' && data.delta?.text) {
                      assistantMessage += data.delta.text;
                      // Update UI with streaming message
                    } else if (data.type === 'message_end') {
                      // Message complete, reload conversation
                      if (selectedConversationId) {
                        await loadConversationMessages(selectedConversationId);
                      }
                    }
                  } catch (e) {
                    console.error('Error parsing SSE:', e);
                  }
                }
              }
            }
          }
        }
        
        reader.releaseLock();
      }
      
      setInputValue('');
      
      // Reload conversations list to update last message preview
      await loadConversations();
      
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setMessages([]);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4">
          <button
            onClick={handleNewConversation}
            className="w-full py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Conversation
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isLoadingConversations ? (
            <div className="p-4 text-center text-gray-400">Loading...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-center text-gray-400">No conversations yet</div>
          ) : (
            <div className="space-y-1 p-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversationId(conv.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedConversationId === conv.id
                      ? 'bg-gray-700'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <div className="font-medium truncate">{conv.title}</div>
                  <div className="text-sm text-gray-400 truncate">
                    {conv.lastMessagePreview}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Messages Display */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading messages...</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="mb-2">Start a new conversation</p>
                <p className="text-sm">Type a message below to begin</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !inputValue.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

---

## Implementation Guide

### Step 1: Update chatApi.ts Service

The service file should already have the necessary methods. Ensure the base URL is correctly configured:

```typescript
// In chatApi.ts
constructor() {
  this.baseUrl = 'https://naimalcreativityai-sdd-todo-app.hf.space/api';
}
```

### Step 2: Update ChatWidget Component

Add the "My Conversations" button to the existing ChatWidget:

```typescript
// In ChatWidget.tsx, add button before closing the chat interface div
<div className="border-t border-gray-200 p-3">
  <Button
    variant="outline"
    className="w-full"
    onClick={() => {
      window.location.href = `/chatbot/${userId}`;
    }}
  >
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className="h-5 w-5 mr-2" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
      />
    </svg>
    My Conversations
  </Button>
</div>
```

### Step 3: Create Full Chatbot Page

Create a new route at `app/chatbot/[userId]/page.tsx` with the implementation shown above in the Full Chatbot Page Interface section.

### Step 4: Update Environment Variables

Ensure your `.env.local` file has the correct API URL:

```env
NEXT_PUBLIC_API_URL=https://naimalcreativityai-sdd-todo-app.hf.space/api
```

### Step 5: Handle Authentication

Make sure the JWT token is properly retrieved and passed to the chat API service:

```typescript
const { token, userId } = useChatAuth();

useEffect(() => {
  if (token) {
    chatApiService.setToken(token);
  }
}, [token]);
```

---

## Payload Variations

### Key Differences

| Scenario | Payload Structure | Backend Behavior |
|----------|------------------|------------------|
| **New Conversation** | `{ "message": "..." }` | Creates a new conversation automatically |
| **Existing Conversation** | `{ "conversation_id": 17, "message": "..." }` | Adds message to existing conversation |

### When to Use Each Variation

1. **Use New Conversation Payload** when:
   - User starts chatting from the widget without selecting a conversation
   - User clicks "New Conversation" button on the full page
   - `selectedConversationId` is `null` or `undefined`

2. **Use Existing Conversation Payload** when:
   - User selects a conversation from the sidebar
   - User continues an ongoing conversation
   - `selectedConversationId` has a valid number value

### Implementation Logic

```typescript
async function sendMessage(userId: string, message: string, conversationId?: number, token: string) {
  const payload: any = { message };
  
  // Only add conversation_id if it exists
  if (conversationId) {
    payload.conversation_id = conversationId;
  }
  
  const response = await fetch(
    `https://naimalcreativityai-sdd-todo-app.hf.space/api/${userId}/chat`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    }
  );
  
  return response;
}
```

---

## Response Handling

### Server-Sent Events (SSE) Format

The chat endpoint returns a Server-Sent Events (SSE) stream with the following format:

```
data: {"type":"content_block_start","content_block":{"type":"text","text":""}}

data: {"type":"content_block_delta","delta":{"type":"text_delta","text":"Hello"}}

data: {"type":"content_block_delta","delta":{"type":"text_delta","text":" there!"}}

data: {"type":"message_end"}
```

### Parsing SSE Response

```typescript
async function handleSSEResponse(response: Response) {
  if (!response.body) {
    throw new Error('Response body is empty');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  
  let fullMessage = '';
  let done = false;
  
  while (!done) {
    const { value, done: readerDone } = await reader.read();
    done = readerDone;
    
    if (value) {
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const dataStr = line.substring(6).trim();
          
          if (dataStr) {
            try {
              const data = JSON.parse(dataStr);
              
              switch (data.type) {
                case 'content_block_start':
                  // Message streaming started
                  console.log('Streaming started');
                  break;
                  
                case 'content_block_delta':
                  if (data.delta?.text) {
                    fullMessage += data.delta.text;
                    // Update UI with new text chunk
                    updateStreamingMessage(fullMessage);
                  }
                  break;
                  
                case 'message_end':
                  // Message streaming completed
                  console.log('Streaming completed');
                  finalizeMessage(fullMessage);
                  break;
                  
                default:
                  console.log('Unknown event type:', data.type);
              }
            } catch (error) {
              console.error('Failed to parse SSE data:', error);
            }
          }
        }
      }
    }
  }
  
  reader.releaseLock();
  return fullMessage;
}
```

### UI Update During Streaming

```typescript
const [streamingMessageId, setStreamingMessageId] = useState<number | null>(null);

function updateStreamingMessage(text: string) {
  setMessages(prev => prev.map(msg => 
    msg.id === streamingMessageId 
      ? { ...msg, content: text, streaming: true }
      : msg
  ));
}

function finalizeMessage(text: string) {
  setMessages(prev => prev.map(msg => 
    msg.id === streamingMessageId 
      ? { ...msg, content: text, streaming: false, status: 'delivered' }
      : msg
  ));
  setStreamingMessageId(null);
}
```

---

## Error Handling

### Common Error Scenarios

1. **Authentication Error (401)**
```typescript
if (response.status === 401) {
  // Token expired or invalid
  // Redirect to login or refresh token
  console.error('Authentication failed');
  // Clear token and redirect
  authService.clearToken();
  router.push('/signin');
}
```

2. **Rate Limit Error (429)**
```typescript
if (response.status === 429) {
  showError('You are sending messages too quickly. Please wait a moment.');
}
```

3. **Server Error (500)**
```typescript
if (response.status === 500) {
  showError('Server error. Please try again later.');
}
```

4. **Network Error**
```typescript
try {
  const response = await fetch(url, options);
} catch (error) {
  if (error instanceof TypeError) {
    // Network error
    showError('Network error. Please check your connection.');
  }
}
```

### Error Display in UI

```typescript
function showError(message: string) {
  const errorMessage: Message = {
    id: Date.now(),
    conversationId: selectedConversationId || 0,
    userId: 'system',
    role: 'assistant',
    content: `⚠️ ${message}`,
    createdAt: new Date(),
    status: 'error',
    streaming: false
  };
  
  setMessages(prev => [...prev, errorMessage]);
}
```

### Retry Logic

```typescript
async function sendMessageWithRetry(
  userId: string, 
  message: string, 
  conversationId?: number,
  maxRetries = 3
) {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await sendMessage(userId, message, conversationId);
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry on 4xx errors (client errors)
      if (error instanceof Response && error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  
  throw lastError;
}
```

---

## Testing Checklist

### Chat Widget
- [ ] Widget appears on authenticated pages
- [ ] Widget button is visible in bottom-right corner
- [ ] Clicking button opens chat interface
- [ ] Can send messages and receive responses
- [ ] "My Conversations" button is visible
- [ ] Clicking "My Conversations" redirects to `/chatbot/{userId}`
- [ ] Widget state persists across page navigation
- [ ] Close button works correctly

### Full Chatbot Page (`/chatbot/{userId}`)
- [ ] Page loads all conversations in sidebar
- [ ] Sidebar displays conversation titles and previews
- [ ] Clicking a conversation loads its messages
- [ ] Selected conversation is highlighted
- [ ] "New Conversation" button creates new conversation
- [ ] Can send messages in selected conversation
- [ ] Can send messages in new conversation
- [ ] Messages display correctly (user vs assistant)
- [ ] Streaming responses work properly
- [ ] Scrolling works in sidebar and chat area
- [ ] Page is responsive on different screen sizes

### API Integration
- [ ] GET conversations endpoint works
- [ ] GET specific conversation endpoint works
- [ ] POST chat with new conversation works
- [ ] POST chat with existing conversation works
- [ ] Authorization token is sent correctly
- [ ] SSE streaming is handled properly
- [ ] Error responses are handled gracefully

### Edge Cases
- [ ] Empty conversations list displays appropriate message
- [ ] No selected conversation shows prompt to select or create
- [ ] Empty message cannot be sent
- [ ] Loading states display correctly
- [ ] Network errors show user-friendly messages
- [ ] Authentication errors redirect to login
- [ ] Rate limiting is handled appropriately

---

## Troubleshooting

### Issue: Conversation endpoint returns only metadata, no messages

**Cause**: The API currently returns only the conversation object `{ id, user_id, created_at, updated_at }` without a messages array

**Solution**: Handle the response structure correctly and build messages from chat interactions:

```typescript
const data = await chatApiService.getConversation(userId, conversationId);

// data will be: { id: 17, user_id: "...", created_at: "...", updated_at: "..." }
// NOT: { conversation: {...}, messages: [...] }

// Wrap the response to match expected format
const wrappedData = {
  conversation: data,
  messages: [] // Start with empty, build from chat interactions
};

// Then track messages locally as they're sent/received in the chat
```

### Issue: "Type errors" when receiving response

**Cause**: Response structure doesn't match TypeScript interface

**Solution**: Ensure response parsing includes proper type checking:

```typescript
const data = await response.json();

// Validate structure before using
if (!data || typeof data !== 'object') {
  throw new Error('Invalid response format');
}

// For conversations array
if (!Array.isArray(data)) {
  throw new Error('Expected array of conversations');
}

// For conversation with messages
if (!data.conversation || !Array.isArray(data.messages)) {
  throw new Error('Expected conversation object with messages array');
}
```

### Issue: "Getting nothing" in response

**Cause**: SSE stream not being read correctly

**Solution**: Check SSE handling:

```typescript
// Ensure you're reading the stream correctly
if (!response.body) {
  console.error('No response body');
  return;
}

// Log each chunk for debugging
const chunk = decoder.decode(value, { stream: true });
console.log('Received chunk:', chunk);

// Check for empty data
if (!dataStr || !dataStr.trim()) {
  console.log('Empty data string, skipping');
  continue;
}
```

### Issue: Token not being sent

**Cause**: Token not set in service or expired

**Solution**: Verify token handling:

```typescript
// Check token exists
const token = localStorage.getItem('auth_token');
if (!token) {
  console.error('No token found');
  // Redirect to login
  return;
}

// Verify token is being set
chatApiService.setToken(token);
console.log('Token set:', token.substring(0, 20) + '...');
```

### Issue: CORS errors

**Cause**: Backend not allowing frontend origin

**Solution**: This should be configured on the backend, but verify headers:

```typescript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  // Don't add Origin header - browser handles this
}
```

---

## Summary

This guide covers:

1. **Three API Endpoints**:
   - GET all conversations
   - GET specific conversation
   - POST chat message (with two payload variations)

2. **Two UI Interfaces**:
   - Chat Widget with "My Conversations" button
   - Full Chatbot Page with sidebar

3. **Complete Implementation**:
   - Service layer integration
   - Component structure
   - SSE stream handling
   - Error handling
   - Testing checklist

Follow this guide to implement a complete, production-ready chatbot system with proper conversation management and ChatGPT-like user experience.

