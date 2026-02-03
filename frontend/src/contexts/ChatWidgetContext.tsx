/**
 * Context for managing chat widget state
 * Handles state for the floating chat widget including open/close status,
 * current conversation, loading states, and error states
 */

'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ChatWidgetState } from '@/src/types/chat';

// Define action types for the reducer
type ChatWidgetAction =
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'SET_CURRENT_CONVERSATION'; payload: number | null }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MINIMIZED'; payload: boolean }
  | { type: 'SET_POSITION'; payload: 'bottom-right' | 'bottom-left' }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_UNREAD_COUNT'; payload: number }
  | { type: 'RESET_STATE' };

// Initial state based on the ChatWidgetState interface
const initialState: ChatWidgetState = {
  isOpen: false,
  currentConversationId: null,
  isLoading: false,
  error: null,
  isMinimized: false,
  position: 'bottom-right',
  theme: 'light',
  unreadCount: 0,
};

// Reducer function to handle state updates
const chatWidgetReducer = (state: ChatWidgetState, action: ChatWidgetAction): ChatWidgetState => {
  switch (action.type) {
    case 'SET_OPEN':
      return { ...state, isOpen: action.payload };
    case 'SET_CURRENT_CONVERSATION':
      return { ...state, currentConversationId: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_MINIMIZED':
      return { ...state, isMinimized: action.payload };
    case 'SET_POSITION':
      return { ...state, position: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_UNREAD_COUNT':
      return { ...state, unreadCount: action.payload };
    case 'RESET_STATE':
      return { ...initialState };
    default:
      return state;
  }
};

// Create the context
interface ChatWidgetContextType {
  state: ChatWidgetState;
  dispatch: React.Dispatch<ChatWidgetAction>;
  setOpen: (open: boolean) => void;
  setCurrentConversation: (id: number | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setMinimized: (minimized: boolean) => void;
  setPosition: (position: 'bottom-right' | 'bottom-left') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setUnreadCount: (count: number) => void;
  resetState: () => void;
}

const ChatWidgetContext = createContext<ChatWidgetContextType | undefined>(undefined);

// Provider component
interface ChatWidgetProviderProps {
  children: ReactNode;
}

export function ChatWidgetProvider({ children }: ChatWidgetProviderProps) {
  const [state, dispatch] = useReducer(chatWidgetReducer, initialState);

  // Action helper functions
  const setOpen = (open: boolean) => dispatch({ type: 'SET_OPEN', payload: open });
  const setCurrentConversation = (id: number | null) => dispatch({ type: 'SET_CURRENT_CONVERSATION', payload: id });
  const setLoading = (loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading });
  const setError = (error: string | null) => dispatch({ type: 'SET_ERROR', payload: error });
  const setMinimized = (minimized: boolean) => dispatch({ type: 'SET_MINIMIZED', payload: minimized });
  const setPosition = (position: 'bottom-right' | 'bottom-left') => dispatch({ type: 'SET_POSITION', payload: position });
  const setTheme = (theme: 'light' | 'dark') => dispatch({ type: 'SET_THEME', payload: theme });
  const setUnreadCount = (count: number) => dispatch({ type: 'SET_UNREAD_COUNT', payload: count });
  const resetState = () => dispatch({ type: 'RESET_STATE' });

  const contextValue: ChatWidgetContextType = {
    state,
    dispatch,
    setOpen,
    setCurrentConversation,
    setLoading,
    setError,
    setMinimized,
    setPosition,
    setTheme,
    setUnreadCount,
    resetState,
  };

  return (
    <ChatWidgetContext.Provider value={contextValue}>
      {children}
    </ChatWidgetContext.Provider>
  );
}

// Custom hook to use the context
export function useChatWidget() {
  const context = useContext(ChatWidgetContext);
  if (context === undefined) {
    throw new Error('useChatWidget must be used within a ChatWidgetProvider');
  }
  return context;
}