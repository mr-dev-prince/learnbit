import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { getAuthenticatedUser } from '@/lib/auth';
import { updateDayPlanner } from '@/lib/day-planner';

export const PUT = (request: NextRequest, { params }: { params: Promise<{ id: string }> }) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const resolvedParams = await params;
    const body = await request.json();
    
    const payload: { wakeTime?: Date; sleepTime?: Date } = {};
    if (body.wakeTime) payload.wakeTime = new Date(body.wakeTime);
    if (body.sleepTime) payload.sleepTime = new Date(body.sleepTime);

    const planner = await updateDayPlanner(user.id, resolvedParams.id, payload);
    return new ApiResponse(planner, 'Day Planner updated successfully');
  });
