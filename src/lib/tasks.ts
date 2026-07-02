import 'server-only';

import { randomUUID } from 'node:crypto';
import { getDatabasePool } from '@/lib/database';
import type { Task, TaskPayload, TaskStatus } from '@/types/Task';

interface TaskRow {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  notes: string | null;
  resource_links: string[] | null;
  scheduled_for: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

const VALID_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'completed', 'archived'];

let setupPromise: Promise<void> | null = null;

const normalizeText = (value: unknown) => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const normalizeResourceLinks = (value: unknown) => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
};

const normalizeScheduledFor = (value: unknown) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('`scheduledFor` must be a valid date string.');
  }

  return parsed.toISOString();
};

const normalizeStatus = (value: unknown, fallback: TaskStatus = 'pending') => {
  if (typeof value !== 'string') {
    return fallback;
  }

  if (!VALID_STATUSES.includes(value as TaskStatus)) {
    throw new Error('`status` must be one of pending, in_progress, completed, archived.');
  }

  return value as TaskStatus;
};

const mapTaskRow = (row: TaskRow): Task => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  description: row.description,
  notes: row.notes,
  resourceLinks: row.resource_links ?? [],
  scheduledFor: row.scheduled_for,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const ensureTasksTable = async () => {
  if (!setupPromise) {
    setupPromise = (async () => {
      const databasePool = getDatabasePool();

      await databasePool.query(`
        create table if not exists public.tasks (
          id uuid primary key,
          user_id uuid not null references auth.users(id) on delete cascade,
          title text not null,
          description text,
          notes text,
          resource_links text[] not null default '{}',
          scheduled_for timestamptz,
          status text not null default 'pending'
            check (status in ('pending', 'in_progress', 'completed', 'archived')),
          created_at timestamptz not null default timezone('utc', now()),
          updated_at timestamptz not null default timezone('utc', now())
        )
      `);

      await databasePool.query(`
        create index if not exists idx_tasks_user_id on public.tasks (user_id)
      `);

      await databasePool.query(`
        create index if not exists idx_tasks_scheduled_for on public.tasks (scheduled_for)
      `);
    })();
  }

  await setupPromise;
};

export const parseTaskPayload = (payload: unknown): Required<TaskPayload> => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Request body must be a JSON object.');
  }

  const rawPayload = payload as Record<string, unknown>;
  const title = normalizeText(rawPayload.title);

  if (!title) {
    throw new Error('`title` is required.');
  }

  return {
    title,
    description: normalizeText(rawPayload.description),
    notes: normalizeText(rawPayload.notes),
    resourceLinks: normalizeResourceLinks(rawPayload.resourceLinks),
    scheduledFor: normalizeScheduledFor(rawPayload.scheduledFor),
    status: normalizeStatus(rawPayload.status),
  };
};

export const createTask = async (userId: string, payload: Required<TaskPayload>) => {
  await ensureTasksTable();

  const databasePool = getDatabasePool();
  const taskId = randomUUID();
  const result = await databasePool.query<TaskRow>(
    `
      insert into public.tasks (
        id,
        user_id,
        title,
        description,
        notes,
        resource_links,
        scheduled_for,
        status
      )
      values ($1, $2, $3, $4, $5, $6, $7, $8)
      returning *
    `,
    [
      taskId,
      userId,
      payload.title,
      payload.description,
      payload.notes,
      payload.resourceLinks,
      payload.scheduledFor,
      payload.status,
    ],
  );

  return mapTaskRow(result.rows[0]);
};

export const listTasks = async (userId: string) => {
  await ensureTasksTable();

  const databasePool = getDatabasePool();
  const result = await databasePool.query<TaskRow>(
    `
      select *
      from public.tasks
      where user_id = $1
      order by scheduled_for asc nulls last, created_at desc
    `,
    [userId],
  );

  return result.rows.map(mapTaskRow);
};

export const getTaskById = async (userId: string, taskId: string) => {
  await ensureTasksTable();

  const databasePool = getDatabasePool();
  const result = await databasePool.query<TaskRow>(
    `
      select *
      from public.tasks
      where id = $1 and user_id = $2
      limit 1
    `,
    [taskId, userId],
  );

  return result.rows[0] ? mapTaskRow(result.rows[0]) : null;
};

export const updateTask = async (userId: string, taskId: string, payload: Required<TaskPayload>) => {
  await ensureTasksTable();

  const databasePool = getDatabasePool();
  const result = await databasePool.query<TaskRow>(
    `
      update public.tasks
      set
        title = $3,
        description = $4,
        notes = $5,
        resource_links = $6,
        scheduled_for = $7,
        status = $8,
        updated_at = timezone('utc', now())
      where id = $1 and user_id = $2
      returning *
    `,
    [
      taskId,
      userId,
      payload.title,
      payload.description,
      payload.notes,
      payload.resourceLinks,
      payload.scheduledFor,
      payload.status,
    ],
  );

  return result.rows[0] ? mapTaskRow(result.rows[0]) : null;
};

export const deleteTask = async (userId: string, taskId: string) => {
  await ensureTasksTable();

  const databasePool = getDatabasePool();
  const result = await databasePool.query<{ id: string }>(
    `
      delete from public.tasks
      where id = $1 and user_id = $2
      returning id
    `,
    [taskId, userId],
  );

  return Boolean(result.rows[0]);
};
