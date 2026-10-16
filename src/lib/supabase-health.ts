import 'server-only';

import { createClient } from '@supabase/supabase-js';

export interface SupabaseHealth {
  status: 'healthy';
  database: 'connected';
  latency: string;
  timestamp: string;
}

/**
 * Reads one row from Supabase's `keep_alive` table (see `supabase/keep-alive.sql`).
 * Besides checking that Supabase is reachable, this counts as database activity and keeps
 * a free-plan project from being paused. Throws if the query fails.
 */
export const checkSupabaseHealth = async (): Promise<SupabaseHealth> => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error('Supabase URL or publishable key is not configured');
  }

  // Cron requests carry no user session, so use a plain client without cookie handling.
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const start = performance.now();

  const { error } = await supabase.from('keep_alive').select('id').limit(1);

  if (error) {
    throw new Error(error.message);
  }

  const duration = Number((performance.now() - start).toFixed(2));

  return {
    status: 'healthy',
    database: 'connected',
    latency: `${duration} ms`,
    timestamp: new Date().toISOString(),
  };
};
