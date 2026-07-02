export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  notes: string | null;
  resourceLinks: string[];
  dueDate: string | null;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TaskPayload {
  title: string;
  description?: string | null;
  notes?: string | null;
  resourceLinks?: string[];
  dueDate?: string | null;
  status?: TaskStatus;
}
