'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const CURRENT_USER_ID = 1;

interface Workout {
  WS_id: number;
  session_date: string;
  notes: string;
  created_at: string;
  exercise_count?: number;
  total_calories?: number;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function getWorkoutIcon(notes: string) {
  const lower = notes.toLowerCase();
  if (lower.includes('leg') || lower.includes('squat')) return '🦵';
  if (lower.includes('arm') || lower.includes('bicep') || lower.includes('tricep')) return '💪';
  if (lower.includes('chest') || lower.includes('bench') || lower.includes('upper')) return '🏋️';
  if (lower.includes('back')) return '🔙';
  if (lower.includes('cardio') || lower.includes('run')) return '🏃';
  if (lower.includes('core') || lower.includes('abs')) return '🧘';
  if (lower.includes('full')) return '⚡';
  return '💪';
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionDate, setSessionDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  async function fetchWorkouts() {
    try {
      const res = await fetch(`/api/workouts?user_id=${CURRENT_USER_ID}`);
      const data = await res.json();
      setWorkouts(data);
    } catch (error) {
      console.error('Failed to fetch workouts:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Workouts 💪</h1>
          <p className="text-muted-foreground mt-1">
            {workouts.length} total sessions logged
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 shadow-lg shadow-orange-500/25">
              + Log Workout
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Log New Workout</DialogTitle>
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
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Workout Name</Label>
                <Textarea
                  id="notes"
                  placeholder="e.g., Upper body focus, Leg day, Cardio..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" className="w-full h-11 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                Save Workout
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workouts Grid */}
      {workouts.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workouts.map((workout, index) => (
            <Link key={workout.WS_id} href={`/workouts/${workout.WS_id}`}>
              <Card className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardContent className="p-6 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
                      {getWorkoutIcon(workout.notes || '')}
                    </div>
                    {index === 0 && (
                      <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 border-0">
                        Latest
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-1 group-hover:text-orange-500 transition-colors">
                    {workout.notes || 'Workout Session'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {formatDate(workout.session_date)}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-orange-500">●</span>
                      <span className="text-muted-foreground">
                        {workout.exercise_count || 0} exercises
                      </span>
                    </div>
                    {(workout.total_calories ?? 0) > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-pink-500">🔥</span>
                        <span className="text-muted-foreground">
                          {workout.total_calories} cal
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">🏋️</div>
            <h3 className="text-xl font-bold mb-2">No workouts yet</h3>
            <p className="text-muted-foreground mb-4">Start your fitness journey today!</p>
            <Button
              onClick={() => setIsOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
            >
              Log Your First Workout
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
