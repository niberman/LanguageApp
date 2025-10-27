import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export default function Courses() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  const { data: courses = [], isLoading, error } = useQuery<any[]>({
    queryKey: ['/api/courses'],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-courses-title">
            {t('practice.title')}
          </h1>

          {isLoading ? (
            <div className="text-center py-12" data-testid="text-loading">
              {t('common.loading')}
            </div>
          ) : error ? (
            <div className="text-center py-12" data-testid="text-error">
              <p className="text-destructive mb-4">{t('common.error')}</p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : 'Error al cargar los cursos'}
              </p>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12" data-testid="text-no-courses">
              <p className="text-muted-foreground">No hay cursos disponibles en este momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course: any) => (
                <Card
                  key={course.id}
                  className="hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => setLocation(`/courses/${course.id}`)}
                  data-testid={`card-course-${course.id}`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle>{course.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {course.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
