import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { UserAchievementWithDetails } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  let sql = `
    SELECT ua.*, a.code, a.title, a.description
    FROM user_achievement ua
    JOIN achievement a ON ua.Ach_id = a.Ach_id
  `;
  const params: unknown[] = [];

  if (userId) {
    sql += ' WHERE ua.U_id = ?';
    params.push(userId);
  }

  sql += ' ORDER BY ua.created_at DESC';

  const userAchievements = query<UserAchievementWithDetails>(sql, params);
  return NextResponse.json(userAchievements);
}
