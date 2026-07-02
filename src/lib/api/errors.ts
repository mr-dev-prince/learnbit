export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number = 400,
  ) {
    super(message);

    this.name = this.constructor.name;
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad request') {
    super('BAD_REQUEST', message, 400);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Authentication required') {
    super('UNAUTHORIZED', message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Forbidden') {
    super('FORBIDDEN', message, 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found') {
    super('NOT_FOUND', message, 404);
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'Conflict') {
    super('CONFLICT', message, 409);
  }
}

export class ValidationError extends ApiError {
  constructor(message = 'Validation failed') {
    super('VALIDATION_ERROR', message, 422);
  }
}

export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error') {
    super('INTERNAL_SERVER_ERROR', message, 500);
  }
}
