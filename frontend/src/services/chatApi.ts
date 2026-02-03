/**
 * Chat API service for interacting with backend chat endpoints
 * Handles authentication, API calls, and Server-Sent Events (SSE) for chat functionality
 */

import { Message, Conversation } from '@/types/chat';

class ChatApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    // Use the base URL as specified in the integration guide
    this.baseUrl = process.env.NEXT_PUBLIC_CHAT_API_URL ||
                   process.env.NEXT_PUBLIC_API_URL ||
                   'https://naimalcreativityai-sdd-todo-app.hf.space/api';
  }

  /**
   * Set authentication token for API calls
   */
  setToken(token: string) {
    this.token = token;
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.token = null;
  }

  /**
   * Send a message to the chat API and return an SSE stream
   */
  async sendMessage(userId: string, message: string, conversationId?: number) {
    // Ensure baseUrl ends with /api for the correct endpoint structure
    let apiUrl = this.baseUrl;
    if (!apiUrl.endsWith('/api')) {
      apiUrl = apiUrl.endsWith('/') ? `${apiUrl}api` : `${apiUrl}/api`;
    }

    const url = `${apiUrl}/${userId}/chat`;

    const requestBody: any = {
      message,
    };

    // Only add conversation_id if it exists (for existing conversations)
    if (conversationId !== undefined && conversationId !== null) {
      requestBody.conversation_id = conversationId;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText} (Status: ${response.status})`);
    }

    return response;
  }

  /**
   * Fetch user's conversations
   */
  async getConversations(userId: string): Promise<Conversation[]> {
    // Ensure baseUrl ends with /api for the correct endpoint structure
    let apiUrl = this.baseUrl;
    if (!apiUrl.endsWith('/api')) {
      apiUrl = apiUrl.endsWith('/') ? `${apiUrl}api` : `${apiUrl}/api`;
    }

    const url = `${apiUrl}/${userId}/conversations`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch conversations: ${response.statusText} (Status: ${response.status})`);
    }

    const data = await response.json();
    console.log('Raw conversations data from API:', data);
    
    // Transform API response to match frontend interface
    // API returns: { id, user_id, created_at, updated_at }
    // Frontend expects: { id, userId, title, createdAt, updatedAt, messageCount, lastMessagePreview }
    if (Array.isArray(data)) {
      return data.map((conv: any) => ({
        id: conv.id,
        userId: conv.user_id || conv.userId,
        title: conv.title || `Conversation ${conv.id}`, // Use ID as title for now
        createdAt: conv.created_at || conv.createdAt,
        updatedAt: conv.updated_at || conv.updatedAt,
        messageCount: conv.message_count || conv.messageCount || 0,
        lastMessagePreview: conv.last_message_preview || conv.lastMessagePreview || ''
      }));
    }
    
    return [];
  }

  /**
   * Fetch a specific conversation with its messages
   * Note: The API currently returns only the conversation object without messages
   */
  async getConversation(userId: string, conversationId: number): Promise<{ conversation: Conversation; messages: Message[] }> {
    // Ensure baseUrl ends with /api for the correct endpoint structure
    let apiUrl = this.baseUrl;
    if (!apiUrl.endsWith('/api')) {
      apiUrl = apiUrl.endsWith('/') ? `${apiUrl}api` : `${apiUrl}/api`;
    }

    const url = `${apiUrl}/${userId}/conversations/${conversationId}`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch conversation: ${response.statusText} (Status: ${response.status})`);
    }

    const data = await response.json();
    console.log('Raw conversation API response:', data);
    
    // Handle different response formats from the API
    // Format 1: { conversation: {...}, messages: [...] }
    if (data.conversation && Array.isArray(data.messages)) {
      // Transform messages to match Message interface
      const transformedMessages = data.messages.map((msg: any) => ({
        id: msg.id,
        conversationId: conversationId,
        userId: msg.user_id || msg.userId || (msg.role === 'user' ? userId : 'assistant'),
        role: msg.role,
        content: msg.content,
        createdAt: msg.created_at ? new Date(msg.created_at) : (msg.createdAt ? new Date(msg.createdAt) : new Date()),
        status: msg.status || 'delivered',
        streaming: false
      }));
      
      return {
        conversation: data.conversation,
        messages: transformedMessages
      };
    }
    
    // Format 2: { id: 17, user_id: "...", messages: [...] } - messages directly in conversation object
    if (data.messages && Array.isArray(data.messages)) {
      console.log('Found messages array directly in response:', data.messages.length);
      
      // Transform messages to match Message interface
      const transformedMessages = data.messages.map((msg: any) => ({
        id: msg.id,
        conversationId: conversationId,
        userId: msg.user_id || msg.userId || (msg.role === 'user' ? userId : 'assistant'),
        role: msg.role,
        content: msg.content,
        createdAt: msg.created_at ? new Date(msg.created_at) : (msg.createdAt ? new Date(msg.createdAt) : new Date()),
        status: msg.status || 'delivered',
        streaming: false
      }));
      
      // Transform conversation object
      const conversation: Conversation = {
        id: data.id,
        userId: data.user_id || data.userId,
        title: data.title || `Conversation ${data.id}`,
        createdAt: data.created_at ? new Date(data.created_at) : (data.createdAt ? new Date(data.createdAt) : new Date()),
        updatedAt: data.updated_at ? new Date(data.updated_at) : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
        messageCount: data.messages.length,
        lastMessagePreview: data.messages.length > 0 ? (data.messages[data.messages.length - 1].content || '').substring(0, 50) : ''
      };
      
      console.log('Transformed messages:', transformedMessages);
      console.log('Transformed conversation:', conversation);
      
      return {
        conversation: conversation,
        messages: transformedMessages
      };
    }
    
    // Format 3: Just conversation object without messages
    console.warn('No messages found in response, returning empty array');
    const conversation: Conversation = {
      id: data.id,
      userId: data.user_id || data.userId,
      title: data.title || `Conversation ${data.id}`,
      createdAt: data.created_at ? new Date(data.created_at) : (data.createdAt ? new Date(data.createdAt) : new Date()),
      updatedAt: data.updated_at ? new Date(data.updated_at) : (data.updatedAt ? new Date(data.updatedAt) : new Date()),
      messageCount: 0,
      lastMessagePreview: ''
    };
    
    return {
      conversation: conversation,
      messages: []
    };
  }

  /**
   * Create a new conversation
   */
  async createConversation(userId: string, title: string): Promise<Conversation> {
    // Ensure baseUrl ends with /api for the correct endpoint structure
    let apiUrl = this.baseUrl;
    if (!apiUrl.endsWith('/api')) {
      apiUrl = apiUrl.endsWith('/') ? `${apiUrl}api` : `${apiUrl}/api`;
    }

    const url = `${apiUrl}/${userId}/conversations`;

    const requestBody = {
      title,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to create conversation: ${response.statusText} (Status: ${response.status})`);
    }

    return response.json();
  }

  /**
   * Update conversation title
   */
  async updateConversation(userId: string, conversationId: number, title: string): Promise<Conversation> {
    // Ensure baseUrl ends with /api for the correct endpoint structure
    let apiUrl = this.baseUrl;
    if (!apiUrl.endsWith('/api')) {
      apiUrl = apiUrl.endsWith('/') ? `${apiUrl}api` : `${apiUrl}/api`;
    }

    const url = `${apiUrl}/${userId}/conversations/${conversationId}`;

    const requestBody = {
      title,
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Failed to update conversation: ${response.statusText} (Status: ${response.status})`);
    }

    return response.json();
  }

  /**
   * Delete a conversation
   */
  async deleteConversation(userId: string, conversationId: number): Promise<void> {
    // Ensure baseUrl ends with /api for the correct endpoint structure
    let apiUrl = this.baseUrl;
    if (!apiUrl.endsWith('/api')) {
      apiUrl = apiUrl.endsWith('/') ? `${apiUrl}api` : `${apiUrl}/api`;
    }

    const url = `${apiUrl}/${userId}/conversations/${conversationId}`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to delete conversation: ${response.statusText} (Status: ${response.status})`);
    }
  }
}

// Export singleton instance
export const chatApiService = new ChatApiService();