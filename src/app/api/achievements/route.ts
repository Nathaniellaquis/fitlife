import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Achievement } from '@/lib/types';

export async function GET() {
  const achievements = query<Achievement>('SELECT * FROM achievement ORDER BY title');
  return NextResponse.json(achievements);
}
