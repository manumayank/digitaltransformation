import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { Prisma } from '@prisma/client';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    handlePrismaError(err, res);
    return;
  }

  // Handle validation errors
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
    return;
  }

  // Handle AppError instances
  if (err instanceof AppError) {
    const response: any = {
      success: false,
      message: err.message,
    };

    // Add errors array for validation errors
    if ('errors' in err) {
      response.errors = (err as any).errors;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle other errors
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

function handlePrismaError(
  err: Prisma.PrismaClientKnownRequestError,
  res: Response
): void {
  switch (err.code) {
    case 'P2002':
      // Unique constraint violation
      res.status(409).json({
        success: false,
        message: 'A record with this value already exists',
        field: (err.meta?.target as string[])?.join(', '),
      });
      break;

    case 'P2025':
      // Record not found
      res.status(404).json({
        success: false,
        message: 'Record not found',
      });
      break;

    case 'P2003':
      // Foreign key constraint violation
      res.status(400).json({
        success: false,
        message: 'Invalid reference to related record',
      });
      break;

    default:
      res.status(500).json({
        success: false,
        message: 'Database error occurred',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
  }
}
