import { NextRequest } from 'next/server';

import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';

import { getAuthenticatedUser } from '@/lib/auth';
import { createTask, listTasks, parseTaskPayload } from '@/lib/tasks';

export const GET = () =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const tasks = await listTasks(user.id);
    return new ApiResponse(tasks);
  });

export const POST = (request: NextRequest) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const body = await request.json();
    const payload = parseTaskPayload(body);
    const task = await createTask(user.id, payload);
    return new ApiResponse(task, 'Task created successfully', 201);
  });
