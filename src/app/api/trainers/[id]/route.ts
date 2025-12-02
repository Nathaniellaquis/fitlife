import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';
import { TrainerWithUser } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const trainer = queryOne<TrainerWithUser>(
    `SELECT t.*, u.fname, u.lname, u.email
     FROM trainer t
     JOIN user u ON t.T_id = u.U_id
     WHERE t.T_id = ?`,
    [id]
  );

  if (!trainer) {
    return NextResponse.json({ error: 'Trainer not found' }, { status: 404 });
  }

  return NextResponse.json(trainer);
}
