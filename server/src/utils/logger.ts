import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define format for file logs (without colors)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console({
    format,
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: path.join('logs', 'combined.log'),
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create the logger
export const logger = winston.createLogger({
  level: level(),
  levels,
  format: fileFormat,
  transports,
  exitOnError: false,
});

// Create logs directory if it doesn't exist
import fs from 'fs';
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Add stream for Morgan HTTP logging
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Custom logger methods for different contexts
export const createLogger = (context: string) => {
  return {
    error: (message: string, meta?: any) => logger.error(`[${context}] ${message}`, meta),
    warn: (message: string, meta?: any) => logger.warn(`[${context}] ${message}`, meta),
    info: (message: string, meta?: any) => logger.info(`[${context}] ${message}`, meta),
    http: (message: string, meta?: any) => logger.http(`[${context}] ${message}`, meta),
    debug: (message: string, meta?: any) => logger.debug(`[${context}] ${message}`, meta),
  };
};

// Export specific loggers for different modules
export const dbLogger = createLogger('Database');
export const authLogger = createLogger('Auth');
export const syllabusLogger = createLogger('Syllabus');
export const contentLogger = createLogger('Content');
export const videoLogger = createLogger('Video');
export const adminLogger = createLogger('Admin');
export const analyticsLogger = createLogger('Analytics');

export default logger;
