'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormError } from './FormError';
import { PasswordInput } from './PasswordInput';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

/**
 * Login form component with React Hook Form integration
 * Handles authentication with client-side validation and API submission
 */
export function LoginForm() {
  const { login, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    // Client-side validation should prevent this, but double-check
    if (!isValid) {
      toast.error('Please fix the errors before continuing');
      return;
    }

    try {
      await login({
        email: data.email,
        password: data.password,
      });
    } catch {
      // Error is already handled by useAuth hook
    }
  };

  const onInvalidSubmit = () => {
    toast.error('Please fix the errors before continuing');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-5">
      {/* Email field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-neutral-700">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          autoComplete="email"
          className={cn(errors.email && 'border-red-500 focus-visible:ring-red-500')}
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        <FormError message={errors.email?.message} />
      </div>

      {/* Password field */}
      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      {/* Submit button */}
      <Button
        type="submit"
        className="w-full h-11 bg-primary-500 hover:bg-primary-600 text-white font-medium"
        disabled={isLoading || !isValid}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      {/* Sign up link */}
      <p className="text-center text-sm text-neutral-600">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-700">
          Sign up
        </Link>
      </p>
    </form>
  );
}
