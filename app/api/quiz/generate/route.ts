import { NextRequest, NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    console.log('🎯 Quiz generation request...');
    
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const { subject, chapter, topic, difficulty = 'medium', count = 5 } = await req.json();
    
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

    // Generate quiz questions using AI (OpenRouter API)
    const quizQuestions = await generateQuizQuestions(subject, chapter, topic, difficulty, count, syllabusContext);
    
    // Save questions to database
    for (const question of quizQuestions) {
      await query(
        `INSERT INTO quiz_questions (subject, chapter, topic, question, options, correct_answer, explanation, difficulty) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          subject,
          chapter,
          topic || '',
          question.question,
          JSON.stringify(question.options),
          question.correct_answer,
          question.explanation,
          difficulty
        ]
      );
    }

    console.log(`✅ Generated ${quizQuestions.length} quiz questions for ${subject} - ${chapter}`);
    return NextResponse.json({ 
      success: true,
      questions: quizQuestions,
      message: `Generated ${quizQuestions.length} questions`
    });

  } catch (error) {
    console.error('❌ Quiz generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate quiz questions',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

async function generateQuizQuestions(subject: string, chapter: string, topic: string, difficulty: string, count: number, syllabusContext: string) {
  const prompt = `
    Generate ${count} multiple choice questions for ${subject} - Chapter: ${chapter}${topic ? `, Topic: ${topic}` : ''}.
    Difficulty level: ${difficulty}
    
    Syllabus Context:
    ${syllabusContext}
    
    Requirements:
    - Each question should have 4 options (A, B, C, D)
    - Provide clear explanations for correct answers
    - Questions should test understanding, not just memorization
    - Include a mix of conceptual and problem-solving questions
    - Make questions appropriate for ${difficulty} difficulty level
    
    Format each question as JSON:
    {
      "question": "Question text here?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Explanation of why this is correct"
    }
    
    Return only the JSON array of questions.
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
            content: 'You are an expert educational content creator specializing in creating high-quality quiz questions for NCERT curriculum.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    const questions = JSON.parse(content);
    
    // Validate and format questions
    return questions.map((q: any, index: number) => ({
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation || `This is the correct answer for question ${index + 1}`
    }));

  } catch (error) {
    console.error('AI API error:', error);
    // Fallback to sample questions
    return generateSampleQuestions(subject, chapter, count);
  }
}

function generateSampleQuestions(subject: string, chapter: string, count: number) {
  const sampleQuestions = {
    'Mathematics': [
      {
        question: `What is the fundamental theorem of arithmetic?`,
        options: [
          "Every natural number can be expressed as a product of primes",
          "Every natural number is divisible by 2",
          "Every natural number is a prime number",
          "Every natural number is even"
        ],
        correct_answer: 0,
        explanation: "The fundamental theorem of arithmetic states that every natural number greater than 1 can be expressed as a unique product of prime numbers."
      }
    ],
    'Physics': [
      {
        question: `What is the SI unit of force?`,
        options: ["Newton", "Joule", "Watt", "Pascal"],
        correct_answer: 0,
        explanation: "The SI unit of force is the Newton (N), defined as the force required to accelerate 1 kg at 1 m/s²."
      }
    ],
    'Chemistry': [
      {
        question: `What is the chemical formula for water?`,
        options: ["H2O", "CO2", "O2", "H2"],
        correct_answer: 0,
        explanation: "Water has the chemical formula H2O, consisting of two hydrogen atoms and one oxygen atom."
      }
    ]
  };

  const subjectQuestions = sampleQuestions[subject as keyof typeof sampleQuestions] || sampleQuestions['Mathematics'];
  return subjectQuestions.slice(0, count);
} 