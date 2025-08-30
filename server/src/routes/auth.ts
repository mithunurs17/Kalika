import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authLogger } from '../utils/logger';
import { query, transaction } from '../database/connection';
import { createError } from '../middleware/errorHandler';
import { 
  generateToken, 
  generateRefreshToken, 
  verifyRefreshToken, 
  hashPassword, 
  comparePassword, 
  validatePassword 
} from '../middleware/auth';
import Joi from 'joi';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation schemas
const registerSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  email: Joi.string().email().required().max(255),
  password: Joi.string().required().min(8).max(128),
  class: Joi.string().required().min(1).max(50),
  role: Joi.string().valid('student', 'teacher', 'admin').default('student'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const passwordResetSchema = Joi.object({
  email: Joi.string().email().required(),
});

const newPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required().min(8).max(128),
});

const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

// User registration
router.post('/register', authLimiter, asyncHandler(async (req, res) => {
  const { error, value } = registerSchema.validate(req.body);
  
  if (error) {
    throw createError.badRequest(`Validation error: ${error.details[0].message}`);
  }

  authLogger.info('User registration attempt', { email: value.email, role: value.role });

  // Check if user already exists
  const existingUser = await query(
    'SELECT id FROM users WHERE email = $1',
    [value.email]
  );

  if (existingUser.rows.length > 0) {
    throw createError.conflict('User with this email already exists');
  }

  // Validate password strength
  const passwordValidation = validatePassword(value.password);
  if (!passwordValidation.isValid) {
    throw createError.badRequest(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
  }

  // Hash password
  const hashedPassword = await hashPassword(value.password);

  // Create user
  const result = await query(
    `INSERT INTO users (name, email, password_hash, class, role, active, created_at) 
     VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING id, name, email, class, role`,
    [
      value.name,
      value.email,
      hashedPassword,
      value.class,
      value.role,
      true,
    ]
  );

  const user = result.rows[0];

  // Generate tokens
  const accessToken = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const refreshToken = generateRefreshToken(user.id);

  // Store refresh token
  await query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [user.id, refreshToken, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] // 30 days
  );

  authLogger.info('User registered successfully', { userId: user.id, email: user.email });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        class: user.class,
        role: user.role,
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 7 * 24 * 60 * 60, // 7 days in seconds
      },
    },
  });
}));

// User login
router.post('/login', authLimiter, asyncHandler(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  
  if (error) {
    throw createError.badRequest(`Validation error: ${error.details[0].message}`);
  }

  authLogger.info('User login attempt', { email: value.email });

  // Find user
  const userResult = await query(
    'SELECT id, name, email, password_hash, class, role, active FROM users WHERE email = $1',
    [value.email]
  );

  if (userResult.rows.length === 0) {
    throw createError.unauthorized('Invalid email or password');
  }

  const user = userResult.rows[0];

  // Check if user is active
  if (!user.active) {
    throw createError.forbidden('Account is deactivated');
  }

  // Verify password
  const isPasswordValid = await comparePassword(value.password, user.password_hash);
  if (!isPasswordValid) {
    throw createError.unauthorized('Invalid email or password');
  }

  // Generate tokens
  const accessToken = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const refreshToken = generateRefreshToken(user.id);

  // Store refresh token
  await query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [user.id, refreshToken, new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)] // 30 days
  );

  // Update last login
  await query(
    'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
    [user.id]
  );

  authLogger.info('User logged in successfully', { userId: user.id, email: user.email });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        class: user.class,
        role: user.role,
      },
      tokens: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: 7 * 24 * 60 * 60, // 7 days in seconds
      },
    },
  });
}));

// Refresh access token
router.post('/refresh', asyncHandler(async (req, res) => {
  const { error, value } = refreshTokenSchema.validate(req.body);
  
  if (error) {
    throw createError.badRequest(`Validation error: ${error.details[0].message}`);
  }

  try {
    // Verify refresh token
    const payload = verifyRefreshToken(value.refresh_token);
    
    // Check if token exists in database
    const tokenResult = await query(
      'SELECT user_id, expires_at FROM refresh_tokens WHERE token = $1',
      [value.refresh_token]
    );

    if (tokenResult.rows.length === 0) {
      throw createError.unauthorized('Invalid refresh token');
    }

    const tokenData = tokenResult.rows[0];

    // Check if token is expired
    if (new Date() > new Date(tokenData.expires_at)) {
      // Remove expired token
      await query('DELETE FROM refresh_tokens WHERE token = $1', [value.refresh_token]);
      throw createError.unauthorized('Refresh token expired');
    }

    // Get user data
    const userResult = await query(
      'SELECT id, name, email, class, role FROM users WHERE id = $1 AND active = true',
      [tokenData.user_id]
    );

    if (userResult.rows.length === 0) {
      throw createError.unauthorized('User not found or inactive');
    }

    const user = userResult.rows[0];

    // Generate new access token
    const accessToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    authLogger.info('Access token refreshed', { userId: user.id });

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        access_token: accessToken,
        expires_in: 7 * 24 * 60 * 60, // 7 days in seconds
      },
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw createError.unauthorized('Invalid refresh token');
    }
    throw error;
  }
}));

// Request password reset
router.post('/forgot-password', authLimiter, asyncHandler(async (req, res) => {
  const { error, value } = passwordResetSchema.validate(req.body);
  
  if (error) {
    throw createError.badRequest(`Validation error: ${error.details[0].message}`);
  }

  authLogger.info('Password reset request', { email: value.email });

  // Check if user exists
  const userResult = await query(
    'SELECT id, name FROM users WHERE email = $1 AND active = true',
    [value.email]
  );

  if (userResult.rows.length === 0) {
    // Don't reveal if user exists or not
    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
    return;
  }

  const user = userResult.rows[0];

  // Generate reset token
  const resetToken = generateToken({
    id: user.id,
    email: value.email,
    role: 'reset',
    name: user.name,
  });

  // Store reset token with expiration (1 hour)
  await query(
    'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [user.id, resetToken, new Date(Date.now() + 60 * 60 * 1000)]
  );

  // TODO: Send email with reset link
  // For now, just return the token (in production, send email)
  
  authLogger.info('Password reset token generated', { userId: user.id, email: value.email });

  res.json({
    success: true,
    message: 'Password reset link sent to your email',
    data: {
      reset_token: resetToken, // Remove this in production
      expires_in: 60 * 60, // 1 hour in seconds
    },
  });
}));

// Reset password with token
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { error, value } = newPasswordSchema.validate(req.body);
  
  if (error) {
    throw createError.badRequest(`Validation error: ${error.details[0].message}`);
  }

  try {
    // Verify reset token
    const payload = verifyRefreshToken(value.token);
    
    // Check if token exists and is valid
    const tokenResult = await query(
      'SELECT user_id, expires_at FROM password_reset_tokens WHERE token = $1',
      [value.token]
    );

    if (tokenResult.rows.length === 0) {
      throw createError.unauthorized('Invalid reset token');
    }

    const tokenData = tokenResult.rows[0];

    // Check if token is expired
    if (new Date() > new Date(tokenData.expires_at)) {
      // Remove expired token
      await query('DELETE FROM password_reset_tokens WHERE token = $1', [value.token]);
      throw createError.unauthorized('Reset token expired');
    }

    // Validate new password
    const passwordValidation = validatePassword(value.password);
    if (!passwordValidation.isValid) {
      throw createError.badRequest(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
    }

    // Hash new password
    const hashedPassword = await hashPassword(value.password);

    // Update user password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [hashedPassword, tokenData.user_id]
    );

    // Remove used reset token
    await query('DELETE FROM password_reset_tokens WHERE token = $1', [value.token]);

    // Invalidate all refresh tokens for this user
    await query('DELETE FROM refresh_tokens WHERE user_id = $1', [tokenData.user_id]);

    authLogger.info('Password reset successful', { userId: tokenData.user_id });

    res.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.',
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw createError.unauthorized('Invalid reset token');
    }
    throw error;
  }
}));

// Logout
router.post('/logout', asyncHandler(async (req, res) => {
  const { refresh_token } = req.body;

  if (refresh_token) {
    // Remove refresh token
    await query('DELETE FROM refresh_tokens WHERE token = $1', [refresh_token]);
  }

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
}));

// Get current user profile
router.get('/profile', asyncHandler(async (req, res) => {
  // This endpoint requires authentication middleware
  // The user data will be available in req.user
  if (!req.user) {
    throw createError.unauthorized('Authentication required');
  }

  const userResult = await query(
    'SELECT id, name, email, class, role, created_at, last_login FROM users WHERE id = $1',
    [req.user.id]
  );

  if (userResult.rows.length === 0) {
    throw createError.notFound('User not found');
  }

  res.json({
    success: true,
    data: userResult.rows[0],
  });
}));

// Update user profile
router.put('/profile', asyncHandler(async (req, res) => {
  if (!req.user) {
    throw createError.unauthorized('Authentication required');
  }

  const { name, class: userClass } = req.body;

  if (!name || !userClass) {
    throw createError.badRequest('Name and class are required');
  }

  const result = await query(
    'UPDATE users SET name = $1, class = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, name, email, class, role',
    [name, userClass, req.user.id]
  );

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: result.rows[0],
  });
}));

// Change password
router.put('/change-password', asyncHandler(async (req, res) => {
  if (!req.user) {
    throw createError.unauthorized('Authentication required');
  }

  const { current_password, new_password } = req.body;

  if (!current_password || !new_password) {
    throw createError.badRequest('Current password and new password are required');
  }

  // Get current password hash
  const userResult = await query(
    'SELECT password_hash FROM users WHERE id = $1',
    [req.user.id]
  );

  if (userResult.rows.length === 0) {
    throw createError.notFound('User not found');
  }

  // Verify current password
  const isCurrentPasswordValid = await comparePassword(current_password, userResult.rows[0].password_hash);
  if (!isCurrentPasswordValid) {
    throw createError.unauthorized('Current password is incorrect');
  }

  // Validate new password
  const passwordValidation = validatePassword(new_password);
  if (!passwordValidation.isValid) {
    throw createError.badRequest(`Password validation failed: ${passwordValidation.errors.join(', ')}`);
  }

  // Hash new password
  const hashedPassword = await hashPassword(new_password);

  // Update password
  await query(
    'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
    [hashedPassword, req.user.id]
  );

  // Invalidate all refresh tokens for this user
  await query('DELETE FROM refresh_tokens WHERE user_id = $1', [req.user.id]);

  authLogger.info('Password changed successfully', { userId: req.user.id });

  res.json({
    success: true,
    message: 'Password changed successfully. Please login again.',
  });
}));

export default router;

