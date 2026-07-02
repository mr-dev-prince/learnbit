import { NextResponse } from 'next/server';

export class ApiResponse<T = unknown> {
  constructor(
    public readonly data: T,
    public readonly message = 'Success',
    public readonly status = 200,
  ) {}

  send() {
    return NextResponse.json(
      {
        success: true,
        message: this.message,
        data: this.data,
      },
      {
        status: this.status,
      },
    );
  }
}
