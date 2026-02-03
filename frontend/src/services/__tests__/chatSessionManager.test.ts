/**
 * Session management tests for chat functionality
 * Tests connection status tracking, reconnection logic, and session maintenance
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { chatSessionManager } from '../../../services/chatSessionManager';

// Mock console for testing
const mockConsole = {
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
};

// Replace console with mock during tests
global.console = mockConsole as any;

describe('Chat Session Management Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the session manager to initial state
    chatSessionManager['session'] = null;
    chatSessionManager['reconnectAttempts'] = 0;
    if (chatSessionManager['reconnectTimeout']) {
      clearTimeout(chatSessionManager['reconnectTimeout']);
      chatSessionManager['reconnectTimeout'] = null;
    }
  });

  afterEach(() => {
    if (chatSessionManager['reconnectTimeout']) {
      clearTimeout(chatSessionManager['reconnectTimeout']);
    }
  });

  it('initializes a new chat session', async () => {
    const userId = 'test-user-123';
    const conversationId = 1;

    const session = await chatSessionManager.initSession(userId, conversationId);

    expect(session).toBeDefined();
    expect(session.userId).toBe(userId);
    expect(session.currentConversationId).toBe(conversationId);
    expect(session.isActive).toBe(true);
    expect(session.connectionStatus).toBe('connected');
    expect(session.id).toMatch(/^session_\d+_[a-z0-9]+$/);
  });

  it('tracks connection status correctly', () => {
    const status = chatSessionManager.getConnectionStatus();
    expect(status).toBe('disconnected');

    // Initialize a session to change the status
    const initSession = async () => {
      await chatSessionManager.initSession('test-user', 1);
      expect(chatSessionManager.getConnectionStatus()).toBe('connected');
    };

    return initSession();
  });

  it('updates conversation in session', async () => {
    await chatSessionManager.initSession('test-user', 1);

    chatSessionManager.updateConversation(2);

    const session = chatSessionManager.getSession();
    expect(session).toBeDefined();
    expect(session!.currentConversationId).toBe(2);
  });

  it('handles disconnection and attempts reconnection', async () => {
    await chatSessionManager.initSession('test-user', 1);

    // Mock setTimeout to control the reconnection timing
    const originalSetTimeout = global.setTimeout;
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout').mockImplementation((callback, delay) => {
      return originalSetTimeout(callback, 1); // Speed up for testing
    });

    // Set connection to disconnected to trigger reconnection
    chatSessionManager.updateConnectionStatus('disconnected');

    expect(chatSessionManager.getConnectionStatus()).toBe('disconnected');

    // Allow reconnection attempt to happen
    await new Promise(resolve => setTimeout(resolve, 10));

    // Should be attempting to reconnect
    expect(chatSessionManager['reconnectAttempts']).toBeGreaterThan(0);

    setTimeoutSpy.mockRestore();
  });

  it('resets reconnect attempts on successful connection', async () => {
    await chatSessionManager.initSession('test-user', 1);

    // Manually increase reconnect attempts
    chatSessionManager['reconnectAttempts'] = 2;

    // Update connection status to connected
    chatSessionManager.updateConnectionStatus('connected');

    expect(chatSessionManager['reconnectAttempts']).toBe(0);
  });

  it('tracks activity in session', async () => {
    await chatSessionManager.initSession('test-user', 1);

    const initialLastActivity = chatSessionManager.getSession()?.lastActivityAt;

    // Record activity
    chatSessionManager.recordActivity();

    const updatedSession = chatSessionManager.getSession();
    expect(updatedSession?.lastActivityAt.getTime()).toBeGreaterThanOrEqual(initialLastActivity!.getTime());
  });

  it('detects expired sessions', async () => {
    await chatSessionManager.initSession('test-user', 1);

    // Mock a past timestamp to make session appear expired
    const pastDate = new Date(Date.now() - 40 * 60 * 1000); // 40 minutes ago
    chatSessionManager['session']!.lastActivityAt = pastDate;

    const isExpired = chatSessionManager.isExpired(30); // 30 minute threshold
    expect(isExpired).toBe(true);
  });

  it('does not expire active sessions', async () => {
    await chatSessionManager.initSession('test-user', 1);

    const isExpired = chatSessionManager.isExpired(30); // 30 minute threshold
    expect(isExpired).toBe(false);
  });

  it('ends session properly', async () => {
    await chatSessionManager.initSession('test-user', 1);

    chatSessionManager.endSession();

    const session = chatSessionManager.getSession();
    expect(session?.isActive).toBe(false);
    expect(session?.connectionStatus).toBe('disconnected');
  });

  it('reports active status correctly', async () => {
    await chatSessionManager.initSession('test-user', 1);

    expect(chatSessionManager.isActive()).toBe(true);

    chatSessionManager.endSession();

    expect(chatSessionManager.isActive()).toBe(false);
  });

  it('limits reconnection attempts', async () => {
    await chatSessionManager.initSession('test-user', 1);

    // Manually set max attempts reached
    chatSessionManager['reconnectAttempts'] = 5;
    chatSessionManager['maxReconnectAttempts'] = 5;

    // Try to trigger reconnection - should not attempt since max reached
    chatSessionManager['attemptReconnection']();

    // Check that attempts weren't increased further
    expect(chatSessionManager['reconnectAttempts']).toBe(5);
  });
});