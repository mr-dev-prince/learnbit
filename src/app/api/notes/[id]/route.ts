import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { getAuthenticatedUser } from '@/lib/auth';
import { updateNote, deleteNote } from '@/lib/notes';

export const PUT = (request: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const body = await request.json();
    const { id } = await params;

    const note = await updateNote(user.id, id, {
      title: body.title,
      content: body.content,
      folderId: body.folderId,
    });
    return new ApiResponse(note, 'Note updated successfully');
  });

export const DELETE = (request: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const { id } = await params;
    await deleteNote(user.id, id);
    return new ApiResponse(null, 'Note deleted successfully');
  });
