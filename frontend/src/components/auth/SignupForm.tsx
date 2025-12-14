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
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

/**
 * Signup form component with React Hook Form integration
 * Handles registration with client-side validation and API submission
 */
export function SignupForm() {
  const { register: registerUser, isLoading } = useAuth();
  const [passwordValue, setPasswordValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Watch password for strength indicator
  const password = watch('password');
  if (password !== passwordValue) {
    setPasswordValue(password);
  }

  const onSubmit = async (data: RegisterFormData) => {
    // Client-side validation should prevent this, but double-check
    if (!isValid) {
      toast.error('Please fix the errors before continuing');
      return;
    }

    try {
      await registerUser({
        name: data.name,
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
      {/* Name field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium text-neutral-700">
          Full Name
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          autoComplete="name"
          className={cn(errors.name && 'border-red-500 focus-visible:ring-red-500')}
          aria-invalid={!!errors.name}
          {...register('name')}
        />
        <FormError message={errors.name?.message} />
      </div>

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

      {/* Password field with strength indicator */}
      <div className="space-y-2">
        <PasswordInput
          label="Password"
          placeholder="Create a password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordStrengthIndicator password={passwordValue} />
      </div>

      {/* Confirm Password field */}
      <PasswordInput
        label="Confirm Password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
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
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      {/* Sign in link */}
      <p className="text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <Link href="/signin" className="font-medium text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </form>
  );
}
