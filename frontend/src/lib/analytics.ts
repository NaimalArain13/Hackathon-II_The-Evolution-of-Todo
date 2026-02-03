/**
 * Analytics utilities for chat interactions
 * Tracks user engagement and usage patterns
 */

interface ChatEvent {
  type: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

class AnalyticsTracker {
  private events: ChatEvent[] = [];
  private userId: string | null = null;
  private sessionId: string | null = null;
  private enabled: boolean = true;

  /**
   * Enable or disable analytics tracking
   */
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  /**
   * Set the current user ID
   */
  setUserId(userId: string) {
    this.userId = userId;
  }

  /**
   * Set the current session ID
   */
  setSessionId(sessionId: string) {
    this.sessionId = sessionId;
  }

  /**
   * Track a chat event
   */
  track(type: string, metadata?: Record<string, any>) {
    if (!this.enabled) return;

    const event: ChatEvent = {
      type,
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionId || undefined,
      metadata
    };

    this.events.push(event);

    // For now, just log to console. In production, this would send to analytics service
    if (typeof window !== 'undefined') {
      console.debug('Chat Analytics Event:', event);
    }

    // Optional: Send to analytics service
    this.sendEvent(event);
  }

  /**
   * Send event to analytics service
   */
  private async sendEvent(event: ChatEvent) {
    // In a real implementation, this would send to an analytics service
    // For now, we'll just simulate it
    try {
      // Example: await fetch('/api/analytics', { method: 'POST', body: JSON.stringify(event) });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  /**
   * Get tracked events
   */
  getEvents(): ChatEvent[] {
    return [...this.events];
  }

  /**
   * Clear all events
   */
  clearEvents() {
    this.events = [];
  }

  /**
   * Track message sent
   */
  trackMessageSent(message: string, messageId: string) {
    this.track('message_sent', {
      messageId,
      messageLength: message.length,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track message received
   */
  trackMessageReceived(message: string, messageId: string) {
    this.track('message_received', {
      messageId,
      messageLength: message.length,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track task creation
   */
  trackTaskCreated(taskDetails: any) {
    this.track('task_created', {
      ...taskDetails,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track session start
   */
  trackSessionStart(sessionId: string) {
    this.setSessionId(sessionId);
    this.track('session_start', {
      sessionId,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track session end
   */
  trackSessionEnd() {
    this.track('session_end', {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    });
    this.setSessionId(null);
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: string) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  }
}

// Export singleton instance
export const analyticsTracker = new AnalyticsTracker();