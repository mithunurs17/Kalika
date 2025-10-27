const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function debugClass9Query() {
  try {
    console.log('🔍 Debugging Class 9 query issue...\n');
    
    // Test 1: Get distinct subjects with raw data
    console.log('📚 Test 1: Raw distinct query results');
    const distinctSubjects = await pool.query('SELECT DISTINCT class, subject FROM syllabus WHERE class = $1 ORDER BY subject', ['9th Grade']);
    
    console.log('Raw distinct results:');
    distinctSubjects.rows.forEach((row, index) => {
      console.log(`  ${index + 1}. Class: "${row.class}" | Subject: "${row.subject}"`);
    });
    
    // Test 2: Get all records for Class 9
    console.log('\n📚 Test 2: All Class 9 records');
    const allRecords = await pool.query('SELECT class, subject, chapter_name FROM syllabus WHERE class = $1 ORDER BY subject, chapter_number', ['9th Grade']);
    
    console.log('All records:');
    let currentSubject = '';
    allRecords.rows.forEach(row => {
      if (row.subject !== currentSubject) {
        currentSubject = row.subject;
        console.log(`\n📖 ${row.subject}:`);
      }
      console.log(`  - ${row.chapter_name}`);
    });
    
    // Test 3: Check for any hidden characters or encoding issues
    console.log('\n📚 Test 3: Checking for encoding issues');
    const socialScienceCheck = await pool.query('SELECT * FROM syllabus WHERE class = $1 AND subject = $2 LIMIT 1', ['9th Grade', 'Social Science']);
    
    if (socialScienceCheck.rows.length > 0) {
      const row = socialScienceCheck.rows[0];
      console.log('Social Science record found:');
      console.log(`  Class: "${row.class}"`);
      console.log(`  Subject: "${row.subject}"`);
      console.log(`  Subject length: ${row.subject.length}`);
      console.log(`  Subject bytes: ${Buffer.from(row.subject).toString('hex')}`);
    } else {
      console.log('❌ No Social Science record found');
    }
    
    // Test 4: Try different subject names
    console.log('\n📚 Test 4: Trying different subject name variations');
    const variations = [
      'Social Science',
      'social science',
      'SOCIAL SCIENCE',
      'SocialScience',
      'Social_Science'
    ];
    
    for (const variation of variations) {
      const result = await pool.query('SELECT COUNT(*) as count FROM syllabus WHERE class = $1 AND subject = $2', ['9th Grade', variation]);
      console.log(`  "${variation}": ${result.rows[0].count} records`);
    }
    
    // Test 5: Check if there are any subjects with similar names
    console.log('\n📚 Test 5: Checking for similar subject names');
    const similarSubjects = await pool.query('SELECT DISTINCT subject FROM syllabus WHERE class = $1 AND subject ILIKE $2', ['9th Grade', '%social%']);
    
    if (similarSubjects.rows.length > 0) {
      console.log('Similar subjects found:');
      similarSubjects.rows.forEach(row => {
        console.log(`  📖 "${row.subject}"`);
      });
    } else {
      console.log('No subjects with "social" in the name found');
    }
    
  } catch (error) {
    console.error('❌ Error debugging:', error);
  } finally {
    await pool.end();
  }
}

debugClass9Query();
