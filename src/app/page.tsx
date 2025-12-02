'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatsCard } from '@/components/stats-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';

interface Workout {
  WS_id: number;
  session_date: string;
  notes: string;
  exercise_count: number;
  total_calories: number;
}

interface Goal {
  U_id: number;
  G_id: number;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  status: string;
}

interface Achievement {
  U_id: number;
  Ach_id: number;
  code: string;
  title: string;
  description: string;
  created_at: string;
}

interface DashboardData {
  stats: {
    workoutCount: number;
    goalCount: number;
    achievementCount: number;
    totalCalories: number;
    weekWorkouts: number;
  };
  recentWorkouts: Workout[];
  activeGoals: Goal[];
  recentAchievements: Achievement[];
  userName: string;
  fitnessLevel: string;
}

const achievementIcons: Record<string, string> = {
  FIRST_WORKOUT: '🎉',
  WEEK_STREAK: '🔥',
  MONTH_STREAK: '💎',
  EARLY_BIRD: '🌅',
  NIGHT_OWL: '🦉',
  GOAL_CRUSHER: '🏆',
  FIVE_GOALS: '⭐',
  SOCIAL_BUTTERFLY: '🦋',
  CALORIE_BURNER: '🔥',
  CONSISTENT: '📅',
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      if (!user) return;
      try {
        const res = await fetch(`/api/dashboard?user_id=${user.id}`);
        const dashboardData = await res.json();
        setData(dashboardData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="text-6xl">😕</div>
        <h1 className="text-2xl font-bold">Unable to load dashboard</h1>
        <p className="text-muted-foreground">Please try refreshing the page.</p>
      </div>
    );
  }

  const { stats, recentWorkouts, activeGoals, recentAchievements, userName, fitnessLevel } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Hey, {userName}! <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Let&apos;s crush your fitness goals today
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1.5 text-sm">
            {fitnessLevel}
          </Badge>
          <Link href="/workouts">
            <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg shadow-orange-500/25">
              + Log Workout
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Workouts"
          value={stats.workoutCount}
          description={`${stats.weekWorkouts} this week`}
          gradient="orange"
          icon={<span className="text-2xl">💪</span>}
        />
        <StatsCard
          title="Active Goals"
          value={stats.goalCount}
          description="Keep pushing!"
          gradient="blue"
          icon={<span className="text-2xl">🎯</span>}
        />
        <StatsCard
          title="Achievements"
          value={stats.achievementCount}
          description="Badges earned"
          gradient="purple"
          icon={<span className="text-2xl">🏆</span>}
        />
        <StatsCard
          title="Calories Burned"
          value={stats.totalCalories.toLocaleString()}
          description="Total burned"
          gradient="green"
          icon={<span className="text-2xl">🔥</span>}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Workouts */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Recent Workouts</CardTitle>
            <Link href="/workouts">
              <Button variant="ghost" size="sm">View All →</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentWorkouts.length > 0 ? (
              recentWorkouts.map((workout) => (
                <Link key={workout.WS_id} href={`/workouts/${workout.WS_id}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                        {formatDate(workout.session_date).split(' ')[1]}
                      </div>
                      <div>
                        <p className="font-semibold group-hover:text-orange-500 transition-colors">
                          {workout.notes || 'Workout Session'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {workout.exercise_count} exercises • {formatDate(workout.session_date)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-orange-500">{workout.total_calories}</p>
                      <p className="text-xs text-muted-foreground">calories</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🏃</div>
                <p className="text-muted-foreground">No workouts yet</p>
                <Link href="/workouts">
                  <Button variant="link" className="mt-2">Start your first workout →</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Goals */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Active Goals</CardTitle>
            <Link href="/goals">
              <Button variant="ghost" size="sm">View All →</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeGoals.length > 0 ? (
              activeGoals.map((goal) => {
                const progress = Math.min((goal.current_value / goal.target_value) * 100, 100);
                return (
                  <div key={`${goal.U_id}-${goal.G_id}`} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{goal.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {goal.current_value} / {goal.target_value}
                        </p>
                      </div>
                      <Badge
                        variant={progress >= 100 ? "default" : "secondary"}
                        className={progress >= 100 ? "bg-green-500" : ""}
                      >
                        {Math.round(progress)}%
                      </Badge>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-muted-foreground">No active goals</p>
                <Link href="/goals">
                  <Button variant="link" className="mt-2">Set your first goal →</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-bold">Recent Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAchievements.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-3">
              {recentAchievements.map((achievement) => (
                <div
                  key={`${achievement.U_id}-${achievement.Ach_id}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
                    {achievementIcons[achievement.code] || '🏅'}
                  </div>
                  <div>
                    <p className="font-bold">{achievement.title}</p>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-muted-foreground">Complete workouts to earn achievements!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
