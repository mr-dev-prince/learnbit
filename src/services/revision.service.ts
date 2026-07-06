import { api } from './api';

import type { MarkRevisionPayload, Revision, RevisionStatus } from '@/types/Revision';

export interface PendingRevisionWithTask extends Revision {
  task: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    notes: string | null;
  };
}

export interface UpdateRevisionPayload {
  status?: RevisionStatus;
  notes?: string | null;
  intervalDays?: number;
  scheduledAt?: string | null;
}

/* -------------------------------------------------------------------------- */
/*                           Task-scoped revisions                            */
/* -------------------------------------------------------------------------- */

export function listTaskRevisions(taskId: string) {
  return api.get<Revision[]>(`/api/tasks/${taskId}/revisions`);
}

export function markTaskForRevision(taskId: string, payload: MarkRevisionPayload = {}) {
  return api.post<Revision>(`/api/tasks/${taskId}/revisions`, payload);
}

export function unmarkTaskForRevision(taskId: string) {
  return api.delete(`/api/tasks/${taskId}/revisions`);
}

/* -------------------------------------------------------------------------- */
/*                         User-level revision queue                          */
/* -------------------------------------------------------------------------- */

export function listPendingRevisions() {
  return api.get<PendingRevisionWithTask[]>('/api/revisions');
}

export function updateRevision(revisionId: string, payload: UpdateRevisionPayload) {
  return api.patch<Revision>(`/api/revisions/${revisionId}`, payload);
}
