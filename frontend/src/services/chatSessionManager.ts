/**
 * Session management service for chat sessions
 * Handles connection status tracking, session reconnection logic, and conversation context maintenance
 */

import { ChatSession } from '@/types/chat';

class ChatSessionManager {
  private session: ChatSession | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  /**
   * Initialize a new chat session
   */
  async initSession(userId: string, currentConversationId: number | null): Promise<ChatSession> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.session = {
      id: sessionId,
      userId,
      currentConversationId: currentConversationId || 0, // Use 0 as default if null
      isActive: true,
      connectionStatus: 'connecting',
      createdAt: new Date(),
      lastActivityAt: new Date(),
    };

    // Simulate connection establishment
    await this.simulateConnection();

    return this.session;
  }

  /**
   * Simulate connection establishment for demo purposes
   */
  private async simulateConnection(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        if (this.session) {
          this.session.connectionStatus = 'connected';
          this.session.lastActivityAt = new Date();
        }
        resolve();
      }, 300); // Simulate connection delay
    });
  }

  /**
   * Get the current session
   */
  getSession(): ChatSession | null {
    return this.session;
  }

  /**
   * Update the current conversation in the session
   */
  updateConversation(conversationId: number): void {
    if (this.session) {
      this.session.currentConversationId = conversationId;
      this.session.lastActivityAt = new Date();
    }
  }

  /**
   * Update connection status
   */
  updateConnectionStatus(status: 'connected' | 'connecting' | 'disconnected'): void {
    if (this.session) {
      this.session.connectionStatus = status;
      this.session.lastActivityAt = new Date();

      if (status === 'disconnected') {
        this.attemptReconnection();
      }
    }
  }

  /**
   * Attempt to reconnect to the chat service
   */
  private attemptReconnection(): void {
    if (!this.session || this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    this.reconnectAttempts++;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(async () => {
      if (this.session) {
        this.session.connectionStatus = 'connecting';

        // Simulate reconnection attempt
        await this.simulateConnection();

        if (this.session.connectionStatus !== "connecting") {
          this.attemptReconnection(); // Try again
        } else {
          this.reconnectAttempts = 0; // Reset on successful connection
        }
      }
    }, 1000 * this.reconnectAttempts); // Exponential backoff
  }

  /**
   * Track activity in the session
   */
  recordActivity(): void {
    if (this.session) {
      this.session.lastActivityAt = new Date();
    }
  }

  /**
   * Check if session is expired (inactive for too long)
   */
  isExpired(maxInactiveMinutes: number = 30): boolean {
    if (!this.session) {
      return true;
    }

    const now = new Date();
    const inactiveDurationMs = now.getTime() - this.session.lastActivityAt.getTime();
    const maxInactiveMs = maxInactiveMinutes * 60 * 1000;

    return inactiveDurationMs > maxInactiveMs;
  }

  /**
   * End the current session
   */
  endSession(): void {
    if (this.session) {
      this.session.isActive = false;
      this.session.connectionStatus = 'disconnected';
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.reconnectAttempts = 0;
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): 'connected' | 'connecting' | 'disconnected' {
    return this.session?.connectionStatus || 'disconnected';
  }

  /**
   * Check if session is active
   */
  isActive(): boolean {
    return this.session?.isActive || false;
  }
}

// Export singleton instance
export const chatSessionManager = new ChatSessionManager();