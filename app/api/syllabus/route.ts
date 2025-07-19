export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const classParam = searchParams.get('class');
    const subject = searchParams.get('subject');

    console.log('📚 Fetching syllabus...', { class: classParam, subject });

    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    let sql = 'SELECT * FROM syllabus';
    let params: any[] = [];
    let paramIndex = 1;

    if (classParam) {
      sql += ` WHERE class = $${paramIndex}`;
      params.push(classParam);
      paramIndex++;
    }

    if (subject) {
      sql += classParam ? ' AND' : ' WHERE';
      sql += ` subject = $${paramIndex}`;
      params.push(subject);
    }

    sql += ' ORDER BY class, subject, chapter_number';

    console.log('🔍 Executing SQL:', sql, 'with params:', params);

    const result = await query(sql, params);
    console.log('📊 Found', result.rows.length, 'syllabus records');

    // Group by class and subject
    const syllabus = result.rows.reduce((acc: any, row) => {
      if (!acc[row.class]) {
        acc[row.class] = {};
      }
      if (!acc[row.class][row.subject]) {
        acc[row.class][row.subject] = [];
      }
      
      // Handle JSONB data - it might already be parsed or might be a string
      let topics = [];
      let learning_objectives = [];
      
      try {
        topics = typeof row.topics === 'string' ? JSON.parse(row.topics) : (row.topics || []);
        learning_objectives = typeof row.learning_objectives === 'string' ? JSON.parse(row.learning_objectives) : (row.learning_objectives || []);
      } catch (parseError) {
        console.warn('⚠️ JSON parse error for row:', row.id, parseError);
        topics = [];
        learning_objectives = [];
      }
      
      acc[row.class][row.subject].push({
        id: row.id,
        chapter_name: row.chapter_name,
        chapter_number: row.chapter_number,
        topics: topics,
        learning_objectives: learning_objectives,
        duration_hours: row.duration_hours
      });
      
      return acc;
    }, {});

    console.log('✅ Syllabus grouped successfully:', Object.keys(syllabus));

    return NextResponse.json({ syllabus });

  } catch (error) {
    console.error('❌ Syllabus fetch error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch syllabus',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
} 