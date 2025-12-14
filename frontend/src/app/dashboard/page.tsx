'use client';

/**
 * Dashboard Main Page
 * Feature: 007-dashboard-ui (User Stories 1, 2, 3, 4, 5, 6)
 *
 * Main dashboard view displaying:
 * - Dashboard header with welcome message
 * - Search bar and filters (User Story 3)
 * - Task list with loading/error states
 * - Create task modal (User Story 2)
 * - Edit task modal (User Story 4)
 * - Delete confirm dialog (User Story 6)
 */

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { TaskList } from '@/components/dashboard/TaskList';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { TaskFilters } from '@/components/dashboard/TaskFilters';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { EditTaskModal } from '@/components/modals/EditTaskModal';
import { DeleteConfirmDialog } from '@/components/modals/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { useTasks, useToggleComplete } from '@/lib/hooks/useTasks';
import { useFilters } from '@/lib/hooks/useFilters';
import { useAuthStore } from '@/store/auth-store';
import type { Task } from '@/types/task';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { filters, setFilters, clearFilters, hasActiveFilters } = useFilters();
  const { data: tasks = [], isLoading, error } = useTasks({ filters });
  const { mutate: toggleComplete, variables: togglingTaskId } = useToggleComplete();

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Handlers
  const handleCreateTask = () => {
    setCreateModalOpen(true);
  };

  const handleToggleComplete = (taskId: number) => {
    toggleComplete(taskId);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setEditModalOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true);
  };

  const handleSearchChange = (search: string) => {
    setFilters({ search });
  };

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="mb-4 text-red-500">Failed to load tasks</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <>
      <div className="relative space-y-8">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute left-0 top-0 -z-10 h-96 w-96 rounded-full bg-primary-100 opacity-20 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-40 -z-10 h-96 w-96 rounded-full bg-danger-100 opacity-20 blur-3xl" />

        {/* Header with create task button */}
        <DashboardHeader
          title={`${getGreeting()}, ${user?.name || 'there'}!`}
          subtitle={
            isLoading
              ? 'Loading your tasks...'
              : `You have ${tasks.length} task${tasks.length !== 1 ? 's' : ''}${hasActiveFilters ? ' (filtered)' : ''}`
          }
          action={
            <Button onClick={handleCreateTask} className="gap-2 bg-gradient-to-r from-primary-500 to-primary-600 shadow-lg shadow-primary-200 hover:from-primary-600 hover:to-primary-700">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Task</span>
              <span className="sm:hidden">Add</span>
            </Button>
          }
        />

        {/* Statistics Dashboard */}
        {!isLoading && <DashboardStats tasks={tasks} />}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gradient-to-r from-neutral-50 to-white px-4 text-sm font-medium text-neutral-500">
              Your Tasks
            </span>
          </div>
        </div>

        {/* Search and filters */}
        <div className="space-y-4">
          <SearchBar
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search tasks by title or description..."
            className="max-w-md"
          />
          <TaskFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Task list */}
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          hasFilters={hasActiveFilters}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          onCreateTask={handleCreateTask}
          onClearFilters={clearFilters}
          togglingTaskId={togglingTaskId ?? null}
        />
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal open={createModalOpen} onOpenChange={setCreateModalOpen} />

      {/* Edit Task Modal */}
      <EditTaskModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        task={selectedTask}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        taskId={selectedTask?.id ?? null}
        taskTitle={selectedTask?.title ?? null}
      />
    </>
  );
}
