import { useLocation, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function CourseDetail() {
  const [, params] = useRoute('/courses/:id');
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const { data: course, isLoading } = useQuery({
    queryKey: ['/api/courses', params?.id],
    queryFn: async () => {
      const res = await fetch(`/api/courses/${params?.id}`);
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center py-12">Loading course...</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center py-12">Course not found</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const progressPercent = Math.round(course.getProgress() * 100);

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
              Back to courses
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2" data-testid="text-course-title">
              {course.title}
            </h1>
            <p className="text-muted-foreground mb-4">{course.description}</p>
            
            <div className="flex items-center gap-4">
              <Progress value={progressPercent} className="flex-1" data-testid="progress-course" />
              <span className="text-sm text-muted-foreground">{progressPercent}%</span>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Lessons</h2>
            {course.lessons.map((lesson: any) => {
              const lessonProgress = Math.round(lesson.getProgress() * 100);
              return (
                <Card
                  key={lesson.id}
                  className="hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setLocation(`/courses/${params?.id}/lessons/${lesson.id}`)}
                  data-testid={`card-lesson-${lesson.id}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle>{lesson.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {lesson.topics.length} topics
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">{lessonProgress}%</div>
                        <Progress value={lessonProgress} className="w-24 mt-1" />
                      </div>
                    </div>
                  </CardHeader>
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
