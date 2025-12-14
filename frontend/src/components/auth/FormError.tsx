'use client';

import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message?: string;
}

/**
 * Inline error message component for form fields
 * Displays below input fields when validation fails
 */
export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p
      className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500"
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" />
      <span>{message}</span>
    </p>
  );
}
