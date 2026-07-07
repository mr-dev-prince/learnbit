import { NextRequest } from 'next/server';

import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';

import { getAuthenticatedUser } from '@/lib/auth';
import { createHabit, listHabits, parseHabitPayload } from '@/lib/habits';

export const GET = () =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const habits = await listHabits(user.id);
    return new ApiResponse(habits);
  });

export const POST = (request: NextRequest) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const body = await request.json();
    const payload = parseHabitPayload(body);
    const habit = await createHabit(user.id, payload);
    return new ApiResponse(habit, 'Habit created successfully', 201);
  });
