# Database Setup Guide for Kalika

## Prerequisites

1. **Neon Database Account**: Sign up at [neon.tech](https://neon.tech) for a free PostgreSQL database
2. **Node.js**: Make sure you have Node.js installed

## Step 1: Create Neon Database

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string (it looks like: `postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/database?sslmode=require`)

## Step 2: Configure Environment Variables

1. Open the `.env.local` file in your project root
2. Replace the placeholder with your actual Neon connection string:

```env
DATABASE_URL=postgresql://your-username:your-password@ep-xxx-xxx-xxx.region.aws.neon.tech/your-database?sslmode=require
```

## Step 3: Initialize Database Tables

1. Open your Neon SQL Editor or use any PostgreSQL client
2. Copy and paste the contents of `scripts/init-db.sql`
3. Run the script to create all necessary tables

## Step 4: Test Database Connection

Run the database test script:

```bash
node scripts/test-db.js
```

You should see:
```
🔍 Testing database connection...
📡 Testing connection...
✅ Connection successful: { current_time: '2024-01-01T12:00:00.000Z' }
📋 Checking tables...
📊 Found tables: ['users', 'progress', 'study_sessions', 'quiz_results', 'achievements', 'profile_pictures']
👥 Testing users table...
✅ Users table accessible, count: 1
📈 Testing progress table...
✅ Progress table accessible, count: 3
🎉 All database tests passed!
```

## Step 5: Start the Application

```bash
npm run dev
```

You should see database connection messages in the terminal:
```
✅ Connected to PostgreSQL database
```

## Troubleshooting

### "DATABASE_URL environment variable is not set"
- Make sure you have a `.env.local` file in your project root
- Check that the `DATABASE_URL` is correctly formatted
- Restart your development server after adding the environment variable

### "Database connection failed"
- Verify your Neon connection string is correct
- Check that your Neon database is active
- Ensure you're using the correct SSL settings

### "Table does not exist"
- Run the `scripts/init-db.sql` script in your Neon SQL Editor
- Check that all tables were created successfully

### "Authentication failed"
- Verify your username and password in the connection string
- Make sure you're using the correct database name

## Database Schema

The application uses the following tables:

- **users**: User accounts and authentication
- **progress**: Subject and chapter progress tracking
- **study_sessions**: Study session history
- **quiz_results**: Quiz scores and results
- **achievements**: User achievements and badges
- **profile_pictures**: User profile images

## Support

If you're still having issues:
1. Check the terminal output for specific error messages
2. Verify your Neon database is running
3. Test the connection using the provided test script
4. Check that all required packages are installed (`npm install`) 