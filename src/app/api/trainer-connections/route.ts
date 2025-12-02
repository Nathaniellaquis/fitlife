import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, run } from '@/lib/db';
import { TrainerConnectionWithDetails } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const athleteId = searchParams.get('athlete_id');
  const trainerId = searchParams.get('trainer_id');

  let sql = `
    SELECT tc.*,
      (ua.fname || ' ' || ua.lname) as athlete_name,
      (ut.fname || ' ' || ut.lname) as trainer_name,
      t.specialty as trainer_specialty
    FROM trainer_connection tc
    JOIN "user" ua ON tc.A_id = ua.U_id
    JOIN "user" ut ON tc.T_id = ut.U_id
    JOIN trainer t ON tc.T_id = t.T_id
  `;
  const params: unknown[] = [];

  if (athleteId) {
    sql += ' WHERE tc.A_id = ?';
    params.push(athleteId);
  } else if (trainerId) {
    sql += ' WHERE tc.T_id = ?';
    params.push(trainerId);
  }

  const connections = await query<TrainerConnectionWithDetails>(sql, params);
  return NextResponse.json(connections);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { A_id, T_id, notes } = body;

  // Check if connection already exists
  const existing = await queryOne(
    'SELECT * FROM trainer_connection WHERE A_id = ? AND T_id = ?',
    [A_id, T_id]
  );

  if (existing) {
    return NextResponse.json({ error: 'Connection already exists' }, { status: 400 });
  }

  await run(
    'INSERT INTO trainer_connection (A_id, T_id, notes) VALUES (?, ?, ?)',
    [A_id, T_id, notes]
  );

  return NextResponse.json({ success: true, A_id, T_id });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const A_id = searchParams.get('A_id');
  const T_id = searchParams.get('T_id');

  if (!A_id || !T_id) {
    return NextResponse.json({ error: 'A_id and T_id required' }, { status: 400 });
  }

  await run(
    'DELETE FROM trainer_connection WHERE A_id = ? AND T_id = ?',
    [A_id, T_id]
  );

  return NextResponse.json({ success: true });
}
