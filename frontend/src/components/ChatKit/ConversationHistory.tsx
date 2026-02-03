/**
 * ConversationHistory component - Sidebar for viewing and switching conversations
 * Displays a list of conversations with titles and previews
 */

'use client';

import { useState, useEffect } from 'react';
import { Conversation } from '@/types/chat';
import { chatApiService } from '@/services/chatApi';
import { useChatAuth } from '@/hooks/useChatAuth';
import { Button } from '@/components/ui/button';

interface ConversationHistoryProps {
  onSelectConversation: (conversation: Conversation) => void;
  onCreateNewConversation: () => void;
  currentConversationId: number | null;
}

export function ConversationHistory({
  onSelectConversation,
  onCreateNewConversation,
  currentConversationId
}: ConversationHistoryProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { userId, token } = useChatAuth();

  useEffect(() => {
    if (userId && token) {
      loadConversations();
    }
  }, [userId, token]);

  const loadConversations = async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      chatApiService.setToken(token);
      const convos = await chatApiService.getConversations(userId);
      setConversations(convos);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConversation = (conversation: Conversation) => {
    onSelectConversation(conversation);
  };

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Conversations</h3>
        <Button
          onClick={onCreateNewConversation}
          className="mt-2 w-full"
          variant="outline"
        >
          New Conversation
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading conversations...</div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No conversations yet</div>
        ) : (
          <ul>
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  onClick={() => handleSelectConversation(conversation)}
                  className={`w-full text-left p-3 hover:bg-gray-100 transition-colors ${
                    currentConversationId === conversation.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="font-medium truncate">{conversation.title}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {conversation.lastMessagePreview || 'New conversation'}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(conversation.updatedAt).toLocaleDateString()}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}