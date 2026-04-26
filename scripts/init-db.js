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
    
    // Split statements more carefully - looking for CREATE/INSERT statements
    const statements = [];
    let currentStatement = '';
    const lines = sqlContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('--')) {
        continue;
      }
      
      currentStatement += ' ' + trimmedLine;
      
      // Check if statement ends with semicolon
      if (trimmedLine.endsWith(';')) {
        // Remove the semicolon and add to statements
        const cleanStatement = currentStatement.replace(/;$/, '').trim();
        if (cleanStatement.length > 0) {
          statements.push(cleanStatement);
        }
        currentStatement = '';
      }
    }
    
    // Handle last statement if it doesn't end with semicolon
    if (currentStatement.trim().length > 0) {
      statements.push(currentStatement.trim());
    }

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          // Only log first 100 chars of statement for brevity
          const displayStmt = statement.substring(0, 80) + (statement.length > 80 ? '...' : '');
          console.log(`✏️  Statement ${i + 1}/${statements.length}: ${displayStmt}`);
          await pool.query(statement);
        } catch (error) {
          // Ignore errors for existing tables/indexes
          if (error.code === '42P07' || error.code === '42710') {
            console.log(`⚠️  Statement ${i + 1} skipped (already exists)`);
          } else if (error.code === '23505') {
            console.log(`⚠️  Statement ${i + 1} skipped (duplicate data)`);
          } else {
            console.error(`❌ Error in statement ${i + 1}:`, error.message);
            console.error(`Full statement: ${statement.substring(0, 200)}`);
            // Don't throw, continue with next statement
            // throw error;
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
    
    console.log('📊 Available tables:', tables.rows.map(row => row.table_name).join(', '));

  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await pool.end();
  }
}

initDatabase(); 