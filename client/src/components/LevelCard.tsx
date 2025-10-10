import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProgressRing from './ProgressRing';
import { useLanguage } from '@/contexts/LanguageContext';

interface LevelCardProps {
  number: number;
  title: string;
  progress: number;
  isCompleted: boolean;
  track: 'english' | 'spanish';
  onClick: () => void;
}

export default function LevelCard({
  number,
  title,
  progress,
  isCompleted,
  onClick,
}: LevelCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="p-6 hover-elevate cursor-pointer" onClick={onClick} data-testid={`card-level-${number}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-xl font-bold text-primary">{number}</span>
          </div>
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            {isCompleted && (
              <Badge variant="secondary" className="mt-1">
                {t('practice.completed')}
              </Badge>
            )}
          </div>
        </div>
        <ProgressRing progress={progress} size="sm" />
      </div>
      <Button className="w-full" variant={progress > 0 ? 'default' : 'outline'} data-testid={`button-level-${number}`}>
        {progress > 0 ? t('practice.continue') : t('practice.start')}
      </Button>
    </Card>
  );
}
