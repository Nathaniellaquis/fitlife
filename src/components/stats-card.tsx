import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string;
  gradient?: 'orange' | 'blue' | 'green' | 'purple' | 'pink';
}

const gradients = {
  orange: 'from-orange-500 to-amber-500',
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-emerald-500 to-teal-500',
  purple: 'from-purple-500 to-indigo-500',
  pink: 'from-pink-500 to-rose-500',
};

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
  gradient = 'blue'
}: StatsCardProps) {
  return (
    <Card className={cn(
      "relative overflow-hidden border-0 shadow-lg",
      className
    )}>
      <div className={cn(
        "absolute inset-0 opacity-10 bg-gradient-to-br",
        gradients[gradient]
      )} />
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold tracking-tight">{value}</span>
              {trend && trendValue && (
                <span className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded-full",
                  trend === 'up' && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                  trend === 'down' && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                  trend === 'neutral' && "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                )}>
                  {trend === 'up' && '+'}{trendValue}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {icon && (
            <div className={cn(
              "p-3 rounded-xl bg-gradient-to-br text-white shadow-lg",
              gradients[gradient]
            )}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
