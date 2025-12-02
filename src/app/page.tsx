import { query } from '@/lib/db';
import { StatsCard } from '@/components/stats-card';
import { WorkoutCard } from '@/components/workout-card';
import { GoalProgress } from '@/components/goal-progress';
import { AchievementBadge } from '@/components/achievement-badge';
import { WorkoutSession, UserGoalWithDetails, UserAchievementWithDetails } from '@/lib/types';

// Hardcoded user ID for demo (Jack)
const CURRENT_USER_ID = 1;

export default function Dashboard() {
  // Get stats
  const workoutCount = query<{ count: number }>(
    'SELECT COUNT(*) as count FROM workout_session WHERE U_id = ?',
    [CURRENT_USER_ID]
  )[0]?.count || 0;

  const goalCount = query<{ count: number }>(
    'SELECT COUNT(*) as count FROM user_goal WHERE U_id = ? AND status = ?',
    [CURRENT_USER_ID, 'active']
  )[0]?.count || 0;

  const achievementCount = query<{ count: number }>(
    'SELECT COUNT(*) as count FROM user_achievement WHERE U_id = ?',
    [CURRENT_USER_ID]
  )[0]?.count || 0;

  const totalCalories = query<{ total: number }>(
    `SELECT COALESCE(SUM(wse.calories_burned), 0) as total
     FROM workout_session_exercise wse
     JOIN workout_session ws ON wse.WS_id = ws.WS_id
     WHERE ws.U_id = ?`,
    [CURRENT_USER_ID]
  )[0]?.total || 0;

  // Get recent workouts
  const recentWorkouts = query<WorkoutSession>(
    'SELECT * FROM workout_session WHERE U_id = ? ORDER BY session_date DESC LIMIT 3',
    [CURRENT_USER_ID]
  );

  // Get active goals
  const activeGoals = query<UserGoalWithDetails>(
    `SELECT ug.*, g.title, g.description
     FROM user_goal ug
     JOIN goal g ON ug.G_id = g.G_id
     WHERE ug.U_id = ? AND ug.status = ?
     ORDER BY ug.created_at DESC LIMIT 3`,
    [CURRENT_USER_ID, 'active']
  );

  // Get recent achievements
  const recentAchievements = query<UserAchievementWithDetails>(
    `SELECT ua.*, a.code, a.title, a.description
     FROM user_achievement ua
     JOIN achievement a ON ua.Ach_id = a.Ach_id
     WHERE ua.U_id = ?
     ORDER BY ua.created_at DESC LIMIT 3`,
    [CURRENT_USER_ID]
  );

  // Get user name
  const user = query<{ fname: string }>(
    'SELECT fname FROM user WHERE U_id = ?',
    [CURRENT_USER_ID]
  )[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.fname || 'User'}!</h1>
        <p className="text-muted-foreground">Here&apos;s your fitness overview</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard title="Total Workouts" value={workoutCount} />
        <StatsCard title="Active Goals" value={goalCount} />
        <StatsCard title="Achievements" value={achievementCount} />
        <StatsCard title="Calories Burned" value={totalCalories.toLocaleString()} />
      </div>

      {/* Recent Workouts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Workouts</h2>
        {recentWorkouts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {recentWorkouts.map((workout) => (
              <WorkoutCard key={workout.WS_id} workout={workout} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No workouts yet. Start logging!</p>
        )}
      </div>

      {/* Active Goals */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Active Goals</h2>
        {activeGoals.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {activeGoals.map((goal) => (
              <GoalProgress key={`${goal.U_id}-${goal.G_id}`} goal={goal} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No active goals. Set some goals!</p>
        )}
      </div>

      {/* Recent Achievements */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
        {recentAchievements.length > 0 ? (
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <AchievementBadge
                key={`${achievement.U_id}-${achievement.Ach_id}`}
                achievement={achievement}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No achievements yet. Keep working out!</p>
        )}
      </div>
    </div>
  );
}
