const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkClass9SocialScience() {
  try {
    console.log('🔍 Checking Class 9 Social Science in database...\n');
    
    // Check all Class 9 subjects
    const class9Subjects = await pool.query('SELECT DISTINCT subject FROM syllabus WHERE class = $1 ORDER BY subject', ['9th Grade']);
    
    console.log('📚 Class 9 Subjects found:');
    class9Subjects.rows.forEach(row => {
      console.log(`  📖 ${row.subject}`);
    });
    
    // Check Social Science specifically
    const socialScienceChapters = await pool.query('SELECT * FROM syllabus WHERE class = $1 AND subject = $2 ORDER BY chapter_number', ['9th Grade', 'Social Science']);
    
    console.log(`\n📚 Social Science chapters found: ${socialScienceChapters.rows.length}`);
    
    if (socialScienceChapters.rows.length > 0) {
      console.log('\nFirst few chapters:');
      socialScienceChapters.rows.slice(0, 5).forEach(row => {
        console.log(`  Chapter ${row.chapter_number}: ${row.chapter_name}`);
      });
    } else {
      console.log('\n❌ No Social Science chapters found for Class 9');
      
      // Check if there are any subjects with similar names
      const similarSubjects = await pool.query('SELECT DISTINCT subject FROM syllabus WHERE class = $1 AND subject ILIKE $2', ['9th Grade', '%social%']);
      
      if (similarSubjects.rows.length > 0) {
        console.log('\n🔍 Similar subjects found:');
        similarSubjects.rows.forEach(row => {
          console.log(`  📖 ${row.subject}`);
        });
      }
    }
    
    // Check total count for Class 9
    const totalCount = await pool.query('SELECT COUNT(*) as total FROM syllabus WHERE class = $1', ['9th Grade']);
    console.log(`\n📊 Total Class 9 records: ${totalCount.rows[0].total}`);
    
  } catch (error) {
    console.error('❌ Error checking Class 9 Social Science:', error);
  } finally {
    await pool.end();
  }
}

checkClass9SocialScience();
