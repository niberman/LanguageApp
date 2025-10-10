import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface TrackSelectorProps {
  title: string;
  description: string;
  levelCount: number;
  flag: string;
  onClick: () => void;
}

export default function TrackSelector({
  title,
  description,
  levelCount,
  flag,
  onClick,
}: TrackSelectorProps) {
  return (
    <Card className="p-8 hover-elevate cursor-pointer" onClick={onClick} data-testid={`card-track-${title.toLowerCase()}`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{flag}</span>
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <Badge variant="secondary" className="ml-4">
          {levelCount} levels
        </Badge>
      </div>
      <Button className="w-full" size="lg" data-testid={`button-start-${title.toLowerCase()}`}>
        Start Learning
        <ChevronRight className="ml-2 h-5 w-5" />
      </Button>
    </Card>
  );
}
