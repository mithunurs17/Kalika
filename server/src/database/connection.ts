import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
  max: number;
  idleTimeoutMillis: number;
  connectionTimeoutMillis: number;
}

class DatabaseConnection {
  private pool: Pool;
  private isConnected: boolean = false;

  constructor() {
    const config: DatabaseConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'kalika',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      ssl: process.env.NODE_ENV === 'production',
      max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
      idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000'),
      connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
    };

    this.pool = new Pool(config);

    // Event listeners
    this.pool.on('connect', (client: PoolClient) => {
      logger.info('🔌 New database client connected');
      this.isConnected = true;
    });

    this.pool.on('error', (err: Error, client: PoolClient) => {
      logger.error('❌ Database client error:', err.message);
      this.isConnected = false;
    });

    this.pool.on('remove', (client: PoolClient) => {
      logger.info('🔌 Database client removed from pool');
    });

    // Graceful shutdown
    process.on('SIGINT', () => this.close());
    process.on('SIGTERM', () => this.close());
  }

  async connect(): Promise<void> {
    try {
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      this.isConnected = true;
      logger.info('✅ Database connection established');
    } catch (error) {
      logger.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async query(text: string, params?: any[]): Promise<any> {
    try {
      const start = Date.now();
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      logger.debug(`📊 Query executed in ${duration}ms: ${text.substring(0, 100)}...`);
      
      return result;
    } catch (error) {
      logger.error('❌ Query execution failed:', error);
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    try {
      return await this.pool.connect();
    } catch (error) {
      logger.error('❌ Failed to get database client:', error);
      throw error;
    }
  }

  async transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.getClient();
    
    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.query('SELECT NOW() as current_time');
      return result.rows.length > 0;
    } catch (error) {
      logger.error('❌ Database health check failed:', error);
      return false;
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  async close(): Promise<void> {
    try {
      await this.pool.end();
      this.isConnected = false;
      logger.info('🔌 Database connection pool closed');
    } catch (error) {
      logger.error('❌ Error closing database pool:', error);
    }
  }

  // Get pool statistics
  getPoolStats() {
    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
      isConnected: this.isConnected,
    };
  }
}

// Create singleton instance
const databaseConnection = new DatabaseConnection();

export const connectDatabase = async (): Promise<void> => {
  await databaseConnection.connect();
};

export const query = databaseConnection.query.bind(databaseConnection);
export const getClient = databaseConnection.getClient.bind(databaseConnection);
export const transaction = databaseConnection.transaction.bind(databaseConnection);
export const healthCheck = databaseConnection.healthCheck.bind(databaseConnection);
export const getConnectionStatus = databaseConnection.getConnectionStatus.bind(databaseConnection);
export const getPoolStats = databaseConnection.getPoolStats.bind(databaseConnection);
export const closeDatabase = databaseConnection.close.bind(databaseConnection);

export default databaseConnection;
