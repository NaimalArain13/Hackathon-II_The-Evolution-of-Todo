/**
 * Better Auth Client Integration
 * Provides session management and authentication hooks for Better Auth
 */

'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import type { User } from '@/types';

interface Session {
  user: User | null;
  session: {
    token: string | null;
  } | null;
}

interface UseSessionReturn {
  data: Session | null;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Custom hook to access Better Auth session
 * Mimics the Better Auth useSession hook pattern
 */
export function useSession(): UseSessionReturn {
  const [sessionData, setSessionData] = useState<UseSessionReturn>({
    data: null,
    isLoading: true,
    isError: false,
  });

  const authState = useAuthStore();

  useEffect(() => {
    try {
      if (authState.isAuthenticated && authState.user && authState.token) {
        setSessionData({
          data: {
            user: authState.user,
            session: {
              token: authState.token,
            },
          },
          isLoading: false,
          isError: false,
        });
      } else {
        setSessionData({
          data: null,
          isLoading: false,
          isError: false,
        });
      }
    } catch (error) {
      setSessionData({
        data: null,
        isLoading: false,
        isError: true,
      });
    }
  }, [authState.isAuthenticated, authState.user, authState.token]);

  return sessionData;
}

/**
 * Function to get current session (non-reactive)
 */
export async function getSession(): Promise<Session | null> {
  const authStore = useAuthStore.getState();

  if (authStore.isAuthenticated && authStore.user && authStore.token) {
    return {
      user: authStore.user,
      session: {
        token: authStore.token,
      },
    };
  }

  return null;
}

/**
 * Function to sign in user
 */
export async function signIn(credentials: { email: string; password: string }): Promise<Session | null> {
  // This would typically call an API endpoint
  // For now, this is a placeholder - actual implementation would be in useAuth hook
  console.warn('signIn function is a placeholder. Use the useAuth hook for actual sign in.');
  return null;
}

/**
 * Function to sign out user
 */
export async function signOut(): Promise<void> {
  // This would typically call an API endpoint
  // Actual implementation would use the auth store
  useAuthStore.getState().clearAuth();
}

/**
 * Function to sign up user
 */
export async function signUp(userData: { email: string; password: string; name: string }): Promise<Session | null> {
  // This would typically call an API endpoint
  // For now, this is a placeholder - actual implementation would be in useAuth hook
  console.warn('signUp function is a placeholder. Use the useAuth hook for actual sign up.');
  return null;
}