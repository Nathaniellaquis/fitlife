import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WorkoutSession {
  ws_id: number;
  session_date: string;
  notes: string | null;
}

interface WorkoutCardProps {
  workout: WorkoutSession;
  exerciseCount?: number;
}

export function WorkoutCard({ workout, exerciseCount }: WorkoutCardProps) {
  return (
    <Link href={`/workouts/${workout.ws_id}`}>
      <Card className="hover:bg-accent transition-colors cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{workout.notes || 'Workout'}</CardTitle>
            <Badge variant="secondary">
              {new Date(workout.session_date).toLocaleDateString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {exerciseCount !== undefined && (
            <p className="text-sm text-muted-foreground">
              {exerciseCount} exercise{exerciseCount !== 1 ? 's' : ''}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
