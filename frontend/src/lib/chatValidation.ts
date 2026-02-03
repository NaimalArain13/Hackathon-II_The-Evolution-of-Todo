/**
 * Validation utilities for chat components
 * Provides input validation for message content
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates message content according to specified rules
 */
export function validateMessageContent(content: string): ValidationResult {
  const errors: string[] = [];

  // Check if content is empty
  if (!content.trim()) {
    errors.push('Message cannot be empty');
  }

  // Check length limits
  if (content.length > 1000) {
    errors.push('Message is too long (maximum 1000 characters)');
  }

  // Check for excessive whitespace
  if (content.length > 0 && content.replace(/\s/g, '').length === 0) {
    errors.push('Message contains only whitespace');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sanitizes message content by removing potentially harmful content
 */
export function sanitizeMessageContent(content: string): string {
  // Remove potentially harmful scripts (basic sanitization)
  let sanitized = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove other potentially harmful tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // Remove javascript: urls
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Trim whitespace
  return sanitized.trim();
}

/**
 * Validates conversation title
 */
export function validateConversationTitle(title: string): ValidationResult {
  const errors: string[] = [];

  if (!title.trim()) {
    errors.push('Title cannot be empty');
  }

  if (title.length > 100) {
    errors.push('Title is too long (maximum 100 characters)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}