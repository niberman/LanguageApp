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

  // Mobile-responsive heights and aspect ratios
  // For YouTube: Standard 16:9 aspect ratio
  // For Quizlet: Taller aspect to show flashcards properly, responsive on mobile
  const containerClass = type === 'quizlet' 
    ? 'w-full h-[500px] sm:h-[600px] md:h-[700px]' 
    : 'aspect-video w-full';

  return (
    <Card className="overflow-hidden w-full">
      <div className="p-3 sm:p-4 border-b flex items-center justify-between gap-2">
        <h3 className="font-semibold text-sm sm:text-base">{title}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClick}
          data-testid={`button-open-${type}`}
          className="shrink-0"
        >
          <ExternalLink className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Abrir en pestaña nueva</span>
        </Button>
      </div>
      <div className={`${containerClass} bg-muted`}>
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
