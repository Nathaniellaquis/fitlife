'use client';

import { useState, useEffect } from 'react';
import { WorkoutCard } from '@/components/workout-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { WorkoutSession } from '@/lib/types';
import { toast } from 'sonner';

const CURRENT_USER_ID = 1;

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionDate, setSessionDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  async function fetchWorkouts() {
    const res = await fetch(`/api/workouts?user_id=${CURRENT_USER_ID}`);
    const data = await res.json();
    setWorkouts(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        U_id: CURRENT_USER_ID,
        session_date: sessionDate,
        notes,
      }),
    });

    if (res.ok) {
      toast.success('Workout logged!');
      setIsOpen(false);
      setSessionDate('');
      setNotes('');
      fetchWorkouts();
    } else {
      toast.error('Failed to log workout');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Workouts</h1>
          <p className="text-muted-foreground">Track your workout sessions</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Log Workout</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log New Workout</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={sessionDate}
                  onChange={(e) => setSessionDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="What did you work on?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">Save Workout</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {workouts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.WS_id} workout={workout} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No workouts yet. Start logging!</p>
      )}
    </div>
  );
}
