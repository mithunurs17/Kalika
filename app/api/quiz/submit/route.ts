import { NextRequest, NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    console.log('📝 Quiz submission...');

    const dbConnected = await testConnection();
    if (!dbConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const { user_id, subject, topic, answers, correct_answers, difficulty } = await req.json();

    if (!user_id || !subject || !answers || !correct_answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate score
    let score = 0;
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] === correct_answers[i]) {
        score++;
      }
    }

    const totalQuestions = answers.length;

    // Save quiz result to database
    const result = await query(
      `INSERT INTO quiz_results (user_id, subject, topic, score, total_questions, status) 
       VALUES ($1, $2, $3, $4, $5, 'completed')
       RETURNING *`,
      [user_id, subject, topic || '', score, totalQuestions]
    );

    // Update user progress
    await query(
      `INSERT INTO progress (user_id, subject, chapter, progress_percent, points) 
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, subject, chapter) DO UPDATE 
       SET progress_percent = GREATEST(progress_percent, $4),
           points = points + $5`,
      [user_id, subject, topic || '', Math.round((score / totalQuestions) * 100), score * 10]
    );

    // Award points based on performance
    const percentage = (score / totalQuestions) * 100;
    let pointsAwarded = 0;

    if (percentage === 100) {
      pointsAwarded = 50;
    } else if (percentage >= 80) {
      pointsAwarded = 40;
    } else if (percentage >= 60) {
      pointsAwarded = 30;
    } else if (percentage >= 40) {
      pointsAwarded = 20;
    } else {
      pointsAwarded = 10;
    }

    console.log(`✅ Quiz submitted: ${score}/${totalQuestions} (${percentage.toFixed(1)}%)`);

    return NextResponse.json({
      success: true,
      score,
      totalQuestions,
      percentage: parseFloat((percentage).toFixed(1)),
      pointsAwarded,
      result: result.rows[0]
    });

  } catch (error: any) {
    console.error('❌ Quiz submission error:', error);
    return NextResponse.json(
      {
        error: 'Failed to submit quiz',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const dbConnected = await testConnection();
    if (!dbConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    // Get user's quiz results
    const results = await query(
      `SELECT * FROM quiz_results 
       WHERE user_id = $1 
       ORDER BY date DESC`,
      [user_id]
    );

    // Calculate statistics
    const totalQuizzes = results.rows.length;
    const totalScore = results.rows.reduce((sum, quiz) => sum + (quiz.score || 0), 0);
    const totalQuestions = results.rows.reduce((sum, quiz) => sum + (quiz.total_questions || 0), 0);
    const averagePercentage = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0;

    return NextResponse.json({
      success: true,
      quizzes: results.rows,
      statistics: {
        totalQuizzes,
        totalScore,
        averagePercentage: parseFloat(averagePercentage.toFixed(1))
      }
    });

  } catch (error: any) {
    console.error('❌ Error fetching quizzes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}
