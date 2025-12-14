'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';
import { api } from '@/services/api';
import { useAuthStore } from '@/store/auth-store';
import type { LoginFormData, RegisterFormData } from '@/lib/validations/auth';
import type { User } from '@/types';

/**
 * Auth response from API
 */
interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

/**
 * API error response
 */
interface ApiErrorResponse {
  detail: string | Array<{ loc: string[]; msg: string; type: string }>;
}

/**
 * Hook for authentication operations
 */
export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setAuth, clearAuth } = useAuthStore();

  /**
   * Extract error message from API response
   */
  const getErrorMessage = (err: unknown): string => {
    if (axios.isAxiosError(err)) {
      const data = err.response?.data as ApiErrorResponse | undefined;

      // Handle network errors
      if (!err.response) {
        return 'Network error. Please check your connection and try again.';
      }

      // Handle validation errors (422)
      if (err.response.status === 422 && data?.detail) {
        if (Array.isArray(data.detail)) {
          return data.detail.map((e) => e.msg).join(', ');
        }
        return data.detail;
      }

      // Handle 409 (email already exists)
      if (err.response.status === 409) {
        return 'Email already registered';
      }

      // Handle 401 (invalid credentials)
      if (err.response.status === 401) {
        return 'Invalid email or password';
      }

      // Handle 500 (server error)
      if (err.response.status >= 500) {
        return 'Something went wrong. Please try again later.';
      }

      // Generic error with detail
      if (typeof data?.detail === 'string') {
        return data.detail;
      }
    }

    return 'An unexpected error occurred. Please try again.';
  };

  /**
   * Register a new user
   */
  const register = useCallback(
    async (data: Omit<RegisterFormData, 'confirmPassword'>) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.post<AuthResponse>('/api/auth/register', {
          email: data.email,
          name: data.name,
          password: data.password,
        });

        // Store auth data
        setAuth(response.data.user, response.data.access_token);

        // Show success toast
        toast.success('Account created successfully!', {
          description: `Welcome to TaskFlow, ${response.data.user.name}!`,
        });

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error('Registration failed', { description: message });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setAuth, router]
  );

  /**
   * Login an existing user
   */
  const login = useCallback(
    async (data: LoginFormData) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.post<AuthResponse>('/api/auth/login', {
          email: data.email,
          password: data.password,
        });

        // Store auth data
        setAuth(response.data.user, response.data.access_token);

        // Show success toast
        toast.success('Welcome back!', {
          description: `Good to see you, ${response.data.user.name}!`,
        });

        // Redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        toast.error('Login failed', { description: message });
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [setAuth, router]
  );

  /**
   * Logout the current user
   */
  const logout = useCallback(() => {
    clearAuth();
    toast.success('Logged out successfully');
    router.push('/signin');
  }, [clearAuth, router]);

  return {
    login,
    register,
    logout,
    isLoading,
    error,
  };
}
