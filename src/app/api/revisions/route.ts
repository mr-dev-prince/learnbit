import { ApiResponse } from '@/lib/api/response';
import { apiHandler } from '@/lib/api/handler';
import { getAuthenticatedUser } from '@/lib/auth';
import { listPendingRevisions } from '@/lib/revisions';

/** GET /api/revisions — list all PENDING revisions for the authenticated user */
export const GET = () =>
  apiHandler(async () => {
    const user = await getAuthenticatedUser();
    const revisions = await listPendingRevisions(user.id);
    return new ApiResponse(revisions);
  });
