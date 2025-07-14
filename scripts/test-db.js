// Database connection test script
// Run with: node scripts/test-db.js

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function testDatabase() {
  console.log('🔍 Testing database connection...');
  
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    console.error('Please create a .env.local file with your Neon database connection string');
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    // Test basic connection
    console.log('📡 Testing connection...');
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Connection successful:', result.rows[0]);

    // Test if tables exist
    console.log('📋 Checking tables...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('📊 Found tables:', tables.rows.map(row => row.table_name));

    // Test users table
    console.log('👥 Testing users table...');
    const userCount = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log('✅ Users table accessible, count:', userCount.rows[0].count);

    // Test progress table
    console.log('📈 Testing progress table...');
    const progressCount = await pool.query('SELECT COUNT(*) as count FROM progress');
    console.log('✅ Progress table accessible, count:', progressCount.rows[0].count);

    console.log('🎉 All database tests passed!');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

testDatabase(); 