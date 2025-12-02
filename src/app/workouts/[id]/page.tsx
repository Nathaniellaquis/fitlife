'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkoutWithExercises, ExerciseType } from '@/lib/types';
import { toast } from 'sonner';

export default function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [workout, setWorkout] = useState<WorkoutWithExercises | null>(null);
  const [exerciseTypes, setExerciseTypes] = useState<ExerciseType[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Form state
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');

  useEffect(() => {
    fetchWorkout();
    fetchExerciseTypes();
  }, [id]);

  async function fetchWorkout() {
    const res = await fetch(`/api/workouts/${id}`);
    if (res.ok) {
      const data = await res.json();
      setWorkout(data);
    }
  }

  async function fetchExerciseTypes() {
    const res = await fetch('/api/exercise-types');
    const data = await res.json();
    setExerciseTypes(data);
  }

  async function handleAddExercise(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch(`/api/workouts/${id}/exercises`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ET_id: parseInt(selectedExercise),
        exercise_order: (workout?.exercises.length || 0) + 1,
        sets: sets ? parseInt(sets) : null,
        reps: reps ? parseInt(reps) : null,
        weight: weight ? parseFloat(weight) : null,
        duration_min: duration ? parseInt(duration) : null,
        calories_burned: calories ? parseInt(calories) : null,
      }),
    });

    if (res.ok) {
      toast.success('Exercise added!');
      setIsOpen(false);
      resetForm();
      fetchWorkout();
    } else {
      toast.error('Failed to add exercise');
    }
  }

  function resetForm() {
    setSelectedExercise('');
    setSets('');
    setReps('');
    setWeight('');
    setDuration('');
    setCalories('');
  }

  async function handleDelete() {
    if (!confirm('Delete this workout?')) return;

    const res = await fetch(`/api/workouts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Workout deleted');
      router.push('/workouts');
    }
  }

  if (!workout) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{workout.notes || 'Workout'}</h1>
          <p className="text-muted-foreground">
            {new Date(workout.session_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>Add Exercise</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Exercise</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddExercise} className="space-y-4">
                <div className="space-y-2">
                  <Label>Exercise</Label>
                  <Select value={selectedExercise} onValueChange={setSelectedExercise} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select exercise" />
                    </SelectTrigger>
                    <SelectContent>
                      {exerciseTypes.map((et) => (
                        <SelectItem key={et.ET_id} value={et.ET_id.toString()}>
                          {et.name} ({et.target_muscle_group})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sets">Sets</Label>
                    <Input
                      id="sets"
                      type="number"
                      value={sets}
                      onChange={(e) => setSets(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reps">Reps</Label>
                    <Input
                      id="reps"
                      type="number"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.5"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="calories">Calories Burned</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">Add Exercise</Button>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Exercises</h2>
        {workout.exercises.length > 0 ? (
          <div className="space-y-3">
            {workout.exercises.map((exercise, index) => (
              <Card key={`${exercise.WS_id}-${exercise.ET_id}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {index + 1}. {exercise.name}
                    </CardTitle>
                    <Badge variant="outline">{exercise.target_muscle_group}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {exercise.sets && <span><strong>Sets:</strong> {exercise.sets}</span>}
                    {exercise.reps && <span><strong>Reps:</strong> {exercise.reps}</span>}
                    {exercise.weight && <span><strong>Weight:</strong> {exercise.weight}kg</span>}
                    {exercise.duration_min && <span><strong>Duration:</strong> {exercise.duration_min}min</span>}
                    {exercise.calories_burned && <span><strong>Calories:</strong> {exercise.calories_burned}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No exercises added yet.</p>
        )}
      </div>
    </div>
  );
}
