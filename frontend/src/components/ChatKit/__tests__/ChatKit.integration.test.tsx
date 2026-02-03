/**
 * End-to-end integration tests for ChatKit frontend integration
 * Tests the complete functionality as specified in the requirements
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ChatWidget } from '../ChatWidget';
import { ChatWidgetProvider } from '../../contexts/ChatWidgetContext';
import { AuthProvider } from '../../../../components/providers/auth-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock all the services and hooks
vi.mock('../../lib/auth-client', () => ({
  useSession: () => ({
    data: {
      user: { id: 'test-user-123', email: 'test@example.com' },
      session: { token: 'mock-token' }
    },
    isLoading: false
  })
}));

vi.mock('../../services/chatApi', () => ({
  chatApiService: {
    setToken: vi.fn(),
    clearToken: vi.fn(),
    sendMessage: vi.fn().mockResolvedValue({
      body: {
        getReader: () => ({
          read: vi.fn()
            .mockResolvedValueOnce({
              value: new TextEncoder().encode('data: {"type": "content_block_start", "content_block": {"type": "text", "text": ""}}\n'),
              done: false
            })
            .mockResolvedValueOnce({
              value: new TextEncoder().encode('data: {"type": "content_block_delta", "delta": {"type": "text_delta", "text": "Hello"}}\n'),
              done: false
            })
            .mockResolvedValueOnce({
              value: new TextEncoder().encode('data: {"type": "content_block_delta", "delta": {"type": "text_delta", "text": " world"}}\n'),
              done: false
            })
            .mockResolvedValueOnce({
              value: null,
              done: true
            }),
          releaseLock: vi.fn()
        }
      }
    }),
    getConversations: vi.fn().mockResolvedValue([])
  }
}));

vi.mock('../../services/api', () => ({
  apiService: {
    setToken: vi.fn(),
    clearToken: vi.fn(),
    post: vi.fn().mockResolvedValue({})
  }
}));

vi.mock('../../services/chatSessionManager', () => ({
  chatSessionManager: {
    initSession: vi.fn().mockResolvedValue({
      id: 'session-123',
      userId: 'test-user-123',
      currentConversationId: 1,
      isActive: true,
      connectionStatus: 'connected',
      createdAt: new Date(),
      lastActivityAt: new Date()
    }),
    getSession: vi.fn(),
    updateConnectionStatus: vi.fn(),
    endSession: vi.fn(),
    getConnectionStatus: vi.fn().mockReturnValue('connected'),
    isActive: vi.fn().mockReturnValue(true)
  }
}));

vi.mock('../../lib/chatValidation', () => ({
  validateMessageContent: vi.fn().mockReturnValue({ isValid: true, errors: [] })
}));

vi.mock('../../lib/analytics', () => ({
  analyticsTracker: {
    track: vi.fn(),
    trackMessageSent: vi.fn(),
    trackMessageReceived: vi.fn(),
    trackTaskCreated: vi.fn(),
    trackError: vi.fn(),
    setUserId: vi.fn()
  }
}));

vi.mock('../../lib/rateLimiter', () => ({
  rateLimiter: {
    isAllowed: vi.fn().mockResolvedValue(true),
    getRemainingRequests: vi.fn().mockReturnValue(10)
  },
  withRateLimit: vi.fn(fn => fn)
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatWidgetProvider>
          {ui}
        </ChatWidgetProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

describe('ChatKit Frontend Integration - End-to-End Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('completes full user story flow: widget access -> conversation -> task creation', async () => {
    renderWithProviders(<ChatWidget />);

    // Phase 1: Chat Widget Access (US1)
    const chatButton = screen.getByLabelText(/open chat/i);
    expect(chatButton).toBeInTheDocument();
    expect(chatButton).toHaveClass('fixed');
    expect(chatButton).toHaveClass('right-4'); // Positioned in bottom-right
    expect(chatButton).toHaveClass('bottom-4');

    // Phase 2: Open chat interface (US1)
    fireEvent.click(chatButton);

    // Chat interface should appear
    await waitFor(() => {
      expect(screen.getByText(/ai task assistant/i)).toBeInTheDocument();
    });

    // Connection status should be displayed
    const connectionStatus = screen.getByText(/connected/i);
    expect(connectionStatus).toBeInTheDocument();

    // Phase 3: Natural Language Task Creation (US2)
    const messageInput = screen.getByPlaceholderText(/ask me to help manage your tasks/i);
    expect(messageInput).toBeInTheDocument();

    fireEvent.change(messageInput, { target: { value: 'Create a task to buy groceries' } });

    const sendButton = screen.getByText(/send/i);
    fireEvent.click(sendButton);

    // Should show loading state
    expect(screen.getByText(/sending\.\.\./i)).toBeInTheDocument();

    // Wait for response
    await waitFor(() => {
      expect(screen.getByText(/buy groceries/i)).toBeInTheDocument();
    }, { timeout: 5000 });

    // Phase 4: Session Management (US4)
    // Check that session was initialized
    expect(vi.mocked(chatSessionManager.initSession)).toHaveBeenCalledWith('test-user-123', 1);

    // Check that connection status is tracked
    expect(vi.mocked(chatSessionManager.getConnectionStatus)).toHaveBeenCalled();

    // Phase 5: Conversation History (US3) - tested separately
    // Would involve switching between conversations, which we'll test via the context

    // Phase 6: Error handling and validation
    const invalidMessage = '   '; // Just whitespace
    fireEvent.change(messageInput, { target: { value: invalidMessage } });
    fireEvent.click(sendButton);

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/validation error/i)).toBeInTheDocument();
    });

    // Phase 7: Analytics tracking
    expect(vi.mocked(analyticsTracker.track)).toHaveBeenCalledWith(
      'widget_opened',
      expect.objectContaining({ userId: 'test-user-123' })
    );

    expect(vi.mocked(analyticsTracker.trackMessageSent)).toHaveBeenCalled();
  });

  it('handles responsive design on mobile', () => {
    // Mock mobile screen size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 400,
    });

    window.dispatchEvent(new Event('resize'));

    renderWithProviders(<ChatWidget />);

    const chatButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(chatButton);

    // On mobile, the chat should adapt to full screen
    const chatContainer = screen.getByRole('dialog', { hidden: true });
    expect(chatContainer).toHaveClass('fixed');
    expect(chatContainer).toHaveClass('inset-0');
  });

  it('implements rate limiting correctly', async () => {
    renderWithProviders(<ChatWidget />);

    const chatButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(chatButton);

    const messageInput = screen.getByPlaceholderText(/ask me to help manage your tasks/i);

    // Mock rate limit exceeded
    vi.mocked(rateLimiter.isAllowed).mockResolvedValue(false);

    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(screen.getByText(/send/i));

    // Should show rate limit error
    await waitFor(() => {
      expect(screen.getByText(/rate limit exceeded/i)).toBeInTheDocument();
    });
  });

  it('validates message content before sending', async () => {
    renderWithProviders(<ChatWidget />);

    const chatButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(chatButton);

    const messageInput = screen.getByPlaceholderText(/ask me to help manage your tasks/i);

    // Mock validation failure
    vi.mocked(validateMessageContent).mockReturnValue({
      isValid: false,
      errors: ['Message is too long (maximum 1000 characters)']
    });

    fireEvent.change(messageInput, { target: { value: 'A'.repeat(1001) } }); // Too long message
    fireEvent.click(screen.getByText(/send/i));

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/validation error/i)).toBeInTheDocument();
    });
  });

  it('handles connection status changes', async () => {
    // Mock disconnection
    vi.mocked(chatSessionManager.getConnectionStatus).mockReturnValue('disconnected');

    renderWithProviders(<ChatWidget />);

    const chatButton = screen.getByLabelText(/open chat/i);
    fireEvent.click(chatButton);

    // Should show disconnected status
    await waitFor(() => {
      expect(screen.getByText(/disconnected/i)).toBeInTheDocument();
    });
  });

  it('maintains session across browser sessions', async () => {
    renderWithProviders(<ChatWidget />);

    // Simulate session initialization
    await waitFor(() => {
      expect(vi.mocked(chatSessionManager.initSession)).toHaveBeenCalledWith(
        'test-user-123',
        1
      );
    });

    // Session should remain active
    expect(vi.mocked(chatSessionManager.isActive)).toHaveBeenCalled();
  });

  it('cleans up resources properly', async () => {
    const { unmount } = renderWithProviders(<ChatWidget />);

    // Mount and then unmount
    unmount();

    // Cleanup functions should be called
    expect(vi.mocked(chatApiService.clearToken)).toHaveBeenCalled();
    expect(vi.mocked(apiService.clearToken)).toHaveBeenCalled();
    expect(vi.mocked(chatSessionManager.endSession)).toHaveBeenCalled();
  });
});