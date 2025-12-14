'use client';

/**
 * TaskList Component
 * Feature: 007-dashboard-ui (User Story 1)
 *
 * Renders a list of TaskCard components with:
 * - Loading state with Skeleton placeholders
 * - Empty state handling
 * - Responsive grid layout
 * - Fade-in animations with Framer Motion
 */

import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { EmptyState } from './EmptyState';
import { Skeleton } from '@/components/ui/skeleton';

interface TaskListProps {
  tasks: Task[];
  isLoading?: boolean;
  hasFilters?: boolean;
  onToggleComplete?: (taskId: number) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onCreateTask?: () => void;
  onClearFilters?: () => void;
  togglingTaskId?: number | null;
}

// Animation variants for staggered list animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// Loading skeleton component
function TaskListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-800"
        >
          <div className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TaskList({
  tasks,
  isLoading = false,
  hasFilters = false,
  onToggleComplete,
  onEdit,
  onDelete,
  onCreateTask,
  onClearFilters,
  togglingTaskId,
}: TaskListProps) {
  // Show loading skeleton
  if (isLoading) {
    return <TaskListSkeleton />;
  }

  // Show empty state when no tasks
  if (tasks.length === 0) {
    return (
      <EmptyState
        variant={hasFilters ? 'no-results' : 'no-tasks'}
        onCreateTask={onCreateTask}
        onClearFilters={onClearFilters}
      />
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            variants={itemVariants}
            layout
            exit={{ opacity: 0, x: -20 }}
          >
            <TaskCard
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
              isToggling={togglingTaskId === task.id}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
