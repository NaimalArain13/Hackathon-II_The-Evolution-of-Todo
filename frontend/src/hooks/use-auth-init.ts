'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';

/**
 * Hook to initialize authentication state on app load
 * Restores auth state from cookies/localStorage
 */
export function useAuthInit() {
  useEffect(() => {
    useAuthStore.getState().restoreAuth();
  }, []);
}

