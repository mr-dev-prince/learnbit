import type { NextRequest } from 'next/server';

import { apiHandler } from '@/lib/api/handler';
import { InternalServerError, UnauthorizedError } from '@/lib/api/errors';
import { ApiResponse } from '@/lib/api/response';

import { checkDatabaseHealth } from '@/lib/db-health';
import { checkSupabaseHealth } from '@/lib/supabase-health';

const errorMessage = (reason: unknown) =>
  reason instanceof Error ? reason.message.trim() : String(reason);

/**
 * Scheduled health check for both databases, invoked every 3 hours by GitHub Actions
 * (see `.github/workflows/db-health.yml`). Pinging Supabase also keeps the free-plan
 * project from pausing. Callers must send `Authorization: Bearer <CRON_SECRET>`.
 */
export const GET = (request: NextRequest) =>
  apiHandler(async () => {
    const secret = process.env.CRON_SECRET;

    if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
      throw new UnauthorizedError('Invalid cron secret');
    }

    const [aiven, supabase] = await Promise.allSettled([
      checkDatabaseHealth(),
      checkSupabaseHealth(),
    ]);

    const failures = Object.entries({ aiven, supabase }).flatMap(([name, result]) =>
      result.status === 'rejected' ? [`${name} (${errorMessage(result.reason)})`] : [],
    );

    if (aiven.status === 'rejected' || supabase.status === 'rejected') {
      console.error(`[cron:db-health] unhealthy: ${failures.join(', ')}`);
      throw new InternalServerError(`Health check failed: ${failures.join(', ')}`);
    }

    console.log(
      `[cron:db-health] healthy (aiven ${aiven.value.latency}, supabase ${supabase.value.latency})`,
    );

    return new ApiResponse(
      { aiven: aiven.value, supabase: supabase.value },
      'All databases are healthy',
    );
  });
