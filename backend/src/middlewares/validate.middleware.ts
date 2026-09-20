import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { ZodType } from 'zod';

interface ValidationSchemas {
  body?: ZodType;
  params?: ZodType;
}

export const validate =
  (schemas: ValidationSchemas): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.params) {
        schemas.params.parse(req.params);
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      next();
    } catch (err) {
      next(err); // ZodError -> errorHandler global
    }
  };
