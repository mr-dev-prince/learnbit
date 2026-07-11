import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { getAuthenticatedUser } from '@/lib/auth';
import { getRoadmapById, updateRoadmap, deleteRoadmap, parseRoadmapPayload } from '@/lib/roadmaps';

export const GET = async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  apiHandler(async () => {
    const resolvedParams = await params;
    const user = await getAuthenticatedUser();
    const roadmap = await getRoadmapById(user.id, resolvedParams.id);
    if (!roadmap) return new ApiResponse(null, 'Roadmap not found', 404);
    return new ApiResponse(roadmap);
  });

export const PUT = async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  apiHandler(async () => {
    const resolvedParams = await params;
    const user = await getAuthenticatedUser();
    const body = await request.json();
    const payload = parseRoadmapPayload(body);
    const roadmap = await updateRoadmap(user.id, resolvedParams.id, payload);
    if (!roadmap) return new ApiResponse(null, 'Roadmap not found', 404);
    return new ApiResponse(roadmap, 'Roadmap updated successfully');
  });

export const DELETE = async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  apiHandler(async () => {
    const resolvedParams = await params;
    const user = await getAuthenticatedUser();
    const success = await deleteRoadmap(user.id, resolvedParams.id);
    if (!success) return new ApiResponse(null, 'Roadmap not found', 404);
    return new ApiResponse(null, 'Roadmap deleted successfully');
  });
