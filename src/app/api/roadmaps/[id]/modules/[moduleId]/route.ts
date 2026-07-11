import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { getAuthenticatedUser } from '@/lib/auth';
import { updateModule, deleteModule, parseModulePayload } from '@/lib/roadmaps';

export const PUT = async (
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> },
) =>
  apiHandler(async () => {
    const resolvedParams = await params;
    const user = await getAuthenticatedUser();
    const body = await request.json();
    const payload = parseModulePayload(body);
    const updatedModule = await updateModule(
      user.id,
      resolvedParams.id,
      resolvedParams.moduleId,
      payload,
    );
    if (!updatedModule) return new ApiResponse(null, 'Module not found', 404);
    return new ApiResponse(updatedModule, 'Module updated successfully');
  });

export const DELETE = async (
  _: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> },
) =>
  apiHandler(async () => {
    const resolvedParams = await params;
    const user = await getAuthenticatedUser();
    const success = await deleteModule(user.id, resolvedParams.id, resolvedParams.moduleId);
    if (!success) return new ApiResponse(null, 'Module not found', 404);
    return new ApiResponse(null, 'Module deleted successfully');
  });
