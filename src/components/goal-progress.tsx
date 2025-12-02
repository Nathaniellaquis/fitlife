import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserGoalWithDetails } from '@/lib/types';

interface GoalProgressProps {
  goal: UserGoalWithDetails;
}

export function GoalProgress({ goal }: GoalProgressProps) {
  const progress = goal.target_value
    ? Math.min(100, Math.round(((goal.current_value || 0) / goal.target_value) * 100))
    : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{goal.title}</CardTitle>
          <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
            {goal.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {goal.description && (
          <p className="text-sm text-muted-foreground mb-3">{goal.description}</p>
        )}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{goal.current_value || 0} / {goal.target_value}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">{progress}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
