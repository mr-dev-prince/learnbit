import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { getAuthenticatedUser } from '@/lib/auth';
import { createNote, listNotes } from '@/lib/notes';

export const GET = () =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const notes = await listNotes(user.id);
    return new ApiResponse(notes);
  });

export const POST = (request: NextRequest) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const body = await request.json();

    if (!body.title) {
      throw new Error('Note title is required');
    }

    const note = await createNote(user.id, {
      title: body.title,
      content: body.content,
      folderId: body.folderId,
    });
    return new ApiResponse(note, 'Note created successfully', 201);
  });
