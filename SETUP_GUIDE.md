# Kalika - Complete Setup & Usage Guide

## 🎓 Overview
Kalika is a comprehensive educational platform designed for SSLC (10th Grade) and PUC (12th Grade) students. The platform features:
- **Interactive Quizzes** - AI-generated quizzes with multiple difficulty levels
- **Study Materials** - AI-generated study notes and content
- **Progress Tracking** - Track your learning progress
- **Points & Achievements** - Earn points and badges
- **Dashboard** - Personalized learning dashboard

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (Neon recommended)
- npm or yarn package manager

### Step 1: Environment Setup

Create a `.env.local` file in the project root:

```env
# Database Connection (Neon PostgreSQL)
DATABASE_URL=postgresql://[username]:[password]@[host]/[database]?sslmode=require&channel_binding=require

# AI API Keys (using OpenRouter)
OPENROUTER_API_KEY=sk-or-v1-xxxxx
NVIDIA_API_KEY=sk-or-v1-xxxxx
```

Get your connection string from [neon.tech](https://neon.tech)

### Step 2: Database Initialization

```bash
# Initialize database tables
node scripts/init-db.js

# Populate with sample quiz questions
node scripts/populate-quizzes.js
```

### Step 3: Install Dependencies & Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will start on `http://localhost:3000` (or 3001 if 3000 is in use)

## 📚 Features Overview

### 1. Quiz System

#### Taking Quizzes
1. Navigate to **Dashboard → Quizzes**
2. Select a subject and chapter
3. Choose difficulty level (Easy, Medium, Hard)
4. Select number of questions (5, 10, 15, or 20)
5. Click "Generate Quiz"
6. Answer questions and track your progress
7. View immediate feedback and explanations
8. Submit for scoring

**Key Features:**
- Interactive quiz interface with real-time progress
- Four-option multiple choice questions
- Explanations for correct answers
- Instant score calculation
- Points awarded based on performance
- Quiz history tracking

### 2. Study Materials

#### Creating Study Content
1. Go to **Dashboard → Study Materials**
2. Select subject and chapter
3. Choose difficulty level
4. Click "Generate Study Material"
5. AI generates 3 comprehensive study materials:
   - Detailed notes and summaries
   - Key concepts and definitions
   - Study tips and common mistakes

#### Using Study Materials
- Read at your own pace
- Materials include examples and explanations
- Estimated reading times provided
- Organized with clear structure

### 3. Progress Tracking

View your learning statistics:
- Quiz completion count
- Average performance percentage
- Total points earned
- Progress per subject
- Study streak tracking

### 4. Points & Achievements System

**Point Allocation:**
- 100% Score: 50 points
- 80-99% Score: 40 points
- 60-79% Score: 30 points
- 40-59% Score: 20 points
- Below 40%: 10 points

**Achievements:**
- Unlocked automatically based on performance
- Displayed in dashboard
- Earn badges for milestones

## 🏗️ Project Structure

```
Kalika/
├── app/
│   ├── api/
│   │   ├── auth/                # Authentication endpoints
│   │   ├── quiz/
│   │   │   ├── route.ts        # Get quiz results
│   │   │   ├── generate/       # Generate quizzes (AI)
│   │   │   └── submit/         # Submit quiz answers
│   │   ├── content/
│   │   │   └── generate/       # Generate study materials (AI)
│   │   ├── progress/           # Track user progress
│   │   └── user/               # User management
│   └── dashboard/
│       ├── quizzes/            # Quiz interface
│       ├── study-materials/    # Study content viewer
│       ├── progress/           # Progress dashboard
│       └── ...
├── components/
│   ├── dashboard/
│   │   └── quiz/
│   │       └── quiz-taker.tsx  # Interactive quiz component
│   └── ui/                     # UI components (Radix UI)
├── lib/
│   └── db.ts                   # Database connection
├── scripts/
│   ├── init-db.js              # Database initialization
│   ├── populate-quizzes.js     # Sample data population
│   └── ...
└── data/
    └── *-syllabus.json         # Course syllabi
```

## 🗄️ Database Schema

### Key Tables

**users**
- User authentication and profile information
- Stores password hashes securely
- Links to all other user data

**quiz_questions**
- AI-generated quiz questions
- Includes options, correct answers, and explanations
- Tagged by subject, chapter, topic, and difficulty

**quiz_results**
- User quiz attempts and scores
- Tracks performance over time
- Links to user progress

**study_content**
- AI-generated study materials
- Includes content type and difficulty
- Estimated reading/study time

**progress**
- User progress per subject/chapter
- Points and percentage completion

**achievements**
- User achievements and badges
- Tracks milestone completions

## 🤖 AI Integration

### Models Used
- **Quiz Generation**: NVIDIA Nemotron-3-Super-120B
- **Study Materials**: NVIDIA Nemotron-3-Super-120B
- **API Provider**: OpenRouter

### How AI Works

**Quiz Generation:**
1. Takes subject, chapter, topic, and difficulty
2. Uses curriculum context from syllabus
3. Generates high-quality multiple-choice questions
4. Creates explanations for answers

**Study Content Generation:**
1. Creates comprehensive study notes
2. Includes key concepts and definitions
3. Adds practice problems and tips
4. Estimates study time required

## 📊 API Endpoints

### Quiz APIs
- `POST /api/quiz/generate` - Generate new quiz
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz?user_id=xxx` - Get user's quiz history

### Study Content APIs
- `POST /api/content/generate` - Generate study material
- `GET /api/content?subject=xxx&chapter=xxx` - Get study materials

### User APIs
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/user/profile` - Get user profile

### Progress APIs
- `GET /api/progress?user_id=xxx` - Get user progress

## ⚙️ Configuration

### Subjects & Chapters

The platform supports these subjects:

**Mathematics**
- Real Numbers
- Polynomials
- Linear Equations
- Quadratic Equations
- Arithmetic Progressions
- ... (and more from syllabus)

**Physics**
- Motion
- Forces
- Energy
- Waves
- ... (and more)

**Chemistry**
- Atomic Structure
- Chemical Bonding
- Reactions
- States of Matter

**Biology**
- Cell Biology
- Genetics
- Evolution
- Ecology

### Difficulty Levels
- **Easy**: Basic understanding, simple problems
- **Medium**: Application of concepts, moderate problems
- **Hard**: Complex analysis, challenging problems

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ Environment variable protection
- ✅ SSL connection to database
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ CORS protection

## 📱 Responsive Design

- Mobile-friendly interface
- Tablet optimized
- Desktop full experience
- Touch-friendly controls

## 🧪 Testing

### Manual Testing

1. **Register New User**
   - Register → Fill form → Create account

2. **Generate Quiz**
   - Dashboard → Quizzes → Create Quiz → Answer → Submit

3. **Generate Study Materials**
   - Dashboard → Study Materials → Generate → Read

4. **Check Progress**
   - Dashboard → Progress/Overview → View statistics

### Database Testing
```bash
node scripts/test-db.js
```

## 🐛 Troubleshooting

### Database Connection Failed
```
❌ Error: getaddrinfo ENOTFOUND...
```
**Solution**: Check `.env.local` has correct DATABASE_URL

### Quiz Generation Fails
```
❌ Failed to generate quiz questions
```
**Solution**: 
1. Check OPENROUTER_API_KEY in .env.local
2. Verify API key is valid
3. Check internet connection

### Port Already in Use
```
⚠ Port 3000 is in use
```
**Solution**: Server will use 3001 automatically or stop the process using port 3000

## 📈 Performance Tips

1. **Caching**: Study materials are cached in database
2. **Lazy Loading**: Components load on demand
3. **Optimized Images**: Compressed and responsive
4. **Database Indexes**: Optimized queries

## 🎯 Future Enhancements

- Video content support
- Live doubt-clearing sessions
- Group study features
- Personalized recommendations
- Offline mode
- Mobile app (React Native)
- Voice/video practice
- Peer comparison (anonymous)

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review database logs: `scripts/` directory
3. Check browser console for frontend errors
4. Review server logs for backend errors

## 📄 License

Proprietary - Kalika Educational Platform

## 🙏 Credits

Built with:
- **Next.js** - React Framework
- **Tailwind CSS** - Styling
- **Radix UI** - Component Library
- **PostgreSQL** - Database
- **OpenRouter** - AI API
- **NVIDIA** - AI Models

---

**Version**: 1.0.0  
**Last Updated**: April 2025

Happy Learning! 📚✨
