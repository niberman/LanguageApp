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

export default function CourseDetail() {
  const [, params] = useRoute('/courses/:id');
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();

  const { data: course, isLoading } = useQuery({
    queryKey: ['/api/courses', params?.id],
    queryFn: async () => {
      const res = await fetch(`/api/courses/${params?.id}`);
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

  if (isLoading) {
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

  if (!course || course.error || !course.lessons) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center py-12">
              <p className="text-xl mb-4">Curso no encontrado</p>
              <Button onClick={() => setLocation('/courses')}>
                Volver a cursos
              </Button>
            </div>
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
              onClick={() => setLocation('/courses')}
              data-testid="button-back-to-courses"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('course.backToCourses')}
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-course-title">
              {course.title}
            </h1>
            <p className="text-muted-foreground mb-4">{course.description}</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">{t('course.lessons')}</h2>
            {course.lessons.map((lesson: any) => {
              const allActivities = (lesson.topics || []).flatMap((t: any) => t.activities || []);
              const totalActivities = allActivities.length;
              const safeCompletions = Array.isArray(completions) ? completions : [];
              const completedSet = new Set(safeCompletions.map((c: any) => c.activityId));
              const completedCount = allActivities.filter((a: any) => completedSet.has(a.id)).length;
              const progressPercent = totalActivities > 0 ? Math.round((completedCount / totalActivities) * 100) : 0;
              const completedLabel = t('common.completed');
              const completedText = completedLabel === 'common.completed' ? 'completadas' : completedLabel;
              return (
                <Card
                  key={lesson.id}
                  className="hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setLocation(`/courses/${params?.id}/lessons/${lesson.id}`)}
                  data-testid={`card-lesson-${lesson.id}`}
                >
                  <CardHeader>
                    <CardTitle>{lesson.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {lesson.topics.length} {t('lesson.topics').toLowerCase()}
                    </CardDescription>
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
    </div>
  );
}
