import { prisma } from '@/lib/database';

export interface CreateFolderPayload {
  name: string;
  parentId?: string | null;
}

export interface UpdateFolderPayload {
  name?: string;
  parentId?: string | null;
}

export interface CreateNotePayload {
  title: string;
  content?: string;
  folderId?: string | null;
}

export interface UpdateNotePayload {
  title?: string;
  content?: string;
  folderId?: string | null;
}

export const createFolder = async (userId: string, payload: CreateFolderPayload) => {
  return prisma.folder.create({
    data: {
      userId,
      name: payload.name,
      parentId: payload.parentId || null,
    },
  });
};

export const listFolders = async (userId: string) => {
  return prisma.folder.findMany({
    where: { userId },
    include: {
      children: true,
      notes: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const updateFolder = async (userId: string, id: string, payload: UpdateFolderPayload) => {
  return prisma.folder.update({
    where: { id, userId },
    data: {
      ...(payload.name && { name: payload.name }),
      ...(payload.parentId !== undefined && { parentId: payload.parentId }),
    },
  });
};

export const deleteFolder = async (userId: string, id: string) => {
  return prisma.folder.delete({
    where: { id, userId },
  });
};

export const createNote = async (userId: string, payload: CreateNotePayload) => {
  return prisma.note.create({
    data: {
      userId,
      title: payload.title,
      content: payload.content || null,
      folderId: payload.folderId || null,
    },
  });
};

export const listNotes = async (userId: string) => {
  return prisma.note.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  });
};

export const updateNote = async (userId: string, id: string, payload: UpdateNotePayload) => {
  return prisma.note.update({
    where: { id, userId },
    data: {
      ...(payload.title && { title: payload.title }),
      ...(payload.content !== undefined && { content: payload.content }),
      ...(payload.folderId !== undefined && { folderId: payload.folderId }),
    },
  });
};

export const deleteNote = async (userId: string, id: string) => {
  return prisma.note.delete({
    where: { id, userId },
  });
};
