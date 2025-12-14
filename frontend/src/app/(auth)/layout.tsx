'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * Auth layout wrapper
 * - Redirects authenticated users to dashboard
 * - Provides minimal layout without header/footer
 */
export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, user, token } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user has valid authentication (user + token + isAuthenticated)
    const hasValidAuth = isAuthenticated && user && token;

    if (hasValidAuth) {
      // Redirect authenticated users away from auth pages
      router.replace('/dashboard');
    } else {
      // Not authenticated - show auth pages
      setIsChecking(false);
    }
  }, [isAuthenticated, user, token, router]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          <p className="text-neutral-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {children}
    </main>
  );
}
