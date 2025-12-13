'use client';

import { useAuthStore } from '@/store/auth-store';
import { ReactNode, useEffect } from 'react';

/**
 * Auth Provider component that initializes authentication state
 * Wrap your app with this to restore auth on page load
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize auth state on mount - restore from cookies
    useAuthStore.getState().restoreAuth();
  }, []);

  return <>{children}</>;
}

