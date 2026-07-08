import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { getAuthenticatedUser } from '@/lib/auth';
import { listModules, createModule, parseModulePayload } from '@/lib/roadmaps';

export const GET = async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  apiHandler(async () => {
    const resolvedParams = await params;
    const user = await getAuthenticatedUser();
    const modules = await listModules(user.id, resolvedParams.id);
    return new ApiResponse(modules);
  });

export const POST = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  apiHandler(async () => {
    const resolvedParams = await params;
    const user = await getAuthenticatedUser();
    const body = await request.json();
    const payload = parseModulePayload(body);
    const newModule = await createModule(user.id, resolvedParams.id, payload);
    return new ApiResponse(newModule, 'Module created successfully', 201);
  });
