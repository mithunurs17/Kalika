// SSLC Content Setup Script
// Run with: node scripts/setup-sslc-content.js

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

async function setupSSLContent() {
  console.log('🚀 Setting up SSLC content...');
  
  try {
    // Step 1: Upload Syllabus
    console.log('\n📚 Step 1: Uploading SSLC Syllabus...');
    await uploadSyllabus();
    
    // Step 2: Generate Sample Quizzes
    console.log('\n🎯 Step 2: Generating Sample Quizzes...');
    await generateSampleQuizzes();
    
    // Step 3: Generate Sample Study Content
    console.log('\n📖 Step 3: Generating Sample Study Content...');
    await generateSampleContent();
    
    console.log('\n✅ SSLC content setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up SSLC content:', error.message);
  }
}

async function uploadSyllabus() {
  try {
    const syllabusPath = path.join(__dirname, '../data/sslc-syllabus.json');
    const syllabusData = JSON.parse(fs.readFileSync(syllabusPath, 'utf8'));
    
    const response = await fetch('http://localhost:3000/api/syllabus/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(syllabusData),
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log(`✅ Syllabus uploaded: ${result.subjects} subjects`);
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('❌ Syllabus upload failed:', error.message);
    throw error;
  }
}

async function generateSampleQuizzes() {
  const sampleChapters = [
    { subject: 'Mathematics', chapter: 'Real Numbers', topic: 'Euclid\'s Division Lemma' },
    { subject: 'Mathematics', chapter: 'Polynomials', topic: 'Zeroes of Polynomials' },
    { subject: 'Science', chapter: 'Chemical Reactions and Equations', topic: 'Balancing Chemical Equations' },
    { subject: 'Science', chapter: 'Acids, Bases and Salts', topic: 'pH Scale' },
    { subject: 'Social Science', chapter: 'History - Nationalism in India', topic: 'Non-Cooperation Movement' }
  ];

  for (const chapter of sampleChapters) {
    try {
      console.log(`🎯 Generating quiz for ${chapter.subject} - ${chapter.chapter}...`);
      
      const response = await fetch('http://localhost:3000/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: chapter.subject,
          chapter: chapter.chapter,
          topic: chapter.topic,
          difficulty: 'medium',
          count: 5
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(`✅ Generated ${result.questions.length} questions`);
      } else {
        console.log(`⚠️ Quiz generation failed: ${result.error}`);
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`⚠️ Quiz generation failed for ${chapter.chapter}: ${error.message}`);
    }
  }
}

async function generateSampleContent() {
  const sampleChapters = [
    { subject: 'Mathematics', chapter: 'Real Numbers', topic: 'Introduction' },
    { subject: 'Science', chapter: 'Chemical Reactions and Equations', topic: 'Introduction' },
    { subject: 'Social Science', chapter: 'History - Nationalism in India', topic: 'Introduction' }
  ];

  for (const chapter of sampleChapters) {
    try {
      console.log(`📖 Generating content for ${chapter.subject} - ${chapter.chapter}...`);
      
      const response = await fetch('http://localhost:3000/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: chapter.subject,
          chapter: chapter.chapter,
          topic: chapter.topic,
          content_type: 'text',
          difficulty: 'medium'
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(`✅ Generated study content: ${result.content.title}`);
      } else {
        console.log(`⚠️ Content generation failed: ${result.error}`);
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`⚠️ Content generation failed for ${chapter.chapter}: ${error.message}`);
    }
  }
}

// Check if running directly
if (require.main === module) {
  setupSSLContent();
}

module.exports = { setupSSLContent }; 