import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  children?: Folder[];
  notes?: Note[];
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string | null;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

export const useNotesAndFolders = () => {
  const queryClient = useQueryClient();

  const foldersQuery = useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      return (await api.get<Folder[]>('/api/folders')) || [];
    },
  });

  const notesQuery = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      return (await api.get<Note[]>('/api/notes')) || [];
    },
  });

  const createFolder = useMutation({
    mutationFn: async (data: { name: string; parentId?: string | null }) => {
      return await api.post<Folder>('/api/folders', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const updateFolder = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      name?: string;
      parentId?: string | null;
    }) => {
      return await api.put<Folder>(`/api/folders/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const deleteFolder = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/folders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const createNote = useMutation({
    mutationFn: async (data: { title: string; content?: string; folderId?: string | null }) => {
      return await api.post<Note>('/api/notes', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const updateNote = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: {
      id: string;
      title?: string;
      content?: string;
      folderId?: string | null;
    }) => {
      return await api.put<Note>(`/api/notes/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  const deleteNote = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['folders'] });
    },
  });

  return {
    folders: foldersQuery.data || [],
    notes: notesQuery.data || [],
    isLoading: foldersQuery.isLoading || notesQuery.isLoading,
    createFolder,
    updateFolder,
    deleteFolder,
    createNote,
    updateNote,
    deleteNote,
  };
};
