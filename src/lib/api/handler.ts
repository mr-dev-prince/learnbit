import { NextResponse } from 'next/server';

import { ApiResponse } from './response';
import { ApiError, InternalServerError } from './errors';

type Handler<T> = () => Promise<ApiResponse<T>>;

export const apiHandler = async <T>(handler: Handler<T>): Promise<NextResponse> => {
  try {
    const response = await handler();
    return response.send();
  } catch (error) {
    console.error(error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: error.code,
            message: error.message,
          },
        },
        {
          status: error.status,
        },
      );
    }

    const internal = new InternalServerError(
      error instanceof Error ? error.message : 'Unknown error',
    );

    return NextResponse.json(
      {
        success: false,
        error: {
          code: internal.code,
          message: internal.message,
        },
      },
      {
        status: internal.status,
      },
    );
  }
};
