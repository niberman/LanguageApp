import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface EmbedFrameProps {
  type: 'quizlet' | 'youtube';
  embedUrl: string;
  externalUrl?: string;
  title: string;
  onInteraction: () => void;
}

export default function EmbedFrame({ type, embedUrl, externalUrl, title, onInteraction }: EmbedFrameProps) {
  const handleClick = () => {
    onInteraction();
    window.open(externalUrl || embedUrl, '_blank');
  };

  // Use different aspect ratios for different embed types
  const aspectClass = type === 'quizlet' ? 'aspect-[4/3]' : 'aspect-video';
  const heightClass = type === 'quizlet' ? 'min-h-[600px]' : '';

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
          Abrir en pestaña nueva
        </Button>
      </div>
      <div className={`${aspectClass} ${heightClass} bg-muted`}>
        <iframe
          src={embedUrl}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          data-testid={`iframe-${type}`}
        />
      </div>
    </Card>
  );
}
