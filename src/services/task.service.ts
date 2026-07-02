import { api } from './api';

import type { Task, TaskPayload } from '@/types/Task';

export function listTasks() {
  return api.get<Task[]>('/api/tasks');
}

export function getTask(id: string) {
  return api.get<Task>(`/api/tasks/${id}`);
}

export function createTask(payload: TaskPayload) {
  return api.post<Task>('/api/tasks', payload);
}

export function updateTask(id: string, payload: TaskPayload) {
  return api.put<Task>(`/api/tasks/${id}`, payload);
}

export function deleteTask(id: string) {
  return api.delete(`/api/tasks/${id}`);
}
