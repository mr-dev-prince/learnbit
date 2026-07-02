import 'server-only';

import { prisma } from '@/lib/database';
import { TaskStatus as PrismaTaskStatus } from '@prisma/client';

import type { Task, TaskPayload, TaskStatus } from '@/types/Task';

const VALID_STATUSES: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'];

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

const normalizeDueDate = (value: unknown) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return null;
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error('`dueDate` must be a valid date string.');
  }

  return parsed.toISOString();
};

const normalizeStatus = (value: unknown, fallback: TaskStatus = 'TODO') => {
  if (typeof value !== 'string') {
    return fallback;
  }

  if (!VALID_STATUSES.includes(value as TaskStatus)) {
    throw new Error('`status` must be one of TODO, IN_PROGRESS, COMPLETED, ARCHIVED.');
  }

  return value as TaskStatus;
};

const mapTaskRecord = (task: {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  notes: string | null;
  dueDate: Date | null;
  status: PrismaTaskStatus;
  createdAt: Date;
  updatedAt: Date;
  resources: {
    url: string;
    title: string | null;
  }[];
}): Task => ({
  id: task.id,
  userId: task.userId,
  title: task.title,
  description: task.description,
  notes: task.notes,
  resourceLinks: task.resources.map((resource) => resource.url),
  dueDate: task.dueDate?.toISOString() ?? null,
  status: task.status,
  createdAt: task.createdAt.toISOString(),
  updatedAt: task.updatedAt.toISOString(),
});

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
    dueDate: normalizeDueDate(rawPayload.dueDate),
    status: normalizeStatus(rawPayload.status),
  };
};

export const createTask = async (userId: string, payload: Required<TaskPayload>) => {
  const task = await prisma.task.create({
    data: {
      userId,
      title: payload.title,
      description: payload.description,
      notes: payload.notes,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
      status: payload.status,

      resources: {
        create: payload.resourceLinks.map((url) => ({
          url,
        })),
      },
    },

    include: {
      resources: true,
    },
  });

  return mapTaskRecord(task);
};

export const listTasks = async (userId: string) => {
  const tasks = await prisma.task.findMany({
    where: {
      userId,
    },

    include: {
      resources: true,
    },

    orderBy: [
      {
        dueDate: 'asc',
      },
      {
        createdAt: 'desc',
      },
    ],
  });

  return tasks.map(mapTaskRecord);
};

export const getTaskById = async (userId: string, taskId: string) => {
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },

    include: {
      resources: true,
    },
  });

  return task ? mapTaskRecord(task) : null;
};

export const updateTask = async (
  userId: string,
  taskId: string,
  payload: Required<TaskPayload>,
) => {
  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId,
    },
  });

  if (!existingTask) {
    return null;
  }

  const task = await prisma.task.update({
    where: {
      id: taskId,
    },

    data: {
      title: payload.title,
      description: payload.description,
      notes: payload.notes,
      dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
      status: payload.status,

      resources: {
        deleteMany: {},

        create: payload.resourceLinks.map((url) => ({
          url,
        })),
      },
    },

    include: {
      resources: true,
    },
  });

  return mapTaskRecord(task);
};

export const deleteTask = async (userId: string, taskId: string) => {
  const result = await prisma.task.deleteMany({
    where: {
      id: taskId,
      userId,
    },
  });

  return result.count > 0;
};
