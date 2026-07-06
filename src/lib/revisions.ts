import 'server-only';

import { prisma } from '@/lib/database';
import { RevisionStatus as PrismaRevisionStatus } from '@prisma/client';

import type { MarkRevisionPayload, Revision, RevisionStatus } from '@/types/Revision';

const mapRevisionRecord = (revision: {
  id: string;
  taskId: string;
  userId: string;
  revisionNumber: number;
  scheduledAt: Date;
  completedAt: Date | null;
  intervalDays: number;
  notes: string | null;
  status: PrismaRevisionStatus;
  createdAt: Date;
  updatedAt: Date;
}): Revision => ({
  id: revision.id,
  taskId: revision.taskId,
  userId: revision.userId,
  revisionNumber: revision.revisionNumber,
  scheduledAt: revision.scheduledAt.toISOString(),
  completedAt: revision.completedAt?.toISOString() ?? null,
  intervalDays: revision.intervalDays,
  notes: revision.notes,
  status: revision.status as RevisionStatus,
  createdAt: revision.createdAt.toISOString(),
  updatedAt: revision.updatedAt.toISOString(),
});

const normalizeIntervalDays = (value: unknown, fallback = 1): number => {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 1) {
    return fallback;
  }
  return value;
};

const normalizeScheduledAt = (value: unknown, intervalDays: number): Date => {
  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  const date = new Date();
  date.setDate(date.getDate() + intervalDays);
  return date;
};

export const parseMarkRevisionPayload = (payload: unknown): Required<MarkRevisionPayload> => {
  const raw = (payload && typeof payload === 'object' ? payload : {}) as Record<string, unknown>;

  const intervalDays = normalizeIntervalDays(raw.intervalDays);
  const scheduledAt = normalizeScheduledAt(raw.scheduledAt, intervalDays).toISOString();
  const notes =
    typeof raw.notes === 'string' && raw.notes.trim().length > 0 ? raw.notes.trim() : null;

  return { scheduledAt, intervalDays, notes };
};

export const markTaskForRevision = async (
  userId: string,
  taskId: string,
  payload: Required<MarkRevisionPayload>,
): Promise<Revision | null> => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
  });

  if (!task) return null;

  const lastRevision = await prisma.revision.findFirst({
    where: { taskId, userId },
    orderBy: { revisionNumber: 'desc' },
    select: { revisionNumber: true },
  });

  const revisionNumber = (lastRevision?.revisionNumber ?? -1) + 1;

  const revision = await prisma.revision.create({
    data: {
      taskId,
      userId,
      revisionNumber,
      scheduledAt: new Date(payload.scheduledAt ?? new Date()),
      intervalDays: payload.intervalDays,
      notes: payload.notes,
      status: 'PENDING',
    },
  });

  return mapRevisionRecord(revision);
};

export const unmarkTaskForRevision = async (userId: string, taskId: string): Promise<boolean> => {
  const pending = await prisma.revision.findFirst({
    where: { taskId, userId, status: 'PENDING' },
    orderBy: { revisionNumber: 'desc' },
    select: { id: true },
  });

  if (!pending) return false;

  await prisma.revision.delete({ where: { id: pending.id } });

  return true;
};

export const listTaskRevisions = async (userId: string, taskId: string): Promise<Revision[]> => {
  const task = await prisma.task.findFirst({
    where: { id: taskId, userId },
    select: { id: true },
  });

  if (!task) return [];

  const revisions = await prisma.revision.findMany({
    where: { taskId, userId },
    orderBy: { revisionNumber: 'desc' },
  });

  return revisions.map(mapRevisionRecord);
};

export interface PendingRevisionWithTask extends Revision {
  task: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    notes: string | null;
  };
}

export const listPendingRevisions = async (userId: string): Promise<PendingRevisionWithTask[]> => {
  const rows = await prisma.revision.findMany({
    where: { userId, status: 'PENDING' },
    orderBy: { scheduledAt: 'asc' },
    include: {
      task: {
        select: {
          id: true,
          title: true,
          description: true,
          status: true,
          notes: true,
          resources: { select: { url: true } },
        },
      },
    },
  });

  return rows.map((row) => ({
    ...mapRevisionRecord(row),
    task: {
      id: row.task.id,
      title: row.task.title,
      description: row.task.description,
      status: row.task.status,
      notes: row.task.notes,
    },
  }));
};

export interface UpdateRevisionPayload {
  status?: RevisionStatus;
  notes?: string | null;
  intervalDays?: number;
  scheduledAt?: string | null;
}

export const updateRevision = async (
  userId: string,
  revisionId: string,
  payload: UpdateRevisionPayload,
): Promise<Revision | null> => {
  const existing = await prisma.revision.findFirst({
    where: { id: revisionId, userId },
  });

  if (!existing) return null;

  const completedAt =
    payload.status === 'COMPLETED'
      ? new Date()
      : payload.status === 'PENDING'
        ? null
        : existing.completedAt;

  const updated = await prisma.revision.update({
    where: { id: revisionId },
    data: {
      ...(payload.status !== undefined && { status: payload.status }),
      ...(payload.notes !== undefined && { notes: payload.notes }),
      ...(payload.intervalDays !== undefined && { intervalDays: payload.intervalDays }),
      ...(payload.scheduledAt !== undefined && {
        scheduledAt: payload.scheduledAt ? new Date(payload.scheduledAt) : existing.scheduledAt,
      }),
      completedAt,
    },
  });

  return mapRevisionRecord(updated);
};
