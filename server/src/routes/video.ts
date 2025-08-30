import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { verifyToken, requireAdmin } from '../middleware/auth';
import { videoLogger } from '../utils/logger';
import { query, transaction } from '../database/connection';
import { createError } from '../middleware/errorHandler';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import Joi from 'joi';

const router = Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'videos');
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
    fileSize: 500 * 1024 * 1024, // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid video file type'));
    }
  }
});

// Validation schemas
const videoSchema = Joi.object({
  title: Joi.string().required().min(1).max(255),
  description: Joi.string().max(1000),
  subject: Joi.string().required().min(1).max(100),
  chapter: Joi.string().required().min(1).max(255),
  topic: Joi.string().max(255),
  difficulty_level: Joi.string().valid('beginner', 'intermediate', 'advanced').default('intermediate'),
  duration_minutes: Joi.number().integer().min(1).max(300),
  tags: Joi.array().items(Joi.string()).default([]),
  is_active: Joi.boolean().default(true),
  thumbnail_url: Joi.string().uri().optional(),
  transcript: Joi.string().optional(),
  subtitles: Joi.array().items(Joi.object({
    language: Joi.string().required(),
    url: Joi.string().uri().required(),
  })).default([]),
});

// Get all videos with filtering and pagination
router.get('/', asyncHandler(async (req, res) => {
  const {
    subject,
    chapter,
    difficulty_level,
    is_active,
    page = 1,
    limit = 20,
    sort_by = 'created_at',
    sort_order = 'desc',
    search,
  } = req.query;

  videoLogger.info('Fetching videos with filters', { subject, chapter, difficulty_level, page, limit });

  let sql = 'SELECT * FROM videos WHERE 1=1';
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

// Get video by ID
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const result = await query(
    'SELECT * FROM videos WHERE id = $1',
    [id]
  );

  if (result.rows.length === 0) {
    throw createError.notFound('Video not found');
  }

  // Increment view count
  await query(
    'UPDATE videos SET view_count = view_count + 1 WHERE id = $1',
    [id]
  );

  res.json({
    success: true,
    data: result.rows[0],
  });
}));

// Upload video
router.post('/upload', verifyToken, requireAdmin, upload.single('video'), asyncHandler(async (req, res) => {
  if (!req.file) {
    throw createError.badRequest('Video file is required');
  }

  const { error, value } = videoSchema.validate(req.body);
  
  if (error) {
    throw createError.badRequest(`Validation error: ${error.details[0].message}`);
  }

  videoLogger.info('Processing video upload', { 
    filename: req.file.filename, 
    subject: value.subject, 
    chapter: value.chapter 
  });

  const videoPath = req.file.path;
  const videoFileName = req.file.filename;

  // Get video metadata using ffmpeg
  const videoInfo = await getVideoInfo(videoPath);
  
  // Generate thumbnail
  const thumbnailPath = await generateThumbnail(videoPath, videoFileName);
  
  // Generate multiple quality versions
  const qualityVersions = await generateQualityVersions(videoPath, videoFileName);

  // Save to database
  const result = await query(
    `INSERT INTO videos (
      title, description, subject, chapter, topic, difficulty_level, 
      duration_minutes, tags, is_active, thumbnail_url, transcript,
      subtitles, file_path, quality_versions, metadata, view_count
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
    [
      value.title,
      value.description || '',
      value.subject,
      value.chapter,
      value.topic || '',
      value.difficulty_level,
      value.duration_minutes || videoInfo.duration,
      JSON.stringify(value.tags),
      value.is_active,
      thumbnailPath,
      value.transcript || '',
      JSON.stringify(value.subtitles),
      videoPath,
      JSON.stringify(qualityVersions),
      JSON.stringify(videoInfo),
      0,
    ]
  );

  res.status(201).json({
    success: true,
    data: result.rows[0],
    message: 'Video uploaded successfully',
    processing: {
      thumbnail: thumbnailPath,
      qualities: qualityVersions,
      metadata: videoInfo,
    },
  });
}));

// Update video
router.put('/:id', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, value } = videoSchema.validate(req.body);
  
  if (error) {
    throw createError.badRequest(`Validation error: ${error.details[0].message}`);
  }

  videoLogger.info('Updating video', { id, title: value.title });

  // Check if video exists
  const existingResult = await query('SELECT * FROM videos WHERE id = $1', [id]);
  if (existingResult.rows.length === 0) {
    throw createError.notFound('Video not found');
  }

  const result = await query(
    `UPDATE videos SET 
      title = $1, description = $2, subject = $3, chapter = $4, topic = $5,
      difficulty_level = $6, duration_minutes = $7, tags = $8, is_active = $9,
      thumbnail_url = $10, transcript = $11, subtitles = $12,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $13 RETURNING *`,
    [
      value.title,
      value.description || '',
      value.subject,
      value.chapter,
      value.topic || '',
      value.difficulty_level,
      value.duration_minutes,
      JSON.stringify(value.tags),
      value.is_active,
      value.thumbnail_url || existingResult.rows[0].thumbnail_url,
      value.transcript || existingResult.rows[0].transcript,
      JSON.stringify(value.subtitles),
      id,
    ]
  );

  res.json({
    success: true,
    data: result.rows[0],
    message: 'Video updated successfully',
  });
}));

// Delete video
router.delete('/:id', verifyToken, requireAdmin, asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  videoLogger.info('Deleting video', { id });

  const result = await query('SELECT * FROM videos WHERE id = $1', [id]);
  
  if (result.rows.length === 0) {
    throw createError.notFound('Video not found');
  }

  const video = result.rows[0];

  // Delete video files
  try {
    if (fs.existsSync(video.file_path)) {
      fs.unlinkSync(video.file_path);
    }
    
    if (video.thumbnail_url && fs.existsSync(video.thumbnail_url)) {
      fs.unlinkSync(video.thumbnail_url);
    }

    // Delete quality versions
    if (video.quality_versions) {
      const qualities = JSON.parse(video.quality_versions);
      for (const quality of qualities) {
        if (fs.existsSync(quality.path)) {
          fs.unlinkSync(quality.path);
        }
      }
    }
  } catch (error) {
    videoLogger.warn('Failed to delete some video files', { error: error.message });
  }

  // Delete from database
  await query('DELETE FROM videos WHERE id = $1', [id]);

  res.json({
    success: true,
    message: 'Video deleted successfully',
    data: video,
  });
}));

// Stream video
router.get('/:id/stream', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quality = 'original' } = req.query;
  
  const result = await query('SELECT * FROM videos WHERE id = $1 AND is_active = true', [id]);
  
  if (result.rows.length === 0) {
    throw createError.notFound('Video not found or not active');
  }

  const video = result.rows[0];
  let videoPath = video.file_path;

  // Use quality version if specified
  if (quality !== 'original' && video.quality_versions) {
    const qualities = JSON.parse(video.quality_versions);
    const qualityVersion = qualities.find((q: any) => q.quality === quality);
    if (qualityVersion) {
      videoPath = qualityVersion.path;
    }
  }

  if (!fs.existsSync(videoPath)) {
    throw createError.notFound('Video file not found');
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = (end - start) + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(videoPath).pipe(res);
  }
}));

// Get video statistics
router.get('/stats/overview', asyncHandler(async (req, res) => {
  const stats = await query(`
    SELECT 
      COUNT(*) as total_videos,
      COUNT(DISTINCT subject) as total_subjects,
      COUNT(DISTINCT chapter) as total_chapters,
      AVG(duration_minutes) as avg_duration,
      SUM(view_count) as total_views,
      SUM(duration_minutes) as total_duration
    FROM videos 
    WHERE is_active = true
  `);

  const difficultyStats = await query(`
    SELECT 
      difficulty_level,
      COUNT(*) as count,
      AVG(view_count) as avg_views
    FROM videos 
    WHERE is_active = true
    GROUP BY difficulty_level
  `);

  const topVideos = await query(`
    SELECT title, subject, chapter, view_count, duration_minutes
    FROM videos 
    WHERE is_active = true
    ORDER BY view_count DESC
    LIMIT 10
  `);

  res.json({
    success: true,
    data: {
      overview: stats.rows[0],
      difficulty_distribution: difficultyStats.rows,
      top_videos: topVideos.rows,
    },
  });
}));

// Helper functions
async function getVideoInfo(videoPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const videoStream = metadata.streams.find((stream: any) => stream.codec_type === 'video');
      const audioStream = metadata.streams.find((stream: any) => stream.codec_type === 'audio');

      resolve({
        duration: Math.round(metadata.format.duration / 60), // Convert to minutes
        size: metadata.format.size,
        bitrate: metadata.format.bit_rate,
        format: metadata.format.format_name,
        video: {
          codec: videoStream?.codec_name,
          width: videoStream?.width,
          height: videoStream?.height,
          fps: videoStream?.r_frame_rate,
        },
        audio: {
          codec: audioStream?.codec_name,
          sample_rate: audioStream?.sample_rate,
          channels: audioStream?.channels,
        },
      });
    });
  });
}

async function generateThumbnail(videoPath: string, videoFileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const thumbnailDir = path.join(process.cwd(), 'uploads', 'thumbnails');
    if (!fs.existsSync(thumbnailDir)) {
      fs.mkdirSync(thumbnailDir, { recursive: true });
    }

    const thumbnailPath = path.join(thumbnailDir, `${path.parse(videoFileName).name}.jpg`);
    
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['50%'],
        filename: path.basename(thumbnailPath),
        folder: path.dirname(thumbnailPath),
        size: '320x240'
      })
      .on('end', () => resolve(thumbnailPath))
      .on('error', reject);
  });
}

async function generateQualityVersions(videoPath: string, videoFileName: string): Promise<any[]> {
  const qualities = [
    { name: 'low', resolution: '640x360', bitrate: '500k' },
    { name: 'medium', resolution: '1280x720', bitrate: '1500k' },
    { name: 'high', resolution: '1920x1080', bitrate: '3000k' },
  ];

  const versionsDir = path.join(process.cwd(), 'uploads', 'videos', 'qualities');
  if (!fs.existsSync(versionsDir)) {
    fs.mkdirSync(versionsDir, { recursive: true });
  }

  const versions: any[] = [];

  for (const quality of qualities) {
    const outputPath = path.join(versionsDir, `${path.parse(videoFileName).name}_${quality.name}.mp4`);
    
    try {
      await new Promise<void>((resolve, reject) => {
        ffmpeg(videoPath)
          .videoCodec('libx264')
          .audioCodec('aac')
          .size(quality.resolution)
          .videoBitrate(quality.bitrate)
          .audioBitrate('128k')
          .output(outputPath)
          .on('end', () => {
            versions.push({
              quality: quality.name,
              resolution: quality.resolution,
              bitrate: quality.bitrate,
              path: outputPath,
            });
            resolve();
          })
          .on('error', reject)
          .run();
      });
    } catch (error) {
      videoLogger.warn(`Failed to generate ${quality.name} quality version`, { error: error.message });
    }
  }

  return versions;
}

export default router;

