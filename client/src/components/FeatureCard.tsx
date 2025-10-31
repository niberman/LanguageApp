import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { useLocation } from 'wouter';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  href?: string;
}

export default function FeatureCard({ icon: Icon, title, description, badge, href }: FeatureCardProps) {
  const [, setLocation] = useLocation();
  
  const handleClick = () => {
    if (href) {
      setLocation(href);
    }
  };

  return (
    <Card 
      className={`p-6 hover-elevate transition-shadow ${href ? 'cursor-pointer' : ''}`}
      data-testid={`card-${title.toLowerCase().replace(/\s/g, '-')}`}
      onClick={handleClick}
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Icon className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-xl mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {badge && (
          <span className="text-xs font-medium text-chart-3 bg-chart-3/10 px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
    </Card>
  );
}
