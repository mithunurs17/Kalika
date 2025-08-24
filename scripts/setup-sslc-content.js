// SSLC Content Setup Script
// Run with: node scripts/setup-sslc-content.js

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/kalika_db',
});

async function setupContent() {
  const client = await pool.connect();
  try {
    console.log('🚀 Setting up Class 10 (SSLC) syllabus content from data/sslc-syllabus.json ...');

    // Clear existing syllabus data
    await client.query('DELETE FROM syllabus');

    // Read syllabus from JSON file
    const syllabusPath = path.join(__dirname, '../data/sslc-syllabus.json');
    const syllabusJson = JSON.parse(fs.readFileSync(syllabusPath, 'utf-8'));

    const className = syllabusJson.class || '10th Grade (SSLC)';
    const subjects = syllabusJson.subjects || [];

    let insertCount = 0;
    for (const subject of subjects) {
      const subjectName = subject.name;
      for (const chapter of subject.chapters) {
        const query = `
          INSERT INTO syllabus (
            class, subject, chapter_name, chapter_number, 
            topics, learning_objectives, duration_hours
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        await client.query(query, [
          className,
          subjectName,
          chapter.name,
          chapter.number,
          JSON.stringify(chapter.topics),
          JSON.stringify(chapter.learning_objectives),
          chapter.duration_hours
        ]);
        insertCount++;
      }
    }

    console.log(`✅ Syllabus content setup completed successfully!`);
    console.log(`📚 Added ${insertCount} chapters for Class 10 (SSLC) from data/sslc-syllabus.json`);
    console.log('📖 Subjects covered:', subjects.map(s => s.name).join(', '));
  } catch (error) {
    console.error('❌ Error setting up syllabus content:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the setup
setupContent()
  .then(() => {
    console.log('🎉 Setup completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  }); 