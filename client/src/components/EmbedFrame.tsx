import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Check } from 'lucide-react';

interface EmbedFrameProps {
  type: 'quizlet' | 'youtube';
  embedUrl: string;
  externalUrl?: string;
  title: string;
  onInteraction: () => void;
  isCompleted?: boolean;
  onComplete: () => void;
}

export default function EmbedFrame({ type, embedUrl, externalUrl, title, onInteraction, isCompleted = false, onComplete }: EmbedFrameProps) {
  const handleOpenExternal = () => {
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
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOpenExternal}
            data-testid={`button-open-${type}`}
          >
            <ExternalLink className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Abrir en pestaña nueva</span>
          </Button>
        </div>
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
      <div className="p-3 sm:p-4 border-t flex items-center justify-end">
        <Button
          onClick={onComplete}
          disabled={isCompleted}
          data-testid="button-complete"
          variant={isCompleted ? "secondary" : "default"}
        >
          {isCompleted && <Check className="mr-2 h-4 w-4" />}
          {isCompleted ? "Completado" : "Completar"}
        </Button>
      </div>
    </Card>
  );
}
