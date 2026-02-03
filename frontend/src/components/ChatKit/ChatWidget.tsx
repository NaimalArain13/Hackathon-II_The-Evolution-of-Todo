/**
 * ChatWidget component - Floating chat widget positioned in bottom-right corner
 * Implements the floating chat widget as specified in the requirements
 */

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useChatWidget } from '@/contexts/ChatWidgetContext';
import { useChatAuth } from '@/hooks/useChatAuth';
import { ChatInterface } from './ChatInterface';
import { Button } from '@/components/ui/button';
import { ResponsiveChatWrapper } from './ResponsiveChatWrapper';
import ChatErrorBoundary from './ChatErrorBoundary';
import { analyticsTracker } from '@/lib/analytics';

/** Routes where the chat widget should never be shown */
const HIDDEN_WIDGET_ROUTES = ['/signin', '/signup'] as const;

export function ChatWidget() {
  const pathname = usePathname();
  const { state, setOpen } = useChatWidget();
  const { isAuthenticated, userId, token } = useChatAuth();

  // Use pathname from router, fallback to window.location for client (usePathname can be null during hydration)
  const currentPath =
    pathname ?? (typeof window !== 'undefined' ? window.location.pathname : '');

  // Track session events - must be called on every render to maintain hook order
  useEffect(() => {
    if (userId) {
      analyticsTracker.setUserId(userId);
    }
  }, [userId]);

  // Hide widget if user is not authenticated (landing, signin, signup, etc.)
  if (!isAuthenticated || !userId) {
    return null;
  }

  // Hide widget on chatbot page (user is already in full chatbot view)
  if (currentPath.startsWith('/chatbot/')) {
    return null;
  }

  // Hide widget on auth pages (signin, signup) even if somehow authenticated
  if (HIDDEN_WIDGET_ROUTES.some((route) => currentPath.startsWith(route))) {
    return null;
  }

  const handleOpenChat = () => {
    console.log("Chat opened")
    setOpen(true);
    analyticsTracker.track('widget_opened', { userId });
  };

  const handleCloseChat = () => {
    setOpen(false);
    analyticsTracker.track('widget_closed', { userId });
  };

  return (
    <>
      {/* Floating chat button */}
      {!state.isOpen && (
        <button
          onClick={handleOpenChat}
          className={`fixed ${state.position.includes('right') ? 'right-4' : 'left-4'} bottom-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50`}
          aria-label="Open chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {state.unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {state.unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Interface - only show when open */}
      {state.isOpen && (
        <div className={`fixed ${state.position.includes('right') ? 'right-4' : 'left-4'} bottom-4 z-[9999] w-[380px] h-[500px] flex flex-col`}>
          <ResponsiveChatWrapper>
            <ChatErrorBoundary>
              <div className="bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col w-full h-full min-h-0 overflow-hidden flex-1">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center gap-2 flex-shrink-0">
                  <h3 className="font-semibold text-gray-800">AI Task Assistant</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        window.location.href = `/chatbot/${userId}`;
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      My Conversations
                    </button>
                    <button
                      onClick={handleCloseChat}
                      className="text-gray-500 hover:text-gray-700 p-1"
                      aria-label="Close chat"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {userId && token && (
                  <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                    <ChatInterface userId={userId} token={token} onClose={handleCloseChat} onTaskOperationsComplete={() => {
                    // Trigger a global event to notify the task list to refresh
                    console.log('Dispatching refreshTasks event from ChatWidget');
                    window.dispatchEvent(new CustomEvent('refreshTasks'));
                  }} />
                  </div>
                )}
              </div>
            </ChatErrorBoundary>
          </ResponsiveChatWrapper>
        </div>
      )}
    </>
  );
}