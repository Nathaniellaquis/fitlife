import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
  }

  try {
    // Get stats
    const workoutCountResult = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM workout_session WHERE U_id = ?',
      [userId]
    );
    const workoutCount = workoutCountResult[0]?.count || 0;

    const goalCountResult = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM user_goal WHERE U_id = ? AND status = ?',
      [userId, 'active']
    );
    const goalCount = goalCountResult[0]?.count || 0;

    const achievementCountResult = await query<{ count: number }>(
      'SELECT COUNT(*) as count FROM user_achievement WHERE U_id = ?',
      [userId]
    );
    const achievementCount = achievementCountResult[0]?.count || 0;

    const totalCaloriesResult = await query<{ total: number }>(
      `SELECT COALESCE(SUM(wse.calories_burned), 0) as total
       FROM workout_session_exercise wse
       JOIN workout_session ws ON wse.WS_id = ws.WS_id
       WHERE ws.U_id = ?`,
      [userId]
    );
    const totalCalories = totalCaloriesResult[0]?.total || 0;

    // Get recent workouts with exercise count and calories
    const recentWorkouts = await query<{
      WS_id: number;
      session_date: string;
      notes: string;
      created_at: string;
      exercise_count: number;
      total_calories: number;
    }>(
      `SELECT
        ws.WS_id,
        ws.session_date,
        ws.notes,
        ws.created_at,
        COUNT(wse.ET_id) as exercise_count,
        COALESCE(SUM(wse.calories_burned), 0) as total_calories
       FROM workout_session ws
       LEFT JOIN workout_session_exercise wse ON ws.WS_id = wse.WS_id
       WHERE ws.U_id = ?
       GROUP BY ws.WS_id
       ORDER BY ws.session_date DESC LIMIT 3`,
      [userId]
    );

    // Get active goals
    const activeGoals = await query<{
      U_id: number;
      G_id: number;
      target_value: number;
      current_value: number;
      status: string;
      title: string;
      description: string;
    }>(
      `SELECT ug.U_id, ug.G_id, ug.target_value, ug.current_value, ug.status, g.title, g.description
       FROM user_goal ug
       JOIN goal g ON ug.G_id = g.G_id
       WHERE ug.U_id = ? AND ug.status = ?
       ORDER BY (CAST(ug.current_value AS FLOAT) / ug.target_value) DESC LIMIT 3`,
      [userId, 'active']
    );

    // Get recent achievements
    const recentAchievements = await query<{
      U_id: number;
      Ach_id: number;
      created_at: string;
      code: string;
      title: string;
      description: string;
    }>(
      `SELECT ua.U_id, ua.Ach_id, ua.created_at, a.code, a.title, a.description
       FROM user_achievement ua
       JOIN achievement a ON ua.Ach_id = a.Ach_id
       WHERE ua.U_id = ?
       ORDER BY ua.created_at DESC LIMIT 3`,
      [userId]
    );

    // Get user name and fitness level
    const userResult = await query<{ fname: string; lname: string; fitness_level: string }>(
      `SELECT u.fname, u.lname, a.fitness_level
       FROM "user" u
       LEFT JOIN athlete a ON u.U_id = a.A_id
       WHERE u.U_id = ?`,
      [userId]
    );
    const user = userResult[0];

    // Get this week's workout count
    const weekWorkoutsResult = await query<{ count: number }>(
      `SELECT COUNT(*) as count FROM workout_session
       WHERE U_id = ? AND session_date >= date('now', '-7 days')`,
      [userId]
    );
    const weekWorkouts = weekWorkoutsResult[0]?.count || 0;

    return NextResponse.json({
      stats: {
        workoutCount,
        goalCount,
        achievementCount,
        totalCalories,
        weekWorkouts,
      },
      recentWorkouts,
      activeGoals,
      recentAchievements,
      userName: user?.fname || 'User',
      userFullName: user ? `${user.fname} ${user.lname}` : 'User',
      fitnessLevel: user?.fitness_level || 'Beginner',
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({
      stats: {
        workoutCount: 0,
        goalCount: 0,
        achievementCount: 0,
        totalCalories: 0,
        weekWorkouts: 0,
      },
      recentWorkouts: [],
      activeGoals: [],
      recentAchievements: [],
      userName: 'User',
      userFullName: 'User',
      fitnessLevel: 'Beginner',
    });
  }
}
