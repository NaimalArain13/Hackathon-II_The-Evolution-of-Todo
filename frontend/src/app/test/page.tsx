'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthStore } from '@/store/auth-store';
import { toast } from 'sonner';
import { Check, User } from '@/components/ui/icons';
import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/animations';
import { formatDate, formatRelativeTime } from '@/lib/date-utils';

export default function TestPage() {
  const { user, setAuth, clearAuth, isAuthenticated } = useAuthStore();

  const testAuth = () => {
    setAuth(
      {
        id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
        created_at: new Date().toISOString(),
      },
      'fake-token-123'
    );
    toast.success('User authenticated successfully!');
  };

  const testLogout = () => {
    clearAuth();
    toast.info('User logged out');
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
          <h1 className="text-5xl font-bold text-primary-500">Frontend Setup Test</h1>
          <p className="mt-2 text-lg text-neutral-700">Testing all installed features</p>
        </motion.div>

        {/* Design System Test */}
        <Card>
          <CardHeader>
            <CardTitle>Design System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="h-16 w-16 rounded bg-primary-500"></div>
              <div className="h-16 w-16 rounded bg-danger-500"></div>
              <div className="h-16 w-16 rounded bg-neutral-900"></div>
            </div>
            <div>
              <p className="text-xs">Extra Small (12px)</p>
              <p className="text-sm">Small (14px)</p>
              <p className="text-base">Base (16px)</p>
              <p className="text-lg">Large (18px)</p>
              <p className="text-xl">Extra Large (20px)</p>
            </div>
          </CardContent>
        </Card>

        {/* Components Test */}
        <Card>
          <CardHeader>
            <CardTitle>UI Components</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="test-input">Email</Label>
              <Input id="test-input" type="email" placeholder="test@example.com" />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Icons Test */}
        <Card>
          <CardHeader>
            <CardTitle>Icons</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Check className="h-6 w-6 text-danger-500" />
            <User className="h-6 w-6 text-primary-500" />
          </CardContent>
        </Card>

        {/* Loading State Test */}
        <Card>
          <CardHeader>
            <CardTitle>Loading States</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>

        {/* Auth Store Test */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Store</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">
                Status: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
              </p>
              {user && (
                <div className="mt-2 text-sm">
                  <p>User: {user.name}</p>
                  <p>Email: {user.email}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={testAuth}>Test Login</Button>
              <Button variant="outline" onClick={testLogout}>
                Test Logout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Date Utilities Test */}
        <Card>
          <CardHeader>
            <CardTitle>Date Utilities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">Formatted: {formatDate(new Date())}</p>
            <p className="text-sm">Relative: {formatRelativeTime(new Date())}</p>
          </CardContent>
        </Card>

        {/* Toast Test */}
        <Card>
          <CardHeader>
            <CardTitle>Toast Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <Button
                onClick={() => toast.success('Success message!')}
                variant="default"
              >
                Success Toast
              </Button>
              <Button
                onClick={() => toast.error('Error message!')}
                variant="destructive"
              >
                Error Toast
              </Button>
              <Button
                onClick={() => toast.info('Info message!')}
                variant="outline"
              >
                Info Toast
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

