'use client';

import { useMemo } from 'react';
import { calculatePasswordStrength } from '@/lib/validations/auth';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
}

/**
 * Visual password strength indicator
 * Shows progress bar with 3 segments and text feedback
 */
export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  if (!password) return null;

  const colors = {
    weak: {
      bar: 'bg-red-500',
      text: 'text-red-600',
    },
    medium: {
      bar: 'bg-yellow-500',
      text: 'text-yellow-600',
    },
    strong: {
      bar: 'bg-green-500',
      text: 'text-green-600',
    },
  };

  const { bar: barColor, text: textColor } = colors[strength.level];

  return (
    <div className="mt-2 space-y-1.5">
      {/* Progress bar */}
      <div className="flex gap-1">
        {[1, 2, 3].map((segment) => (
          <div
            key={segment}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors duration-200',
              strength.score >= segment ? barColor : 'bg-neutral-200'
            )}
          />
        ))}
      </div>

      {/* Strength message */}
      <p className={cn('text-xs', textColor)}>
        {strength.level === 'weak' && 'Weak'}
        {strength.level === 'medium' && 'Medium'}
        {strength.level === 'strong' && 'Strong'}
        {' - '}
        {strength.message}
      </p>
    </div>
  );
}
