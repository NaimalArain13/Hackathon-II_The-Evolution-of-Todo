'use client';

/**
 * EditTaskModal Component
 * Feature: 007-dashboard-ui (User Story 4)
 *
 * Dialog with form for editing existing tasks:
 * - Pre-filled with current task data
 * - Title (required)
 * - Description (optional)
 * - Priority selection
 * - Category selection
 * - Completed checkbox
 * - react-hook-form with Zod validation
 * - Loading state and error handling
 * - Smooth animations with Framer Motion
 */

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
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
import { Checkbox } from '@/components/ui/checkbox';
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
  FormDescription,
} from '@/components/ui/form';
import { editTaskSchema, type EditTaskSchemaType } from '@/lib/validations/task';
import { TaskPriority, TaskCategory, type Task } from '@/types/task';
import { useUpdateTask } from '@/lib/hooks/useTasks';

interface EditTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
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

export function EditTaskModal({ open, onOpenChange, task }: EditTaskModalProps) {
  const { mutate: updateTask, isPending } = useUpdateTask();

  const form = useForm<EditTaskSchemaType>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: TaskPriority.MEDIUM,
      category: TaskCategory.PERSONAL,
      completed: false,
    },
  });

  // Reset form with task data when modal opens or task changes
  useEffect(() => {
    if (open && task) {
      form.reset({
        title: task.title,
        description: task.description || '',
        priority: task.priority as TaskPriority,
        category: task.category as TaskCategory,
        completed: task.completed,
      });
    }
  }, [open, task, form]);

  const onSubmit = (data: EditTaskSchemaType) => {
    if (!task) return;

    updateTask(
      {
        taskId: task.id,
        data: {
          title: data.title,
          description: data.description || undefined,
          priority: data.priority,
          category: data.category,
          completed: data.completed,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  // Don't render if no task
  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-white via-amber-50/30 to-white p-0 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
        >
          {/* Colorful Header Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 px-6 py-6">
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

            <DialogHeader className="relative">
              <DialogTitle className="text-2xl font-bold text-white">
                ✏️ Edit Task
              </DialogTitle>
              <DialogDescription className="text-amber-50">
                Make changes to your task. Click save when you're done.
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
                        className="border-2 border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus:border-amber-400 focus:ring-amber-200"
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
                        className="flex min-h-[100px] w-full rounded-md border-2 border-neutral-200 bg-background px-3 py-2 text-sm text-neutral-900 ring-offset-background placeholder:text-neutral-400 focus-visible:outline-none focus-visible:border-amber-400 focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                        value={field.value}
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
                        value={field.value}
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

              {/* Completed Checkbox */}
              <FormField
                control={form.control}
                name="completed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                        className="h-5 w-5 border-2 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-600"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-neutral-800 font-semibold">Mark as completed</FormLabel>
                      <FormDescription className="text-neutral-600">
                        This task will be marked as done and styled differently
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

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
                  className="bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg shadow-amber-200 hover:from-amber-600 hover:to-orange-600"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                      />
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
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
