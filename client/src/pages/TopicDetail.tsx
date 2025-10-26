import { useLocation, useRoute } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ChevronLeft, Video, BookOpenCheck, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EmbedFrame from '@/components/EmbedFrame';
import { queryClient } from '@/lib/queryClient';

export default function TopicDetail() {
  const [, params] = useRoute('/courses/:courseId/lessons/:lessonId/topics/:topicId');
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: course, isLoading } = useQuery({
    queryKey: ['/api/courses', params?.courseId],
    queryFn: async () => {
      const res = await fetch(`/api/courses/${params?.courseId}`);
      return res.json();
    },
  });

  const completeActivity = useMutation({
    mutationFn: async (activityId: string) => {
      const res = await fetch(`/api/activities/${activityId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/courses'] });
      queryClient.invalidateQueries({ queryKey: ['/api/completions'] });
    },
  });

  const getAuthToken = async () => {
    if (globalThis.__supabaseInitPromise) {
      await globalThis.__supabaseInitPromise;
    }
    const client = globalThis.__supabaseClient;
    if (!client || !client.auth) return '';
    const { data: { session } } = await client.auth.getSession();
    return session?.access_token || '';
  };

  if (isLoading || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center py-12">Loading...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const lesson = course.lessons.find((l: any) => l.id === params?.lessonId);
  const topic = lesson?.topics.find((t: any) => t.id === params?.topicId);

  if (!lesson || !topic) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center py-12">Topic not found</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleActivityComplete = (activityId: string) => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'Sign in to track your progress' });
      setLocation('/auth');
      return;
    }
    completeActivity.mutate(activityId);
    toast({ title: 'Progress saved!', description: 'Activity marked as complete' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation(`/courses/${params?.courseId}/lessons/${params?.lessonId}`)}
              data-testid="button-back-to-lesson"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to lesson
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-topic-title">
              {topic.title}
            </h1>
            <p className="text-muted-foreground">{topic.summary}</p>
          </div>

          <div className="space-y-6">
            {topic.activities.map((activity: any) => {
              if (activity.type === 'video') {
                const videoIdMatch = activity.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
                const videoId = videoIdMatch?.[1] || '';
                const timestampMatch = activity.videoUrl.match(/[?&]t=(\d+)/);
                const timestamp = timestampMatch?.[1] || '';
                
                return (
                  <EmbedFrame
                    key={activity.id}
                    type="youtube"
                    embedUrl={`https://www.youtube.com/embed/${videoId}${timestamp ? `?start=${timestamp}` : ''}`}
                    externalUrl={activity.videoUrl}
                    title="Watch Video Lesson"
                    onInteraction={() => handleActivityComplete(activity.id)}
                  />
                );
              }

              if (activity.type === 'quizlet') {
                return (
                  <EmbedFrame
                    key={activity.id}
                    type="quizlet"
                    embedUrl={`https://quizlet.com/${activity.quizletId}`}
                    title="Practice with Quizlet"
                    onInteraction={() => handleActivityComplete(activity.id)}
                  />
                );
              }

              if (activity.type === 'aiChat') {
                return (
                  <Card key={activity.id} data-testid={`card-activity-${activity.id}`}>
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-6 w-6 text-primary" />
                        <CardTitle>AI Practice Chat</CardTitle>
                      </div>
                      <CardDescription>
                        Practice conversation with AI assistant
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground mb-4">
                          Practice these phrases:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {activity.promptSet.map((prompt: string, idx: number) => (
                            <li key={idx} className="text-sm">{prompt}</li>
                          ))}
                        </ul>
                        <Button
                          className="mt-4"
                          onClick={() => {
                            handleActivityComplete(activity.id);
                            toast({ title: 'Coming soon!', description: 'AI chat feature will be available soon' });
                          }}
                          data-testid={`button-start-chat-${activity.id}`}
                        >
                          Start Chat Practice
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              return null;
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
