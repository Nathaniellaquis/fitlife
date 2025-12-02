import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const user = await queryOne<{ u_id: number; email: string; fname: string; lname: string }>(
      'SELECT u_id, email, fname, lname FROM "user" WHERE u_id = $1',
      [userId]
    );

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.u_id,
        email: user.email,
        fname: user.fname,
        lname: user.lname
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ user: null });
  }
}
