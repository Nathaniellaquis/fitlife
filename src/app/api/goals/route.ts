import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Goal } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const goals = query<Goal>('SELECT * FROM goal ORDER BY title');
  return NextResponse.json(goals);
}
