import { NextRequest, NextResponse } from 'next/server';
import { query, testConnection } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    console.log('🔐 Login attempt...');
    
    // Test database connection first
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ Database connection failed during login');
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    const { email, password } = await req.json();
    
    // Validate input
    if (!email || !password) {
      console.log('❌ Missing fields in login:', { email: !!email, password: !!password });
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user
    console.log('🔍 Looking up user:', email);
    const result = await query('SELECT id, name, email, password_hash, class FROM users WHERE email = $1', [email]);
    
    if (result.rowCount === 0) {
      console.log('❌ User not found:', email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = result.rows[0];
    
  // Verify password
  console.log('🔐 Verifying password...');
  const valid = await (bcrypt.compare as any)(password, user.password_hash);
    if (!valid) {
      console.log('❌ Invalid password for user:', email);
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Exclude password_hash from response
    const { password_hash, ...userInfo } = user;
    
    console.log('✅ Login successful:', email);
    return NextResponse.json({ 
      user: userInfo,
      message: 'Login successful'
    });
    
  } catch (error: any) {
    console.error('❌ Login error:', error);
    return NextResponse.json({ 
      error: 'Server error during login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
} 