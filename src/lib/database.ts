import 'server-only';

import { Pool } from 'pg';
import type { PoolConfig } from 'pg';

const DEFAULT_DB_NAME = 'postgres';
const DEFAULT_DB_PORT = 5432;
const DEFAULT_DB_USER = 'postgres';

let pool: Pool | null = null;

const parseConnectionString = (connectionString: string): PoolConfig => {
  const normalized = connectionString.trim();

  if (!normalized.startsWith('postgres://') && !normalized.startsWith('postgresql://')) {
    throw new Error('DB connection string must start with `postgres://` or `postgresql://`.');
  }

  const protocolSeparatorIndex = normalized.indexOf('://');
  const protocol = normalized.slice(0, protocolSeparatorIndex);
  const remainder = normalized.slice(protocolSeparatorIndex + 3);
  const credentialsSeparatorIndex = remainder.lastIndexOf('@');

  if (credentialsSeparatorIndex === -1) {
    throw new Error('DB connection string is missing credentials or host information.');
  }

  const credentials = remainder.slice(0, credentialsSeparatorIndex);
  const hostAndPath = remainder.slice(credentialsSeparatorIndex + 1);
  const credentialSplitIndex = credentials.indexOf(':');

  if (credentialSplitIndex === -1) {
    throw new Error('DB connection string must include both a username and password.');
  }

  const username = credentials.slice(0, credentialSplitIndex);
  const password = credentials.slice(credentialSplitIndex + 1);

  if (!username || !password) {
    throw new Error('DB connection string must include both a username and password.');
  }

  const parsedUrl = new URL(`${protocol}://${hostAndPath}`);
  const databaseName = parsedUrl.pathname.replace(/^\//, '') || DEFAULT_DB_NAME;
  const port = parsedUrl.port ? Number(parsedUrl.port) : DEFAULT_DB_PORT;

  return {
    host: parsedUrl.hostname,
    port,
    database: databaseName,
    user: decodeURIComponent(username),
    password: decodeURIComponent(password),
    ssl: {
      rejectUnauthorized: false,
    },
  };
};

const getProjectRef = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured.');
  }

  const hostname = new URL(supabaseUrl).hostname;
  const projectRef = hostname.split('.')[0];

  if (!projectRef) {
    throw new Error('Unable to derive Supabase project reference from NEXT_PUBLIC_SUPABASE_URL.');
  }

  return projectRef;
};

const getConnectionConfig = () => {
  const connectionString =
    process.env.DB_CONNECTION_URL ?? process.env.DB_CONNECTION_STRING ?? null;

  if (connectionString) {
    return parseConnectionString(connectionString);
  }

  const password = process.env.DB_PASSWORD;

  if (!password) {
    throw new Error('DB_PASSWORD is not configured.');
  }

  const host = process.env.SUPABASE_DB_HOST ?? `db.${getProjectRef()}.supabase.co`;
  const database = process.env.SUPABASE_DB_NAME ?? DEFAULT_DB_NAME;
  const user = process.env.SUPABASE_DB_USER ?? DEFAULT_DB_USER;
  const port = Number(process.env.SUPABASE_DB_PORT ?? DEFAULT_DB_PORT);

  return {
    host,
    database,
    user,
    password,
    port,
    ssl: {
      rejectUnauthorized: false,
    },
  };
};

export const getDatabasePool = () => {
  if (!pool) {
    pool = new Pool({
      ...getConnectionConfig(),
      max: 5,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });
  }

  return pool;
};

export const runDatabaseHealthCheck = async () => {
  const databasePool = getDatabasePool();
  const startedAt = Date.now();
  const result = await databasePool.query<{
    current_timestamp: string;
    current_database: string;
    current_user: string;
  }>(
    'select current_timestamp, current_database(), current_user',
  );
  const durationMs = Date.now() - startedAt;
  const row = result.rows[0];

  return {
    status: 'ok' as const,
    durationMs,
    database: row.current_database,
    user: row.current_user,
    checkedAt: row.current_timestamp,
  };
};
