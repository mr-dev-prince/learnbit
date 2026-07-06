'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, getTask, listTasks, updateTask } from '@/services/task.service';
import {
  listTaskRevisions,
  markTaskForRevision,
  unmarkTaskForRevision,
} from '@/services/revision.service';
import type { Task, TaskPayload } from '@/types/Task';
import type { MarkRevisionPayload, Revision } from '@/types/Revision';

export const taskKeys = {
  all: ['tasks'] as const,
  detail: (id: string) => ['tasks', id] as const,
};

export const revisionKeys = {
  forTask: (taskId: string) => ['tasks', taskId, 'revisions'] as const,
};

/* -------------------------------------------------------------------------- */
/*                                   Queries                                  */
/* -------------------------------------------------------------------------- */

export function useTasks() {
  return useQuery({
    queryKey: taskKeys.all,
    queryFn: listTasks,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => getTask(id),
    enabled: !!id,
  });
}

/* -------------------------------------------------------------------------- */
/*                                  Mutations                                 */
/* -------------------------------------------------------------------------- */

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TaskPayload) => createTask(payload),

    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(taskKeys.all, (old = []) => [task, ...old]);

      queryClient.setQueryData(taskKeys.detail(task.id), task);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: TaskPayload }) => updateTask(id, payload),

    onSuccess: (task) => {
      queryClient.setQueryData(taskKeys.detail(task.id), task);

      queryClient.setQueryData<Task[]>(taskKeys.all, (old = []) =>
        old.map((t) => (t.id === task.id ? task : t)),
      );
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),

    onSuccess: (_, id) => {
      queryClient.removeQueries({
        queryKey: taskKeys.detail(id),
      });

      queryClient.setQueryData<Task[]>(taskKeys.all, (old = []) =>
        old.filter((task) => task.id !== id),
      );
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                                  Revisions                                 */
/* -------------------------------------------------------------------------- */

export function useTaskRevisions(taskId: string) {
  return useQuery({
    queryKey: revisionKeys.forTask(taskId),
    queryFn: () => listTaskRevisions(taskId),
    enabled: !!taskId,
  });
}

export function useMarkRevision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload?: MarkRevisionPayload }) =>
      markTaskForRevision(taskId, payload),

    onSuccess: (revision) => {
      queryClient.setQueryData<Revision[]>(revisionKeys.forTask(revision.taskId), (old = []) => [
        revision,
        ...old,
      ]);
    },
  });
}

export function useUnmarkRevision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskId: string) => unmarkTaskForRevision(taskId),

    onSuccess: (_, taskId) => {
      // Remove the latest PENDING revision from the cache
      queryClient.setQueryData<Revision[]>(revisionKeys.forTask(taskId), (old = []) => {
        const pendingIdx = old.findIndex((r) => r.status === 'PENDING');
        if (pendingIdx === -1) return old;
        return old.filter((_, i) => i !== pendingIdx);
      });
    },
  });
}
