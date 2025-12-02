'use client';

import { useState, useEffect } from 'react';
import { StatsCard } from '@/components/stats-card';
import { WorkoutCard } from '@/components/workout-card';
import { GoalProgress } from '@/components/goal-progress';
import { AchievementBadge } from '@/components/achievement-badge';
import { WorkoutSession, UserGoalWithDetails, UserAchievementWithDetails } from '@/lib/types';

const CURRENT_USER_ID = 1;

interface DashboardData {
  stats: {
    workoutCount: number;
    goalCount: number;
    achievementCount: number;
    totalCalories: number;
  };
  recentWorkouts: WorkoutSession[];
  activeGoals: UserGoalWithDetails[];
  recentAchievements: UserAchievementWithDetails[];
  userName: string;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch(`/api/dashboard?user_id=${CURRENT_USER_ID}`);
        const dashboardData = await res.json();
        setData(dashboardData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set default empty data on error
        setData({
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
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Loading your fitness overview...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome!</h1>
          <p className="text-muted-foreground">Unable to load dashboard data.</p>
        </div>
      </div>
    );
  }

  const { stats, recentWorkouts, activeGoals, recentAchievements, userName } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {userName}!</h1>
        <p className="text-muted-foreground">Here&apos;s your fitness overview</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard title="Total Workouts" value={stats.workoutCount} />
        <StatsCard title="Active Goals" value={stats.goalCount} />
        <StatsCard title="Achievements" value={stats.achievementCount} />
        <StatsCard title="Calories Burned" value={stats.totalCalories.toLocaleString()} />
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
