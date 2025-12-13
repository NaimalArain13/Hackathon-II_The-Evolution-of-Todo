'use client';

import { useState, forwardRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from './FormError';
import { cn } from '@/lib/utils';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  showStrengthIndicator?: boolean;
}

/**
 * Password input with visibility toggle
 * Supports optional strength indicator via parent component
 */
export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, className, id, showStrengthIndicator, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `password-${label.toLowerCase().replace(/\s+/g, '-')}`;

    return (
      <div className="space-y-2">
        <Label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
          {label}
        </Label>
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type={showPassword ? 'text' : 'password'}
            className={cn(
              'pr-10',
              error && 'border-red-500 focus-visible:ring-red-500',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 focus:outline-none focus:text-neutral-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {error && <FormError message={error} />}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
