import { useLocation, useRoute } from 'wouter';
import { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import EmbedFrame from '@/components/EmbedFrame';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LevelDetail() {
  const [, params] = useRoute('/practice/:track/:level');
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [quizletViewed, setQuizletViewed] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);

  const handleQuizletView = () => {
    setQuizletViewed(true);
    //todo: remove mock functionality
    toast({
      title: 'Progress recorded',
      description: 'Quizlet set opened',
    });
    console.log('Quizlet view recorded');
  };

  const handleVideoWatch = () => {
    setVideoWatched(true);
    //todo: remove mock functionality
    toast({
      title: 'Progress recorded',
      description: 'Video lesson opened',
    });
    console.log('Video watch recorded');
  };

  const trackTitle = params?.track === 'english' ? 'English' : 'Spanish';
  const levelTitle = `${trackTitle} ${params?.track === 'english' ? 'Foundations' : 'Fundamentos'} ${params?.level}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation(`/practice/${params?.track}`)}
              data-testid="button-back-to-levels"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to levels
            </Button>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-level-title">
            {levelTitle}
          </h1>

          <div className="space-y-6">
            <EmbedFrame
              type="quizlet"
              embedUrl={`https://quizlet.com/${params?.track}-${params?.level}`}
              title={t('level.openQuizlet')}
              onInteraction={handleQuizletView}
            />

            <EmbedFrame
              type="youtube"
              embedUrl={`https://youtube.com/${params?.track}-${params?.level}`}
              title={t('level.watchVideo')}
              onInteraction={handleVideoWatch}
            />

            {quizletViewed && videoWatched && (
              <div className="text-center p-6 bg-chart-2/10 border border-chart-2/20 rounded-lg">
                <p className="text-lg font-medium text-chart-2">
                  🎉 {t('level.completed')}!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
