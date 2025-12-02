import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, run } from '@/lib/db';
import { UserGoalWithDetails } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  let sql = `
    SELECT ug.*, g.title, g.description
    FROM user_goal ug
    JOIN goal g ON ug.G_id = g.G_id
  `;
  const params: unknown[] = [];

  if (userId) {
    sql += ' WHERE ug.U_id = ?';
    params.push(userId);
  }

  sql += ' ORDER BY ug.created_at DESC';

  const userGoals = query<UserGoalWithDetails>(sql, params);
  return NextResponse.json(userGoals);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { U_id, G_id, target_value, current_value, status } = body;

  // Check if user already has this goal
  const existing = queryOne(
    'SELECT * FROM user_goal WHERE U_id = ? AND G_id = ?',
    [U_id, G_id]
  );

  if (existing) {
    return NextResponse.json({ error: 'User already has this goal' }, { status: 400 });
  }

  run(
    `INSERT INTO user_goal (U_id, G_id, target_value, current_value, status)
     VALUES (?, ?, ?, ?, ?)`,
    [U_id, G_id, target_value, current_value || 0, status || 'active']
  );

  return NextResponse.json({ success: true, U_id, G_id });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { U_id, G_id, target_value, current_value, status } = body;

  run(
    `UPDATE user_goal SET
      target_value = COALESCE(?, target_value),
      current_value = COALESCE(?, current_value),
      status = COALESCE(?, status),
      updated_at = CURRENT_TIMESTAMP
    WHERE U_id = ? AND G_id = ?`,
    [target_value, current_value, status, U_id, G_id]
  );

  const userGoal = queryOne<UserGoalWithDetails>(
    `SELECT ug.*, g.title, g.description
     FROM user_goal ug
     JOIN goal g ON ug.G_id = g.G_id
     WHERE ug.U_id = ? AND ug.G_id = ?`,
    [U_id, G_id]
  );

  return NextResponse.json(userGoal);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const U_id = searchParams.get('U_id');
  const G_id = searchParams.get('G_id');

  if (!U_id || !G_id) {
    return NextResponse.json({ error: 'U_id and G_id required' }, { status: 400 });
  }

  run('DELETE FROM user_goal WHERE U_id = ? AND G_id = ?', [U_id, G_id]);
  return NextResponse.json({ success: true });
}
