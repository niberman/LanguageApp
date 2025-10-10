import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface EmbedFrameProps {
  type: 'quizlet' | 'youtube';
  embedUrl: string;
  title: string;
  onInteraction: () => void;
}

export default function EmbedFrame({ type, embedUrl, title, onInteraction }: EmbedFrameProps) {
  const handleClick = () => {
    onInteraction();
    window.open(embedUrl, '_blank');
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClick}
          data-testid={`button-open-${type}`}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in new tab
        </Button>
      </div>
      <div className="aspect-video bg-muted flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-muted-foreground mb-4">
            {type === 'quizlet' ? 'Quizlet' : 'YouTube'} embed placeholder
          </p>
          <Button onClick={handleClick} data-testid={`button-launch-${type}`}>
            Launch {type === 'quizlet' ? 'Quizlet' : 'YouTube'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
