'use client';

/**
 * TaskCard Component
 * Feature: 007-dashboard-ui (User Story 1)
 *
 * Displays a single task with:
 * - Title and description preview
 * - Priority and category badges
 * - Completion checkbox
 * - Edit/Delete action buttons
 * - Hover effects and animations
 */

import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { Task, TaskPriority, TaskCategory } from '@/types/task';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggleComplete?: (taskId: number) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  isToggling?: boolean;
}

// Priority badge color mapping - VIBRANT COLORS
const priorityColors: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: 'bg-gradient-to-r from-danger-500 to-danger-600 text-white shadow-md shadow-danger-200 border border-danger-400',
  [TaskPriority.MEDIUM]: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md shadow-amber-200 border border-amber-300',
  [TaskPriority.LOW]: 'bg-gradient-to-r from-primary-400 to-primary-600 text-white shadow-md shadow-primary-200 border border-primary-300',
  [TaskPriority.NONE]: 'bg-gradient-to-r from-neutral-400 to-neutral-500 text-white shadow-sm',
};

// Category badge color mapping - VIBRANT COLORS
const categoryColors: Record<TaskCategory, string> = {
  [TaskCategory.WORK]: 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-md shadow-purple-200 border border-purple-400',
  [TaskCategory.PERSONAL]: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-200 border border-green-400',
  [TaskCategory.SHOPPING]: 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md shadow-orange-200 border border-orange-400',
  [TaskCategory.HEALTH]: 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-md shadow-pink-200 border border-pink-400',
  [TaskCategory.OTHER]: 'bg-gradient-to-r from-slate-500 to-gray-600 text-white shadow-sm',
};

// Priority labels for display
const priorityLabels: Record<TaskPriority, string> = {
  [TaskPriority.HIGH]: 'High',
  [TaskPriority.MEDIUM]: 'Medium',
  [TaskPriority.LOW]: 'Low',
  [TaskPriority.NONE]: 'None',
};

// Category labels for display
const categoryLabels: Record<TaskCategory, string> = {
  [TaskCategory.WORK]: 'Work',
  [TaskCategory.PERSONAL]: 'Personal',
  [TaskCategory.SHOPPING]: 'Shopping',
  [TaskCategory.HEALTH]: 'Health',
  [TaskCategory.OTHER]: 'Other',
};

export function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  isToggling = false,
}: TaskCardProps) {
  const handleToggleComplete = () => {
    if (onToggleComplete && !isToggling) {
      onToggleComplete(task.id);
    }
  };

  // Normalize priority and category to handle string values from API
  const priority = (task.priority as TaskPriority) || TaskPriority.NONE;
  const category = (task.category as TaskCategory) || TaskCategory.OTHER;

  // Get colors and labels with fallbacks
  const priorityColor = priorityColors[priority] || priorityColors[TaskPriority.NONE];
  const categoryColor = categoryColors[category] || categoryColors[TaskCategory.OTHER];
  const priorityLabel = priorityLabels[priority] || 'None';
  const categoryLabel = categoryLabels[category] || 'Other';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
      className={cn(
        'group relative overflow-hidden rounded-xl border-2 border-neutral-200 bg-white p-5 shadow-lg transition-all hover:shadow-xl hover:border-primary-300 dark:bg-gray-800 dark:border-gray-700',
        task.completed && 'opacity-70 hover:opacity-90 bg-neutral-50'
      )}
    >
      {/* Decorative gradient overlay on hover */}
      <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-primary-400 to-danger-500 opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex items-start gap-4">
        {/* Completion checkbox */}
        <motion.div
          className="pt-0.5"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Checkbox
            checked={task.completed}
            onCheckedChange={handleToggleComplete}
            disabled={isToggling}
            className="h-6 w-6 border-2 data-[state=checked]:bg-gradient-to-br data-[state=checked]:from-green-500 data-[state=checked]:to-emerald-600"
            aria-label={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
          />
        </motion.div>

        {/* Task content */}
        <div className="min-w-0 flex-1">
          {/* Title */}
          <h3
            className={cn(
              'mb-1 text-base font-semibold text-neutral-900 dark:text-white',
              task.completed && 'line-through text-neutral-500 dark:text-neutral-400'
            )}
          >
            {task.title || 'Untitled Task'}
          </h3>

          {/* Description preview */}
          {task.description && (
            <p
              className={cn(
                'mb-3 line-clamp-2 text-sm text-neutral-700 dark:text-neutral-300',
                task.completed && 'text-neutral-400 dark:text-neutral-500'
              )}
            >
              {task.description}
            </p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge className={cn('text-xs font-semibold px-3 py-1', priorityColor)}>
                {priorityLabel} Priority
              </Badge>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge className={cn('text-xs font-semibold px-3 py-1', categoryColor)}>
                {categoryLabel}
              </Badge>
            </motion.div>
          </div>
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {onEdit && (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(task)}
                className="h-9 w-9 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 hover:text-primary-700"
                aria-label="Edit task"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
          {onDelete && (
            <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(task)}
                className="h-9 w-9 rounded-lg bg-danger-50 text-danger-600 hover:bg-danger-100 hover:text-danger-700"
                aria-label="Delete task"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
