import { apiHandler } from '@/lib/api/handler';
import { ApiResponse } from '@/lib/api/response';

import { checkDatabaseHealth } from '@/lib/db-health';

export const GET = () =>
  apiHandler(async () => {
    const health = await checkDatabaseHealth();

    return new ApiResponse(health, 'Database connection is healthy');
  });
