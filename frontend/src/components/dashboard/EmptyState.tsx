'use client';

/**
 * EmptyState Component
 * Feature: 007-dashboard-ui (User Story 1)
 *
 * Two variants:
 * - no-tasks: When user has no tasks at all
 * - no-results: When filters return no matching tasks
 */

import { motion } from 'framer-motion';
import { ClipboardList, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

type EmptyStateVariant = 'no-tasks' | 'no-results';

interface EmptyStateProps {
  variant: EmptyStateVariant;
  onCreateTask?: () => void;
  onClearFilters?: () => void;
}

const variants = {
  'no-tasks': {
    icon: ClipboardList,
    title: 'No tasks yet',
    description: 'Get started by creating your first task.',
    actionLabel: 'Create Task',
  },
  'no-results': {
    icon: Search,
    title: 'No tasks found',
    description: 'Try adjusting your filters or search query.',
    actionLabel: 'Clear Filters',
  },
};

export function EmptyState({ variant, onCreateTask, onClearFilters }: EmptyStateProps) {
  const config = variants[variant];
  const Icon = config.icon;

  const handleAction = () => {
    if (variant === 'no-tasks' && onCreateTask) {
      onCreateTask();
    } else if (variant === 'no-results' && onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-4 rounded-full bg-gray-100 p-4 dark:bg-gray-800"
      >
        <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
      </motion.div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
        {config.title}
      </h3>

      <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
        {config.description}
      </p>

      {(onCreateTask || onClearFilters) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <Button onClick={handleAction} variant={variant === 'no-tasks' ? 'default' : 'outline'}>
            {config.actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
