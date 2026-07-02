import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { deleteTask, getTaskById, parseTaskPayload, updateTask } from '@/lib/tasks';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

const unauthorizedResponse = () =>
  NextResponse.json(
    {
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    },
    { status: 401 },
  );

export async function GET(_request: NextRequest, context: RouteContext) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;

  try {
    const task = await getTaskById(user.id, id);

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TASK_NOT_FOUND',
            message: 'Task not found',
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch task';

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_TASK_FAILED',
          message,
        },
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const payload = parseTaskPayload(body);
    const task = await updateTask(user.id, id, payload);

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TASK_NOT_FOUND',
            message: 'Task not found',
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: task,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update task';

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_TASK_FAILED',
          message,
        },
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const user = await getAuthenticatedUser();

  if (!user) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;

  try {
    const deleted = await deleteTask(user.id, id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'TASK_NOT_FOUND',
            message: 'Task not found',
          },
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete task';

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'DELETE_TASK_FAILED',
          message,
        },
      },
      { status: 500 },
    );
  }
}
