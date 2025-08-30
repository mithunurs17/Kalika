const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testSyllabusDisplay() {
  try {
    console.log('🔍 Testing syllabus display from database...\n');
    
    // Test 1: Get all syllabi (for home page display)
    console.log('📚 Test 1: Getting all syllabi (Home Page Display)');
    const allSyllabi = await pool.query('SELECT DISTINCT class, subject FROM syllabus ORDER BY class, subject');
    
    console.log('Available syllabi in database:');
    let currentClass = '';
    allSyllabi.rows.forEach(row => {
      if (row.class !== currentClass) {
        currentClass = row.class;
        console.log(`\n🏫 ${row.class}:`);
      }
      console.log(`  📖 ${row.subject}`);
    });
    
    // Test 2: Get specific class syllabus (for dashboard display)
    console.log('\n\n📚 Test 2: Getting 1st PUC syllabus (Dashboard Display)');
    const pucSyllabus = await pool.query('SELECT * FROM syllabus WHERE class = $1 ORDER BY subject, chapter_number', ['11th Grade (1st PUC)']);
    
    console.log(`\n1st PUC Syllabus Details:`);
    console.log(`Total chapters: ${pucSyllabus.rows.length}`);
    
    let currentSubject = '';
    pucSyllabus.rows.forEach(row => {
      if (row.subject !== currentSubject) {
        currentSubject = row.subject;
        console.log(`\n📖 ${row.subject}:`);
      }
      console.log(`  Chapter ${row.chapter_number}: ${row.chapter_name} (${row.duration_hours} hours)`);
    });
    
    // Test 3: Get SSLC syllabus for comparison
    console.log('\n\n📚 Test 3: Getting SSLC syllabus for comparison');
    const sslcSyllabus = await pool.query('SELECT * FROM syllabus WHERE class = $1 ORDER BY subject, chapter_number', ['10th Grade (SSLC)']);
    
    console.log(`\nSSLC Syllabus Details:`);
    console.log(`Total chapters: ${sslcSyllabus.rows.length}`);
    
    currentSubject = '';
    sslcSyllabus.rows.forEach(row => {
      if (row.subject !== currentSubject) {
        currentSubject = row.subject;
        console.log(`\n📖 ${row.subject}:`);
      }
      console.log(`  Chapter ${row.chapter_number}: ${row.chapter_name} (${row.duration_hours} hours)`);
    });
    
    // Test 4: Verify JSONB data structure
    console.log('\n\n📚 Test 4: Verifying JSONB data structure');
    const sampleChapter = await pool.query('SELECT * FROM syllabus WHERE class = $1 AND subject = $2 LIMIT 1', ['11th Grade (1st PUC)', 'Physics']);
    
    if (sampleChapter.rows.length > 0) {
      const chapter = sampleChapter.rows[0];
      console.log(`\nSample chapter: ${chapter.chapter_name}`);
      console.log(`Topics: ${chapter.topics.length} topics`);
      console.log(`Learning Objectives: ${chapter.learning_objectives.length} objectives`);
      console.log(`Topics: ${JSON.stringify(chapter.topics, null, 2)}`);
      console.log(`Learning Objectives: ${JSON.stringify(chapter.learning_objectives, null, 2)}`);
    }
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing syllabus display:', error);
  } finally {
    await pool.end();
  }
}

testSyllabusDisplay();
