import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, run } from '@/lib/db';
import { WorkoutSession, WorkoutWithExercises } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const workout = await queryOne<WorkoutSession>(
    'SELECT * FROM workout_session WHERE WS_id = ?',
    [id]
  );

  if (!workout) {
    return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
  }

  const exercises = await query<{ WS_id: number; ET_id: number; exercise_order: number; sets: number; reps: number; duration_min: number; weight: number; calories_burned: number; created_at: string; completed_at: string; name: string; target_muscle_group: string }>(
    `SELECT wse.*, et.name, et.target_muscle_group
     FROM workout_session_exercise wse
     JOIN exercise_type et ON wse.ET_id = et.ET_id
     WHERE wse.WS_id = ?
     ORDER BY wse.exercise_order`,
    [id]
  );

  const result: WorkoutWithExercises = {
    ...workout,
    exercises,
  };

  return NextResponse.json(result);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { session_date, notes } = body;

  await run(
    `UPDATE workout_session SET
      session_date = COALESCE(?, session_date),
      notes = COALESCE(?, notes)
    WHERE WS_id = ?`,
    [session_date, notes, id]
  );

  const workout = await queryOne<WorkoutSession>('SELECT * FROM workout_session WHERE WS_id = ?', [id]);
  return NextResponse.json(workout);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await run('DELETE FROM workout_session WHERE WS_id = ?', [id]);
  return NextResponse.json({ success: true });
}
