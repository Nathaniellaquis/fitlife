import { NextRequest, NextResponse } from 'next/server';
import { query, run } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const exercises = query(
    `SELECT wse.*, et.name, et.target_muscle_group
     FROM workout_session_exercise wse
     JOIN exercise_type et ON wse.ET_id = et.ET_id
     WHERE wse.WS_id = ?
     ORDER BY wse.exercise_order`,
    [id]
  );

  return NextResponse.json(exercises);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { ET_id, exercise_order, sets, reps, duration_min, weight, calories_burned } = body;

  run(
    `INSERT INTO workout_session_exercise
     (WS_id, ET_id, exercise_order, sets, reps, duration_min, weight, calories_burned)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, ET_id, exercise_order, sets, reps, duration_min, weight, calories_burned]
  );

  return NextResponse.json({ success: true, WS_id: id, ET_id });
}
