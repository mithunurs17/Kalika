import { NextRequest, NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    console.log('📖 Study content generation request...');
    
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const { subject, chapter, topic, content_type = 'text', difficulty = 'medium' } = await req.json();
    
    if (!subject || !chapter) {
      return NextResponse.json({ error: 'Subject and chapter are required' }, { status: 400 });
    }

    // Get syllabus information for context
    const syllabusResult = await query(
      'SELECT topics, learning_objectives FROM syllabus WHERE subject = $1 AND chapter_name = $2',
      [subject, chapter]
    );

    let syllabusContext = '';
    if (syllabusResult.rows.length > 0) {
      const syllabus = syllabusResult.rows[0];
      syllabusContext = `
        Topics: ${syllabus.topics ? JSON.parse(syllabus.topics).join(', ') : ''}
        Learning Objectives: ${syllabus.learning_objectives ? JSON.parse(syllabus.learning_objectives).join(', ') : ''}
      `;
    }

    // Generate study content using AI
    const content = await generateStudyContent(subject, chapter, topic, content_type, difficulty, syllabusContext);
    
    // Save content to database
    const result = await query(
      `INSERT INTO study_content (subject, chapter, topic, title, content, content_type, difficulty, duration_minutes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        subject,
        chapter,
        topic || '',
        content.title,
        content.content,
        content_type,
        difficulty,
        content.duration_minutes || 15
      ]
    );

    console.log(`✅ Generated study content for ${subject} - ${chapter}`);
    return NextResponse.json({ 
      success: true,
      content: {
        id: result.rows[0].id,
        ...content
      },
      message: 'Study content generated successfully'
    });

  } catch (error) {
    console.error('❌ Content generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate study content',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

async function generateStudyContent(subject: string, chapter: string, topic: string, content_type: string, difficulty: string, syllabusContext: string) {
  const prompt = `
    Create comprehensive study content for ${subject} - Chapter: ${chapter}${topic ? `, Topic: ${topic}` : ''}.
    Content Type: ${content_type}
    Difficulty Level: ${difficulty}
    
    Syllabus Context:
    ${syllabusContext}
    
    Requirements:
    - Make content engaging and easy to understand
    - Include examples and explanations
    - Use appropriate language for ${difficulty} level
    - Structure content with clear headings
    - Include key concepts and definitions
    - Add practice problems or exercises if relevant
    - Estimated reading time: 15-20 minutes
    
    Format the response as JSON:
    {
      "title": "Chapter Title - Topic Name",
      "content": "Formatted content with markdown...",
      "duration_minutes": 15
    }
    
    Return only the JSON object.
  `;

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://kalika-edu.vercel.app',
        'X-Title': 'Kalika Education Platform'
      },
      body: JSON.stringify({
        model: 'deepseek-chat/deepseek-coder-33b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content creator specializing in creating engaging study materials for NCERT curriculum.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    return JSON.parse(content);

  } catch (error) {
    console.error('AI API error:', error);
    // Fallback to sample content
    return generateSampleContent(subject, chapter, topic);
  }
}

function generateSampleContent(subject: string, chapter: string, topic: string) {
  const sampleContent = {
    'Mathematics': {
      title: `${chapter} - ${topic || 'Introduction'}`,
      content: `
# ${chapter}

## Introduction
This chapter covers fundamental concepts in mathematics that are essential for understanding advanced topics.

## Key Concepts
- **Concept 1**: Definition and explanation
- **Concept 2**: Definition and explanation
- **Concept 3**: Definition and explanation

## Examples
### Example 1
Problem: [Sample problem]
Solution: [Step-by-step solution]

### Example 2
Problem: [Sample problem]
Solution: [Step-by-step solution]

## Practice Problems
1. [Practice problem 1]
2. [Practice problem 2]
3. [Practice problem 3]

## Summary
- Key point 1
- Key point 2
- Key point 3
      `,
      duration_minutes: 15
    },
    'Physics': {
      title: `${chapter} - ${topic || 'Introduction'}`,
      content: `
# ${chapter}

## Introduction
This chapter explores fundamental principles of physics and their applications.

## Key Concepts
- **Concept 1**: Definition and explanation
- **Concept 2**: Definition and explanation
- **Concept 3**: Definition and explanation

## Examples
### Example 1
Problem: [Sample problem]
Solution: [Step-by-step solution]

## Practice Problems
1. [Practice problem 1]
2. [Practice problem 2]

## Summary
- Key point 1
- Key point 2
      `,
      duration_minutes: 15
    }
  };

  return sampleContent[subject as keyof typeof sampleContent] || sampleContent['Mathematics'];
} 