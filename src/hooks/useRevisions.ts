'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listPendingRevisions,
  updateRevision,
  type PendingRevisionWithTask,
  type UpdateRevisionPayload,
} from '@/services/revision.service';
import type { Revision } from '@/types/Revision';

export const revisionQueueKey = ['revision-queue'] as const;

/* -------------------------------------------------------------------------- */
/*                                   Queries                                  */
/* -------------------------------------------------------------------------- */

/** Fetches all PENDING revisions for the current user, with task data. */
export function useRevisionQueue() {
  return useQuery({
    queryKey: revisionQueueKey,
    queryFn: listPendingRevisions,
  });
}

/* -------------------------------------------------------------------------- */
/*                                  Mutations                                 */
/* -------------------------------------------------------------------------- */

/**
 * Patches a revision (complete, skip, update notes/interval).
 * On success, removes COMPLETED/SKIPPED items from the queue cache.
 */
export function useUpdateRevision() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRevisionPayload }) =>
      updateRevision(id, payload),

    onSuccess: (updated: Revision) => {
      if (updated.status === 'COMPLETED' || updated.status === 'SKIPPED') {
        // Remove the entry from the queue view
        queryClient.setQueryData<PendingRevisionWithTask[]>(revisionQueueKey, (old = []) =>
          old.filter((r) => r.id !== updated.id),
        );
      } else {
        // Update in place (e.g. notes / interval edit)
        queryClient.setQueryData<PendingRevisionWithTask[]>(revisionQueueKey, (old = []) =>
          old.map((r) =>
            r.id === updated.id ? { ...r, ...updated } : r,
          ),
        );
      }
    },
  });
}
