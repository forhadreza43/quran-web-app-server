import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import type { APIErrorResponse } from '../types/quran.types.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
   if (error instanceof ZodError) {
      const response: APIErrorResponse = {
         success: false,
         message: 'Validation failed',
         errors: error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
         })),
      };

      res.status(400).json(response);
      return;
   }

   const statusCode = error instanceof AppError ? error.statusCode : 500;

   const response: APIErrorResponse = {
      success: false,
      message:
         error instanceof Error && error.message
            ? error.message
            : 'Internal server error',
   };

   if (error instanceof AppError && error.details !== undefined) {
      response.errors = error.details;
   }

   if (env.NODE_ENV !== 'production' && error instanceof Error) {
      response.errors = {
         ...(typeof response.errors === 'object' && response.errors !== null
            ? response.errors
            : {}),
         stack: error.stack,
      };
   }

   res.status(statusCode).json(response);
};
