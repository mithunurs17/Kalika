// Database initialization script
// Run with: node scripts/init-db.js

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  console.log('🔧 Initializing database...');
  
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
    // Read SQL file
    const sqlPath = path.join(__dirname, 'init-db.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`Executing statement ${i + 1}/${statements.length}...`);
          await pool.query(statement);
        } catch (error) {
          // Ignore errors for existing tables/indexes
          if (error.code === '42P07' || error.code === '42710') {
            console.log(`⚠️  Statement ${i + 1} skipped (already exists):`, error.message);
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            throw error;
          }
        }
      }
    }

    console.log('✅ Database initialization completed successfully!');

    // Test the tables
    console.log('🧪 Testing created tables...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('📊 Available tables:', tables.rows.map(row => row.table_name));

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

initDatabase(); 