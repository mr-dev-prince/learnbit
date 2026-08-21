'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  listArchitectures,
  getArchitecture,
  createArchitecture,
  updateArchitecture,
  deleteArchitecture,
} from '@/services/architecture.service';
import type { Architecture, ArchitecturePayload } from '@/types/Architecture';

export const architectureKeys = {
  all: ['architectures'] as const,
  detail: (id: string) => ['architectures', id] as const,
};

export function useArchitectures() {
  return useQuery({
    queryKey: architectureKeys.all,
    queryFn: listArchitectures,
  });
}

export function useArchitecture(id: string) {
  return useQuery({
    queryKey: architectureKeys.detail(id),
    queryFn: () => getArchitecture(id),
    enabled: !!id,
  });
}

export function useCreateArchitecture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ArchitecturePayload) => createArchitecture(payload),
    onSuccess: (architecture) => {
      queryClient.setQueryData<Architecture[]>(architectureKeys.all, (old = []) => [
        architecture,
        ...old,
      ]);
      queryClient.setQueryData(architectureKeys.detail(architecture.id), architecture);
    },
  });
}

export function useUpdateArchitecture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ArchitecturePayload }) =>
      updateArchitecture(id, payload),
    onSuccess: (architecture) => {
      queryClient.setQueryData(architectureKeys.detail(architecture.id), architecture);
      queryClient.setQueryData<Architecture[]>(architectureKeys.all, (old = []) =>
        old.map((item) => (item.id === architecture.id ? architecture : item)),
      );
    },
  });
}

export function useDeleteArchitecture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteArchitecture(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: architectureKeys.detail(id) });
      queryClient.setQueryData<Architecture[]>(architectureKeys.all, (old = []) =>
        old.filter((item) => item.id !== id),
      );
    },
  });
}
