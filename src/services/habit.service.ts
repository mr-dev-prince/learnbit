import { api } from './api';

import type { Habit, HabitPayload, HabitLog } from '@/types/Habit';

export function listHabits() {
  return api.get<Habit[]>('/api/habits');
}

export function getHabit(id: string) {
  return api.get<Habit>(`/api/habits/${id}`);
}

export function createHabit(payload: HabitPayload) {
  return api.post<Habit>('/api/habits', payload);
}

export function updateHabit(id: string, payload: HabitPayload) {
  return api.put<Habit>(`/api/habits/${id}`, payload);
}

export function deleteHabit(id: string) {
  return api.delete(`/api/habits/${id}`);
}

export function logHabitCompletion(id: string, date: string) {
  return api.post<HabitLog>(`/api/habits/${id}/log`, { date });
}

export function undoHabitCompletion(id: string, date: string) {
  return api.delete(`/api/habits/${id}/log?date=${encodeURIComponent(date)}`);
}
