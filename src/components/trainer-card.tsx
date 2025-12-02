import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrainerWithUser } from '@/lib/types';

interface TrainerCardProps {
  trainer: TrainerWithUser;
  onConnect?: () => void;
  isConnected?: boolean;
}

export function TrainerCard({ trainer, onConnect, isConnected }: TrainerCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {trainer.fname} {trainer.lname}
          </CardTitle>
          {trainer.location && (
            <Badge variant="outline">{trainer.location}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {trainer.specialty && (
          <p className="text-sm font-medium text-primary">{trainer.specialty}</p>
        )}
        {trainer.bio && (
          <p className="text-sm text-muted-foreground">{trainer.bio}</p>
        )}
        {onConnect && (
          <Button
            onClick={onConnect}
            variant={isConnected ? 'secondary' : 'default'}
            className="w-full"
            disabled={isConnected}
          >
            {isConnected ? 'Connected' : 'Connect'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
