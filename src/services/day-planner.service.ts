import { api } from './api';
import { DayPlanner, Activity } from '@prisma/client';

export interface DayPlannerWithActivities extends DayPlanner {
  activities: Activity[];
}

export const getDayPlanner = async (date: string): Promise<DayPlannerWithActivities | null> => {
  try {
    return await api.get<DayPlannerWithActivities>(`/api/day-planner?date=${date}`);
  } catch (error) {
    return null;
  }
};

export const createDayPlanner = async (payload: { date: string; wakeTime: string; sleepTime: string }): Promise<DayPlannerWithActivities> => {
  return await api.post<DayPlannerWithActivities>('/api/day-planner', payload);
};

export const updateDayPlanner = async (id: string, payload: { wakeTime?: string; sleepTime?: string }): Promise<DayPlannerWithActivities> => {
  return await api.put<DayPlannerWithActivities>(`/api/day-planner/${id}`, payload);
};

export const createActivity = async (payload: {
  plannerId: string;
  title: string;
  notes?: string | null;
  startTime: string;
  endTime: string;
}): Promise<Activity> => {
  return await api.post<Activity>('/api/activities', payload);
};

export const updateActivity = async (
  id: string,
  payload: {
    title?: string;
    notes?: string | null;
    startTime?: string;
    endTime?: string;
    completed?: boolean;
  }
): Promise<Activity> => {
  return await api.put<Activity>(`/api/activities/${id}`, payload);
};

export const deleteActivity = async (id: string): Promise<void> => {
  return await api.delete(`/api/activities/${id}`);
};
