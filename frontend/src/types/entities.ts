/**
 * Entity type definitions for database models
 */

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
  updated_at?: string;
  is_active?: boolean;
}

export interface Task {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: 'high' | 'medium' | 'low' | 'none';
  category: 'work' | 'personal' | 'shopping' | 'health' | 'other';
  created_at: string;
  updated_at: string;
}

