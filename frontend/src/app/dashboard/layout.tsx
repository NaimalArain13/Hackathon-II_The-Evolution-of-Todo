'use client';

/**
 * Dashboard Layout
 * Feature: 007-dashboard-ui (User Story 8)
 *
 * Provides the base layout structure for all dashboard pages:
 * - Sidebar navigation (desktop) / Drawer (mobile)
 * - Main content area
 * - Authentication check
 * - Logout functionality
 */

import { ReactNode, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/auth-store';
import { useQueryClient } from '@tanstack/react-query';
import {
  Sidebar,
  MobileHeader,
  MobileSidebarWrapper,
} from '@/components/dashboard/Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, token, isAuthenticated, clearAuth } = useAuthStore();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication on mount
  useEffect(() => {
    // Check if user is authenticated (has both user and token)
    const hasValidAuth = isAuthenticated && user && token;

    if (!hasValidAuth) {
      // Not authenticated - redirect to signin
      router.replace('/signin');
    } else {
      // Authenticated - allow access
      setIsCheckingAuth(false);
    }
  }, [isAuthenticated, user, token, router]);

  // Handle logout
  const handleLogout = useCallback(() => {
    // Clear auth state
    clearAuth();
    // Clear React Query cache
    queryClient.clear();
    // Show success message
    toast.success('Logged out successfully');
    // Redirect to signin
    router.replace('/signin');
  }, [clearAuth, queryClient, router]);

  // Toggle sidebar collapse
  const handleToggleCollapse = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          <p className="text-neutral-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Extra safety check - should not render if not authenticated
  if (!isAuthenticated || !user || !token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile header with hamburger menu */}
      <MobileHeader onMenuClick={() => setMobileMenuOpen(true)} />

      {/* Mobile sidebar drawer */}
      <MobileSidebarWrapper
        user={user}
        onLogout={handleLogout}
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
      />

      {/* Main layout container - sidebar + content */}
      <div className="flex h-screen overflow-hidden md:pt-0 pt-14">
        {/* Desktop Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
          user={user}
          onLogout={handleLogout}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
