'use client';

/**
 * Tasks Page
 * Feature: 007-dashboard-ui (User Stories 4, 5, 6, 8)
 *
 * Dedicated tasks view with:
 * - TaskList, filters, search functionality
 * - Edit task modal (User Story 4)
 * - Delete confirm dialog (User Story 6)
 * - Focused view for task management
 */

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TaskList } from '@/components/dashboard/TaskList';
import { SearchBar } from '@/components/dashboard/SearchBar';
import { TaskFilters } from '@/components/dashboard/TaskFilters';
import { CreateTaskModal } from '@/components/modals/CreateTaskModal';
import { EditTaskModal } from '@/components/modals/EditTaskModal';
import { DeleteConfirmDialog } from '@/components/modals/DeleteConfirmDialog';
import { Button } from '@/components/ui/button';
import { useTasks, useToggleComplete } from '@/lib/hooks/useTasks';
import { useFilters } from '@/lib/hooks/useFilters';
import type { Task } from '@/types/task';

export default function TasksPage() {
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

  // Calculate task statistics
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.length - completedTasks;

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
      <div className="space-y-6">
        {/* Header with create task button */}
        <DashboardHeader
          title="My Tasks"
          subtitle={
            isLoading
              ? 'Loading your tasks...'
              : `${pendingTasks} pending, ${completedTasks} completed${hasActiveFilters ? ' (filtered)' : ''}`
          }
          action={
            <Button onClick={handleCreateTask} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Task</span>
              <span className="sm:hidden">Add</span>
            </Button>
          }
        />

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
