import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { getAuthenticatedUser } from '@/lib/auth';
import { updateFolder, deleteFolder } from '@/lib/notes';

export const PUT = (request: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const body = await request.json();
    const { id } = await params;

    const folder = await updateFolder(user.id, id, {
      name: body.name,
      parentId: body.parentId,
    });
    return new ApiResponse(folder, 'Folder updated successfully');
  });

export const DELETE = (request: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const { id } = await params;
    await deleteFolder(user.id, id);
    return new ApiResponse(null, 'Folder deleted successfully');
  });
