'use client';

/**
 * DashboardStats Component
 * Feature: 007-dashboard-ui (Enhanced)
 *
 * Displays animated statistics cards and charts:
 * - Total, Pending, Completed task counts
 * - Priority distribution chart
 * - Category distribution chart
 * - Beautiful gradients and animations
 */

import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ListTodo, TrendingUp } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Task, TaskPriority, TaskCategory } from '@/types/task';
import { Card } from '@/components/ui/card';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface DashboardStatsProps {
  tasks: Task[];
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  textColor: string;
  delay: number;
}

function StatCard({ title, value, icon, gradient, textColor, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative"
    >
      <Card className={`relative overflow-hidden border-0 ${gradient} p-6 shadow-lg`}>
        {/* Decorative circle */}
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className={`text-sm font-medium ${textColor} opacity-90`}>{title}</p>
            <motion.p
              className={`mt-2 text-4xl font-bold ${textColor}`}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
            >
              {value}
            </motion.p>
          </div>
          <motion.div
            className={`rounded-xl bg-white/20 p-3 ${textColor}`}
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            {icon}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

export function DashboardStats({ tasks }: DashboardStatsProps) {
  console.log("dashboard statistics");
  // Calculate statistics
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority distribution
  const priorityCount = {
    [TaskPriority.HIGH]: tasks.filter((t) => t.priority === TaskPriority.HIGH).length,
    [TaskPriority.MEDIUM]: tasks.filter((t) => t.priority === TaskPriority.MEDIUM).length,
    [TaskPriority.LOW]: tasks.filter((t) => t.priority === TaskPriority.LOW).length,
    [TaskPriority.NONE]: tasks.filter((t) => t.priority === TaskPriority.NONE).length,
  };

  // Category distribution
  const categoryCount = {
    [TaskCategory.WORK]: tasks.filter((t) => t.category === TaskCategory.WORK).length,
    [TaskCategory.PERSONAL]: tasks.filter((t) => t.category === TaskCategory.PERSONAL).length,
    [TaskCategory.SHOPPING]: tasks.filter((t) => t.category === TaskCategory.SHOPPING).length,
    [TaskCategory.HEALTH]: tasks.filter((t) => t.category === TaskCategory.HEALTH).length,
    [TaskCategory.OTHER]: tasks.filter((t) => t.category === TaskCategory.OTHER).length,
  };

  // Priority chart data
  const priorityChartData = {
    labels: ['High', 'Medium', 'Low', 'None'],
    datasets: [
      {
        data: [
          priorityCount[TaskPriority.HIGH],
          priorityCount[TaskPriority.MEDIUM],
          priorityCount[TaskPriority.LOW],
          priorityCount[TaskPriority.NONE],
        ],
        backgroundColor: [
          '#FF6767', // High - Danger red
          '#FBBF24', // Medium - Amber
          '#3ABEFF', // Low - Primary cyan
          '#9CA3AF', // None - Gray
        ],
        borderWidth: 0,
        hoverOffset: 8,
      },
    ],
  };

  // Category chart data
  const categoryChartData = {
    labels: ['Work', 'Personal', 'Shopping', 'Health', 'Other'],
    datasets: [
      {
        label: 'Tasks',
        data: [
          categoryCount[TaskCategory.WORK],
          categoryCount[TaskCategory.PERSONAL],
          categoryCount[TaskCategory.SHOPPING],
          categoryCount[TaskCategory.HEALTH],
          categoryCount[TaskCategory.OTHER],
        ],
        backgroundColor: [
          '#8B5CF6', // Work - Purple
          '#10B981', // Personal - Green
          '#F97316', // Shopping - Orange
          '#EC4899', // Health - Pink
          '#6B7280', // Other - Gray
        ],
        borderRadius: 8,
        hoverBackgroundColor: [
          '#7C3AED',
          '#059669',
          '#EA580C',
          '#DB2777',
          '#4B5563',
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 16,
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={<ListTodo className="h-6 w-6" />}
          gradient="bg-gradient-to-br from-primary-400 to-primary-600"
          textColor="text-white"
          delay={0}
        />
        <StatCard
          title="Pending"
          value={pendingTasks}
          icon={<Clock className="h-6 w-6" />}
          gradient="bg-gradient-to-br from-amber-400 to-orange-500"
          textColor="text-white"
          delay={0.1}
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          icon={<CheckCircle2 className="h-6 w-6" />}
          gradient="bg-gradient-to-br from-green-400 to-emerald-600"
          textColor="text-white"
          delay={0.2}
        />
        <StatCard
          title="Completion Rate"
          value={completionRate}
          icon={<TrendingUp className="h-6 w-6" />}
          gradient="bg-gradient-to-br from-danger-400 to-danger-600"
          textColor="text-white"
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      {totalTasks > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {/* Priority Distribution */}
          <Card className="border-2 border-primary-100 bg-gradient-to-br from-white to-primary-50/30 p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-neutral-900">Priority Distribution</h3>
            <div className="h-64">
              <Doughnut data={priorityChartData} options={chartOptions} />
            </div>
          </Card>

          {/* Category Distribution */}
          <Card className="border-2 border-primary-100 bg-gradient-to-br from-white to-primary-50/30 p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-semibold text-neutral-900">Category Breakdown</h3>
            <div className="h-64">
              <Bar data={categoryChartData} options={barChartOptions} />
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
