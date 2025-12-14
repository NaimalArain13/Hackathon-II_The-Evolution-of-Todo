'use client';

/**
 * Profile Page
 * Feature: 007-dashboard-ui (User Story 9)
 *
 * User profile page with:
 * - Display user name, email, creation date, updated date
 * - Edit functionality with inline form
 * - Form validation with Zod
 * - Loading and error states
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Pencil, User as UserIcon, Mail, Calendar, Clock, Save, X } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuthStore } from '@/store/auth-store';
import { useUpdateProfile } from '@/lib/hooks/useProfile';
import { editProfileSchema, type EditProfileSchemaType } from '@/lib/validations/profile';

/**
 * Format date string for display
 */
function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get user initials from name
 */
function getInitials(name: string | undefined): string {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<EditProfileSchemaType>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name || '',
    },
  });

  // Handle edit button click
  const handleEdit = () => {
    form.reset({ name: user?.name || '' });
    setIsEditing(true);
  };

  // Handle cancel edit
  const handleCancel = () => {
    form.reset({ name: user?.name || '' });
    setIsEditing(false);
  };

  // Handle form submit
  const onSubmit = (data: EditProfileSchemaType) => {
    updateProfile(data, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  // Loading state
  if (!isAuthenticated || !user) {
    return (
      <div className="space-y-6">
        <DashboardHeader title="Profile" subtitle="Loading your profile..." />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-48" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Profile"
        subtitle="View and manage your account information"
        action={
          !isEditing && (
            <Button onClick={handleEdit} variant="outline" className="gap-2">
              <Pencil className="h-4 w-4" />
              Edit Profile
            </Button>
          )
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your personal details and account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                {!isEditing && (
                  <p className="text-lg font-medium">{user.name}</p>
                )}
              </div>

              {/* Details Section */}
              <div className="flex-1 space-y-6">
                {isEditing ? (
                  /* Edit Form */
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Enter your name"
                                disabled={isPending}
                                autoFocus
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Email (read-only) */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Email
                        </label>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span>{user.email}</span>
                          <span className="text-xs bg-muted px-2 py-0.5 rounded">
                            Cannot be changed
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4">
                        <Button type="submit" disabled={isPending} className="gap-2">
                          <Save className="h-4 w-4" />
                          {isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          disabled={isPending}
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </Form>
                ) : (
                  /* Display Mode */
                  <div className="space-y-4">
                    {/* Name */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>

                    {/* Created At */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="font-medium">{formatDate(user.created_at)}</p>
                      </div>
                    </div>

                    {/* Updated At */}
                    {user.updated_at && (
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Updated</p>
                          <p className="font-medium">{formatDate(user.updated_at)}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
