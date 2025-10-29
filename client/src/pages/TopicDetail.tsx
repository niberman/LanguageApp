import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ChevronLeft, Video, BookOpenCheck, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EmbedFrame from "@/components/EmbedFrame";
import ActivitySteps from "@/components/ActivitySteps";
import { queryClient } from "@/lib/queryClient";

export default function TopicDetail() {
  const [, params] = useRoute(
    "/courses/:courseId/lessons/:lessonId/topics/:topicId",
  );
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: course, isLoading } = useQuery({
    queryKey: ["/api/courses", params?.courseId],
    queryFn: async () => {
      const res = await fetch(`/api/courses/${params?.courseId}`);
      return res.json();
    },
  });

  const { data: completions = [] } = useQuery({
    queryKey: ["/api/completions"],
    queryFn: async () => {
      const token = await getAuthToken();
      const res = await fetch("/api/completions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.json();
    },
    enabled: !!user,
  });

  const completeActivity = useMutation({
    mutationFn: async (activityId: string) => {
      const res = await fetch(`/api/activities/${activityId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getAuthToken()}`,
        },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/completions"] });
    },
  });

  const getAuthToken = async () => {
    if (globalThis.__supabaseInitPromise) {
      await globalThis.__supabaseInitPromise;
    }
    const client = globalThis.__supabaseClient;
    if (!client || !client.auth) return "";
    const {
      data: { session },
    } = await client.auth.getSession();
    return session?.access_token || "";
  };

  if (isLoading || !course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center py-12">{t("common.loading")}</div>
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
            <div className="text-center py-12">Tema no encontrado</div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Activities are already sorted by backend (video → quizlet → aiChat)
  // No need to sort again on frontend
  const sortedActivities = topic.activities;

  // Create a Set of completed activity IDs for quick lookup
  const completedActivityIds = new Set(
    completions.map((c: any) => c.activityId)
  );

  // Create steps for the ActivitySteps component
  const steps = sortedActivities.map((activity: any) => ({
    id: activity.id,
    label: activity.title || '',
    type: activity.type,
    isCompleted: completedActivityIds.has(activity.id),
  }));

  // Find the first incomplete step (current step)
  const currentStepIndex = steps.findIndex((step: any) => !step.isCompleted);
  const activeStepIndex = currentStepIndex === -1 ? steps.length - 1 : currentStepIndex;

  // Find next topic for navigation
  const currentTopicIndex = lesson.topics.findIndex((t: any) => t.id === params?.topicId);
  const nextTopic = currentTopicIndex < lesson.topics.length - 1 ? lesson.topics[currentTopicIndex + 1] : null;

  const handleActivityComplete = (activityId: string) => {
    if (!user) {
      toast({
        title: "Por favor inicia sesión",
        description: "Inicia sesión para seguir tu progreso",
      });
      setLocation("/auth");
      return;
    }
    completeActivity.mutate(activityId);
    toast({
      title: "¡Progreso guardado!",
      description: "Actividad marcada como completada",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-6 sm:py-12">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() =>
                setLocation(
                  `/courses/${params?.courseId}/lessons/${params?.lessonId}`,
                )
              }
              data-testid="button-back-to-lesson"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t("topic.backToLesson")}
            </Button>
          </div>

          <div className="mb-8">
            <h1
              className="text-3xl md:text-4xl font-bold mb-2"
              data-testid="text-topic-title"
            >
              {topic.title}
            </h1>
            <p className="text-muted-foreground">{topic.summary}</p>
          </div>

          <ActivitySteps steps={steps} currentStepIndex={activeStepIndex} />

          <div className="space-y-6">
            {sortedActivities.map((activity: any) => {
              if (activity.type === "video") {
                // Extract video ID from various YouTube URL formats
                let videoId = "";
                let timestamp = "";
                
                // Handle embed URLs: https://www.youtube.com/embed/VIDEO_ID
                if (activity.videoUrl.includes('/embed/')) {
                  const embedMatch = activity.videoUrl.match(/\/embed\/([^?&]+)/);
                  videoId = embedMatch?.[1] || "";
                }
                // Handle watch URLs: https://www.youtube.com/watch?v=VIDEO_ID
                else if (activity.videoUrl.includes('watch?v=')) {
                  const watchMatch = activity.videoUrl.match(/watch\?v=([^&]+)/);
                  videoId = watchMatch?.[1] || "";
                }
                // Handle short URLs: https://youtu.be/VIDEO_ID
                else if (activity.videoUrl.includes('youtu.be/')) {
                  const shortMatch = activity.videoUrl.match(/youtu\.be\/([^?&]+)/);
                  videoId = shortMatch?.[1] || "";
                }
                
                // Extract timestamp if present
                const timestampMatch = activity.videoUrl.match(/[?&]t=(\d+)/);
                timestamp = timestampMatch?.[1] || "";

                const embedUrl = `https://www.youtube.com/embed/${videoId}${timestamp ? `?start=${timestamp}` : ""}`;
                const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

                return (
                  <EmbedFrame
                    key={activity.id}
                    type="youtube"
                    embedUrl={embedUrl}
                    externalUrl={watchUrl}
                    title="Ver lección en video"
                    onInteraction={() => {}}
                    isCompleted={completedActivityIds.has(activity.id)}
                    onComplete={() => handleActivityComplete(activity.id)}
                  />
                );
              }

              if (activity.type === "quizlet") {
                return (
                  <EmbedFrame
                    key={activity.id}
                    type="quizlet"
                    embedUrl={activity.embedUrl}
                    externalUrl={activity.embedUrl.replace('/embed', '').split('?')[0]}
                    title="Practicar con Quizlet"
                    onInteraction={() => {}}
                    isCompleted={completedActivityIds.has(activity.id)}
                    onComplete={() => handleActivityComplete(activity.id)}
                  />
                );
              }

              if (activity.type === "aiChat") {
                return (
                  <Card
                    key={activity.id}
                    data-testid={`card-activity-${activity.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-6 w-6 text-primary" />
                        <CardTitle>Práctica de conversación IA</CardTitle>
                      </div>
                      <CardDescription>
                        Practica conversación con asistente IA
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground mb-4">
                          Practica estas frases:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {activity.promptSet.map(
                            (prompt: string, idx: number) => (
                              <li key={idx} className="text-sm">
                                {prompt}
                              </li>
                            ),
                          )}
                        </ul>
                        <Button
                          className="mt-4"
                          onClick={() => {
                            handleActivityComplete(activity.id);
                            toast({
                              title: "¡Próximamente!",
                              description:
                                "La función de chat IA estará disponible pronto",
                            });
                          }}
                          data-testid={`button-start-chat-${activity.id}`}
                        >
                          Iniciar práctica de conversación
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              }

              return null;
            })}
          </div>

          {/* Next Topic Navigation */}
          {nextTopic && (
            <Card className="mt-8 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold mb-1">¿Listo para continuar?</h3>
                  <p className="text-sm text-muted-foreground">
                    Siguiente: {nextTopic.title}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    setLocation(
                      `/courses/${params?.courseId}/lessons/${params?.lessonId}/topics/${nextTopic.id}`,
                    )
                  }
                  data-testid="button-next-topic"
                  size="lg"
                >
                  Continuar
                  <ChevronLeft className="ml-2 h-4 w-4 rotate-180" />
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
