import { useLocation, useRoute } from 'wouter';
import { useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { levelApi, progressApi } from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import EmbedFrame from '@/components/EmbedFrame';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LevelDetail() {
  const [, params] = useRoute('/practice/:track/:level');
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: level, isLoading: levelLoading, error: levelError } = useQuery({
    queryKey: ['/api/levels', params?.track, params?.level],
    queryFn: () => levelApi.getLevel(params?.track || 'english', parseInt(params?.level || '1')),
  });

  const { data: progress } = useQuery({
    queryKey: ['/api/progress', params?.track, params?.level],
    queryFn: () => progressApi.getLevelProgress(params?.track || 'english', parseInt(params?.level || '1')),
    enabled: !!user,
  });

  const recordProgress = useMutation({
    mutationFn: (kind: string) =>
      progressApi.create({
        track: params?.track,
        levelNumber: parseInt(params?.level || '1'),
        kind,
        payload: {},
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
    },
  });

  const handleQuizletView = () => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'Sign in to track your progress' });
      setLocation('/auth');
      return;
    }
    recordProgress.mutate('quizlet_view');
    toast({ title: 'Progress recorded', description: 'Quizlet set opened' });
  };

  const handleVideoWatch = () => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'Sign in to track your progress' });
      setLocation('/auth');
      return;
    }
    recordProgress.mutate('video_watch');
    toast({ title: 'Progress recorded', description: 'Video lesson opened' });
  };

  const levelTitle = level?.title || `English Level ${params?.level}`;
  const quizletId = level?.quizletSetIds?.[0] || 'placeholder';
  
  // Extract YouTube video ID from URL or use playlist ID
  let youtubeEmbedUrl = '';
  let youtubeExternalUrl = '';
  
  if (level?.youtubeUrl) {
    // Extract video ID from various YouTube URL formats
    const videoIdMatch = level.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
    const videoId = videoIdMatch?.[1] || '';
    const timestamp = level.youtubeUrl.match(/[?&]t=(\d+)/)?.[1] || '';
    
    youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}${timestamp ? `?start=${timestamp}` : ''}`;
    youtubeExternalUrl = level.youtubeUrl; // Use original URL for external link
  } else {
    const playlistId = level?.youtubePlaylistIds?.[0] || 'placeholder';
    youtubeEmbedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
    youtubeExternalUrl = `https://youtube.com/playlist?list=${playlistId}`;
  }

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
              embedUrl={`https://quizlet.com/${quizletId}`}
              title={t('level.openQuizlet')}
              onInteraction={handleQuizletView}
            />

            <EmbedFrame
              type="youtube"
              embedUrl={youtubeEmbedUrl}
              externalUrl={youtubeExternalUrl}
              title={t('level.watchVideo')}
              onInteraction={handleVideoWatch}
            />

            {progress?.quizletViewed && progress?.videoWatched && (
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
