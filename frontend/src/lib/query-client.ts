import { QueryClient } from '@tanstack/react-query';

/**
 * TanStack Query client configuration
 * 
 * Default options:
 * - staleTime: 1 minute - data is fresh for 1 minute
 * - gcTime: 5 minutes - cached data is kept for 5 minutes
 * - retry: 1 - retry failed queries once
 * - refetchOnWindowFocus: false - don't refetch when window regains focus
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

