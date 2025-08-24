const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/kalika_db',
});

async function fixUserClass() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Fixing user class assignments...');

    // Update user class from "10th" to "10th Grade (SSLC)"
    const updateResult = await client.query(
      'UPDATE users SET class = $1 WHERE class = $2',
      ['10th Grade (SSLC)', '10th']
    );
    
    console.log(`✅ Updated ${updateResult.rowCount} user(s)`);

    // Verify the update
    const verifyResult = await client.query('SELECT id, name, email, class FROM users');
    console.log('\n📋 Updated users:');
    verifyResult.rows.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.name} (${user.email}) - Class: ${user.class || 'NOT ASSIGNED'}`);
    });

    // Check syllabus data
    const syllabusResult = await client.query('SELECT class, COUNT(*) as chapter_count FROM syllabus GROUP BY class');
    console.log('\n📚 Available syllabus:');
    syllabusResult.rows.forEach((row) => {
      console.log(`  ${row.class}: ${row.chapter_count} chapters`);
    });

  } catch (error) {
    console.error('❌ Error fixing user class:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the fix
fixUserClass()
  .then(() => {
    console.log('\n🎉 User class fix completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 User class fix failed:', error);
    process.exit(1);
  }); 