import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { createError, asyncHandler } from './errorHandler';
import { query } from '../database/connection';
import { authLogger } from '../utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: string;
        name: string;
      };
    }
  }
}

export interface JWTPayload {
  id: number;
  email: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
}

// Verify JWT token
export const verifyToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError.unauthorized('Access token required');
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      authLogger.error('JWT_SECRET not configured');
      throw createError.internalServer('Authentication configuration error');
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;
    
    // Check if user still exists in database
    const userResult = await query(
      'SELECT id, email, role, name FROM users WHERE id = $1 AND active = true',
      [decoded.id]
    );

    if (userResult.rows.length === 0) {
      throw createError.unauthorized('User no longer exists');
    }

    req.user = userResult.rows[0];
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw createError.unauthorized('Invalid token');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw createError.unauthorized('Token expired');
    }
    throw error;
  }
});

// Require admin role
export const requireAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    throw createError.unauthorized('Authentication required');
  }

  if (req.user.role !== 'admin') {
    authLogger.warn(`Unauthorized admin access attempt by user ${req.user.id}`);
    throw createError.forbidden('Admin access required');
  }

  next();
});

// Require specific role
export const requireRole = (roles: string[]) => {
  return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw createError.unauthorized('Authentication required');
    }

    if (!roles.includes(req.user.role)) {
      authLogger.warn(`Unauthorized role access attempt by user ${req.user.id} (role: ${req.user.role})`);
      throw createError.forbidden(`Access denied. Required roles: ${roles.join(', ')}`);
    }

    next();
  });
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const secret = process.env.JWT_SECRET;
      
      if (secret) {
        const decoded = jwt.verify(token, secret) as JWTPayload;
        
        // Check if user still exists
        const userResult = await query(
          'SELECT id, email, role, name FROM users WHERE id = $1 AND active = true',
          [decoded.id]
        );

        if (userResult.rows.length > 0) {
          req.user = userResult.rows[0];
        }
      }
    }
    
    next();
  } catch (error) {
    // Don't fail on auth errors, just continue without user
    next();
  }
});

// Rate limiting for auth endpoints
export const authRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
};

// Generate JWT token
export const generateToken = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    authLogger.error('JWT_SECRET not configured');
    throw new Error('JWT_SECRET not configured');
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'kalika-backend',
    audience: 'kalika-frontend',
  });
};

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12');
  return bcrypt.hash(password, saltRounds);
};

// Compare password
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Validate password strength
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Generate refresh token
export const generateRefreshToken = (userId: number): string => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  
  if (!secret) {
    authLogger.error('JWT_REFRESH_SECRET not configured');
    throw new Error('JWT_REFRESH_SECRET not configured');
  }

  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    issuer: 'kalika-backend',
    audience: 'kalika-frontend',
  });
};

// Verify refresh token
export const verifyRefreshToken = (token: string): { id: number } => {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  
  if (!secret) {
    authLogger.error('JWT_REFRESH_SECRET not configured');
    throw new Error('JWT_REFRESH_SECRET not configured');
  }

  return jwt.verify(token, secret) as { id: number };
};
