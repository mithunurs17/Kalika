// Script to pre-populate quiz questions
// Run with: node scripts/populate-quizzes.js

require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function populateQuizzes() {
  console.log('📚 Populating quiz questions...');

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found');
    return;
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  const sampleQuestions = [
    // Mathematics
    {
      subject: 'Mathematics',
      chapter: 'Real Numbers',
      topic: 'Euclid\'s Division Lemma',
      question: 'What is Euclid\'s Division Lemma?',
      options: [
        'For any two positive integers a and b, there exist unique integers q and r such that a = bq + r, where 0 ≤ r < b',
        'For any two integers a and b, a + b = b + a',
        'For any integer a, a × 1 = a',
        'For any integer a, a - a = 0'
      ],
      correct_answer: 0,
      explanation: 'Euclid\'s Division Lemma states that for any two positive integers a and b, there exist unique integers q and r such that a = bq + r, where 0 ≤ r < b. Here q is the quotient and r is the remainder.',
      difficulty: 'medium'
    },
    {
      subject: 'Mathematics',
      chapter: 'Polynomials',
      topic: 'Zeroes of Polynomials',
      question: 'What is a zero of a polynomial?',
      options: [
        'A value of x for which the polynomial equals zero',
        'The coefficient of x',
        'The constant term',
        'The degree of the polynomial'
      ],
      correct_answer: 0,
      explanation: 'A zero of a polynomial P(x) is a value of x for which P(x) = 0. For example, if P(x) = x² - 1, then x = 1 and x = -1 are zeros because P(1) = 0 and P(-1) = 0.',
      difficulty: 'easy'
    },
    {
      subject: 'Mathematics',
      chapter: 'Quadratic Equations',
      topic: 'Quadratic Formula',
      question: 'What is the quadratic formula for solving ax² + bx + c = 0?',
      options: [
        'x = (-b ± √(b² - 4ac)) / 2a',
        'x = (b ± √(b² + 4ac)) / 2a',
        'x = (-b ± √(b² + 4ac)) / a',
        'x = (b ± √(4ac - b²)) / 2a'
      ],
      correct_answer: 0,
      explanation: 'The quadratic formula x = (-b ± √(b² - 4ac)) / 2a is used to find the roots of a quadratic equation ax² + bx + c = 0.',
      difficulty: 'medium'
    },
    {
      subject: 'Mathematics',
      chapter: 'Linear Equations',
      topic: 'Linear Equations in Two Variables',
      question: 'What is the general form of a linear equation in two variables?',
      options: [
        'ax + by + c = 0',
        'ax² + bx + c = 0',
        'ax + b = 0',
        'xy + a = 0'
      ],
      correct_answer: 0,
      explanation: 'The general form of a linear equation in two variables is ax + by + c = 0, where a, b, and c are constants and a, b are not both zero.',
      difficulty: 'easy'
    },
    // Physics
    {
      subject: 'Physics',
      chapter: 'Motion',
      topic: 'Speed and Velocity',
      question: 'What is the difference between speed and velocity?',
      options: [
        'Speed is a scalar quantity and velocity is a vector quantity',
        'Speed is faster than velocity',
        'Velocity is measured in m/s while speed is measured in km/h',
        'There is no difference'
      ],
      correct_answer: 0,
      explanation: 'Speed is a scalar quantity that describes how fast an object is moving, while velocity is a vector quantity that describes both the speed and direction of motion.',
      difficulty: 'easy'
    },
    {
      subject: 'Physics',
      chapter: 'Forces',
      topic: 'Newton\'s Second Law',
      question: 'What is Newton\'s second law of motion?',
      options: [
        'F = ma, where F is force, m is mass, and a is acceleration',
        'For every action, there is an equal and opposite reaction',
        'An object in motion stays in motion unless acted upon by an external force',
        'Force equals mass times velocity'
      ],
      correct_answer: 0,
      explanation: 'Newton\'s second law states that the force acting on an object is equal to its mass multiplied by its acceleration (F = ma).',
      difficulty: 'medium'
    },
    {
      subject: 'Physics',
      chapter: 'Energy',
      topic: 'Kinetic Energy',
      question: 'What is the formula for kinetic energy?',
      options: [
        'KE = ½mv²',
        'KE = mgh',
        'KE = mv',
        'KE = m/v'
      ],
      correct_answer: 0,
      explanation: 'The kinetic energy of an object is given by KE = ½mv², where m is the mass and v is the velocity of the object.',
      difficulty: 'medium'
    },
    // Chemistry
    {
      subject: 'Chemistry',
      chapter: 'Atomic Structure',
      topic: 'Electron Configuration',
      question: 'What is the electron configuration of Oxygen (O)?',
      options: [
        '1s² 2s² 2p⁴',
        '1s² 2s² 2p²',
        '1s² 2s² 2p⁶',
        '1s¹ 2s² 2p⁴'
      ],
      correct_answer: 0,
      explanation: 'Oxygen has 8 electrons. The electron configuration is 1s² 2s² 2p⁴, which means 2 electrons in the 1s orbital, 2 in the 2s orbital, and 4 in the 2p orbitals.',
      difficulty: 'medium'
    },
    {
      subject: 'Chemistry',
      chapter: 'Chemical Bonding',
      topic: 'Covalent Bond',
      question: 'What is a covalent bond?',
      options: [
        'A bond formed by sharing electrons between two atoms',
        'A bond formed by transfer of electrons',
        'A bond formed by electrostatic attraction',
        'A bond formed by hydrogen atoms only'
      ],
      correct_answer: 0,
      explanation: 'A covalent bond is formed when two atoms share one or more pairs of electrons. This type of bonding is common in organic molecules.',
      difficulty: 'easy'
    },
    // Biology
    {
      subject: 'Biology',
      chapter: 'Cell Biology',
      topic: 'Cell Membrane',
      question: 'What is the primary function of the cell membrane?',
      options: [
        'To control what enters and exits the cell',
        'To store genetic information',
        'To produce energy',
        'To break down food'
      ],
      correct_answer: 0,
      explanation: 'The cell membrane acts as a semi-permeable barrier that controls what substances can enter and exit the cell. It is also called the plasma membrane.',
      difficulty: 'easy'
    }
  ];

  try {
    console.log(`📝 Inserting ${sampleQuestions.length} sample questions...`);

    for (const q of sampleQuestions) {
      await pool.query(
        `INSERT INTO quiz_questions (subject, chapter, topic, question, options, correct_answer, explanation, difficulty)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING`,
        [
          q.subject,
          q.chapter,
          q.topic,
          q.question,
          JSON.stringify(q.options),
          q.correct_answer,
          q.explanation,
          q.difficulty
        ]
      );
    }

    console.log('✅ Quiz questions populated successfully!');

    // Verify
    const result = await pool.query('SELECT COUNT(*) as count FROM quiz_questions');
    console.log(`📊 Total quiz questions in database: ${result.rows[0].count}`);

  } catch (error) {
    console.error('❌ Error populating quiz questions:', error);
  } finally {
    await pool.end();
  }
}

populateQuizzes();
