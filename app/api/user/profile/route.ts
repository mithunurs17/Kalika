import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 });
    const userRes = await query('SELECT id, name, email, class FROM users WHERE email = $1', [email]);
    if (userRes.rowCount === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const user = userRes.rows[0];
    const picRes = await query('SELECT image_url FROM profile_pictures WHERE user_id = $1 ORDER BY uploaded_at DESC LIMIT 1', [user.id]);
    const profile_picture = picRes.rowCount > 0 ? picRes.rows[0].image_url : null;
    return NextResponse.json({ ...user, profile_picture });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 