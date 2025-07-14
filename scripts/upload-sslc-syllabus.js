// SSLC Syllabus Upload Script
// Run with: node scripts/upload-sslc-syllabus.js

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

async function uploadSSLCSyllabus() {
  console.log('📚 Uploading SSLC Syllabus...');
  
  try {
    // Read the syllabus data
    const syllabusPath = path.join(__dirname, '../data/sslc-syllabus.json');
    const syllabusData = JSON.parse(fs.readFileSync(syllabusPath, 'utf8'));
    
    console.log(`📖 Found ${syllabusData.subjects.length} subjects for ${syllabusData.class}`);
    
    // Upload to the API
    const response = await fetch('http://localhost:3000/api/syllabus/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(syllabusData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Syllabus uploaded successfully!');
      console.log(`📊 Uploaded ${result.subjects} subjects`);
      console.log(`📝 Message: ${result.message}`);
    } else {
      console.error('❌ Upload failed:', result.error);
      if (result.details) {
        console.error('🔍 Details:', result.details);
      }
    }

  } catch (error) {
    console.error('❌ Error uploading syllabus:', error.message);
  }
}

// Check if running directly
if (require.main === module) {
  uploadSSLCSyllabus();
}

module.exports = { uploadSSLCSyllabus }; 