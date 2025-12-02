import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { queryOne, run } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { fname, lname, email, password } = await request.json();

    // Check if email already exists
    const existing = await queryOne<{ u_id: number }>(
      'SELECT u_id FROM "user" WHERE email = $1',
      [email]
    );

    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Create user
    const result = await run(
      `INSERT INTO "user" (email, password, fname, lname) VALUES ($1, $2, $3, $4) RETURNING u_id`,
      [email, password, fname, lname]
    );

    const userId = result.lastInsertRowid;

    if (!userId) {
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }

    // Also create athlete record for the new user
    await run(
      `INSERT INTO athlete (a_id, fitness_level) VALUES ($1, $2)`,
      [userId, 'Beginner']
    );

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('user_id', userId.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json({ success: true, user: { id: userId, fname } });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 });
  }
}
