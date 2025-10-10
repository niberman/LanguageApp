import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accentColor?: 'primary' | 'success' | 'warning';
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  accentColor = 'primary',
}: StatCardProps) {
  const colorClasses = {
    primary: 'border-l-primary bg-primary/5',
    success: 'border-l-chart-2 bg-chart-2/5',
    warning: 'border-l-chart-3 bg-chart-3/5',
  };

  return (
    <Card className={`p-6 border-l-4 ${colorClasses[accentColor]}`} data-testid={`stat-${label.toLowerCase().replace(/\s/g, '-')}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-5 w-5" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <div className="text-3xl font-bold" data-testid={`text-${label.toLowerCase().replace(/\s/g, '-')}-value`}>{value}</div>
      </div>
    </Card>
  );
}
