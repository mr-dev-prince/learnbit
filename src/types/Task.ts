export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'archived';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  notes: string | null;
  resourceLinks: string[];
  scheduledFor: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskPayload {
  title: string;
  description?: string | null;
  notes?: string | null;
  resourceLinks?: string[];
  scheduledFor?: string | null;
  status?: TaskStatus;
}
