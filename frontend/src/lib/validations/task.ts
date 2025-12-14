/**
 * Task Validation Schemas
 * Feature: 007-dashboard-ui
 *
 * Zod schemas for task form validation with proper error messages
 */

import { z } from 'zod';
import { TaskPriority, TaskCategory } from '@/types/task';

/**
 * Schema for creating a new task
 */
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less'),
  priority: z.nativeEnum(TaskPriority, {
    message: 'Please select a valid priority',
  }),
  category: z.nativeEnum(TaskCategory, {
    message: 'Please select a valid category',
  }),
});

/**
 * Schema for editing an existing task
 * Same as create schema but includes completed field
 */
export const editTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or less'),
  priority: z.nativeEnum(TaskPriority, {
    message: 'Please select a valid priority',
  }),
  category: z.nativeEnum(TaskCategory, {
    message: 'Please select a valid category',
  }),
  completed: z.boolean(),
});

// Type inference from schemas
export type CreateTaskSchemaType = z.infer<typeof createTaskSchema>;
export type EditTaskSchemaType = z.infer<typeof editTaskSchema>;
