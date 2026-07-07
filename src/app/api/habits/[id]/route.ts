import { NextRequest } from 'next/server';

import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';

import { getAuthenticatedUser } from '@/lib/auth';
import { getHabitById, updateHabit, deleteHabit, parseHabitPayload } from '@/lib/habits';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const GET = (request: NextRequest, { params }: RouteContext) =>
  apiHandler(async () => {
    const { id } = await params;
    const user = await getAuthenticatedUser();
    const habit = await getHabitById(user.id, id);

    if (!habit) {
      return new ApiResponse(null, 'Habit not found', 404);
    }

    return new ApiResponse(habit);
  });

export const PUT = (request: NextRequest, { params }: RouteContext) =>
  apiHandler(async () => {
    const { id } = await params;
    const user = await getAuthenticatedUser();
    const body = await request.json();
    const payload = parseHabitPayload(body);

    const updatedHabit = await updateHabit(user.id, id, payload);

    if (!updatedHabit) {
      return new ApiResponse(null, 'Habit not found', 404);
    }

    return new ApiResponse(updatedHabit, 'Habit updated successfully');
  });

export const DELETE = (request: NextRequest, { params }: RouteContext) =>
  apiHandler(async () => {
    const { id } = await params;
    const user = await getAuthenticatedUser();
    const success = await deleteHabit(user.id, id);

    if (!success) {
      return new ApiResponse(null, 'Habit not found', 404);
    }

    return new ApiResponse(null, 'Habit deleted successfully');
  });
