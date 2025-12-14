/**
 * useProfile Custom Hook
 * Feature: 007-dashboard-ui (User Story 9)
 *
 * Provides React Query integration for profile operations:
 * - useQuery for fetching profile
 * - useMutation for updating profile
 * - Query invalidation on success
 * - Toast notifications
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProfile, updateProfile, type ProfileUpdateInput } from '@/services/profile';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import type { User } from '@/types';

// Query keys for React Query cache management
export const profileKeys = {
  all: ['profile'] as const,
  detail: () => [...profileKeys.all, 'detail'] as const,
};

/**
 * Hook for fetching user profile
 *
 * @example
 * ```tsx
 * const { data: profile, isLoading, error } = useProfile();
 * ```
 */
export function useProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery<User, Error>({
    queryKey: profileKeys.detail(),
    queryFn: getProfile,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for updating user profile
 *
 * @example
 * ```tsx
 * const { mutate: update, isPending } = useUpdateProfile();
 * update({ name: 'New Name' });
 * ```
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { updateUser } = useAuthStore();

  return useMutation({
    mutationFn: (data: ProfileUpdateInput) => updateProfile(data),
    onSuccess: (updatedUser) => {
      // Update the profile cache
      queryClient.setQueryData(profileKeys.detail(), updatedUser);
      // Also update the auth store
      updateUser(updatedUser);
      toast.success('Profile updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
}
