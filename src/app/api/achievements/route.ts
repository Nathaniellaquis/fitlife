import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Achievement } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const achievements = await query<Achievement>('SELECT * FROM achievement ORDER BY title');
  return NextResponse.json(achievements);
}
