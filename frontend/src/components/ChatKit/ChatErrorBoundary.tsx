/**
 * Enhanced error boundary for chat components
 * Provides graceful error handling for chat interface components
 */

import React from 'react';

interface ChatErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ChatErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ChatErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ChatErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Chat component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-medium">Chat Unavailable</h3>
          <p className="text-red-600 text-sm mt-1">
            We're sorry, but the chat interface encountered an error.
            Please refresh the page or try again later.
          </p>
          <button
            className="mt-3 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
            onClick={() => window.location.reload()}
          >
            Refresh Chat
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChatErrorBoundary;