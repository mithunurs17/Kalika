import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

export class CustomError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message, code } = error;

  // Log the error
  logger.error(`Error ${statusCode}: ${message}`, {
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    stack: error.stack,
    code,
  });

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (error.code === '23505') { // PostgreSQL unique constraint violation
    statusCode = 409;
    message = 'Resource already exists';
  } else if (error.code === '23503') { // PostgreSQL foreign key constraint violation
    statusCode = 400;
    message = 'Referenced resource does not exist';
  } else if (error.code === '42P01') { // PostgreSQL undefined table
    statusCode = 500;
    message = 'Database configuration error';
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal Server Error';
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
      code,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
    timestamp: new Date().toISOString(),
    path: req.url,
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  logger.warn(`Route not found: ${req.method} ${req.url}`);
  
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      statusCode: 404,
    },
    timestamp: new Date().toISOString(),
    path: req.url,
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Common error constructors
export const createError = {
  badRequest: (message: string = 'Bad Request', code?: string) => 
    new CustomError(message, 400, code),
  
  unauthorized: (message: string = 'Unauthorized', code?: string) => 
    new CustomError(message, 401, code),
  
  forbidden: (message: string = 'Forbidden', code?: string) => 
    new CustomError(message, 403, code),
  
  notFound: (message: string = 'Not Found', code?: string) => 
    new CustomError(message, 404, code),
  
  conflict: (message: string = 'Conflict', code?: string) => 
    new CustomError(message, 409, code),
  
  unprocessableEntity: (message: string = 'Unprocessable Entity', code?: string) => 
    new CustomError(message, 422, code),
  
  internalServer: (message: string = 'Internal Server Error', code?: string) => 
    new CustomError(message, 500, code),
  
  serviceUnavailable: (message: string = 'Service Unavailable', code?: string) => 
    new CustomError(message, 503, code),
};
