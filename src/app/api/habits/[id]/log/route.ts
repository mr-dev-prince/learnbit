import { NextRequest } from 'next/server';

import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';

import { getAuthenticatedUser } from '@/lib/auth';
import { logHabitCompletion, undoHabitCompletion } from '@/lib/habits';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const POST = (request: NextRequest, { params }: RouteContext) =>
  apiHandler(async () => {
    const { id } = await params;
    const user = await getAuthenticatedUser();

    const body = await request.json();
    const date = body.date;
    const timezoneOffset = body.timezoneOffset ? Number(body.timezoneOffset) : 0;

    if (!date) {
      throw new Error('`date` is required.');
    }

    const clientNow = new Date(Date.now() - timezoneOffset * 60000);
    const clientToday = clientNow.toISOString().split('T')[0];
    if (date < clientToday) {
      throw new Error('Cannot modify habit for past days.');
    }

    const log = await logHabitCompletion(user.id, id, date);
    return new ApiResponse(log, 'Habit logged successfully', 201);
  });

export const DELETE = (request: NextRequest, { params }: RouteContext) =>
  apiHandler(async () => {
    const { id } = await params;
    const user = await getAuthenticatedUser();

    const date = request.nextUrl.searchParams.get('date');
    const timezoneOffsetParam = request.nextUrl.searchParams.get('timezoneOffset');
    const timezoneOffset = timezoneOffsetParam ? Number(timezoneOffsetParam) : 0;

    if (!date) {
      throw new Error('`date` is required.');
    }

    const clientNow = new Date(Date.now() - timezoneOffset * 60000);
    const clientToday = clientNow.toISOString().split('T')[0];
    if (date < clientToday) {
      throw new Error('Cannot modify habit for past days.');
    }

    await undoHabitCompletion(user.id, id, date);
    return new ApiResponse(null, 'Habit log removed successfully');
  });
