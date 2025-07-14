import { NextRequest, NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    console.log('📚 Syllabus upload attempt...');
    
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const syllabusData = await req.json();
    
    // Validate syllabus structure
    if (!syllabusData.class || !syllabusData.subjects || !Array.isArray(syllabusData.subjects)) {
      return NextResponse.json({ error: 'Invalid syllabus format' }, { status: 400 });
    }

    // Clear existing syllabus for this class
    await query('DELETE FROM syllabus WHERE class = $1', [syllabusData.class]);

    // Insert new syllabus data
    for (const subject of syllabusData.subjects) {
      if (subject.name && subject.chapters && Array.isArray(subject.chapters)) {
        for (const chapter of subject.chapters) {
          await query(
            `INSERT INTO syllabus (class, subject, chapter_name, chapter_number, topics, learning_objectives, duration_hours) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              syllabusData.class,
              subject.name,
              chapter.name,
              chapter.number,
              JSON.stringify(chapter.topics || []),
              JSON.stringify(chapter.learning_objectives || []),
              chapter.duration_hours || 10
            ]
          );
        }
      }
    }

    console.log(`✅ Syllabus uploaded for class ${syllabusData.class}`);
    return NextResponse.json({ 
      success: true, 
      message: `Syllabus uploaded for ${syllabusData.class}`,
      subjects: syllabusData.subjects.length
    });

  } catch (error) {
    console.error('❌ Syllabus upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload syllabus',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
} 