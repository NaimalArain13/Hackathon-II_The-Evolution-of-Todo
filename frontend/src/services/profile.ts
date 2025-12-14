/**
 * Profile Service Layer
 * Feature: 007-dashboard-ui
 *
 * Provides typed functions for user profile operations
 * Uses the singleton API instance for all HTTP calls
 */

import { api } from './api';
import type { User } from '@/types';

export interface ProfileUpdateInput {
  name: string;
}

/**
 * Get the current user's profile
 * Requires authentication (JWT token)
 */
export async function getProfile(): Promise<User> {
  const response = await api.get<User>('/api/auth/profile');
  return response.data;
}

/**
 * Update the current user's profile
 * @param data - Profile update data (currently only name)
 */
export async function updateProfile(data: ProfileUpdateInput): Promise<User> {
  const response = await api.put<User>('/api/auth/profile', data);
  return response.data;
}

// Export all functions as a service object for convenience
export const profileService = {
  getProfile,
  updateProfile,
};
