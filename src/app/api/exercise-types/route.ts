import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ExerciseType } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const exerciseTypes = query<ExerciseType>(
    'SELECT * FROM exercise_type ORDER BY name'
  );

  return NextResponse.json(exerciseTypes);
}
