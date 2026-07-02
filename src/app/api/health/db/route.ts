import { NextResponse } from 'next/server';
import { runDatabaseHealthCheck } from '@/lib/database';

export async function GET() {
  try {
    const database = await runDatabaseHealthCheck();

    return NextResponse.json({
      success: true,
      data: database,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error';

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DB_CONNECTION_FAILED',
          message,
        },
      },
      { status: 500 },
    );
  }
}
