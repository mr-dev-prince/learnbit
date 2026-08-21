import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { getAuthenticatedUser } from '@/lib/auth';
import {
  getArchitectureById,
  updateArchitecture,
  deleteArchitecture,
  parseArchitecturePayload,
} from '@/lib/architectures';

export const GET = async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  apiHandler(async () => {
    const resolvedParams = await params;
    const user = await getAuthenticatedUser();
    const architecture = await getArchitectureById(user.id, resolvedParams.id);
    if (!architecture) return new ApiResponse(null, 'Architecture not found', 404);
    return new ApiResponse(architecture);
  });

export const PUT = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  apiHandler(async () => {
    const resolvedParams = await params;
    const user = await getAuthenticatedUser();
    const body = await request.json();
    const payload = parseArchitecturePayload(body);
    const architecture = await updateArchitecture(user.id, resolvedParams.id, payload);
    if (!architecture) return new ApiResponse(null, 'Architecture not found', 404);
    return new ApiResponse(architecture, 'Architecture updated successfully');
  });

export const DELETE = async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  apiHandler(async () => {
    const resolvedParams = await params;
    const user = await getAuthenticatedUser();
    const success = await deleteArchitecture(user.id, resolvedParams.id);
    if (!success) return new ApiResponse(null, 'Architecture not found', 404);
    return new ApiResponse(null, 'Architecture deleted successfully');
  });
