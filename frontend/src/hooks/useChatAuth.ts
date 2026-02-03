/**
 * Custom hook for chat authentication using Better Auth
 * Integrates with existing Better Auth session for chat API calls
 */

'use client';

import { useSession } from '@/lib/auth-client';
import { useEffect, useState } from 'react';

interface ChatAuthState {
  isAuthenticated: boolean;
  userId: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export function useChatAuth() {
  const { data: session, isLoading: sessionLoading } = useSession();
  const [authState, setAuthState] = useState<ChatAuthState>({
    isAuthenticated: false,
    userId: null,
    token: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (sessionLoading) {
      setAuthState(prev => ({ ...prev, loading: true }));
      return;
    }

    if (session?.user?.id && session?.session?.token) {
      setAuthState({
        isAuthenticated: true,
        userId: session.user.id,
        token: session.session.token,
        loading: false,
        error: null,
      });
    } else {
      setAuthState({
        isAuthenticated: false,
        userId: null,
        token: null,
        loading: false,
        error: session ? null : 'No active session',
      });
    }
  }, [session, sessionLoading]);

  return authState;
}