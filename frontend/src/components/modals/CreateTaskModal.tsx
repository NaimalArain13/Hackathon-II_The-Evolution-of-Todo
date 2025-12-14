'use client';

/**
 * CreateTaskModal Component
 * Feature: 007-dashboard-ui (User Story 2)
 *
 * Dialog with form for creating new tasks:
 * - Title (required)
 * - Description (optional)
 * - Priority selection
 * - Category selection
 * - react-hook-form with Zod validation
 * - Loading state and error handling
 * - Smooth animations with Framer Motion
 * - Auto-focus on title field
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { createTaskSchema, type CreateTaskSchemaType } from '@/lib/validations/task';
import { TaskPriority, TaskCategory } from '@/types/task';
import { useCreateTask } from '@/lib/hooks/useTasks';

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Priority options for select
const priorityOptions = [
  { value: TaskPriority.HIGH, label: 'High' },
  { value: TaskPriority.MEDIUM, label: 'Medium' },
  { value: TaskPriority.LOW, label: 'Low' },
  { value: TaskPriority.NONE, label: 'None' },
];

// Category options for select
const categoryOptions = [
  { value: TaskCategory.WORK, label: 'Work' },
  { value: TaskCategory.PERSONAL, label: 'Personal' },
  { value: TaskCategory.SHOPPING, label: 'Shopping' },
  { value: TaskCategory.HEALTH, label: 'Health' },
  { value: TaskCategory.OTHER, label: 'Other' },
];

export function CreateTaskModal({ open, onOpenChange }: CreateTaskModalProps) {
  const { mutate: createTask, isPending } = useCreateTask();

  const form = useForm<CreateTaskSchemaType>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      category: TaskCategory.PERSONAL,
    },
  });

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  const onSubmit = (data: CreateTaskSchemaType) => {
    createTask(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] overflow-hidden border-2 border-primary-200 bg-gradient-to-br from-white via-primary-50/30 to-white p-0 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
        >
          {/* Colorful Header Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 px-6 py-6">
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

            <DialogHeader className="relative">
              <DialogTitle className="text-2xl font-bold text-white">
                ✨ Create New Task
              </DialogTitle>
              <DialogDescription className="text-primary-50">
                Add a new task to your list. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 p-6">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-800 font-semibold">Title *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter task title"
                        autoFocus
                        disabled={isPending}
                        className="border-2 border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-primary-400 focus:ring-primary-200"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-800 font-semibold">Description</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="Enter task description (optional)"
                        className="flex min-h-[100px] w-full rounded-md border-2 border-neutral-200 bg-background px-3 py-2 text-sm text-neutral-900 ring-offset-background placeholder:text-neutral-400 focus-visible:outline-none focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Priority and Category Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Priority Field */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-800 font-semibold">Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {priorityOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category Field */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-neutral-800 font-semibold">Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="gap-2 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                  className="border-2 border-neutral-300 hover:bg-neutral-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg shadow-primary-200 hover:from-primary-600 hover:to-primary-700"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                      />
                      Creating...
                    </span>
                  ) : (
                    'Create Task'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
