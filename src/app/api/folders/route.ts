import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { getAuthenticatedUser } from '@/lib/auth';
import { createFolder, listFolders } from '@/lib/notes';

export const GET = () =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const folders = await listFolders(user.id);
    return new ApiResponse(folders);
  });

export const POST = (request: NextRequest) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const body = await request.json();

    if (!body.name) {
      throw new Error('Folder name is required');
    }

    const folder = await createFolder(user.id, {
      name: body.name,
      parentId: body.parentId,
    });
    return new ApiResponse(folder, 'Folder created successfully', 201);
  });
