const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function testAllSyllabi() {
  try {
    console.log('🔍 Testing all syllabi in database...\n');
    
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
    
    // Test 2: Get Class 9 syllabus details
    console.log('\n\n📚 Test 2: Getting Class 9 syllabus details');
    const class9Syllabus = await pool.query('SELECT * FROM syllabus WHERE class = $1 ORDER BY subject, chapter_number', ['9th Grade']);
    
    console.log(`\nClass 9 Syllabus Details:`);
    console.log(`Total chapters: ${class9Syllabus.rows.length}`);
    
    let currentSubject = '';
    class9Syllabus.rows.forEach(row => {
      if (row.subject !== currentSubject) {
        currentSubject = row.subject;
        console.log(`\n📖 ${row.subject}:`);
      }
      console.log(`  Chapter ${row.chapter_number}: ${row.chapter_name} (${row.duration_hours} hours)`);
    });
    
    // Test 3: Get 1st PUC syllabus summary
    console.log('\n\n📚 Test 3: Getting 1st PUC syllabus summary');
    const pucSyllabus = await pool.query('SELECT * FROM syllabus WHERE class = $1 ORDER BY subject, chapter_number', ['11th Grade (1st PUC)']);
    
    console.log(`\n1st PUC Syllabus Summary:`);
    console.log(`Total chapters: ${pucSyllabus.rows.length}`);
    
    currentSubject = '';
    pucSyllabus.rows.forEach(row => {
      if (row.subject !== currentSubject) {
        currentSubject = row.subject;
        console.log(`\n📖 ${row.subject}:`);
      }
      console.log(`  Chapter ${row.chapter_number}: ${row.chapter_name} (${row.duration_hours} hours)`);
    });
    
    // Test 4: Get SSLC syllabus summary
    console.log('\n\n📚 Test 4: Getting SSLC syllabus summary');
    const sslcSyllabus = await pool.query('SELECT * FROM syllabus WHERE class = $1 ORDER BY subject, chapter_number', ['10th Grade (SSLC)']);
    
    console.log(`\nSSLC Syllabus Summary:`);
    console.log(`Total chapters: ${sslcSyllabus.rows.length}`);
    
    currentSubject = '';
    sslcSyllabus.rows.forEach(row => {
      if (row.subject !== currentSubject) {
        currentSubject = row.subject;
        console.log(`\n📖 ${row.subject}:`);
      }
      console.log(`  Chapter ${row.chapter_number}: ${row.chapter_name} (${row.duration_hours} hours)`);
    });
    
    // Test 5: Summary statistics
    console.log('\n\n📊 Test 5: Summary Statistics');
    const summary = await pool.query('SELECT class, COUNT(*) as total_chapters FROM syllabus GROUP BY class ORDER BY class');
    
    console.log('\nTotal chapters per class:');
    summary.rows.forEach(row => {
      console.log(`  ${row.class}: ${row.total_chapters} chapters`);
    });
    
    const totalRecords = await pool.query('SELECT COUNT(*) as total FROM syllabus');
    console.log(`\n🎯 Total syllabus records in database: ${totalRecords.rows[0].total}`);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing syllabi:', error);
  } finally {
    await pool.end();
  }
}

testAllSyllabi();
