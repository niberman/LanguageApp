import { useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';

export default function TopicRedirect() {
  const [, params] = useRoute('/topic/:topicId');
  const [, setLocation] = useLocation();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['/api/courses'],
    queryFn: async () => {
      const res = await fetch('/api/courses');
      return res.json();
    },
  });

  useEffect(() => {
    if (!params?.topicId || isLoading || !courses) return;

    // Find the topic in all courses
    for (const courseData of courses) {
      fetch(`/api/courses/${courseData.id}`)
        .then(res => res.json())
        .then(course => {
          for (const lesson of course.lessons) {
            const topic = lesson.topics.find((t: any) => t.id === params.topicId);
            if (topic) {
              // Redirect to the full route
              setLocation(`/courses/${course.id}/lessons/${lesson.id}/topics/${topic.id}`);
              return;
            }
          }
        });
    }
  }, [params?.topicId, courses, isLoading, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Cargando...</p>
      </div>
    </div>
  );
}
