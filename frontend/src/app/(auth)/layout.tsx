'use client';

import { useEffect } from 'react';
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
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Redirect authenticated users away from auth pages
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Don't render auth pages for authenticated users
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-pulse text-neutral-500">Redirecting...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {children}
    </main>
  );
}
