import { NextRequest, NextResponse } from 'next/server';
import { query, run } from '@/lib/db';
import { WorkoutSession } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  let sql = 'SELECT * FROM workout_session';
  const params: unknown[] = [];

  if (userId) {
    sql += ' WHERE U_id = ?';
    params.push(userId);
  }

  sql += ' ORDER BY session_date DESC';

  const workouts = await query<WorkoutSession>(sql, params);
  return NextResponse.json(workouts);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { U_id, session_date, notes } = body;

  const result = await run(
    'INSERT INTO workout_session (U_id, session_date, notes) VALUES (?, ?, ?)',
    [U_id, session_date, notes]
  );

  return NextResponse.json({ success: true, WS_id: result.lastInsertRowid });
}
