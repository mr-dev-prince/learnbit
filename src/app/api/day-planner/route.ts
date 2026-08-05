import { NextRequest } from 'next/server';
import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { getAuthenticatedUser } from '@/lib/auth';
import { getDayPlanner, createDayPlanner } from '@/lib/day-planner';

export const GET = (request: NextRequest) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    
    // We expect the date to be passed as a query param (e.g., ?date=2024-05-10T00:00:00.000Z)
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    if (!dateParam) {
      throw new Error('Date parameter is required');
    }

    const date = new Date(dateParam);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date parameter');
    }

    const planner = await getDayPlanner(user.id, date);
    return new ApiResponse(planner);
  });

export const POST = (request: NextRequest) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const body = await request.json();
    
    // Validate payload
    if (!body.date || !body.wakeTime || !body.sleepTime) {
      throw new Error('Missing required fields: date, wakeTime, sleepTime');
    }

    const payload = {
      date: new Date(body.date),
      wakeTime: new Date(body.wakeTime),
      sleepTime: new Date(body.sleepTime),
    };

    if (isNaN(payload.date.getTime()) || isNaN(payload.wakeTime.getTime()) || isNaN(payload.sleepTime.getTime())) {
      throw new Error('Invalid date formats in payload');
    }

    const planner = await createDayPlanner(user.id, payload);
    return new ApiResponse(planner, 'Day Planner created successfully', 201);
  });
