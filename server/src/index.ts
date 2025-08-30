import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { connectDatabase } from './database/connection';
import { setupCronJobs } from './utils/cronJobs';

// Import routes
import authRoutes from './routes/auth';
import syllabusRoutes from './routes/syllabus';
import contentRoutes from './routes/content';
import videoRoutes from './routes/video';
import adminRoutes from './routes/admin';
import analyticsRoutes from './routes/analytics';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      mediaSrc: ["'self'", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

// Health check endpoint
app.get('/health', (_req: any, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { status: string; timestamp: string; uptime: number; environment: string; }): void; new(): any; }; }; }) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'] || 'development',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/syllabus', syllabusRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDatabase();
    logger.info('✅ Database connected successfully');

    // Setup cron jobs
    setupCronJobs();
    logger.info('✅ Cron jobs configured');

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📚 Kalika Backend Server v${process.env['npm_package_version'] || '1.0.0'}`);
      logger.info(`🌍 Environment: ${process.env['NODE_ENV'] || 'development'}`);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

startServer();
