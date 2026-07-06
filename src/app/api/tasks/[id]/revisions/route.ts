import { NextRequest } from 'next/server';

import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { NotFoundError } from '@/lib/api/errors';

import { getAuthenticatedUser } from '@/lib/auth';
import {
  listTaskRevisions,
  markTaskForRevision,
  parseMarkRevisionPayload,
  unmarkTaskForRevision,
} from '@/lib/revisions';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/** GET /api/tasks/:id/revisions — list all revisions for a task */
export const GET = (_request: NextRequest, context: RouteContext) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const { id } = await context.params;
    const revisions = await listTaskRevisions(user.id, id);
    return new ApiResponse(revisions);
  });

/** POST /api/tasks/:id/revisions — mark a task for revision */
export const POST = (request: NextRequest, context: RouteContext) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const payload = parseMarkRevisionPayload(body);
    const revision = await markTaskForRevision(user.id, id, payload);
    if (!revision) {
      throw new NotFoundError('Task not found');
    }
    return new ApiResponse(revision, 'Task marked for revision', 201);
  });

/** DELETE /api/tasks/:id/revisions — unmark (remove latest pending revision) */
export const DELETE = (_request: NextRequest, context: RouteContext) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const { id } = await context.params;
    const deleted = await unmarkTaskForRevision(user.id, id);
    if (!deleted) {
      throw new NotFoundError('No pending revision found for this task');
    }
    return new ApiResponse(null, 'Task unmarked for revision');
  });
