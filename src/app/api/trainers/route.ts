import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { TrainerWithUser } from '@/lib/types';

export async function GET() {
  const trainers = query<TrainerWithUser>(
    `SELECT t.*, u.fname, u.lname, u.email
     FROM trainer t
     JOIN user u ON t.T_id = u.U_id`
  );

  return NextResponse.json(trainers);
}
