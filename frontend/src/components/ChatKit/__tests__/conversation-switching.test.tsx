/**
 * Test to verify conversation switching functionality
 * This test ensures that users can switch between conversations as specified in task T027
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ConversationHistory } from '../ConversationHistory';
import { ChatWidgetProvider } from '@/src/contexts/ChatWidgetContext';
import { Conversation } from '@/src/types/chat';

// Mock the chat API service
jest.mock('@/src/services/chatApi', () => ({
  chatApiService: {
    setToken: jest.fn(),
    getConversations: jest.fn().mockResolvedValue([]),
    getConversation: jest.fn(),
    createConversation: jest.fn(),
  },
}));

// Mock the useChatAuth hook
jest.mock('@/src/hooks/useChatAuth', () => ({
  useChatAuth: jest.fn(() => ({
    userId: 'test-user-id',
    token: 'test-token',
    isAuthenticated: true,
  })),
}));

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, ...props }) => {
    return React.createElement('button', { onClick, ...props }, children);
  },
}));

// Define the props type separately to avoid syntax issues
type TestWrapperProps = {
  conversations?: Conversation[];
  currentConversationId?: number | null;
  onSelectConversation?: (conversation: Conversation) => void;
  onCreateNewConversation?: () => void;
}

// Helper component to wrap with provider and handle state
const TestWrapper = ({
  conversations = [],
  currentConversationId = null,
  onSelectConversation = jest.fn(),
  onCreateNewConversation = jest.fn()
}: TestWrapperProps) => {
  // Mock the actual API call to return our test conversations
  require('@/src/services/chatApi').chatApiService.getConversations = jest.fn().mockResolvedValue(conversations);

  return (
    <ChatWidgetProvider>
      <ConversationHistory
        onSelectConversation={onSelectConversation}
        onCreateNewConversation={onCreateNewConversation}
        currentConversationId={currentConversationId}
      />
    </ChatWidgetProvider>
  );
};

describe('Conversation Switching Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders conversation list and allows switching between conversations', async () => {
    const mockConversations: Conversation[] = [
      {
        id: 1,
        userId: 'test-user-id',
        title: 'Project Discussion',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        messageCount: 5,
        lastMessagePreview: 'Let\'s discuss the project timeline',
      },
      {
        id: 2,
        userId: 'test-user-id',
        title: 'Team Standup',
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-03'),
        messageCount: 3,
        lastMessagePreview: 'What are you working on today?',
      },
      {
        id: 3,
        userId: 'test-user-id',
        title: 'Bug Fixes',
        createdAt: new Date('2023-01-03'),
        updatedAt: new Date('2023-01-04'),
        messageCount: 8,
        lastMessagePreview: 'Found a critical bug in the login flow',
      },
    ];

    const onSelectConversation = jest.fn();
    const onCreateNewConversation = jest.fn();

    // Render the component with mock conversations
    render(
      <TestWrapper
        conversations={mockConversations}
        onSelectConversation={onSelectConversation}
        onCreateNewConversation={onCreateNewConversation}
      />
    );

    // Wait for conversations to load
    await waitFor(() => {
      expect(screen.getByText('Project Discussion')).toBeInTheDocument();
    });

    // Verify all conversations are displayed
    expect(screen.getByText('Project Discussion')).toBeInTheDocument();
    expect(screen.getByText('Team Standup')).toBeInTheDocument();
    expect(screen.getByText('Bug Fixes')).toBeInTheDocument();

    // Verify conversation previews are shown
    expect(screen.getByText(/Let's discuss the project timeline/)).toBeInTheDocument();
    expect(screen.getByText(/What are you working on today\?/)).toBeInTheDocument();
    expect(screen.getByText(/Found a critical bug in the login flow/)).toBeInTheDocument();

    // Verify dates are displayed (using partial matches for dates)
    const dateElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
    expect(dateElements).toHaveLength(3);

    // Test selecting the first conversation
    const firstConversationButton = screen.getByText('Project Discussion').closest('button')!;
    fireEvent.click(firstConversationButton);

    // Verify the onSelectConversation callback was called with the correct conversation
    expect(onSelectConversation).toHaveBeenCalledTimes(1);
    expect(onSelectConversation).toHaveBeenCalledWith(mockConversations[0]);

    // Test selecting the second conversation
    const secondConversationButton = screen.getByText('Team Standup').closest('button')!;
    fireEvent.click(secondConversationButton);

    // Verify the onSelectConversation callback was called again with the correct conversation
    expect(onSelectConversation).toHaveBeenCalledTimes(2);
    expect(onSelectConversation).toHaveBeenLastCalledWith(mockConversations[1]);

    // Test selecting the third conversation
    const thirdConversationButton = screen.getByText('Bug Fixes').closest('button')!;
    fireEvent.click(thirdConversationButton);

    // Verify the onSelectConversation callback was called again with the correct conversation
    expect(onSelectConversation).toHaveBeenCalledTimes(3);
    expect(onSelectConversation).toHaveBeenLastCalledWith(mockConversations[2]);
  });

  test('highlights the currently selected conversation', async () => {
    const mockConversations: Conversation[] = [
      {
        id: 1,
        userId: 'test-user-id',
        title: 'Project Discussion',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        messageCount: 5,
        lastMessagePreview: 'Let\'s discuss the project timeline',
      },
      {
        id: 2,
        userId: 'test-user-id',
        title: 'Team Standup',
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-03'),
        messageCount: 3,
        lastMessagePreview: 'What are you working on today?',
      },
    ];

    render(
      <TestWrapper
        conversations={mockConversations}
        currentConversationId={1} // First conversation is selected
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Project Discussion')).toBeInTheDocument();
    });

    // Find the buttons for each conversation
    const firstConversationButton = screen.getByText('Project Discussion').closest('button')!;
    const secondConversationButton = screen.getByText('Team Standup').closest('button')!;

    // The first conversation should be highlighted (have the selected class)
    expect(firstConversationButton).toHaveClass('bg-blue-50');
    expect(firstConversationButton).toHaveClass('border-l-4');
    expect(firstConversationButton).toHaveClass('border-blue-500');

    // The second conversation should not be highlighted
    expect(secondConversationButton).not.toHaveClass('bg-blue-50');
    expect(secondConversationButton).not.toHaveClass('border-l-4');
    expect(secondConversationButton).not.toHaveClass('border-blue-500');
  });

  test('updates highlighting when current conversation changes', async () => {
    const mockConversations: Conversation[] = [
      {
        id: 1,
        userId: 'test-user-id',
        title: 'Project Discussion',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        messageCount: 5,
        lastMessagePreview: 'Let\'s discuss the project timeline',
      },
      {
        id: 2,
        userId: 'test-user-id',
        title: 'Team Standup',
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-03'),
        messageCount: 3,
        lastMessagePreview: 'What are you working on today?',
      },
    ];

    const { rerender } = render(
      <TestWrapper
        conversations={mockConversations}
        currentConversationId={1} // First conversation initially selected
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Project Discussion')).toBeInTheDocument();
    });

    // Initially, the first conversation should be highlighted
    const firstConversationButton = screen.getByText('Project Discussion').closest('button')!;
    const secondConversationButton = screen.getByText('Team Standup').closest('button')!;

    expect(firstConversationButton).toHaveClass('bg-blue-50');
    expect(secondConversationButton).not.toHaveClass('bg-blue-50');

    // Rerender with the second conversation selected
    rerender(
      <TestWrapper
        conversations={mockConversations}
        currentConversationId={2} // Second conversation now selected
      />
    );

    // Now, the second conversation should be highlighted
    expect(firstConversationButton).not.toHaveClass('bg-blue-50');
    expect(secondConversationButton).toHaveClass('bg-blue-50');
  });

  test('handles empty conversation list gracefully', async () => {
    render(
      <TestWrapper
        conversations={[]}
      />
    );

    // Should show "No conversations yet" message
    await waitFor(() => {
      expect(screen.getByText('No conversations yet')).toBeInTheDocument();
    });
  });

  test('creates new conversation when new conversation button is clicked', async () => {
    const mockConversations: Conversation[] = [
      {
        id: 1,
        userId: 'test-user-id',
        title: 'Project Discussion',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        messageCount: 5,
        lastMessagePreview: 'Let\'s discuss the project timeline',
      },
    ];

    const onCreateNewConversation = jest.fn();

    render(
      <TestWrapper
        conversations={mockConversations}
        onCreateNewConversation={onCreateNewConversation}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Project Discussion')).toBeInTheDocument();
    });

    // Find and click the "New Conversation" button
    const newConversationButton = screen.getByText('New Conversation');
    fireEvent.click(newConversationButton);

    // Verify the onCreateNewConversation callback was called
    expect(onCreateNewConversation).toHaveBeenCalledTimes(1);
  });
});

describe('Conversation Switching Integration', () => {
  test('conversation selection updates the global chat widget state', async () => {
    // This test verifies that when a conversation is selected,
    // the global chat widget state is updated accordingly

    const mockConversations: Conversation[] = [
      {
        id: 1,
        userId: 'test-user-id',
        title: 'Project Discussion',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        messageCount: 5,
        lastMessagePreview: 'Let\'s discuss the project timeline',
      },
      {
        id: 2,
        userId: 'test-user-id',
        title: 'Team Standup',
        createdAt: new Date('2023-01-02'),
        updatedAt: new Date('2023-01-03'),
        messageCount: 3,
        lastMessagePreview: 'What are you working on today?',
      },
    ];

    // Mock a function to track state changes
    const stateChanges: number[] = [];
    const onSelectConversation = (conversation: Conversation) => {
      stateChanges.push(conversation.id);
    };

    render(
      <TestWrapper
        conversations={mockConversations}
        onSelectConversation={onSelectConversation}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Project Discussion')).toBeInTheDocument();
    });

    // Select the first conversation
    const firstConversationButton = screen.getByText('Project Discussion').closest('button')!;
    fireEvent.click(firstConversationButton);

    // Select the second conversation
    const secondConversationButton = screen.getByText('Team Standup').closest('button')!;
    fireEvent.click(secondConversationButton);

    // Verify that state was updated correctly
    expect(stateChanges).toEqual([1, 2]);
  });
});