'use client';

import { useState, useEffect } from 'react';
import { GoalProgress } from '@/components/goal-progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserGoalWithDetails, Goal } from '@/lib/types';
import { toast } from 'sonner';

const CURRENT_USER_ID = 1;

export default function GoalsPage() {
  const [userGoals, setUserGoals] = useState<UserGoalWithDetails[]>([]);
  const [goalCatalog, setGoalCatalog] = useState<Goal[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Form state
  const [selectedGoal, setSelectedGoal] = useState('');
  const [targetValue, setTargetValue] = useState('');

  useEffect(() => {
    fetchUserGoals();
    fetchGoalCatalog();
  }, []);

  async function fetchUserGoals() {
    const res = await fetch(`/api/user-goals?user_id=${CURRENT_USER_ID}`);
    const data = await res.json();
    setUserGoals(data);
  }

  async function fetchGoalCatalog() {
    const res = await fetch('/api/goals');
    const data = await res.json();
    setGoalCatalog(data);
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
      fetchUserGoals();
    } else {
      const error = await res.json();
      toast.error(error.error || 'Failed to add goal');
    }
  }

  async function handleUpdateProgress(goal: UserGoalWithDetails, newValue: number) {
    const res = await fetch('/api/user-goals', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        U_id: goal.U_id,
        G_id: goal.G_id,
        current_value: newValue,
        status: newValue >= (goal.target_value || 0) ? 'completed' : 'active',
      }),
    });

    if (res.ok) {
      toast.success('Progress updated!');
      fetchUserGoals();
    }
  }

  // Filter out goals user already has
  const availableGoals = goalCatalog.filter(
    (g) => !userGoals.some((ug) => ug.G_id === g.G_id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Goals</h1>
          <p className="text-muted-foreground">Track your fitness goals</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button disabled={availableGoals.length === 0}>Add Goal</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Goal</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="space-y-2">
                <Label>Goal</Label>
                <Select value={selectedGoal} onValueChange={setSelectedGoal} required>
                  <SelectTrigger>
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
                  required
                />
              </div>
              <Button type="submit" className="w-full">Add Goal</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {userGoals.length > 0 ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Active Goals</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userGoals
                .filter((g) => g.status === 'active')
                .map((goal) => (
                  <div key={`${goal.U_id}-${goal.G_id}`} className="space-y-2">
                    <GoalProgress goal={goal} />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Update progress"
                        className="flex-1"
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
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateProgress(goal, goal.target_value || 0)}
                      >
                        Complete
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {userGoals.some((g) => g.status === 'completed') && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Completed Goals</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userGoals
                  .filter((g) => g.status === 'completed')
                  .map((goal) => (
                    <GoalProgress key={`${goal.U_id}-${goal.G_id}`} goal={goal} />
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">No goals yet. Add some goals to track!</p>
      )}
    </div>
  );
}
