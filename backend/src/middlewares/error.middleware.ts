import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/app-error.js';
import { errorResponse, type ApiError } from '../utils/api-response.js';

export const notFoundHandler = (req: Request, res: Response): void => {
  res
    .status(404)
    .json(errorResponse(`Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (err instanceof ZodError) {
    const errors: ApiError[] = err.issues.map((issue) => ({
      campo: issue.path.join('.'),
      mensaje: issue.message,
    }));
    res.status(400).json(errorResponse('Error de validación', errors));
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json(errorResponse(err.message, err.errors));
    return;
  }

  console.error('❌ [Error no controlado]:', err);
  res.status(500).json(errorResponse('Error interno del servidor'));
};
