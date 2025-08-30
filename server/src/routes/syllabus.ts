import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { syllabusLogger } from '../utils/logger';
import { query, transaction } from '../database/connection';
import { createError } from '../middleware/errorHandler';
import Joi from 'joi';

const router = Router();

// Validation schemas
const syllabusSchema = Joi.object({
  class: Joi.string().required().min(1).max(50),
  subject: Joi.string().required().min(1).max(100),
  chapter_name: Joi.string().required().min(1).max(255),
  chapter_number: Joi.number().integer().min(1).required(),
  topics: Joi.array().items(Joi.string()).default([]),
  learning_objectives: Joi.array().items(Joi.string()).default([]),
  duration_hours: Joi.number().integer().min(1).max(100).default(10),
  difficulty_level: Joi.string().valid('beginner', 'intermediate', 'advanced').default('intermediate'),
  prerequisites: Joi.array().items(Joi.string()).default([]),
  tags: Joi.array().items(Joi.string()).default([]),
  is_active: Joi.boolean().default(true),
});

const bulkSyllabusSchema = Joi.object({
  class: Joi.string().required(),
  subjects: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    chapters: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      number: Joi.number().integer().min(1).required(),
      topics: Joi.array().items(Joi.string()).default([]),
      learning_objectives: Joi.array().items(Joi.string()).default([]),
      duration_hours: Joi.number().integer().min(1).max(100).default(10),
      difficulty_level: Joi.string().valid('beginner', 'intermediate', 'advanced').default('intermediate'),
      prerequisites: Joi.array().items(Joi.string()).default([]),
      tags: Joi.array().items(Joi.string()).default([]),
    })).required(),
  })).required(),
});

// Get all syllabus with filtering and pagination
router.get('/', asyncHandler(async (req, res) => {
  const {
    class: classParam,
    subject,
    difficulty_level,
    is_active,
    page = 1,
    limit = 50,
    sort_by = 'class',
    sort_order = 'asc',
    search,
  } = req.query;

  syllabusLogger.info('Fetching syllabus with filters', { classParam, subject, difficulty_level, page, limit });

  let sql = 'SELECT * FROM syllabus WHERE 1=1';
  let params: any[] = [];
  let paramIndex = 1;

  // Apply filters
  if (classParam) {
    sql += ` AND class = $${paramIndex}`;
    params.push(classParam);
    paramIndex++;
  }

  if (subject) {
    sql += ` AND subject = $${paramIndex}`;
    params.push(subject);
    paramIndex++;
  }

  if (difficulty_level) {
    sql += ` AND difficulty_level = $${paramIndex}`;
    params.push(difficulty_level);
    paramIndex++;
  }

  if (is_active !== undefined) {
    sql += ` AND is_active = $${paramIndex}`;
    params.push(is_active === 'true');
    paramIndex++;
  }

  if (search) {
    sql += ` AND (chapter_name ILIKE $${paramIndex} OR subject ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  // Get total count for pagination
  const countSql = sql.replace('SELECT *', 'SELECT COUNT(*)');
  const countResult = await query(countSql, params);
  const totalCount = parseInt(countResult.rows[0].count);

  // Apply sorting and pagination
  sql += ` ORDER BY ${sort_by} ${sort_order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
  sql += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  params.push(parseInt(limit as string), (parseInt(page as string) - 1) * parseInt(limit as string));

  const result = await query(sql, params);

  // Group by class and subject
  const syllabus = result.rows.reduce((acc: any, row) => {
    if (!acc[row.class]) {
      acc[row.class] = {};
    }
    if (!acc[row.class][row.subject]) {
      acc[row.class][row.subject] = [];
    }
    
    acc[row.class][row.subject].push({
      id: row.id,
      chapter_name: row.chapter_name,
      chapter_number: row.chapter_number,
      topics: row.topics || [],
      learning_objectives: row.learning_objectives || [],
      duration_hours: row.duration_hours,
      difficulty_level: row.difficulty_level,
      prerequisites: row.prerequisites || [],
      tags: row.tags || [],
      is_active: row.is_active,
      created_at: row.created_at,
      updated_at: row.updated_at,
    });
    
    return acc;
  }, {});

  res.json({
    success: true,
    data: syllabus,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: totalCount,
      pages: Math.ceil(totalCount / parseInt(limit as string)),
    },
  });
}));

// Get syllabus by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await query(
    'SELECT * FROM syllabus WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    throw createError.notFound('Syllabus not found');
  }

  res.json({
    success: true,
    data: result.rows[0],
  });
}));

// Create new syllabus entry
router.post('/', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { error, value } = syllabusSchema.validate(req.body);
  
  if (error) {
    throw createError.badRequest(`Validation error: ${error.details[0].message}`);
  }

  syllabusLogger.info('Creating new syllabus entry', { class: value.class, subject: value.subject, chapter: value.chapter_name });

  const result = await query(
    `INSERT INTO syllabus (
      class, subject, chapter_name, chapter_number, topics, learning_objectives, 
      duration_hours, difficulty_level, prerequisites, tags, is_active
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [
      value.class,
      value.subject,
      value.chapter_name,
      value.chapter_number,
      JSON.stringify(value.topics),
      JSON.stringify(value.learning_objectives),
      value.duration_hours,
      value.difficulty_level,
      JSON.stringify(value.prerequisites),
      JSON.stringify(value.tags),
      value.is_active,
    ]
  );

  res.status(201).json({
    success: true,
    data: result.rows[0],
    message: 'Syllabus entry created successfully',
  });
}));

// Update syllabus entry
router.put('/:id', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = syllabusSchema.validate(req.body);
  
  if (error) {
    throw createError.badRequest(`Validation error: ${error.details[0].message}`);
  }

  syllabusLogger.info('Updating syllabus entry', { id, class: value.class, subject: value.subject });

  // Check if syllabus exists
  const existingResult = await query('SELECT * FROM syllabus WHERE id = $1', [id]);
  if (existingResult.rows.length === 0) {
    throw createError.notFound('Syllabus not found');
  }

  const result = await query(
    `UPDATE syllabus SET 
      class = $1, subject = $2, chapter_name = $3, chapter_number = $4, 
      topics = $5, learning_objectives = $6, duration_hours = $7, 
      difficulty_level = $8, prerequisites = $9, tags = $10, is_active = $11,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $12 RETURNING *`,
    [
      value.class,
      value.subject,
      value.chapter_name,
      value.chapter_number,
      JSON.stringify(value.topics),
      JSON.stringify(value.learning_objectives),
      value.duration_hours,
      value.difficulty_level,
      JSON.stringify(value.prerequisites),
      JSON.stringify(value.tags),
      value.is_active,
      id,
    ]
  );

  res.json({
    success: true,
    data: result.rows[0],
    message: 'Syllabus updated successfully',
  });
}));

// Delete syllabus entry
router.delete('/:id', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  syllabusLogger.info('Deleting syllabus entry', { id });

  const result = await query('DELETE FROM syllabus WHERE id = $1 RETURNING *', [id]);
  
  if (result.rows.length === 0) {
    throw createError.notFound('Syllabus not found');
  }

  res.json({
    success: true,
    message: 'Syllabus deleted successfully',
    data: result.rows[0],
  });
}));

// Bulk upload syllabus
router.post('/bulk', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { error, value } = bulkSyllabusSchema.validate(req.body);
  
  if (error) {
    throw createError.badRequest(`Validation error: ${error.details[0].message}`);
  }

  syllabusLogger.info('Bulk uploading syllabus', { class: value.class, subjects: value.subjects.length });

  await transaction(async (client) => {
    // Clear existing syllabus for this class
    await client.query('DELETE FROM syllabus WHERE class = $1', [value.class]);

    // Insert new syllabus data
    for (const subject of value.subjects) {
      for (const chapter of subject.chapters) {
        await client.query(
          `INSERT INTO syllabus (
            class, subject, chapter_name, chapter_number, topics, learning_objectives,
            duration_hours, difficulty_level, prerequisites, tags, is_active
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
          [
            value.class,
            subject.name,
            chapter.name,
            chapter.number,
            JSON.stringify(chapter.topics),
            JSON.stringify(chapter.learning_objectives),
            chapter.duration_hours,
            chapter.difficulty_level,
            JSON.stringify(chapter.prerequisites),
            JSON.stringify(chapter.tags),
            true,
          ]
        );
      }
    }
  });

  res.json({
    success: true,
    message: `Syllabus uploaded for ${value.class}`,
    data: {
      class: value.class,
      subjects_count: value.subjects.length,
      total_chapters: value.subjects.reduce((acc, subj) => acc + subj.chapters.length, 0),
    },
  });
}));

// Get syllabus statistics
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const stats = await query(`
    SELECT 
      COUNT(*) as total_chapters,
      COUNT(DISTINCT class) as total_classes,
      COUNT(DISTINCT subject) as total_subjects,
      AVG(duration_hours) as avg_duration,
      SUM(duration_hours) as total_duration
    FROM syllabus 
    WHERE is_active = true
  `);

  const difficultyStats = await query(`
    SELECT 
      difficulty_level,
      COUNT(*) as count
    FROM syllabus 
    WHERE is_active = true
    GROUP BY difficulty_level
  `);

  const classStats = await query(`
    SELECT 
      class,
      COUNT(*) as chapters,
      COUNT(DISTINCT subject) as subjects
    FROM syllabus 
    WHERE is_active = true
    GROUP BY class
    ORDER BY class
  `);

  res.json({
    success: true,
    data: {
      overview: stats.rows[0],
      difficulty_distribution: difficultyStats.rows,
      class_distribution: classStats.rows,
    },
  });
}));

// Search syllabus
router.get('/search/:query', asyncHandler(async (req, res) => {
  const { query: searchQuery } = req.params;
  const { limit = 20 } = req.query;

  const result = await query(
    `SELECT * FROM syllabus 
     WHERE is_active = true 
     AND (
       chapter_name ILIKE $1 
       OR subject ILIKE $1 
       OR class ILIKE $1
       OR topics::text ILIKE $1
       OR learning_objectives::text ILIKE $1
     )
     ORDER BY 
       CASE 
         WHEN chapter_name ILIKE $1 THEN 1
         WHEN subject ILIKE $1 THEN 2
         ELSE 3
       END,
       chapter_number
     LIMIT $2`,
    [`%${searchQuery}%`, parseInt(limit as string)]
  );

  res.json({
    success: true,
    data: result.rows,
    query: searchQuery,
    count: result.rows.length,
  });
}));

// Toggle syllabus active status
router.patch('/:id/toggle', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await query(
    'UPDATE syllabus SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
    [id]
  );
  
  if (result.rows.length === 0) {
    throw createError.notFound('Syllabus not found');
  }

  const status = result.rows[0].is_active ? 'activated' : 'deactivated';
  
  res.json({
    success: true,
    data: result.rows[0],
    message: `Syllabus ${status} successfully`,
  });
}));

export default router;
