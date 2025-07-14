-- Kalika Database Initialization Script
-- Run this in your Neon PostgreSQL database

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    class VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Syllabus table
CREATE TABLE IF NOT EXISTS syllabus (
    id SERIAL PRIMARY KEY,
    class VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    chapter_name VARCHAR(255) NOT NULL,
    chapter_number INTEGER NOT NULL,
    topics JSONB DEFAULT '[]',
    learning_objectives JSONB DEFAULT '[]',
    duration_hours INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Progress tracking table
CREATE TABLE IF NOT EXISTS progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(100),
    progress_percent INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Study sessions table
CREATE TABLE IF NOT EXISTS study_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(100),
    duration_minutes INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz results table
CREATE TABLE IF NOT EXISTS quiz_results (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    topic VARCHAR(100),
    score INTEGER,
    total_questions INTEGER,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'completed' -- 'completed', 'missed', 'upcoming'
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(100),
    topic VARCHAR(100),
    question TEXT NOT NULL,
    options JSONB NOT NULL, -- Array of answer options
    correct_answer INTEGER NOT NULL, -- Index of correct option
    explanation TEXT,
    difficulty VARCHAR(20) DEFAULT 'medium', -- 'easy', 'medium', 'hard'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Study content table
CREATE TABLE IF NOT EXISTS study_content (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(100) NOT NULL,
    chapter VARCHAR(100),
    topic VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'text', -- 'text', 'video', 'interactive'
    difficulty VARCHAR(20) DEFAULT 'medium',
    duration_minutes INTEGER DEFAULT 15,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    points_awarded INTEGER DEFAULT 0,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profile pictures table
CREATE TABLE IF NOT EXISTS profile_pictures (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_syllabus_class_subject ON syllabus(class, subject);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_user_id ON study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_subject_chapter ON quiz_questions(subject, chapter);
CREATE INDEX IF NOT EXISTS idx_study_content_subject_chapter ON study_content(subject, chapter);
CREATE INDEX IF NOT EXISTS idx_achievements_user_id ON achievements(user_id);

-- Insert some sample data for testing (optional)
INSERT INTO users (name, email, password_hash, class) VALUES 
('Test Student', 'test@example.com', '$2b$10$example.hash.here', '12th Grade')
ON CONFLICT (email) DO NOTHING;

-- Insert sample progress data
INSERT INTO progress (user_id, subject, chapter, progress_percent, points) VALUES 
(1, 'Mathematics', 'Calculus', 75, 150),
(1, 'Physics', 'Wave Optics', 60, 120),
(1, 'Chemistry', 'Organic Chemistry', 45, 90)
ON CONFLICT DO NOTHING;

-- Insert sample quiz data
INSERT INTO quiz_results (user_id, subject, topic, score, total_questions, status) VALUES 
(1, 'Mathematics', 'Calculus', 8, 10, 'completed'),
(1, 'Physics', 'Wave Optics', 7, 10, 'completed'),
(1, 'Chemistry', 'Organic Chemistry', 6, 10, 'upcoming')
ON CONFLICT DO NOTHING; 