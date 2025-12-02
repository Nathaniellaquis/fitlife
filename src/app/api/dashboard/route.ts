import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { WorkoutSession, UserGoalWithDetails, UserAchievementWithDetails } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
  }

  try {
    // Get stats
    const workoutCount = query<{ count: number }>(
      'SELECT COUNT(*) as count FROM workout_session WHERE U_id = ?',
      [userId]
    )[0]?.count || 0;

    const goalCount = query<{ count: number }>(
      'SELECT COUNT(*) as count FROM user_goal WHERE U_id = ? AND status = ?',
      [userId, 'active']
    )[0]?.count || 0;

    const achievementCount = query<{ count: number }>(
      'SELECT COUNT(*) as count FROM user_achievement WHERE U_id = ?',
      [userId]
    )[0]?.count || 0;

    const totalCalories = query<{ total: number }>(
      `SELECT COALESCE(SUM(wse.calories_burned), 0) as total
       FROM workout_session_exercise wse
       JOIN workout_session ws ON wse.WS_id = ws.WS_id
       WHERE ws.U_id = ?`,
      [userId]
    )[0]?.total || 0;

    // Get recent workouts
    const recentWorkouts = query<WorkoutSession>(
      'SELECT * FROM workout_session WHERE U_id = ? ORDER BY session_date DESC LIMIT 3',
      [userId]
    );

    // Get active goals
    const activeGoals = query<UserGoalWithDetails>(
      `SELECT ug.*, g.title, g.description
       FROM user_goal ug
       JOIN goal g ON ug.G_id = g.G_id
       WHERE ug.U_id = ? AND ug.status = ?
       ORDER BY ug.created_at DESC LIMIT 3`,
      [userId, 'active']
    );

    // Get recent achievements
    const recentAchievements = query<UserAchievementWithDetails>(
      `SELECT ua.*, a.code, a.title, a.description
       FROM user_achievement ua
       JOIN achievement a ON ua.Ach_id = a.Ach_id
       WHERE ua.U_id = ?
       ORDER BY ua.created_at DESC LIMIT 3`,
      [userId]
    );

    // Get user name
    const user = query<{ fname: string }>(
      'SELECT fname FROM user WHERE U_id = ?',
      [userId]
    )[0];

    return NextResponse.json({
      stats: {
        workoutCount,
        goalCount,
        achievementCount,
        totalCalories,
      },
      recentWorkouts,
      activeGoals,
      recentAchievements,
      userName: user?.fname || 'User',
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    // Return empty data if database isn't available
    return NextResponse.json({
      stats: {
        workoutCount: 0,
        goalCount: 0,
        achievementCount: 0,
        totalCalories: 0,
      },
      recentWorkouts: [],
      activeGoals: [],
      recentAchievements: [],
      userName: 'User',
    });
  }
}

