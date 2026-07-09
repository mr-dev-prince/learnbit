import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  logHabitCompletion,
  undoHabitCompletion,
} from '@/services/habit.service';
import type { HabitPayload } from '@/types/Habit';

export const HABITS_QUERY_KEY = ['habits'];

export function useHabits() {
  const queryClient = useQueryClient();

  const habitsQuery = useQuery({
    queryKey: HABITS_QUERY_KEY,
    queryFn: listHabits,
  });

  const createHabitMutation = useMutation({
    mutationFn: (payload: HabitPayload) => createHabit(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
    },
  });

  const updateHabitMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: HabitPayload }) =>
      updateHabit(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
    },
  });

  const deleteHabitMutation = useMutation({
    mutationFn: (id: string) => deleteHabit(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
    },
  });

  const logCompletionMutation = useMutation({
    mutationFn: ({ id, date, timezoneOffset }: { id: string; date: string; timezoneOffset: number }) => logHabitCompletion(id, date, timezoneOffset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
    },
  });

  const undoCompletionMutation = useMutation({
    mutationFn: ({ id, date, timezoneOffset }: { id: string; date: string; timezoneOffset: number }) => undoHabitCompletion(id, date, timezoneOffset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: HABITS_QUERY_KEY });
    },
  });

  return {
    habits: habitsQuery.data ?? [],
    isLoading: habitsQuery.isLoading,
    error: habitsQuery.error,
    createHabit: createHabitMutation.mutateAsync,
    updateHabit: updateHabitMutation.mutateAsync,
    deleteHabit: deleteHabitMutation.mutateAsync,
    logCompletion: logCompletionMutation.mutateAsync,
    undoCompletion: undoCompletionMutation.mutateAsync,
  };
}
