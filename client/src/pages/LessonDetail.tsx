import { useLocation, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import OnboardingCoach from '@/components/OnboardingCoach';
import { hasOnboardingSeen, markOnboardingSeen } from '@/lib/onboarding';

export default function LessonDetail() {
  const [, params] = useRoute('/courses/:courseId/lessons/:lessonId');
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();

  const { data: course, isLoading } = useQuery({
    queryKey: ['/api/courses', params?.courseId],
    queryFn: async () => {
      const res = await fetch(`/api/courses/${params?.courseId}`);
      return res.json();
    },
  });

  const { data: completions = [] } = useQuery({
    queryKey: ['/api/completions'],
    queryFn: async () => {
      if (globalThis.__supabaseInitPromise) {
        await globalThis.__supabaseInitPromise;
      }
      const client = (globalThis as any).__supabaseClient;
      const { data } = await client?.auth.getSession();
      const token = data?.session?.access_token || '';
      const res = await fetch('/api/completions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!user,
  });

  if (isLoading || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center py-12">{t('common.loading')}</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const lesson = course.lessons.find((l: any) => l.id === params?.lessonId);

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center py-12">Lección no encontrada</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation(`/courses/${params?.courseId}`)}
              data-testid="button-back-to-course"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('lesson.backToCourse')}
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-lesson-title">
              {lesson.title}
            </h1>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">{t('lesson.topics')}</h2>
            {lesson.topics.map((topic: any) => {
              const totalActivities = (topic.activities || []).length;
              const safeCompletions = Array.isArray(completions) ? completions : [];
              const completedSet = new Set(safeCompletions.map((c: any) => c.activityId));
              const completedCount = (topic.activities || []).filter((a: any) => completedSet.has(a.id)).length;
              const progressPercent = totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0;
              const completedLabel = t('common.completed');
              const completedText = completedLabel === 'common.completed' ? 'completadas' : completedLabel;
              return (
                <Card
                  key={topic.id}
                  className="hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setLocation(`/courses/${params?.courseId}/lessons/${params?.lessonId}/topics/${topic.id}`)}
                  data-testid={`card-topic-${topic.id}`}
                >
                  <CardHeader>
                    <CardTitle>{topic.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {topic.summary}
                    </CardDescription>
                    <p className="text-sm text-muted-foreground mt-2">
                      {topic.activities.length} actividades
                    </p>
                  </CardHeader>
                  {user && (
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{completedCount} / {totalActivities} {completedText}</span>
                        <span className="text-sm font-medium">{progressPercent}%</span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
      {(() => {
        const key = `lesson.${params?.lessonId}`;
        if (hasOnboardingSeen(key)) return null;
        const steps = [
          { id: 'choose-topic', title: 'Elige un tema para empezar', description: 'Abre un tema y sigue los pasos: video → tarjetas → conversación.' },
        ];
        return (
          <OnboardingCoach
            steps={steps}
            activeIndex={0}
            onNext={() => markOnboardingSeen(key)}
            onSkip={() => markOnboardingSeen(key)}
          />
        );
      })()}
    </div>
  );
}
