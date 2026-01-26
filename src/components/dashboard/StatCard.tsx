import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'destructive';
  description?: string;
}

export function StatCard({ title, value, icon: Icon, variant = 'default', description }: StatCardProps) {
  return (
    <div className="glass-card rounded-xl p-6 transition-all hover:border-primary/30">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn(
            "text-3xl font-bold",
            variant === 'success' && "text-success",
            variant === 'warning' && "text-warning",
            variant === 'destructive' && "text-destructive",
            variant === 'default' && "text-foreground"
          )}>
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-lg",
          variant === 'success' && "bg-success/10 text-success",
          variant === 'warning' && "bg-warning/10 text-warning",
          variant === 'destructive' && "bg-destructive/10 text-destructive",
          variant === 'default' && "bg-primary/10 text-primary"
        )}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
