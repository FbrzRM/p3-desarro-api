import type { ApiError } from './api-response.js';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors: ApiError[] | null;

  constructor(statusCode: number, message: string, errors: ApiError[] | null = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
