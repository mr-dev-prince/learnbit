import 'server-only';

import { prisma } from '@/lib/database';
import type {
  Architecture,
  ArchitecturePayload,
  ArchitectureStatus,
} from '@/types/Architecture';

const VALID_STATUSES: ArchitectureStatus[] = [
  'PLANNED',
  'IN_PROGRESS',
  'BUILT',
  'LEARNING',
];

const normalizeText = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const normalizeTags = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapArchitecture = (item: any): Architecture => ({
  id: item.id,
  userId: item.userId,
  title: item.title,
  description: item.description,
  category: item.category,
  status: item.status as ArchitectureStatus,
  diagram: item.diagram,
  content: item.content,
  tags: item.tags || [],
  createdAt: item.createdAt.toISOString(),
  updatedAt: item.updatedAt.toISOString(),
});

export const parseArchitecturePayload = (payload: unknown): Required<ArchitecturePayload> => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Request body must be a JSON object.');
  }

  const rawPayload = payload as Record<string, unknown>;
  const title = normalizeText(rawPayload.title);

  if (!title) {
    throw new Error('`title` is required.');
  }

  let status: ArchitectureStatus = 'IN_PROGRESS';
  if (
    typeof rawPayload.status === 'string' &&
    VALID_STATUSES.includes(rawPayload.status as ArchitectureStatus)
  ) {
    status = rawPayload.status as ArchitectureStatus;
  }

  return {
    title,
    description: normalizeText(rawPayload.description),
    category: normalizeText(rawPayload.category) || 'System Architecture',
    status,
    diagram: typeof rawPayload.diagram === 'string' ? rawPayload.diagram : null,
    content: typeof rawPayload.content === 'string' ? rawPayload.content : null,
    tags: normalizeTags(rawPayload.tags),
  };
};

export const listArchitectures = async (userId: string) => {
  const items = await prisma.architecture.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
  return items.map(mapArchitecture);
};

export const getArchitectureById = async (userId: string, id: string) => {
  const item = await prisma.architecture.findFirst({
    where: { id, userId },
  });
  return item ? mapArchitecture(item) : null;
};

export const createArchitecture = async (
  userId: string,
  payload: Required<ArchitecturePayload>,
) => {
  const item = await prisma.architecture.create({
    data: {
      userId,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      status: payload.status,
      diagram: payload.diagram,
      content: payload.content,
      tags: payload.tags,
    },
  });
  return mapArchitecture(item);
};

export const updateArchitecture = async (
  userId: string,
  id: string,
  payload: Required<ArchitecturePayload>,
) => {
  const existing = await prisma.architecture.findFirst({ where: { id, userId } });
  if (!existing) return null;

  const item = await prisma.architecture.update({
    where: { id },
    data: {
      title: payload.title,
      description: payload.description,
      category: payload.category,
      status: payload.status,
      diagram: payload.diagram,
      content: payload.content,
      tags: payload.tags,
    },
  });
  return mapArchitecture(item);
};

export const deleteArchitecture = async (userId: string, id: string) => {
  const result = await prisma.architecture.deleteMany({
    where: { id, userId },
  });
  return result.count > 0;
};
