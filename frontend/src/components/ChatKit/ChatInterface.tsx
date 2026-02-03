/**
 * ChatInterface component - Expanded chat interface for conversation
 * Implements the chat interface with message composer and display
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Message } from '@/types/chat';
import { MessageBubble } from './MessageBubble';
import { Button } from '@/components/ui/button';
import { chatSessionManager } from '@/services/chatSessionManager';
import { analyticsTracker } from '@/lib/analytics';
import { rateLimiter } from '@/lib/rateLimiter';
import { chatApiService } from '@/services/chatApi';

interface ChatInterfaceProps {
  userId: string;
  token: string;
  onClose: () => void;
  onTaskOperationsComplete?: () => void; // Callback to trigger task list refresh
}

export function ChatInterface({ userId, token, onClose, onTaskOperationsComplete }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdCounter = useRef(0);

  // Function to generate unique message IDs
  const generateUniqueId = useCallback(() => {
    messageIdCounter.current += 1;
    return Date.now() + messageIdCounter.current;
  }, []);


  // Set the token in the chat API service and initialize session
  useEffect(() => {
    let isCancelled = false; // Flag to prevent state updates after unmount

    // Initialize chat session
    const initSession = async () => {
      try {
        // Safely access the chat API service
        let chatService;
        try {
          chatService = chatApiService;
        } catch (error) {
          console.error('Error accessing chatApiService:', error);
          chatService = null;
        }

        // Check if chatApiService exists before using it
        if (chatService && typeof chatService.setToken === 'function') {
          try {
            chatService.setToken(token);
          } catch (error) {
            console.error('Error setting token for chat API service:', error);
          }
        } else {
          console.error('chatApiService is not properly initialized');
        }

        // Initialize session with userId
        const session = await chatSessionManager.initSession(userId, null);
        if (!isCancelled) {
          setConnectionStatus(session.connectionStatus);
        }

        // Load the most recent conversation for this user
        try {
          const conversations = await chatApiService.getConversations(userId);
          if (!isCancelled && conversations && Array.isArray(conversations) && conversations.length > 0) {
            // Get the most recent conversation (sorted by updatedAt or createdAt)
            const mostRecentConversation = conversations.reduce((mostRecent, current) => {
              const currentUpdated = new Date(current.updatedAt).getTime();
              const mostRecentUpdated = new Date(mostRecent.updatedAt).getTime();
              return currentUpdated > mostRecentUpdated ? current : mostRecent;
            });

            if (!isCancelled) {
              setCurrentConversationId(mostRecentConversation.id);
              chatSessionManager.updateConversation(mostRecentConversation.id);
            }

            // Load messages for the most recent conversation
            const { messages: conversationMessages } = await chatApiService.getConversation(
              userId,
              mostRecentConversation.id
            );

            if (!isCancelled) {
              setMessages(Array.isArray(conversationMessages) ? conversationMessages : []);
            }
          } else if (!isCancelled) {
            // No existing conversation, initialize with empty messages
            setMessages([]);
            setCurrentConversationId(null);
          }
        } catch (error) {
          console.error('Error loading conversation history:', error);
          // Initialize with empty messages if loading fails
          if (!isCancelled) {
            setMessages([]);
            setCurrentConversationId(null);
          }
        }
      } catch (error) {
        console.error('Failed to initialize chat session:', error);
        if (!isCancelled) {
          setConnectionStatus('disconnected');
          setMessages([]);
          setCurrentConversationId(null);
        }
      }
    };

    initSession();

    // Cleanup token and session when component unmounts
    return () => {
      isCancelled = true; // Set flag to prevent state updates

      // Safely access the chat API service for cleanup
      let chatService;
      try {
        chatService = chatApiService;
      } catch (error) {
        console.error('Error accessing chatApiService for cleanup:', error);
        chatService = null;
      }

      if (chatService && typeof chatService.clearToken === 'function') {
        try {
          chatService.clearToken();
        } catch (error) {
          console.error('Error clearing token for chat API service:', error);
        }
      }

      chatSessionManager.endSession();
    };
  }, [token, userId]);

  // Scroll to bottom when messages change
  const scrollToBottom = useCallback(() => {
    try {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error scrolling to bottom:', error);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Function to extract task information from AI response
  const extractTaskFromResponse = (response: string): {
    taskOperation: 'create' | 'view' | 'update' | 'delete' | 'complete' | 'none';
    title?: string;
    description?: string;
    taskId?: number;
    status?: 'completed' | 'pending';
  } => {
    // Look for different task operation indicators in the AI response
    const createTaskRegex = /(?:create|make|add|new)\s+(?:a\s+)?task\s+(?:to|for)\s+(.+)/i;
    const viewTasksRegex = /(?:show|list|display|view)\s+(?:me\s+)?(?:my\s+)?tasks/i;
    const updateTaskRegex = /(?:update|change|modify)\s+(?:task|the\s+task)\s+(?:id\s+|#)?(\d+)(?:\s+to\s+)?(.*)/i;
    const deleteTaskRegex = /(?:delete|remove|cancel)\s+(?:task|the\s+task)\s+(?:id\s+|#)?(\d+)/i;
    const completeTaskRegex = /(?:mark|complete|finish|done)\s+(?:task|the\s+task)\s+(?:id\s+|#)?(\d+)(?:\s+as\s+(completed|done))?/i;

    // Add safety check for null/undefined response
    if (!response) {
      return { taskOperation: 'none' };
    }

    const createMatch = response.match(createTaskRegex);
    if (createMatch) {
      const taskDescription = createMatch[1].trim();
      const title = taskDescription.charAt(0).toUpperCase() + taskDescription.slice(1);

      return {
        taskOperation: 'create',
        title,
        description: `Task created from chat: "${response}"`
      };
    }

    const viewMatch = response.match(viewTasksRegex);
    if (viewMatch) {
      return {
        taskOperation: 'view'
      };
    }

    const updateMatch = response.match(updateTaskRegex);
    if (updateMatch) {
      const taskId = parseInt(updateMatch[1]);
      if (isNaN(taskId)) {
        return { taskOperation: 'none' };
      }
      const updateDetails = updateMatch[2]?.trim();

      return {
        taskOperation: 'update',
        taskId,
        description: updateDetails
      };
    }

    const deleteMatch = response.match(deleteTaskRegex);
    if (deleteMatch) {
      const taskId = parseInt(deleteMatch[1]);
      if (isNaN(taskId)) {
        return { taskOperation: 'none' };
      }

      return {
        taskOperation: 'delete',
        taskId
      };
    }

    const completeMatch = response.match(completeTaskRegex);
    if (completeMatch) {
      const taskId = parseInt(completeMatch[1]);
      if (isNaN(taskId)) {
        return { taskOperation: 'none' };
      }
      const status = completeMatch[2] === 'completed' || completeMatch[2] === 'done' ? 'completed' : 'pending';

      return {
        taskOperation: 'complete',
        taskId,
        status
      };
    }

    return {
      taskOperation: 'none'
    };
  };

  // Function to create task in backend via chat API (MCP server tools)
  const createTaskFromResponse = async (title: string, description: string) => {
    try {
      // Safely access the chat API service
      let chatService;
      try {
        chatService = chatApiService;
      } catch (error) {
        console.error('Error accessing chatApiService:', error);
        return null;
      }

      // Check if chatApiService exists before using it
      if (!chatService || typeof chatService.sendMessage !== 'function') {
        console.error('chatApiService is not properly initialized');
        return null;
      }

      // Send a message to the chat API that triggers task creation via MCP server tools
      const taskCreationMessage = `Create a task with title: "${title}" and description: "${description}"`;

      const response = await chatService.sendMessage(userId, taskCreationMessage);

      if (response && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let fullResponse = '';
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          if (value) {
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.substring(6); // Remove 'data: ' prefix
                if (dataStr.trim()) {
                  try {
                    const data = JSON.parse(dataStr);

                    if (data.type === 'content_block_delta' && data.delta?.text) {
                      fullResponse += data.delta.text;
                    } else if (data.type === 'message_end') {
                      // Task was created via MCP server tools in the backend
                      console.log('Task created successfully via MCP server tools');
                      // Return a success indicator
                      return { id: Date.now(), title, description, completed: false };
                    }
                  } catch (e) {
                    console.error('Error parsing SSE data:', e);
                  }
                }
              }
            }
          }
        }

        if (reader && typeof reader.releaseLock === 'function') {
          reader.releaseLock();
        }
      }

      return null;
    } catch (error) {
      console.error('Error creating task via chat API:', error);
      return null;
    }
  };

  // Function to view tasks via chat API (MCP server tools)
  const viewTasksFromResponse = async () => {
    try {
      // Safely access the chat API service
      let chatService;
      try {
        chatService = chatApiService;
      } catch (error) {
        console.error('Error accessing chatApiService:', error);
        return null;
      }

      // Check if chatApiService exists before using it
      if (!chatService || typeof chatService.sendMessage !== 'function') {
        console.error('chatApiService is not properly initialized');
        return null;
      }

      // Send a message to the chat API that triggers task viewing via MCP server tools
      const viewTasksMessage = `Show me my tasks`;

      const response = await chatService.sendMessage(userId, viewTasksMessage);

      if (response && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let fullResponse = '';
        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          if (value) {
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.substring(6); // Remove 'data: ' prefix
                if (dataStr.trim()) {
                  try {
                    const data = JSON.parse(dataStr);

                    if (data.type === 'content_block_delta' && data.delta?.text) {
                      fullResponse += data.delta.text;
                    } else if (data.type === 'message_end') {
                      // Tasks were fetched via MCP server tools in the backend
                      console.log('Tasks fetched successfully via MCP server tools');
                      // Display the tasks in the chat
                      return fullResponse;
                    }
                  } catch (e) {
                    console.error('Error parsing SSE data:', e);
                  }
                }
              }
            }
          }
        }

        if (reader && typeof reader.releaseLock === 'function') {
          reader.releaseLock();
        }
      }

      return null;
    } catch (error) {
      console.error('Error viewing tasks via chat API:', error);
      return null;
    }
  };

  // Ref to track if component is mounted (must set true in effect for React Strict Mode)
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('[ChatInterface] handleSubmit called', {
      inputValue,
      inputValueLength: inputValue?.length,
      isLoading,
      isMounted: isMountedRef.current,
    });
    e.preventDefault();
    if (!inputValue.trim() || isLoading || !isMountedRef.current) {
      console.log('[ChatInterface] Early return - empty/loading/unmounted');
      return;
    }

    // Minimal validation - same as chatbot page (empty already checked above)
    // Only block if message is too long (>4000 chars to allow longer inputs)
    const trimmedInput = inputValue.trim();
    console.log('[ChatInterface] Validation - trimmedInput', {
      trimmedInput,
      trimmedLength: trimmedInput.length,
      isValidLength: trimmedInput.length <= 4000,
    });
    if (trimmedInput.length > 4000) {
      console.log('[ChatInterface] Validation FAILED - message too long');
      setMessages(prev => [...prev, {
        id: generateUniqueId(),
        conversationId: currentConversationId || 0,
        userId: 'system',
        role: 'assistant',
        content: 'Message is too long. Please keep it under 4000 characters.',
        createdAt: new Date(),
        status: 'error',
        streaming: false,
      }]);
      return;
    }

    // Check rate limit
    const rateLimitKey = `chat_send_${userId}`;
    const isAllowed = await rateLimiter.isAllowed(rateLimitKey, 10, 60000); // 10 messages per minute
    console.log('[ChatInterface] Rate limit check', { rateLimitKey, isAllowed });

    if (!isAllowed) {
      console.log('[ChatInterface] Rate limit FAILED - too many requests');
      const errorMessage: Message = {
        id: generateUniqueId(),
        conversationId: currentConversationId || 0,
        userId: 'system',
        role: 'assistant',
        content: 'Rate limit exceeded. Please wait a moment before sending another message.',
        createdAt: new Date(),
        status: 'error',
        streaming: false,
      };

      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    console.log('[ChatInterface] Validation passed - proceeding to API call');
    // Add user message to the chat (use trimmed input)
    const userMessage: Message = {
      id: generateUniqueId(), // Temporary ID, will be replaced by server ID
      conversationId: currentConversationId || 0,
      userId,
      role: 'user',
      content: trimmedInput,
      createdAt: new Date(),
      status: 'sent',
      streaming: false,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Track the message being sent
      analyticsTracker.trackMessageSent(trimmedInput, userMessage.id.toString());

      // Safely access the chat API service
      let chatService;
      try {
        chatService = chatApiService;
      } catch (error) {
        console.error('Error accessing chatApiService:', error);
        throw new Error('Chat API service is not available');
      }

      // Check if chatService is available before sending message
      if (!chatService || typeof chatService.sendMessage !== 'function') {
        throw new Error('Chat API service is not available');
      }

      // Send message to the backend with the current conversation ID
      console.log('[ChatInterface] Calling chatApiService.sendMessage', {
        userId,
        messageLength: trimmedInput.length,
        conversationId: currentConversationId,
      });
      const response = await chatService.sendMessage(userId, trimmedInput, currentConversationId || undefined);
      console.log('[ChatInterface] API response received', {
        hasBody: !!response?.body,
        ok: response?.ok,
      });

      // Handle Server-Sent Events (SSE) for streaming response
      if (response && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let fullResponse = '';
        let assistantMessage: Message = {
          id: generateUniqueId(), // Temporary ID
          conversationId: currentConversationId || 0,
          userId: 'assistant', // Using 'assistant' as a placeholder
          role: 'assistant',
          content: '',
          createdAt: new Date(),
          status: 'sent',
          streaming: true,
        };

        // Add empty assistant message to show loading state
        setMessages(prev => [...prev, assistantMessage]);

        let done = false;
        let streamError = null;

        try {
          while (!done && isMountedRef.current) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;

            if (streamError || !isMountedRef.current) {
              throw streamError || new Error('Component unmounted or stream error occurred');
            }

            if (value) {
              const chunk = decoder.decode(value);
              const lines = chunk.split('\n');

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const dataStr = line.substring(6); // Remove 'data: ' prefix
                  if (dataStr.trim() && isMountedRef.current) {
                    try {
                      const data = JSON.parse(dataStr);

                      // Handle different response formats
                      if (data.type === 'content_block_delta' && data.delta?.text) {
                        // Anthropic-style response
                        fullResponse += data.delta.text;

                        setMessages(prev => prev.map(msg =>
                          msg.id === assistantMessage.id && isMountedRef.current
                            ? { ...msg, content: msg.content + data.delta.text, streaming: true }
                            : msg
                        ));
                      } else if (data.type === 'content_block_start' && data.content_block?.text) {
                        // Handle content block start
                        fullResponse += data.content_block.text;

                        setMessages(prev => prev.map(msg =>
                          msg.id === assistantMessage.id && isMountedRef.current
                            ? { ...msg, content: msg.content + data.content_block.text, streaming: true }
                            : msg
                        ));
                      } else if (data.type === 'message_end') {
                        // Check if the response indicates a task operation should be performed
                        const taskInfo = extractTaskFromResponse(fullResponse);

                        switch (taskInfo.taskOperation) {
                          case 'create':
                            if (taskInfo.title && isMountedRef.current) {
                              // Create the task via MCP server tools
                              await createTaskFromResponse(taskInfo.title, taskInfo.description || '');

                              // Add a message indicating the task was created
                              const taskCreatedMessage: Message = {
                                id: generateUniqueId(),
                                conversationId: currentConversationId || 0,
                                userId: 'system',
                                role: 'assistant',
                                content: `Task "${taskInfo.title}" has been created successfully.`,
                                createdAt: new Date(),
                                status: 'delivered',
                                streaming: false,
                              };

                              setMessages(prev => [...prev, taskCreatedMessage]);

                              // Track task creation
                              analyticsTracker.trackTaskCreated({
                                title: taskInfo.title,
                                description: taskInfo.description
                              });

                              // Notify parent component to refresh task list
                              if (onTaskOperationsComplete && isMountedRef.current) {
                                onTaskOperationsComplete();
                              }
                            }
                            break;

                          case 'view':
                            // Send a message to the chat API to view tasks via MCP server tools
                            const viewTasksMessage: Message = {
                              id: generateUniqueId(),
                              conversationId: currentConversationId || 0,
                              userId: 'system',
                              role: 'assistant',
                              content: 'Fetching your tasks via MCP server tools...',
                              createdAt: new Date(),
                              status: 'delivered',
                              streaming: false,
                            };

                            setMessages(prev => [...prev, viewTasksMessage]);

                            // Actually fetch and display tasks via the API
                            const taskList = await viewTasksFromResponse();
                            if (taskList && isMountedRef.current) {
                              const taskListMessage: Message = {
                                id: generateUniqueId(),
                                conversationId: currentConversationId || 0,
                                userId: 'system',
                                role: 'assistant',
                                content: taskList,
                                createdAt: new Date(),
                                status: 'delivered',
                                streaming: false,
                              };

                              setMessages(prev => [...prev, taskListMessage]);
                            }
                            break;

                          case 'update':
                            if (taskInfo.taskId && isMountedRef.current) {
                              // Update the task via MCP server tools
                              const updateMessage: Message = {
                                id: generateUniqueId(),
                                conversationId: currentConversationId || 0,
                                userId: 'system',
                                role: 'assistant',
                                content: `Task #${taskInfo.taskId} has been updated successfully.`,
                                createdAt: new Date(),
                                status: 'delivered',
                                streaming: false,
                              };

                              setMessages(prev => [...prev, updateMessage]);

                              // Notify parent component to refresh task list
                              if (onTaskOperationsComplete && isMountedRef.current) {
                                onTaskOperationsComplete();
                              }
                            }
                            break;

                          case 'delete':
                            if (taskInfo.taskId && isMountedRef.current) {
                              // Delete the task via MCP server tools
                              const deleteMessage: Message = {
                                id: generateUniqueId(),
                                conversationId: currentConversationId || 0,
                                userId: 'system',
                                role: 'assistant',
                                content: `Task #${taskInfo.taskId} has been deleted successfully.`,
                                createdAt: new Date(),
                                status: 'delivered',
                                streaming: false,
                              };

                              setMessages(prev => [...prev, deleteMessage]);

                              // Notify parent component to refresh task list
                              if (onTaskOperationsComplete && isMountedRef.current) {
                                onTaskOperationsComplete();
                              }
                            }
                            break;

                          case 'complete':
                            if (taskInfo.taskId && isMountedRef.current) {
                              // Mark the task as complete via MCP server tools
                              const completeMessage: Message = {
                                id: generateUniqueId(),
                                conversationId: currentConversationId || 0,
                                userId: 'system',
                                role: 'assistant',
                                content: `Task #${taskInfo.taskId} has been marked as ${taskInfo.status}.`,
                                createdAt: new Date(),
                                status: 'delivered',
                                streaming: false,
                              };

                              setMessages(prev => [...prev, completeMessage]);

                              // Notify parent component to refresh task list
                              if (onTaskOperationsComplete && isMountedRef.current) {
                                onTaskOperationsComplete();
                              }
                            }
                            break;

                          case 'none':
                            // No task operation detected, continue normally
                            break;
                        }

                        // Mark the message as no longer streaming
                        setMessages(prev => prev.map(msg =>
                          msg.id === assistantMessage.id && isMountedRef.current
                            ? { ...msg, streaming: false, status: 'delivered' }
                            : msg
                        ));

                        // Track the response received
                        analyticsTracker.trackMessageReceived(fullResponse, (Date.now() + 1).toString());
                      } else if (typeof data === 'string') {
                        // Raw string response
                        fullResponse += data;

                        setMessages(prev => prev.map(msg =>
                          msg.id === assistantMessage.id && isMountedRef.current
                            ? { ...msg, content: msg.content + data, streaming: true }
                            : msg
                        ));
                      } else if (data.choices && Array.isArray(data.choices)) {
                        // OpenAI-style response
                        const choice = data.choices[0];
                        if (choice && choice.delta && choice.delta.content) {
                          fullResponse += choice.delta.content;

                          setMessages(prev => prev.map(msg =>
                            msg.id === assistantMessage.id && isMountedRef.current
                              ? { ...msg, content: msg.content + choice.delta.content, streaming: true }
                              : msg
                          ));
                        } else if (choice && choice.text) {
                          fullResponse += choice.text;

                          setMessages(prev => prev.map(msg =>
                            msg.id === assistantMessage.id && isMountedRef.current
                              ? { ...msg, content: msg.content + choice.text, streaming: true }
                              : msg
                          ));
                        }
                      } else if (data.message) {
                        // Direct message property
                        fullResponse += data.message;

                        setMessages(prev => prev.map(msg =>
                          msg.id === assistantMessage.id && isMountedRef.current
                            ? { ...msg, content: msg.content + data.message, streaming: true }
                            : msg
                        ));
                      } else if (data.content) {
                        // Content property
                        fullResponse += data.content;

                        setMessages(prev => prev.map(msg =>
                          msg.id === assistantMessage.id && isMountedRef.current
                            ? { ...msg, content: msg.content + data.content, streaming: true }
                            : msg
                        ));
                      }
                    } catch (e) {
                      console.error('Error parsing SSE data:', e);
                      streamError = e; // Store error to throw after releasing reader

                      // Add error message to chat
                      const errorMessage: Message = {
                        id: generateUniqueId(),
                        conversationId: currentConversationId || 0,
                        userId: 'system',
                        role: 'assistant',
                        content: 'Error processing the response from the AI. Please try again.',
                        createdAt: new Date(),
                        status: 'error',
                        streaming: false,
                      };

                      setMessages(prev => [...prev, errorMessage]);

                      // Track the error
                      if (e instanceof Error) {
                        analyticsTracker.trackError(e, 'SSE parsing error');
                      }
                    }
                  }
                } else if (line.startsWith(':')) {
                  // Skip comment lines in SSE
                  continue;
                } else if (line.trim() === '') {
                  // Skip empty lines
                  continue;
                }
              }
            }
          }
        } catch (readerError) {
          if (isMountedRef.current) {
            console.error('Error reading SSE stream:', readerError);

            // Add error message to chat
            const errorMessage: Message = {
              id: generateUniqueId(),
              conversationId: currentConversationId || 0,
              userId: 'system',
              role: 'assistant',
              content: 'Connection error while receiving response. Please try again.',
              createdAt: new Date(),
              status: 'error',
              streaming: false,
            };

            setMessages(prev => [...prev, errorMessage]);

            // Track the error
            if (readerError instanceof Error) {
              analyticsTracker.trackError(readerError, 'SSE reader error');
            }
          }
        } finally {
          // Ensure reader is always released
          if (reader && typeof reader.releaseLock === 'function' && isMountedRef.current) {
            try {
              reader.releaseLock();
            } catch (releaseError) {
              console.error('Error releasing reader lock:', releaseError);
            }
          }
        }
      } else {
        // Handle case where response body is empty
        console.error('Response body is empty or invalid');

        // Add error message to chat
        const errorMessage: Message = {
          id: generateUniqueId(),
          conversationId: currentConversationId || 0,
          userId: 'system',
          role: 'assistant',
          content: 'No response received from the AI. Please try again.',
          createdAt: new Date(),
          status: 'error',
          streaming: false,
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error('Error sending message:', error);

        // Determine the type of error and provide specific message
        let errorMessageContent = 'Sorry, I encountered an error processing your request. Please try again.';

        if (error instanceof TypeError && error.message.includes('fetch')) {
          // Network error
          errorMessageContent = 'Network error. Please check your internet connection and try again.';
        } else if (error instanceof Error) {
          // Check for specific error messages
          if (error.message.includes('401')) {
            errorMessageContent = 'Authentication failed. Please log in again.';
          } else if (error.message.includes('429')) {
            errorMessageContent = 'You are sending messages too quickly. Please wait a moment before sending another message.';
          } else if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
            errorMessageContent = 'The server is temporarily unavailable. Please try again later.';
          }

          // Track the error
          analyticsTracker.trackError(error, 'Message sending error');
        }

        // Add error message to chat
        const errorMessage: Message = {
          id: generateUniqueId(),
          conversationId: currentConversationId || 0,
          userId: 'system',
          role: 'assistant',
          content: errorMessageContent,
          createdAt: new Date(),
          status: 'error',
          streaming: false,
        };

        setMessages(prev => [...prev, errorMessage]);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      {/* Header with connection status */}
      {/* <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">AI Task Assistant</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
              'bg-red-500'
            }`}></div>
            <span className="text-xs text-gray-500 capitalize">{connectionStatus}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="ml-2"
          >
            Close
          </Button>
        </div>
      </div> */}

      {/* Messages container - Scrollable, takes remaining space */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <p className="mb-2">Start a conversation with the AI Task Assistant</p>
              <p className="text-sm">Try asking: "Create a task to buy groceries"</p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwnMessage={message.role === 'user'}
              />
            ))
          )}
          <div ref={messagesEndRef} />
      </div>

      {/* Composer - same pattern as chatbot page: form onSubmit handles both button click and Enter */}
      <div className="relative z-10 border-t border-gray-200 p-4 flex-shrink-0 bg-white pointer-events-auto">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me to help manage your tasks..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 disabled:pointer-events-none disabled:opacity-50 min-w-[80px]"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2">
          Examples: "Create a task to buy groceries", "Show me my tasks", "Mark the report task as complete"
        </p>
      </div>
    </div>
  );
}