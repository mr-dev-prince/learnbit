import { api } from './api';
import type { Roadmap, RoadmapModule, RoadmapPayload, ModulePayload } from '@/types/Roadmap';

export function listRoadmaps() {
  return api.get<Roadmap[]>('/api/roadmaps');
}

export function getRoadmap(id: string) {
  return api.get<Roadmap>(`/api/roadmaps/${id}`);
}

export function createRoadmap(payload: RoadmapPayload) {
  return api.post<Roadmap>('/api/roadmaps', payload);
}

export function updateRoadmap(id: string, payload: RoadmapPayload) {
  return api.put<Roadmap>(`/api/roadmaps/${id}`, payload);
}

export function deleteRoadmap(id: string) {
  return api.delete(`/api/roadmaps/${id}`);
}

export function listModules(roadmapId: string) {
  return api.get<RoadmapModule[]>(`/api/roadmaps/${roadmapId}/modules`);
}

export function createModule(roadmapId: string, payload: ModulePayload) {
  return api.post<RoadmapModule>(`/api/roadmaps/${roadmapId}/modules`, payload);
}

export function updateModule(roadmapId: string, moduleId: string, payload: ModulePayload) {
  return api.put<RoadmapModule>(`/api/roadmaps/${roadmapId}/modules/${moduleId}`, payload);
}

export function deleteModule(roadmapId: string, moduleId: string) {
  return api.delete(`/api/roadmaps/${roadmapId}/modules/${moduleId}`);
}
