import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { verifyToken, requireAdmin, optionalAuth } from '../middleware/auth';
import { contentLogger } from '../utils/logger';
import { query, transaction } from '../database/connection';
import { createError } from '../middleware/errorHandler';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Joi from 'joi';

const router = Router();

// Configure multer for content uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'content');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/markdown',
      'application/json',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml'
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Validation schemas
const contentSchema = Joi.object({
  title: Joi.string().required().min(1).max(255),
  description: Joi.string().max(1000),
  subject: Joi.string().required().min(1).max(100),
  chapter: Joi.string().required().min(1).max(255),
  topic: Joi.string().max(255),
  content_type: Joi.string().valid('text', 'document', 'interactive', 'quiz', 'assignment').required(),
  difficulty_level: Joi.string().valid('beginner', 'intermediate', 'advanced').default('intermediate'),
  duration_minutes: Joi.number().integer().min(1).max(300),
  tags: Joi.array().items(Joi.string()).default([]),
  is_active: Joi.boolean().default(true),
  prerequisites: Joi.array().items(Joi.string()).default([]),
  learning_objectives: Joi.array().items(Joi.string()).default([]),
  content_data: Joi.object().optional(),
  metadata: Joi.object().optional(),
});

const bulkContentSchema = Joi.object({
  subject: Joi.string().required(),
  chapter: Joi.string().required(),
  contents: Joi.array().items(Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    topic: Joi.string().optional(),
    content_type: Joi.string().valid('text', 'document', 'interactive', 'quiz', 'assignment').required(),
    difficulty_level: Joi.string().valid('beginner', 'intermediate', 'advanced').default('intermediate'),
    duration_minutes: Joi.number().integer().min(1).max(300).default(15),
    tags: Joi.array().items(Joi.string()).default([]),
    content_data: Joi.object().optional(),
  })).required(),
});

// Get all content with filtering and pagination
router.get('/', asyncHandler(async (req, res) => {
  const {
    subject,
    chapter,
    content_type,
    difficulty_level,
    is_active,
    page = 1,
    limit = 20,
    sort_by = 'created_at',
    sort_order = 'desc',
    search,
  } = req.query;

  contentLogger.info('Fetching content with filters', { subject, chapter, content_type, page, limit });

  let sql = 'SELECT * FROM study_content WHERE 1=1';
  let params: any[] = [];
  let paramIndex = 1;

  // Apply filters
  if (subject) {
    sql += ` AND subject = $${paramIndex}`;
    params.push(subject);
    paramIndex++;
  }

  if (chapter) {
    sql += ` AND chapter = $${paramIndex}`;
    params.push(chapter);
    paramIndex++;
  }

  if (content_type) {
    sql += ` AND content_type = $${paramIndex}`;
    params.push(content_type);
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
    sql += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
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

  res.json({
    success: true,
    data: result.rows,
    pagination: {
      page: parseInt(page as string),
      limit: parseInt(limit as string),
      total: totalCount,
      pages: Math.ceil(totalCount / parseInt(limit as string)),
    },
  });
}));

// Get content by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await query(
    'SELECT * FROM study_content WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    throw createError.notFound('Content not found');
  }

  // Increment view count
  await query(
    'UPDATE study_content SET view_count = view_count + 1 WHERE id = $1',
    [id]
  );

  res.json({
    success: true,
    data: result.rows[0],
  });
}));

// Create new content
router.post('/', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { error, value } = contentSchema.validate(req.body);
  
  if (error) {
    throw createError.badRequest(`Validation error: ${error.details[0].message}`);
  }

  contentLogger.info('Creating new content', { 
    title: value.title, 
    subject: value.subject, 
    chapter: value.chapter,
    content_type: value.content_type 
  });

  const result = await query(
    `INSERT INTO study_content (
      title, description, subject, chapter, topic, content_type, difficulty_level,
      duration_minutes, tags, is_active, prerequisites, learning_objectives,
      content_data, metadata, view_count
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *`,
    [
      value.title,
      value.description || '',
      value.subject,
      value.chapter,
      value.topic || '',
      value.content_type,
      value.difficulty_level,
      value.duration_minutes || 15,
      JSON.stringify(value.tags),
      value.is_active,
      JSON.stringify(value.prerequisites),
      JSON.stringify(value.learning_objectives),
      JSON.stringify(value.content_data || {}),
      JSON.stringify(value.metadata || {}),
      0,
    ]
  );

  res.status(201).json({
    success: true,
    data: result.rows[0],
    message: 'Content created successfully',
  });
}));

// Upload content file
router.post('/upload', verifyToken, requireAdmin, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    throw createError.badRequest('File is required');
  }

  const { error, value } = contentSchema.validate(req.body);
  
  if (error) {
    throw createError.badRequest(`Validation error: ${error.details[0].message}`);
  }

  contentLogger.info('Processing content file upload', { 
    filename: req.file.filename, 
    subject: value.subject, 
    chapter: value.chapter 
  });

  const filePath = req.file.path;
  const fileName = req.file.filename;
  const fileSize = req.file.size;
  const mimeType = req.file.mimetype;

  // Save to database
  const result = await query(
    `INSERT INTO study_content (
      title, description, subject, chapter, topic, content_type, difficulty_level,
      duration_minutes, tags, is_active, prerequisites, learning_objectives,
      file_path, file_name, file_size, mime_type, view_count
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *`,
    [
      value.title,
      value.description || '',
      value.subject,
      value.chapter,
      value.topic || '',
      value.content_type,
      value.difficulty_level,
      value.duration_minutes || 15,
      JSON.stringify(value.tags),
      value.is_active,
      JSON.stringify(value.prerequisites),
      JSON.stringify(value.learning_objectives),
      filePath,
      fileName,
      fileSize,
      mimeType,
      0,
    ]
  );

  res.status(201).json({
    success: true,
    data: result.rows[0],
    message: 'Content file uploaded successfully',
    file: {
      name: fileName,
      size: fileSize,
      type: mimeType,
      path: filePath,
    },
  });
}));

// Update content
router.put('/:id', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = contentSchema.validate(req.body);
  
  if (error) {
    throw createError.badRequest(`Validation error: ${error.details[0].message}`);
  }

  contentLogger.info('Updating content', { id, title: value.title });

  // Check if content exists
  const existingResult = await query('SELECT * FROM study_content WHERE id = $1', [id]);
  if (existingResult.rows.length === 0) {
    throw createError.notFound('Content not found');
  }

  const result = await query(
    `UPDATE study_content SET 
      title = $1, description = $2, subject = $3, chapter = $4, topic = $5,
      content_type = $6, difficulty_level = $7, duration_minutes = $8, tags = $9,
      is_active = $10, prerequisites = $11, learning_objectives = $12,
      content_data = $13, metadata = $14, updated_at = CURRENT_TIMESTAMP
    WHERE id = $15 RETURNING *`,
    [
      value.title,
      value.description || '',
      value.subject,
      value.chapter,
      value.topic || '',
      value.content_type,
      value.difficulty_level,
      value.duration_minutes || 15,
      JSON.stringify(value.tags),
      value.is_active,
      JSON.stringify(value.prerequisites),
      JSON.stringify(value.learning_objectives),
      JSON.stringify(value.content_data || {}),
      JSON.stringify(value.metadata || {}),
      id,
    ]
  );

  res.json({
    success: true,
    data: result.rows[0],
    message: 'Content updated successfully',
  });
}));

// Delete content
router.delete('/:id', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  contentLogger.info('Deleting content', { id });

  const result = await query('SELECT * FROM study_content WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    throw createError.notFound('Content not found');
  }

  const content = result.rows[0];

  // Delete content file if exists
  if (content.file_path && fs.existsSync(content.file_path)) {
    try {
      fs.unlinkSync(content.file_path);
    } catch (error) {
      contentLogger.warn('Failed to delete content file', { error: error.message });
    }
  }

  // Delete from database
  await query('DELETE FROM study_content WHERE id = $1', [id]);

  res.json({
    success: true,
    message: 'Content deleted successfully',
    data: content,
  });
}));

// Bulk upload content
router.post('/bulk', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { error, value } = bulkContentSchema.validate(req.body);
  
  if (error) {
    throw createError.badRequest(`Validation error: ${error.details[0].message}`);
  }

  contentLogger.info('Bulk uploading content', { 
    subject: value.subject, 
    chapter: value.chapter, 
    contents: value.contents.length 
  });

  const createdContents = [];

  await transaction(async (client) => {
    for (const content of value.contents) {
      const result = await client.query(
        `INSERT INTO study_content (
          title, description, subject, chapter, topic, content_type, difficulty_level,
          duration_minutes, tags, is_active, content_data
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [
          content.title,
          content.description || '',
          value.subject,
          value.chapter,
          content.topic || '',
          content.content_type,
          content.difficulty_level,
          content.duration_minutes,
          JSON.stringify(content.tags),
          true,
          JSON.stringify(content.content_data || {}),
        ]
      );
      
      createdContents.push(result.rows[0]);
    }
  });

  res.json({
    success: true,
    message: `Bulk content upload completed for ${value.subject} - ${value.chapter}`,
    data: {
      subject: value.subject,
      chapter: value.chapter,
      contents_count: createdContents.length,
      contents: createdContents,
    },
  });
}));

// Get content by subject and chapter
router.get('/subject/:subject/chapter/:chapter', asyncHandler(async (req, res) => {
  const { subject, chapter } = req.params;
  const { content_type, difficulty_level, is_active = 'true' } = req.query;

  let sql = 'SELECT * FROM study_content WHERE subject = $1 AND chapter = $2';
  let params: any[] = [subject, chapter];
  let paramIndex = 3;

  if (content_type) {
    sql += ` AND content_type = $${paramIndex}`;
    params.push(content_type);
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
  }

  sql += ' ORDER BY content_type, difficulty_level, title';

  const result = await query(sql, params);

  // Group by content type
  const groupedContent = result.rows.reduce((acc: any, content) => {
    if (!acc[content.content_type]) {
      acc[content.content_type] = [];
    }
    acc[content.content_type].push(content);
    return acc;
  }, {});

  res.json({
    success: true,
    data: {
      subject,
      chapter,
      content: groupedContent,
      total_count: result.rows.length,
    },
  });
}));

// Search content
router.get('/search/:query', asyncHandler(async (req, res) => {
  const { query: searchQuery } = req.params;
  const { limit = 20, content_type, difficulty_level } = req.query;

  let sql = `SELECT * FROM study_content 
              WHERE is_active = true 
              AND (
                title ILIKE $1 
                OR description ILIKE $1 
                OR subject ILIKE $1
                OR chapter ILIKE $1
                OR topic ILIKE $1
                OR tags::text ILIKE $1
              )`;
  let params: any[] = [`%${searchQuery}%`];
  let paramIndex = 2;

  if (content_type) {
    sql += ` AND content_type = $${paramIndex}`;
    params.push(content_type);
    paramIndex++;
  }

  if (difficulty_level) {
    sql += ` AND difficulty_level = $${paramIndex}`;
    params.push(difficulty_level);
    paramIndex++;
  }

  sql += ` ORDER BY 
            CASE 
              WHEN title ILIKE $1 THEN 1
              WHEN subject ILIKE $1 THEN 2
              WHEN chapter ILIKE $1 THEN 3
              ELSE 4
            END,
            title
          LIMIT $${paramIndex}`;
  params.push(parseInt(limit as string));

  const result = await query(sql, params);

  res.json({
    success: true,
    data: result.rows,
    query: searchQuery,
    count: result.rows.length,
  });
}));

// Get content statistics
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const stats = await query(`
    SELECT 
      COUNT(*) as total_content,
      COUNT(DISTINCT subject) as total_subjects,
      COUNT(DISTINCT chapter) as total_chapters,
      COUNT(DISTINCT content_type) as total_content_types,
      AVG(duration_minutes) as avg_duration,
      SUM(view_count) as total_views
    FROM study_content 
    WHERE is_active = true
  `);

  const contentTypeStats = await query(`
    SELECT 
      content_type,
      COUNT(*) as count,
      AVG(duration_minutes) as avg_duration,
      SUM(view_count) as total_views
    FROM study_content 
    WHERE is_active = true
    GROUP BY content_type
  `);

  const difficultyStats = await query(`
    SELECT 
      difficulty_level,
      COUNT(*) as count,
      AVG(view_count) as avg_views
    FROM study_content 
    WHERE is_active = true
    GROUP BY difficulty_level
  `);

  const topContent = await query(`
    SELECT title, subject, chapter, content_type, view_count, duration_minutes
    FROM study_content 
    WHERE is_active = true
    ORDER BY view_count DESC
    LIMIT 10
  `);

  res.json({
    success: true,
    data: {
      overview: stats.rows[0],
      content_type_distribution: contentTypeStats.rows,
      difficulty_distribution: difficultyStats.rows,
      top_content: topContent.rows,
    },
  });
}));

// Toggle content active status
router.patch('/:id/toggle', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await query(
    'UPDATE study_content SET is_active = NOT is_active, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
    [id]
  );
  
  if (result.rows.length === 0) {
    throw createError.notFound('Content not found');
  }

  const status = result.rows[0].is_active ? 'activated' : 'deactivated';
  
  res.json({
    success: true,
    data: result.rows[0],
    message: `Content ${status} successfully`,
  });
}));

export default router;

