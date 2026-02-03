'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Menu, ChevronLeft, PanelLeftClose, PanelLeft } from 'lucide-react';
import { chatApiService } from '@/services/chatApi';
import { Conversation, Message } from '@/types/chat';
import { useChatAuth } from '@/hooks/useChatAuth';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const loadConversations = async () => {
    try {
      setIsLoadingConversations(true);
      chatApiService.setToken(token);
      const convos = await chatApiService.getConversations(userId);
      console.log('Loaded conversations:', convos);
      console.log('Number of conversations:', convos.length);
      setConversations(convos);

      // Auto-select first conversation if available
      if (convos.length > 0 && !selectedConversationId) {
        console.log('Auto-selecting first conversation:', convos[0].id);
        setSelectedConversationId(convos[0].id);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      // Add error message to UI if needed
      const errorMessage: Message = {
        id: Date.now(),
        conversationId: 0,
        userId: 'system',
        role: 'assistant',
        content: '⚠️ Failed to load conversations. Please try refreshing the page.',
        createdAt: new Date(),
        status: 'error',
        streaming: false
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsLoadingConversations(false);
    }
  };

  const loadConversationMessages = async (conversationId: number) => {
    try {
      setIsLoadingMessages(true);
      chatApiService.setToken(token);
      const data = await chatApiService.getConversation(userId, conversationId);
      console.log("Conversation data received:", data);
      console.log("Messages in data:", data.messages);
      console.log("Messages length:", data.messages?.length);
      
      // Handle the case where messages might be empty or not returned
      if (data.messages && Array.isArray(data.messages)) {
        console.log(`Setting ${data.messages.length} messages to state`);
        setMessages(data.messages);
        
        if (data.messages.length === 0) {
          console.log('Messages array is empty - this is normal for a new conversation');
        }
      } else {
        console.warn('No messages array found in response, starting with empty chat');
        setMessages([]);
      }
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

    const userMessageContent = inputValue;
    setInputValue('');

    try {
      setIsSending(true);
      chatApiService.setToken(token);

      // Add user message to UI immediately
      const userMessage: Message = {
        id: Date.now(),
        conversationId: selectedConversationId || 0,
        userId: userId,
        role: 'user',
        content: userMessageContent,
        createdAt: new Date(),
        status: 'sent',
        streaming: false
      };
      
      setMessages((prev: Message[]) => [...prev, userMessage]);

      // Send message with or without conversation_id
      const response = await chatApiService.sendMessage(
        userId,
        userMessageContent,
        selectedConversationId || undefined
      );

      // Handle SSE stream response
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let assistantMessageContent = '';
        const assistantMessageId = Date.now() + 1;
        let hasStartedStreaming = false;
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          if (value) {
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.trim() === '') continue; // Skip empty lines

              if (line.startsWith('data: ')) {
                // Handle standard SSE data lines
                const dataStr = line.substring(6).trim();

                if (dataStr) {
                  try {
                    const data = JSON.parse(dataStr);

                    // Handle different response formats
                    if (data.type === 'content_block_delta' && data.delta?.text) {
                      // Anthropic-style response
                      assistantMessageContent += data.delta.text;
                    } else if (data.type === 'content_block_start' && data.content_block?.text) {
                      // Handle content block start
                      assistantMessageContent += data.content_block.text;
                    } else if (data.type === 'message_end') {
                      // Message has ended
                      console.log('Message streaming completed - message_end event received');
                      console.log('Final message content length:', assistantMessageContent.length);
                      
                      // Mark message as no longer streaming first
                      setMessages((prev: Message[]) => prev.map((msg: Message) =>
                        msg.id === assistantMessageId
                          ? { ...msg, streaming: false }
                          : msg
                      ));
                      
                      // Check if this was a task operation and trigger refresh
                      // Use setTimeout to ensure state is updated before checking
                      setTimeout(() => {
                        if (assistantMessageContent && detectTaskOperation(assistantMessageContent)) {
                          console.log('Task operation detected in message_end - triggering refresh');
                          triggerTaskRefresh();
                        }
                      }, 100);
                    } else if (typeof data === 'string') {
                      // Raw string response
                      assistantMessageContent += data;
                    } else if (data.choices && Array.isArray(data.choices)) {
                      // OpenAI-style response
                      const choice = data.choices[0];
                      if (choice && choice.delta && choice.delta.content) {
                        assistantMessageContent += choice.delta.content;
                      } else if (choice && choice.text) {
                        assistantMessageContent += choice.text;
                      }
                    } else if (data.message) {
                      // Direct message property
                      assistantMessageContent += data.message;
                    } else if (data.content) {
                      // Content property
                      assistantMessageContent += data.content;
                    }

                    // Update UI with the accumulated content
                    if (assistantMessageContent && assistantMessageContent.trim() !== '') {
                      if (!hasStartedStreaming) {
                        hasStartedStreaming = true;
                        const assistantMessage: Message = {
                          id: assistantMessageId,
                          conversationId: selectedConversationId || 0,
                          userId: 'assistant',
                          role: 'assistant',
                          content: assistantMessageContent,
                          createdAt: new Date(),
                          status: 'delivered',
                          streaming: true
                        };
                        setMessages((prev: Message[]) => [...prev, assistantMessage]);
                      } else {
                        // Update existing assistant message
                        setMessages((prev: Message[]) => prev.map((msg: Message) =>
                          msg.id === assistantMessageId
                            ? { ...msg, content: assistantMessageContent }
                            : msg
                        ));
                      }
                    }
                  } catch (e) {
                    console.error('Error parsing SSE JSON data:', e);
                    console.error('Problematic data string:', dataStr);

                    // Try to treat as plain text if JSON parsing fails
                    if (dataStr && dataStr.trim() !== '') {
                      assistantMessageContent += dataStr;

                      if (!hasStartedStreaming) {
                        hasStartedStreaming = true;
                        const assistantMessage: Message = {
                          id: assistantMessageId,
                          conversationId: selectedConversationId || 0,
                          userId: 'assistant',
                          role: 'assistant',
                          content: assistantMessageContent,
                          createdAt: new Date(),
                          status: 'delivered',
                          streaming: true
                        };
                        setMessages((prev: Message[]) => [...prev, assistantMessage]);
                      } else {
                        setMessages((prev: Message[]) => prev.map((msg: Message) =>
                          msg.id === assistantMessageId
                            ? { ...msg, content: assistantMessageContent }
                            : msg
                        ));
                      }
                    }
                  }
                }
              } else if (line.startsWith('{')) {
                // Handle cases where the entire line is a JSON object
                try {
                  const data = JSON.parse(line);

                  if (data.type === 'content_block_delta' && data.delta?.text) {
                    assistantMessageContent += data.delta.text;
                  } else if (data.type === 'content_block_start' && data.content_block?.text) {
                    assistantMessageContent += data.content_block.text;
                  } else if (data.type === 'message_end') {
                    console.log('Message streaming completed - message_end event received (alternative path)');
                    
                    // Mark message as no longer streaming first
                    setMessages((prev: Message[]) => prev.map((msg: Message) =>
                      msg.id === assistantMessageId
                        ? { ...msg, streaming: false }
                        : msg
                    ));
                    
                    // Check if this was a task operation and trigger refresh
                    setTimeout(() => {
                      if (assistantMessageContent && detectTaskOperation(assistantMessageContent)) {
                        console.log('Task operation detected in message_end (alt) - triggering refresh');
                        triggerTaskRefresh();
                      }
                    }, 100);
                  } else if (data.choices && Array.isArray(data.choices)) {
                    const choice = data.choices[0];
                    if (choice && choice.delta && choice.delta.content) {
                      assistantMessageContent += choice.delta.content;
                    } else if (choice && choice.text) {
                      assistantMessageContent += choice.text;
                    }
                  } else if (data.message) {
                    assistantMessageContent += data.message;
                  } else if (data.content) {
                    assistantMessageContent += data.content;
                  }

                  // Update UI with the accumulated content
                  if (assistantMessageContent && assistantMessageContent.trim() !== '') {
                    if (!hasStartedStreaming) {
                      hasStartedStreaming = true;
                      const assistantMessage: Message = {
                        id: assistantMessageId,
                        conversationId: selectedConversationId || 0,
                        userId: 'assistant',
                        role: 'assistant',
                        content: assistantMessageContent,
                        createdAt: new Date(),
                        status: 'delivered',
                        streaming: true
                      };
                      setMessages((prev: Message[]) => [...prev, assistantMessage]);
                    } else {
                      setMessages((prev: Message[]) => prev.map((msg: Message) =>
                        msg.id === assistantMessageId
                          ? { ...msg, content: assistantMessageContent }
                          : msg
                      ));
                    }
                  }
                } catch (e) {
                  console.warn('Non-data line JSON parsing failed:', e);
                }
              }
            }
          }
        }

        reader.releaseLock();
        
        // Final check for task operations after streaming completes
        // This is a fallback in case message_end event wasn't received
        console.log('Streaming completed - final check for task operations');
        console.log('Final message content:', assistantMessageContent.substring(0, 200));
        
        if (assistantMessageContent && assistantMessageContent.trim().length > 0) {
          // Mark message as no longer streaming
          setMessages((prev: Message[]) => prev.map((msg: Message) =>
            msg.id === assistantMessageId
              ? { ...msg, streaming: false }
              : msg
          ));
          
          // Check for task operations with a small delay to ensure state is updated
          setTimeout(() => {
            if (detectTaskOperation(assistantMessageContent)) {
              console.log('Task operation detected in final check - triggering refresh');
              triggerTaskRefresh();
            } else {
              console.log('No task operation detected in final check');
            }
          }, 200);
        }
      }

      // Reload conversations list to update last message preview
      await loadConversations();

    } catch (error) {
      console.error('Failed to send message:', error);
      
      // Add error message to UI
      const errorMessage: Message = {
        id: Date.now() + 2,
        conversationId: selectedConversationId || 0,
        userId: 'system',
        role: 'assistant',
        content: '⚠️ Failed to send message. Please try again.',
        createdAt: new Date(),
        status: 'error',
        streaming: false
      };
      setMessages((prev: Message[]) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  // Function to detect task operations from assistant response
  const detectTaskOperation = (response: string): boolean => {
    const lowerResponse = response.toLowerCase();
    
    // Patterns that indicate task operations
    const taskOperationPatterns = [
      // Create operations
      /(?:created|added|made)\s+(?:a\s+)?task/i,
      /i'?ve\s+(?:created|added|made)/i,
      /i\s+(?:created|added|made)/i,
      
      // Update operations
      /(?:updated|changed|modified)\s+(?:a\s+)?task/i,
      /i'?ve\s+(?:updated|changed|modified)/i,
      /i\s+(?:updated|changed|modified)/i,
      
      // Delete operations
      /(?:deleted|removed|canceled)\s+(?:a\s+)?task/i,
      /i'?ve\s+(?:deleted|removed|canceled)/i,
      /i\s+(?:deleted|removed|canceled)/i,
      
      // Complete operations
      /(?:completed|finished)\s+(?:a\s+)?task/i,
      /marked\s+(?:a\s+)?task\s+as\s+complete/i,
      /i'?ve\s+(?:completed|finished)/i,
      /i\s+(?:completed|finished)/i,
      
      // Incomplete operations (NEW - this was missing!)
      /marked\s+.*?\s+as\s+incomplete/i,
      /marked\s+(?:a\s+)?task\s+as\s+incomplete/i,
      /i'?ve\s+marked\s+.*?\s+as\s+incomplete/i,
      /i\s+marked\s+.*?\s+as\s+incomplete/i,
      /(?:marked|set)\s+.*?\s+incomplete/i,
      /as\s+incomplete/i,  // Simple pattern: "as incomplete"
      /incomplete\s+again/i,  // "incomplete again" pattern
      /got\s+it!?\s+.*?\s+marked\s+.*?\s+as\s+incomplete/i,  // "Got it! I've marked ... as incomplete"
      
      // Generic marked operations
      /i'?ve\s+marked/i,
      /i\s+marked/i,
      /marked\s+.*?\s+as\s+(?:complete|incomplete)/i,
      
      // Task has been operations
      /task\s+(?:has\s+)?been\s+(?:created|added|updated|deleted|completed|marked)/i,
      
      // Successfully operations
      /successfully\s+(?:created|added|updated|deleted|completed|marked)/i,
      
      // Got it operations (common AI response pattern)
      /got\s+it!?\s+i'?ve\s+(?:created|added|updated|deleted|completed|marked)/i,
    ];
    
    const hasTaskOperation = taskOperationPatterns.some(pattern => pattern.test(lowerResponse));
    
    // Additional check: if response mentions task operations keywords
    if (!hasTaskOperation) {
      const taskKeywords = ['task', 'tasks'];
      const operationKeywords = ['created', 'added', 'updated', 'changed', 'deleted', 'removed', 'completed', 'finished', 'marked', 'incomplete'];
      
      const hasTaskKeyword = taskKeywords.some(keyword => lowerResponse.includes(keyword));
      const hasOperationKeyword = operationKeywords.some(keyword => lowerResponse.includes(keyword));
      
      if (hasTaskKeyword && hasOperationKeyword) {
        console.log('Task operation detected via keyword matching:', { response: lowerResponse.substring(0, 100) });
        return true;
      }
    }
    
    if (hasTaskOperation) {
      console.log('Task operation detected via pattern matching:', { response: lowerResponse.substring(0, 100) });
    }
    
    return hasTaskOperation;
  };

  // Function to dispatch refreshTasks event
  const triggerTaskRefresh = () => {
    console.log('Task operation detected - dispatching refreshTasks event');
    // Dispatch the event multiple times to ensure it's caught
    window.dispatchEvent(new CustomEvent('refreshTasks'));
    // Also dispatch with a slight delay as fallback
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('refreshTasks'));
    }, 100);
  };

  const handleNewConversation = () => {
    setSelectedConversationId(null);
    setMessages([]);
    setMobileSidebarOpen(false);
  };

  const handleSelectConversation = (convId: number) => {
    setSelectedConversationId(convId);
    setMobileSidebarOpen(false); // Close sidebar on mobile when selecting
  };

  // Reusable sidebar content
  const ConversationsSidebarContent = () => (
    <>
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
                onClick={() => handleSelectConversation(conv.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedConversationId === conv.id
                    ? 'bg-gray-700'
                    : 'hover:bg-gray-800'
                }`}
              >
                <div className="font-bold text-lg truncate">ID: {conv.id}</div>
                <div className="font-medium text-sm truncate">{conv.title}</div>
                {conv.lastMessagePreview && (
                  <div className="text-xs text-gray-400 truncate mt-1">
                    {conv.lastMessagePreview}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  {new Date(conv.updatedAt).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-screen md:flex-row">
      {/* Mobile header with hamburger and back - only on mobile */}
      <header className="flex h-14 items-center border-b bg-white px-4 md:hidden shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileSidebarOpen(true)}
          className="mr-3"
          aria-label="Open conversations"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-900 hover:text-gray-700"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </Link>
      </header>

      {/* Mobile sidebar drawer */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="w-[280px] p-0 bg-gray-900 border-gray-800 [&>button]:text-white [&>button]:right-4 [&>button]:top-4">
          <SheetHeader className="sr-only">
            <SheetTitle>Conversations</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col h-full py-4">
            <ConversationsSidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar - hidden on mobile, collapsible on desktop */}
      <aside
        className={`hidden md:flex shrink-0 flex-col bg-gray-900 text-white transition-all duration-300 ${
          desktopSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}
      >
        {desktopSidebarOpen && <ConversationsSidebarContent />}
      </aside>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white min-h-0">
        {/* Desktop header with back button and sidebar toggle */}
        <header className="hidden md:flex h-14 items-center justify-between border-b bg-white px-4 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
              aria-label={desktopSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            >
              {desktopSidebarOpen ? (
                <PanelLeftClose className="h-5 w-5" />
              ) : (
                <PanelLeft className="h-5 w-5" />
              )}
            </Button>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
          <span className="text-sm font-medium text-gray-500">AI Chat</span>
        </header>
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
              <div ref={messagesEndRef} />
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