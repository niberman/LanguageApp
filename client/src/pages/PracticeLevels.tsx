import { useLocation, useRoute } from 'wouter';
import { ChevronLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { levelApi, progressApi } from '@/lib/api';
import LevelCard from '@/components/LevelCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PracticeLevels() {
  const [, params] = useRoute('/practice/:track');
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();

  const { data: levels = [], isLoading } = useQuery({
    queryKey: ['/api/levels', params?.track],
    queryFn: () => levelApi.getByTrack(params?.track || 'english'),
  });

  const { data: progressData = [] } = useQuery({
    queryKey: ['/api/progress', params?.track],
    queryFn: () => progressApi.getByTrack(params?.track || 'english'),
    enabled: !!user,
  });

  const trackTitle = t('practice.english');

  const calculateProgress = (levelNumber: number) => {
    const events = progressData.filter((e: any) => e.levelNumber === levelNumber);
    const hasQuizlet = events.some((e: any) => e.kind === 'quizlet_view');
    const hasVideo = events.some((e: any) => e.kind === 'video_watch');
    
    if (hasQuizlet && hasVideo) return 100;
    if (hasQuizlet || hasVideo) return 50;
    return 0;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation('/practice')}
              data-testid="button-back"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-track-title">
            {trackTitle}
          </h1>

          {isLoading ? (
            <div className="text-center py-12">Loading levels...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {levels.map((level: any) => {
                const progress = calculateProgress(level.number);
                return (
                  <LevelCard
                    key={level.id}
                    number={level.number}
                    title={level.title}
                    progress={progress}
                    isCompleted={progress === 100}
                    track="english"
                    onClick={() => setLocation(`/practice/${params?.track}/${level.number}`)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
