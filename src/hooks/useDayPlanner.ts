import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getDayPlanner,
  createDayPlanner,
  updateDayPlanner,
  createActivity,
  updateActivity,
  deleteActivity,
} from '@/services/day-planner.service';

export const DAY_PLANNER_QUERY_KEY = (date: string) => ['day-planner', date];

export function useDayPlanner(date: string) {
  const queryClient = useQueryClient();

  const plannerQuery = useQuery({
    queryKey: DAY_PLANNER_QUERY_KEY(date),
    queryFn: () => getDayPlanner(date),
  });

  const createPlannerMutation = useMutation({
    mutationFn: createDayPlanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DAY_PLANNER_QUERY_KEY(date) });
    },
  });

  const updatePlannerMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { wakeTime?: string; sleepTime?: string } }) =>
      updateDayPlanner(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DAY_PLANNER_QUERY_KEY(date) });
    },
  });

  const createActivityMutation = useMutation({
    mutationFn: createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DAY_PLANNER_QUERY_KEY(date) });
    },
  });

  const updateActivityMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: {
        title?: string;
        notes?: string | null;
        startTime?: string;
        endTime?: string;
        completed?: boolean;
      };
    }) => updateActivity(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DAY_PLANNER_QUERY_KEY(date) });
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DAY_PLANNER_QUERY_KEY(date) });
    },
  });

  return {
    planner: plannerQuery.data,
    isLoading: plannerQuery.isLoading,
    error: plannerQuery.error,
    createPlanner: createPlannerMutation.mutateAsync,
    updatePlanner: updatePlannerMutation.mutateAsync,
    createActivity: createActivityMutation.mutateAsync,
    updateActivity: updateActivityMutation.mutateAsync,
    deleteActivity: deleteActivityMutation.mutateAsync,
  };
}
