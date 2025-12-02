'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const CURRENT_USER_ID = 1;

interface UserGoal {
  U_id: number;
  G_id: number;
  target_value: number;
  current_value: number;
  status: string;
  title: string;
  description: string;
}

interface Goal {
  G_id: number;
  title: string;
  description: string;
}

export default function GoalsPage() {
  const [userGoals, setUserGoals] = useState<UserGoal[]>([]);
  const [goalCatalog, setGoalCatalog] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [targetValue, setTargetValue] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [goalsRes, catalogRes] = await Promise.all([
        fetch(`/api/user-goals?user_id=${CURRENT_USER_ID}`),
        fetch('/api/goals')
      ]);
      setUserGoals(await goalsRes.json());
      setGoalCatalog(await catalogRes.json());
    } catch (error) {
      console.error('Failed to fetch goals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddGoal(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/user-goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        U_id: CURRENT_USER_ID,
        G_id: parseInt(selectedGoal),
        target_value: parseFloat(targetValue),
        status: 'active',
      }),
    });

    if (res.ok) {
      toast.success('Goal added!');
      setIsOpen(false);
      setSelectedGoal('');
      setTargetValue('');
      fetchData();
    } else {
      toast.error('Failed to add goal');
    }
  }

  async function handleUpdateProgress(goal: UserGoal, newValue: number) {
    const res = await fetch('/api/user-goals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        U_id: goal.U_id,
        G_id: goal.G_id,
        current_value: newValue,
        status: newValue >= goal.target_value ? 'completed' : 'active',
      }),
    });

    if (res.ok) {
      toast.success('Progress updated!');
      fetchData();
    }
  }

  const availableGoals = goalCatalog.filter(
    (g) => !userGoals.some((ug) => ug.G_id === g.G_id)
  );

  const activeGoals = userGoals.filter((g) => g.status === 'active');
  const completedGoals = userGoals.filter((g) => g.status === 'completed');

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Goals 🎯</h1>
          <p className="text-muted-foreground mt-1">
            {activeGoals.length} active • {completedGoals.length} completed
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={availableGoals.length === 0}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25"
            >
              + Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Add New Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="space-y-2">
                <Label>Choose a Goal</Label>
                <Select value={selectedGoal} onValueChange={setSelectedGoal} required>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGoals.map((g) => (
                      <SelectItem key={g.G_id} value={g.G_id.toString()}>
                        {g.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Target Value</Label>
                <Input
                  id="target"
                  type="number"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  placeholder="e.g., 10, 200, 30"
                  className="h-11"
                  required
                />
              </div>
              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                Add Goal
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Active Goals
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeGoals.map((goal) => {
              const progress = Math.min((goal.current_value / goal.target_value) * 100, 100);
              const isClose = progress >= 80;
              return (
                <Card key={`${goal.U_id}-${goal.G_id}`} className="border-0 shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
                  <CardContent className="p-6 relative">
                    {/* Progress Ring */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="relative w-20 h-20">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            className="text-muted/20"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="url(#gradient)"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${progress * 2.26} 226`}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold">{Math.round(progress)}%</span>
                        </div>
                      </div>
                      {isClose && (
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 border-0">
                          Almost there!
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-bold text-lg mb-1">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{goal.description}</p>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{goal.current_value} / {goal.target_value}</span>
                      </div>
                      <Progress value={progress} className="h-2" />

                      <div className="flex gap-2 pt-2">
                        <Input
                          type="number"
                          placeholder="New value"
                          className="flex-1 h-9"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const value = parseFloat((e.target as HTMLInputElement).value);
                              if (!isNaN(value)) {
                                handleUpdateProgress(goal, value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateProgress(goal, goal.target_value)}
                          className="h-9"
                        >
                          Complete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Completed Goals
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {completedGoals.map((goal) => (
              <Card key={`${goal.U_id}-${goal.G_id}`} className="border-0 shadow-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-lg">
                      ✓
                    </div>
                    <Badge className="bg-green-500 border-0">Completed</Badge>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{goal.title}</h3>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {userGoals.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-4">Set your first fitness goal!</p>
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              Add Your First Goal
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
