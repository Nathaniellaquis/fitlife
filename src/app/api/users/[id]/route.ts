import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, run } from '@/lib/db';
import { User, Athlete, Trainer, UserWithDetails } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = queryOne<User>(
    'SELECT * FROM user WHERE U_id = ?',
    [id]
  );

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const athlete = queryOne<Athlete>(
    'SELECT * FROM athlete WHERE A_id = ?',
    [id]
  );

  const trainer = queryOne<Trainer>(
    'SELECT * FROM trainer WHERE T_id = ?',
    [id]
  );

  const result: UserWithDetails = {
    ...user,
    athlete: athlete ?? undefined,
    trainer: trainer ?? undefined,
  };

  return NextResponse.json(result);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const { fname, lname, phone, dob, gender } = body;

  run(
    `UPDATE user SET
      fname = COALESCE(?, fname),
      lname = COALESCE(?, lname),
      phone = COALESCE(?, phone),
      dob = COALESCE(?, dob),
      gender = COALESCE(?, gender),
      updated_at = CURRENT_TIMESTAMP
    WHERE U_id = ?`,
    [fname, lname, phone, dob, gender, id]
  );

  const user = queryOne<User>('SELECT * FROM user WHERE U_id = ?', [id]);
  return NextResponse.json(user);
}
