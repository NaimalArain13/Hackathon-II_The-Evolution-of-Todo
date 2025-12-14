'use client';

import { z } from 'zod';

/**
 * Special characters allowed in passwords (matching backend)
 */
const SPECIAL_CHARS_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z.string().min(1, 'Password is required'),
});

/**
 * Registration form validation schema
 * Password requirements match backend: 8+ chars, 1 number, 1 special char
 */
export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must be 100 characters or less')
      .trim(),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(72, 'Password must be 72 characters or less')
      .regex(/\d/, 'Password must contain at least 1 number')
      .regex(SPECIAL_CHARS_REGEX, 'Password must contain at least 1 special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

/**
 * Type exports for form data
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Password strength calculation
 * @param password - The password to evaluate
 * @returns Object with strength level and message
 */
export function calculatePasswordStrength(password: string): {
  level: 'weak' | 'medium' | 'strong';
  message: string;
  score: number;
} {
  if (!password || password.length < 8) {
    return {
      level: 'weak',
      message: 'Password must be at least 8 characters',
      score: 0,
    };
  }

  const hasNumber = /\d/.test(password);
  const hasSpecialChar = SPECIAL_CHARS_REGEX.test(password);

  if (hasNumber && hasSpecialChar) {
    return {
      level: 'strong',
      message: 'Strong password',
      score: 3,
    };
  }

  if (hasNumber || hasSpecialChar) {
    const missing = hasNumber ? 'special character' : 'number';
    return {
      level: 'medium',
      message: `Add a ${missing} for a stronger password`,
      score: 2,
    };
  }

  return {
    level: 'weak',
    message: 'Add a number and special character',
    score: 1,
  };
}
