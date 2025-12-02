import { Badge } from '@/components/ui/badge';
import { UserAchievementWithDetails } from '@/lib/types';

interface AchievementBadgeProps {
  achievement: UserAchievementWithDetails;
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
        {achievement.title.charAt(0)}
      </div>
      <div className="flex-1">
        <p className="font-medium">{achievement.title}</p>
        <p className="text-xs text-muted-foreground">{achievement.description}</p>
      </div>
      <Badge variant="secondary" className="text-xs">
        {new Date(achievement.created_at).toLocaleDateString()}
      </Badge>
    </div>
  );
}
