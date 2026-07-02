import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { createTask, listTasks, parseTaskPayload } from '@/lib/tasks';

export async function GET() {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      },
      { status: 401 },
    );
  }

  try {
    const tasks = await listTasks(user.id);

    return NextResponse.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tasks';

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_TASKS_FAILED',
          message,
        },
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const payload = parseTaskPayload(body);
    const task = await createTask(user.id, payload);

    return NextResponse.json(
      {
        success: true,
        data: task,
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create task';

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'CREATE_TASK_FAILED',
          message,
        },
      },
      { status: 400 },
    );
  }
}
