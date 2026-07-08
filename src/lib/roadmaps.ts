import 'server-only';

import { prisma } from '@/lib/database';
import type { Roadmap, RoadmapModule, RoadmapPayload, ModulePayload, RoadmapStatus, ModuleStatus } from '@/types/Roadmap';

const VALID_ROADMAP_STATUSES: RoadmapStatus[] = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED'];
const VALID_MODULE_STATUSES: ModuleStatus[] = ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'SKIPPED'];

const normalizeText = (value: unknown) => {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const normalizeResources = (value: unknown) => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);
};

const mapRoadmapModule = (module: any): RoadmapModule => ({
  id: module.id,
  roadmapId: module.roadmapId,
  title: module.title,
  description: module.description,
  status: module.status as ModuleStatus,
  order: module.order,
  createdAt: module.createdAt.toISOString(),
  updatedAt: module.updatedAt.toISOString(),
});

const mapRoadmap = (roadmap: any): Roadmap => ({
  id: roadmap.id,
  userId: roadmap.userId,
  title: roadmap.title,
  description: roadmap.description,
  estimatedTime: roadmap.estimatedTime,
  resources: roadmap.resources,
  status: roadmap.status as RoadmapStatus,
  createdAt: roadmap.createdAt.toISOString(),
  updatedAt: roadmap.updatedAt.toISOString(),
  modules: roadmap.modules ? roadmap.modules.map(mapRoadmapModule) : undefined,
});

export const parseRoadmapPayload = (payload: unknown): Required<RoadmapPayload> => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Request body must be a JSON object.');
  }

  const rawPayload = payload as Record<string, unknown>;
  const title = normalizeText(rawPayload.title);

  if (!title) {
    throw new Error('`title` is required.');
  }

  let status: RoadmapStatus = 'IN_PROGRESS';
  if (typeof rawPayload.status === 'string' && VALID_ROADMAP_STATUSES.includes(rawPayload.status as RoadmapStatus)) {
    status = rawPayload.status as RoadmapStatus;
  }

  return {
    title,
    description: normalizeText(rawPayload.description),
    estimatedTime: normalizeText(rawPayload.estimatedTime),
    resources: normalizeResources(rawPayload.resources),
    status,
  };
};

export const parseModulePayload = (payload: unknown): Required<ModulePayload> => {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Request body must be a JSON object.');
  }

  const rawPayload = payload as Record<string, unknown>;
  const title = normalizeText(rawPayload.title);

  if (!title) {
    throw new Error('`title` is required.');
  }

  let status: ModuleStatus = 'PLANNED';
  if (typeof rawPayload.status === 'string' && VALID_MODULE_STATUSES.includes(rawPayload.status as ModuleStatus)) {
    status = rawPayload.status as ModuleStatus;
  }

  return {
    title,
    description: normalizeText(rawPayload.description),
    status,
    order: typeof rawPayload.order === 'number' ? rawPayload.order : 0,
  };
};

export const listRoadmaps = async (userId: string) => {
  const roadmaps = await prisma.roadmap.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      modules: {
        orderBy: { order: 'asc' },
      },
    },
  });
  return roadmaps.map(mapRoadmap);
};

export const getRoadmapById = async (userId: string, roadmapId: string) => {
  const roadmap = await prisma.roadmap.findFirst({
    where: { id: roadmapId, userId },
    include: {
      modules: {
        orderBy: { order: 'asc' },
      },
    },
  });
  return roadmap ? mapRoadmap(roadmap) : null;
};

export const createRoadmap = async (userId: string, payload: Required<RoadmapPayload>) => {
  const roadmap = await prisma.roadmap.create({
    data: {
      userId,
      title: payload.title,
      description: payload.description,
      estimatedTime: payload.estimatedTime,
      resources: payload.resources,
      status: payload.status,
    },
    include: {
      modules: true,
    },
  });
  return mapRoadmap(roadmap);
};

export const updateRoadmap = async (userId: string, roadmapId: string, payload: Required<RoadmapPayload>) => {
  const existing = await prisma.roadmap.findFirst({ where: { id: roadmapId, userId } });
  if (!existing) return null;

  const roadmap = await prisma.roadmap.update({
    where: { id: roadmapId },
    data: {
      title: payload.title,
      description: payload.description,
      estimatedTime: payload.estimatedTime,
      resources: payload.resources,
      status: payload.status,
    },
    include: {
      modules: {
        orderBy: { order: 'asc' },
      },
    },
  });
  return mapRoadmap(roadmap);
};

export const deleteRoadmap = async (userId: string, roadmapId: string) => {
  const result = await prisma.roadmap.deleteMany({
    where: { id: roadmapId, userId },
  });
  return result.count > 0;
};

export const listModules = async (userId: string, roadmapId: string) => {
  // First ensure the roadmap belongs to the user
  const roadmap = await prisma.roadmap.findFirst({ where: { id: roadmapId, userId } });
  if (!roadmap) throw new Error("Roadmap not found");

  const modules = await prisma.roadmapModule.findMany({
    where: { roadmapId },
    orderBy: { order: 'asc' },
  });
  return modules.map(mapRoadmapModule);
};

export const createModule = async (userId: string, roadmapId: string, payload: Required<ModulePayload>) => {
  const roadmap = await prisma.roadmap.findFirst({ where: { id: roadmapId, userId } });
  if (!roadmap) throw new Error("Roadmap not found");

  // Get current max order
  const maxOrderModule = await prisma.roadmapModule.findFirst({
    where: { roadmapId },
    orderBy: { order: 'desc' },
  });
  const order = payload.order > 0 ? payload.order : (maxOrderModule?.order ?? -1) + 1;

  const newModule = await prisma.roadmapModule.create({
    data: {
      roadmapId,
      title: payload.title,
      description: payload.description,
      status: payload.status,
      order,
    },
  });
  return mapRoadmapModule(newModule);
};

export const updateModule = async (userId: string, roadmapId: string, moduleId: string, payload: Required<ModulePayload>) => {
  const roadmap = await prisma.roadmap.findFirst({ where: { id: roadmapId, userId } });
  if (!roadmap) throw new Error("Roadmap not found");

  const existingModule = await prisma.roadmapModule.findFirst({ where: { id: moduleId, roadmapId } });
  if (!existingModule) return null;

  const updatedModule = await prisma.roadmapModule.update({
    where: { id: moduleId },
    data: {
      title: payload.title,
      description: payload.description,
      status: payload.status,
      order: payload.order,
    },
  });
  return mapRoadmapModule(updatedModule);
};

export const deleteModule = async (userId: string, roadmapId: string, moduleId: string) => {
  const roadmap = await prisma.roadmap.findFirst({ where: { id: roadmapId, userId } });
  if (!roadmap) return false;

  const result = await prisma.roadmapModule.deleteMany({
    where: { id: moduleId, roadmapId },
  });
  return result.count > 0;
};
