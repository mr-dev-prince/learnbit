import 'server-only';

import { prisma } from '@/lib/database';

export interface DatabaseHealth {
  status: 'healthy';
  database: 'connected';
  latency: string;
  timestamp: string;
}

/**
 * Runs a lightweight `SELECT 1` against the database and reports round-trip latency.
 * Throws if the database is unreachable.
 */
export const checkDatabaseHealth = async (): Promise<DatabaseHealth> => {
  const start = performance.now();

  await prisma.$queryRaw`SELECT 1`;

  const duration = Number((performance.now() - start).toFixed(2));

  return {
    status: 'healthy',
    database: 'connected',
    latency: `${duration} ms`,
    timestamp: new Date().toISOString(),
  };
};
