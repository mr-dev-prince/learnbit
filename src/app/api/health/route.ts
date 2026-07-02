import { NextResponse } from 'next/server';
import { runDatabaseHealthCheck } from '@/lib/database';

export async function GET() {
  try {
    const database = await runDatabaseHealthCheck();

    return NextResponse.json({
      success: true,
      data: {
        service: 'learnbit',
        database,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown database error';
    console.log('Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DATABASE_HEALTHCHECK_FAILED',
          message,
        },
      },
      { status: 500 },
    );
  }
}
