import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { getAuthenticatedUser } from '@/lib/auth';
import { createActivity } from '@/lib/day-planner';

export const POST = (request: NextRequest) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const body = await request.json();

    if (!body.plannerId || !body.title || !body.startTime || !body.endTime) {
      throw new Error('Missing required fields');
    }

    const payload = {
      plannerId: body.plannerId,
      title: body.title,
      notes: body.notes || null,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
    };

    if (isNaN(payload.startTime.getTime()) || isNaN(payload.endTime.getTime())) {
      throw new Error('Invalid date formats for startTime or endTime');
    }

    const activity = await createActivity(user.id, payload);
    return new ApiResponse(activity, 'Activity created successfully', 201);
  });
