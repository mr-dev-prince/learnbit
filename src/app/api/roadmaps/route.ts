import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { getAuthenticatedUser } from '@/lib/auth';
import { listRoadmaps, createRoadmap, parseRoadmapPayload } from '@/lib/roadmaps';

export const GET = () =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const roadmaps = await listRoadmaps(user.id);
    return new ApiResponse(roadmaps);
  });

export const POST = (request: NextRequest) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const body = await request.json();
    const payload = parseRoadmapPayload(body);
    const roadmap = await createRoadmap(user.id, payload);
    return new ApiResponse(roadmap, 'Roadmap created successfully', 201);
  });
