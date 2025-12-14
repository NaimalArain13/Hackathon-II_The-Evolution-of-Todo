/**
 * Profile Validation Schemas
 * Feature: 007-dashboard-ui
 *
 * Zod schemas for profile form validation with proper error messages
 */

import { z } from 'zod';

/**
 * Schema for editing user profile
 */
export const editProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
    .trim(),
});

// Type inference from schema
export type EditProfileSchemaType = z.infer<typeof editProfileSchema>;
