/**
 * TypeScript interfaces for ChatKit frontend integration
 * Based on the data model defined in specs/009-phase3-frontend-chatkit-integration/data-model.md
 */

export interface ChatSession {
  id: string;                    // Unique identifier for the session
  userId: string;               // ID of the authenticated user
  currentConversationId: number; // ID of the active conversation
  isActive: boolean;            // Whether the session is currently active
  connectionStatus: 'connected' | 'connecting' | 'disconnected'; // Current connection status
  createdAt: Date;              // When the session was created
  lastActivityAt: Date;         // Last interaction timestamp
}

export interface Conversation {
  id: number;                   // Unique identifier for the conversation
  userId: string;               // ID of the user who owns this conversation
  title: string;                // Generated title for the conversation
  createdAt: Date;              // When the conversation was created
  updatedAt: Date;              // Last updated timestamp
  messageCount: number;         // Total number of messages in the conversation
  lastMessagePreview: string;   // Preview of the last message
}

export interface Message {
  id: number;                   // Unique identifier for the message
  conversationId: number;       // ID of the conversation this message belongs to
  userId: string;              // ID of the user who sent the message (for user messages)
  role: 'user' | 'assistant';   // Role of the message sender
  content: string;              // Text content of the message
  createdAt: Date;              // When the message was created
  status: 'sent' | 'delivered' | 'read' | 'error'; // Delivery status
  streaming: boolean;           // Whether the message is currently streaming
}

export interface ChatWidgetState {
  isOpen: boolean;              // Whether the chat interface is expanded
  currentConversationId: number | null; // Currently selected conversation
  isLoading: boolean;           // Whether data is loading
  error: string | null;         // Current error message
  isMinimized: boolean;         // Whether widget is minimized
  position: 'bottom-right' | 'bottom-left'; // Widget position preference
  theme: 'light' | 'dark';      // Theme preference
  unreadCount: number;          // Number of unread messages
}