import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { queryOne } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = await queryOne<{ u_id: number; email: string; password: string; fname: string }>(
      'SELECT u_id, email, password, fname FROM "user" WHERE email = $1',
      [email]
    );

    if (!user || user.password !== password) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set('user_id', user.u_id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json({ success: true, user: { id: user.u_id, fname: user.fname } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
