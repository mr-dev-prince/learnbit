'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listRoadmaps,
  getRoadmap,
  createRoadmap,
  updateRoadmap,
  deleteRoadmap,
  listModules,
  createModule,
  updateModule,
  deleteModule,
} from '@/services/roadmap.service';
import type { Roadmap, RoadmapModule, RoadmapPayload, ModulePayload } from '@/types/Roadmap';

export const roadmapKeys = {
  all: ['roadmaps'] as const,
  detail: (id: string) => ['roadmaps', id] as const,
  modules: (roadmapId: string) => ['roadmaps', roadmapId, 'modules'] as const,
};

/* -------------------------------------------------------------------------- */
/*                                  Roadmaps                                  */
/* -------------------------------------------------------------------------- */

export function useRoadmaps() {
  return useQuery({
    queryKey: roadmapKeys.all,
    queryFn: listRoadmaps,
  });
}

export function useRoadmap(id: string) {
  return useQuery({
    queryKey: roadmapKeys.detail(id),
    queryFn: () => getRoadmap(id),
    enabled: !!id,
  });
}

export function useCreateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RoadmapPayload) => createRoadmap(payload),
    onSuccess: (roadmap) => {
      queryClient.setQueryData<Roadmap[]>(roadmapKeys.all, (old = []) => [roadmap, ...old]);
      queryClient.setQueryData(roadmapKeys.detail(roadmap.id), roadmap);
    },
  });
}

export function useUpdateRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RoadmapPayload }) => updateRoadmap(id, payload),
    onSuccess: (roadmap) => {
      queryClient.setQueryData(roadmapKeys.detail(roadmap.id), roadmap);
      queryClient.setQueryData<Roadmap[]>(roadmapKeys.all, (old = []) =>
        old.map((r) => (r.id === roadmap.id ? roadmap : r)),
      );
    },
  });
}

export function useDeleteRoadmap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRoadmap(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: roadmapKeys.detail(id) });
      queryClient.setQueryData<Roadmap[]>(roadmapKeys.all, (old = []) =>
        old.filter((r) => r.id !== id),
      );
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                                  Modules                                   */
/* -------------------------------------------------------------------------- */

export function useRoadmapModules(roadmapId: string) {
  return useQuery({
    queryKey: roadmapKeys.modules(roadmapId),
    queryFn: () => listModules(roadmapId),
    enabled: !!roadmapId,
  });
}

export function useCreateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roadmapId, payload }: { roadmapId: string; payload: ModulePayload }) => createModule(roadmapId, payload),
    onSuccess: (module, { roadmapId }) => {
      queryClient.setQueryData<RoadmapModule[]>(roadmapKeys.modules(roadmapId), (old = []) => [...old, module]);
      
      // Update roadmap detail to include module (if we store them together)
      queryClient.setQueryData<Roadmap | undefined>(roadmapKeys.detail(roadmapId), (old) => {
        if (!old) return old;
        return { ...old, modules: [...(old.modules || []), module] };
      });
    },
  });
}

export function useUpdateModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roadmapId, moduleId, payload }: { roadmapId: string; moduleId: string; payload: ModulePayload }) => updateModule(roadmapId, moduleId, payload),
    onSuccess: (module, { roadmapId }) => {
      queryClient.setQueryData<RoadmapModule[]>(roadmapKeys.modules(roadmapId), (old = []) =>
        old.map((m) => (m.id === module.id ? module : m)),
      );

      // Update roadmap detail
      queryClient.setQueryData<Roadmap | undefined>(roadmapKeys.detail(roadmapId), (old) => {
        if (!old) return old;
        return {
          ...old,
          modules: (old.modules || []).map((m) => (m.id === module.id ? module : m)),
        };
      });
    },
  });
}

export function useDeleteModule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roadmapId, moduleId }: { roadmapId: string; moduleId: string }) => deleteModule(roadmapId, moduleId),
    onSuccess: (_, { roadmapId, moduleId }) => {
      queryClient.setQueryData<RoadmapModule[]>(roadmapKeys.modules(roadmapId), (old = []) =>
        old.filter((m) => m.id !== moduleId),
      );

      // Update roadmap detail
      queryClient.setQueryData<Roadmap | undefined>(roadmapKeys.detail(roadmapId), (old) => {
        if (!old) return old;
        return {
          ...old,
          modules: (old.modules || []).filter((m) => m.id !== moduleId),
        };
      });
    },
  });
}
