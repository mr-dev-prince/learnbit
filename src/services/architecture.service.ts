import { api } from './api';
import type { Architecture, ArchitecturePayload } from '@/types/Architecture';

export function listArchitectures() {
  return api.get<Architecture[]>('/api/architectures');
}

export function getArchitecture(id: string) {
  return api.get<Architecture>(`/api/architectures/${id}`);
}

export function createArchitecture(payload: ArchitecturePayload) {
  return api.post<Architecture>('/api/architectures', payload);
}

export function updateArchitecture(id: string, payload: ArchitecturePayload) {
  return api.put<Architecture>(`/api/architectures/${id}`, payload);
}

export function deleteArchitecture(id: string) {
  return api.delete(`/api/architectures/${id}`);
}
