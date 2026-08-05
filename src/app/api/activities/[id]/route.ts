import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { getAuthenticatedUser } from '@/lib/auth';
import { updateActivity, deleteActivity, UpdateActivityPayload } from '@/lib/day-planner';

export const PUT = (request: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const resolvedParams = await params;
    const body = await request.json();
    
    const payload: UpdateActivityPayload = {};
    if (body.title !== undefined) payload.title = body.title;
    if (body.notes !== undefined) payload.notes = body.notes;
    if (body.startTime !== undefined) payload.startTime = new Date(body.startTime);
    if (body.endTime !== undefined) payload.endTime = new Date(body.endTime);
    if (body.completed !== undefined) payload.completed = body.completed;

    const activity = await updateActivity(user.id, resolvedParams.id, payload);
    return new ApiResponse(activity, 'Activity updated successfully');
  });

export const DELETE = (request: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const resolvedParams = await params;
    
    await deleteActivity(user.id, resolvedParams.id);
    return new ApiResponse(null, 'Activity deleted successfully', 200);
  });
