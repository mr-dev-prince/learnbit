export type ArchitectureStatus = 'PLANNED' | 'IN_PROGRESS' | 'BUILT' | 'LEARNING';

export type ArchitectureCategory =
  | 'System Architecture'
  | 'Frontend Architecture'
  | 'Backend & APIs'
  | 'Full-Stack'
  | 'Database & Data Flow'
  | 'Cloud & DevOps'
  | 'AI & Machine Learning'
  | 'Learning & Experiments';

export interface Architecture {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: string;
  status: ArchitectureStatus;
  diagram: string | null;
  content: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ArchitecturePayload {
  title: string;
  description?: string | null;
  category?: string;
  status?: ArchitectureStatus;
  diagram?: string | null;
  content?: string | null;
  tags?: string[];
}
