import { Pool } from 'pg';

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.error('Please create a .env.local file with your Neon database connection string.');
  console.error('Example: DATABASE_URL=postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Neon requires SSL
});

// Test database connection on startup
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err.message);
});

export async function query(text: string, params?: any[]) {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (error) {
    console.error('❌ Database query error:', error);
    throw error;
  }
}

// Test connection function
export async function testConnection() {
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ Database connection test successful:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    return false;
  }
} 