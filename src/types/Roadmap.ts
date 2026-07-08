export type RoadmapStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ARCHIVED';
export type ModuleStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';

export interface RoadmapModule {
  id: string;
  roadmapId: string;
  title: string;
  description: string | null;
  status: ModuleStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Roadmap {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  estimatedTime: string | null;
  resources: string[];
  status: RoadmapStatus;
  createdAt: string;
  updatedAt: string;
  modules?: RoadmapModule[];
}

export interface RoadmapPayload {
  title: string;
  description?: string | null;
  estimatedTime?: string | null;
  resources?: string[];
  status?: RoadmapStatus;
}

export interface ModulePayload {
  title: string;
  description?: string | null;
  status?: ModuleStatus;
  order?: number;
}
