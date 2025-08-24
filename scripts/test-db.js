// Database connection test script
// Run with: node scripts/test-db.js

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/kalika_db',
});

async function testDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Testing database connection and data...');

    // Test users table
    console.log('\n📋 Checking users table:');
    const usersResult = await client.query('SELECT id, name, email, class FROM users LIMIT 5');
    console.log(`Found ${usersResult.rowCount} users:`);
    usersResult.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email}) - Class: ${user.class || 'NOT ASSIGNED'}`);
    });

    // Test syllabus table
    console.log('\n📚 Checking syllabus table:');
    const syllabusResult = await client.query('SELECT class, subject, COUNT(*) as chapter_count FROM syllabus GROUP BY class, subject ORDER BY class, subject');
    console.log(`Found syllabus data:`);
    syllabusResult.rows.forEach((row) => {
      console.log(`  ${row.class} - ${row.subject}: ${row.chapter_count} chapters`);
    });

    // Test total chapters per class
    console.log('\n📊 Total chapters per class:');
    const totalResult = await client.query('SELECT class, COUNT(*) as total_chapters FROM syllabus GROUP BY class ORDER BY class');
    totalResult.rows.forEach((row) => {
      console.log(`  ${row.class}: ${row.total_chapters} chapters`);
    });

  } catch (error) {
    console.error('❌ Database test error:', error);
  } finally {
    client.release();
  }
}

// Run the test
testDatabase()
  .then(() => {
    console.log('\n✅ Database test completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database test failed:', error);
    process.exit(1);
  }); 