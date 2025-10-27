import { NextRequest, NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    console.log('🔐 Registration attempt...');
    
    // Test database connection first
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Database connection failed during registration');
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const { name, email, password, class: studentClass } = await req.json();
    
    // Validate input
    if (!name || !email || !password || !studentClass) {
      console.log('❌ Missing fields in registration:', { name: !!name, email: !!email, password: !!password, class: !!studentClass });
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    console.log('🔍 Checking if user exists:', email);
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if ((existing?.rowCount ?? 0) > 0) {
      console.log('❌ Email already registered:', email);
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

  // Hash password and create user
  console.log('🔐 Hashing password...');
  const password_hash = await (bcrypt.hash as any)(password, 10);
    
    console.log('📝 Creating new user...');
    await query(
      'INSERT INTO users (name, email, password_hash, class) VALUES ($1, $2, $3, $4)',
      [name, email, password_hash, studentClass]
    );
    
    console.log('✅ User registered successfully:', email);
    return NextResponse.json({ success: true, message: 'Registration successful' });
    
  } catch (error: any) {
    console.error('❌ Registration error:', error);
    return NextResponse.json({ 
      error: 'Server error during registration',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
} 