'use client';

/**
 * DeleteConfirmDialog Component
 * Feature: 007-dashboard-ui (User Story 6)
 *
 * Confirmation dialog for deleting tasks:
 * - Shows task title in confirmation message
 * - Cancel and Delete buttons
 * - Delete button has destructive styling (red)
 * - Loading state during deletion
 * - Auto-closes on successful delete
 */

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeleteTask } from '@/lib/hooks/useTasks';

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: number | null;
  taskTitle: string | null;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  taskId,
  taskTitle,
}: DeleteConfirmDialogProps) {
  const { mutate: deleteTask, isPending } = useDeleteTask();

  const handleDelete = () => {
    if (taskId === null) return;

    deleteTask(taskId, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="overflow-hidden border-2 border-danger-200 bg-gradient-to-br from-white via-danger-50/30 to-white p-0 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
        >
          {/* Colorful Header Section */}
          <div className="relative overflow-hidden bg-gradient-to-r from-danger-500 via-red-500 to-danger-600 px-6 py-6">
            {/* Decorative circles */}
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -left-8 bottom-0 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

            <AlertDialogHeader className="relative">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="rounded-full bg-white/20 p-3"
                >
                  <AlertTriangle className="h-6 w-6 text-white" />
                </motion.div>
                <AlertDialogTitle className="text-2xl font-bold text-white">
                  Delete Task
                </AlertDialogTitle>
              </div>
            </AlertDialogHeader>
          </div>

          {/* Content */}
          <div className="p-6">
            <AlertDialogDescription asChild>
              <div className="text-base text-neutral-800">
                Are you sure you want to delete{' '}
                <span className="font-bold text-danger-600">
                  "{taskTitle || 'this task'}"
                </span>
                ?
                <br />
                <span className="mt-2 block text-sm font-medium text-neutral-600">
                  This action cannot be undone.
                </span>
              </div>
            </AlertDialogDescription>

            <AlertDialogFooter className="mt-6 gap-2">
              <AlertDialogCancel
                disabled={isPending}
                className="border-2 border-neutral-300 hover:bg-neutral-100"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isPending}
                className="bg-gradient-to-r from-danger-500 to-red-600 text-white shadow-lg shadow-danger-200 hover:from-danger-600 hover:to-red-700"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="h-4 w-4 rounded-full border-2 border-white border-t-transparent"
                    />
                    Deleting...
                  </span>
                ) : (
                  'Delete Task'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </motion.div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
