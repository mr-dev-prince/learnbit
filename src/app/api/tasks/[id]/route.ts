import { NextRequest } from 'next/server';

import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { NotFoundError } from '@/lib/api/errors';

import { getAuthenticatedUser } from '@/lib/auth';

import { deleteTask, getTaskById, parseTaskPayload, updateTask } from '@/lib/tasks';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export const GET = (_request: NextRequest, context: RouteContext) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const { id } = await context.params;
    const task = await getTaskById(user.id, id);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return new ApiResponse(task);
  });

export const PUT = (request: NextRequest, context: RouteContext) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const { id } = await context.params;
    const body = await request.json();
    const payload = parseTaskPayload(body);
    const task = await updateTask(user.id, id, payload);
    if (!task) {
      throw new NotFoundError('Task not found');
    }
    return new ApiResponse(task, 'Task updated successfully');
  });

export const DELETE = (_request: NextRequest, context: RouteContext) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const { id } = await context.params;
    const deleted = await deleteTask(user.id, id);
    if (!deleted) {
      throw new NotFoundError('Task not found');
    }
    return new ApiResponse(null, 'Task deleted successfully');
  });
