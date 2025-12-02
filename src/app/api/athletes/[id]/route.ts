import { NextRequest, NextResponse } from 'next/server';
import { queryOne, run } from '@/lib/db';
import { Athlete } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const athlete = queryOne<Athlete>(
    'SELECT * FROM athlete WHERE A_id = ?',
    [id]
  );

  if (!athlete) {
    return NextResponse.json({ error: 'Athlete not found' }, { status: 404 });
  }

  return NextResponse.json(athlete);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { fitness_level } = body;

  run(
    'UPDATE athlete SET fitness_level = COALESCE(?, fitness_level) WHERE A_id = ?',
    [fitness_level, id]
  );

  const athlete = queryOne<Athlete>('SELECT * FROM athlete WHERE A_id = ?', [id]);
  return NextResponse.json(athlete);
}
