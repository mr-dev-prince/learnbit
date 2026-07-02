import { apiHandler } from '@/lib/api/handler';
import { ApiResponse } from '@/lib/api/response';

import { prisma } from '@/lib/database';

export const GET = () =>
  apiHandler(async () => {
    const start = performance.now();

    await prisma.$queryRaw`SELECT 1`;

    const duration = Number((performance.now() - start).toFixed(2));

    return new ApiResponse(
      {
        status: 'healthy',
        database: 'connected',
        latency: `${duration} ms`,
        timestamp: new Date().toISOString(),
      },
      'Database connection is healthy',
    );
  });
