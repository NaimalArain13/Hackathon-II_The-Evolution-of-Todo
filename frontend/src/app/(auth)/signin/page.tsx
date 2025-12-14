'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import { AuthBrandingPanel } from '@/components/auth/AuthBrandingPanel';

export default function SigninPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-neutral-600">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form */}
          <LoginForm />
        </div>
      </div>

      {/* Right side - Branding Panel (hidden on mobile) */}
      <AuthBrandingPanel className="hidden lg:flex" />
    </div>
  );
}
