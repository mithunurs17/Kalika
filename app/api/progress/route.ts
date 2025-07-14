import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get('user_id');
    if (!user_id) return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
    const res = await query('SELECT * FROM student_progress WHERE user_id = $1', [user_id]);
    return NextResponse.json({ progress: res.rows });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 