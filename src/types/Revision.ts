export type RevisionStatus = 'PENDING' | 'COMPLETED' | 'SKIPPED';

export interface Revision {
  id: string;
  taskId: string;
  userId: string;
  revisionNumber: number;
  scheduledAt: string;
  completedAt: string | null;
  intervalDays: number;
  notes: string | null;
  status: RevisionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MarkRevisionPayload {
  /** Optional: when to schedule the revision. Defaults to now + intervalDays. */
  scheduledAt?: string | null;
  /** Spaced-repetition interval in days. Defaults to 1. */
  intervalDays?: number;
  /** Optional notes to attach to the revision entry. */
  notes?: string | null;
}
