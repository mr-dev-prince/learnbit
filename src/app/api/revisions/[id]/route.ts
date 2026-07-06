import { NextRequest } from 'next/server';

import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { NotFoundError, BadRequestError } from '@/lib/api/errors';

import { getAuthenticatedUser } from '@/lib/auth';
import { updateRevision } from '@/lib/revisions';
import type { UpdateRevisionPayload } from '@/lib/revisions';
import type { RevisionStatus } from '@/types/Revision';

interface RouteContext {
  params: Promise<{ id: string }>;
}

const VALID_STATUSES: RevisionStatus[] = ['PENDING', 'COMPLETED', 'SKIPPED'];

/** PATCH /api/revisions/:id — complete, skip, or update a revision's notes/interval */
export const PATCH = (request: NextRequest, context: RouteContext) =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const { id } = await context.params;
    const body = await request.json().catch(() => ({})) as Record<string, unknown>;

    const payload: UpdateRevisionPayload = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status as RevisionStatus)) {
        throw new BadRequestError('`status` must be PENDING, COMPLETED, or SKIPPED');
      }
      payload.status = body.status as RevisionStatus;
    }

    if (body.notes !== undefined) {
      payload.notes =
        typeof body.notes === 'string' && body.notes.trim().length > 0
          ? body.notes.trim()
          : null;
    }

    if (body.intervalDays !== undefined) {
      const days = Number(body.intervalDays);
      if (!Number.isInteger(days) || days < 1) {
        throw new BadRequestError('`intervalDays` must be a positive integer');
      }
      payload.intervalDays = days;
    }

    if (body.scheduledAt !== undefined) {
      payload.scheduledAt =
        typeof body.scheduledAt === 'string' && body.scheduledAt.trim().length > 0
          ? body.scheduledAt
          : null;
    }

    const revision = await updateRevision(user.id, id, payload);
    if (!revision) throw new NotFoundError('Revision not found');

    return new ApiResponse(revision, 'Revision updated');
  });
