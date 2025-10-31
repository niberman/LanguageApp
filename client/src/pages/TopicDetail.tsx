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
import { Progress } from "@/components/ui/progress";
import EmbedFrame from "@/components/EmbedFrame";
import ActivitySteps from "@/components/ActivitySteps";
import { queryClient } from "@/lib/queryClient";
import OnboardingCoach from "@/components/OnboardingCoach";
import { hasOnboardingSeen, markOnboardingSeen } from "@/lib/onboarding";
import ConversationPartner from "@/components/ConversationPartner";
import { useEffect, useState } from "react";

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
  const sortedActivities = topic.activities;
  const firstVideo = sortedActivities.find((a: any) => a.type === "video");
  const hasQuizlet = sortedActivities.some((a: any) => a.type === "quizlet");

  // Create a Set of completed activity IDs for quick lookup
  const completedActivityIds = new Set(
    (Array.isArray(completions) ? completions : []).map((c: any) => c.activityId)
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

  // Onboarding coach local navigation state so "Siguiente" advances
  const [coachIndex, setCoachIndex] = useState<number | null>(null);
  useEffect(() => {
    if (coachIndex === null) return;
    // Clamp to bounds if underlying steps change
    if (coachIndex > steps.length - 1) {
      setCoachIndex(steps.length - 1);
    }
  }, [coachIndex, steps.length]);

  // Calculate completion percentage
  const completedCount = steps.filter((step: any) => step.isCompleted).length;
  const totalCount = steps.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isTopicComplete = completedCount === totalCount && totalCount > 0;

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
            {firstVideo && (() => {
              const src = typeof (firstVideo as any).videoUrl === 'string' ? (firstVideo as any).videoUrl : "";
              if (!src) return null;
              let videoId = "";
              let timestamp = "";
              if (src.includes('/embed/')) {
                const embedMatch = src.match(/\/embed\/([^?&]+)/);
                videoId = embedMatch?.[1] || "";
              } else if (src.includes('watch?v=')) {
                const watchMatch = src.match(/watch\?v=([^&]+)/);
                videoId = watchMatch?.[1] || "";
              } else if (src.includes('youtu.be/')) {
                const shortMatch = src.match(/youtu\.be\/([^?&]+)/);
                videoId = shortMatch?.[1] || "";
              }
              const timestampMatch = src.match(/[?&]t=(\d+)/);
              timestamp = timestampMatch?.[1] || "";
              const embedUrl = `https://www.youtube.com/embed/${videoId}${timestamp ? `?start=${timestamp}` : ""}`;
              const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
              return (
                <EmbedFrame
                  key={firstVideo.id}
                  type="youtube"
                  embedUrl={embedUrl}
                  externalUrl={watchUrl}
                  title="Ver lección en video"
                  onInteraction={() => {}}
                  isCompleted={completedActivityIds.has(firstVideo.id)}
                  onComplete={() => {
                    handleActivityComplete(firstVideo.id);
                    if (hasQuizlet) {
                      setLocation(
                        `/courses/${params?.courseId}/lessons/${params?.lessonId}/topics/${params?.topicId}/flashcards`,
                      );
                    }
                  }}
                />
              );
            })()}

            {(() => {
              const ai = sortedActivities.find((a: any) => a.type === "aiChat");
              if (!ai) return null;
              return (
                <Card key={ai.id} data-testid={`card-activity-${ai.id}`}>
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
                    <div className="space-y-4">
                      {Array.isArray(ai.promptSet) && ai.promptSet.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Frases sugeridas:</p>
                          <ul className="list-disc list-inside space-y-1">
                            {ai.promptSet.map((prompt: string, idx: number) => (
                              <li key={idx} className="text-sm">{prompt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <ConversationPartner
                        courseTitle={course.title}
                        lessonTitle={lesson.title}
                        topicTitle={topic.title}
                        activityType="aiChat"
                        promptSet={ai.promptSet}
                        onComplete={() => handleActivityComplete(ai.id)}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })()}
          </div>

          {/* Progress and Navigation */}
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between gap-4 mb-2">
                <CardTitle className="text-lg">Progreso del tema</CardTitle>
                <span className="text-sm font-medium" data-testid="text-progress-percentage">
                  {completedCount} de {totalCount} completadas
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" data-testid="progress-bar" />
            </CardHeader>
            {isTopicComplete && nextTopic && (
              <CardContent>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-primary mb-2">¡Excelente trabajo!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Has completado todas las actividades de este tema. ¡Continúa con el siguiente!
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-semibold mb-1">Siguiente tema</h4>
                    <p className="text-sm text-muted-foreground">
                      {nextTopic.title}
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
              </CardContent>
            )}
            {isTopicComplete && !nextTopic && (
              <CardContent>
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <h3 className="font-semibold text-primary mb-2">¡Felicitaciones!</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Has completado todas las actividades de este tema y lección.
                  </p>
                  <Button
                    onClick={() => setLocation('/dashboard')}
                    data-testid="button-back-to-dashboard"
                  >
                    Volver al panel
                  </Button>
                </div>
              </CardContent>
            )}
            {!isTopicComplete && (
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  Completa todas las actividades para continuar con el siguiente tema
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </main>

      <Footer />
      {(() => {
        const key = `topic.${params?.topicId}`;
        const video = sortedActivities.find((a: any) => a.type === "video");
        const hasAi = sortedActivities.some((a: any) => a.type === "aiChat");
        const stepsForCoach = [
          video && { id: "video", title: "1) Mira el video", description: "Empieza reproduciendo el video para entender el tema." },
          hasQuizlet && { id: "quizlet", title: "2) Practica con tarjetas", description: "Después del video, practica con Quizlet para memorizar vocabulario." },
          hasAi && { id: "ai", title: "3) Conversa con IA", description: "Refuerza hablando con el asistente IA usando las frases del tema." },
          { id: "continue", title: "4) Continúa al siguiente tema", description: "Cuando completes todas las actividades, avanza al siguiente tema." },
        ].filter(Boolean) as { id: string; title: string; description: string }[];

        const completedMap: Record<string, boolean> = {
          video: video ? completedActivityIds.has(video.id) : true,
          quizlet: hasQuizlet ? sortedActivities.filter((a: any) => a.type === "quizlet").every((a: any) => completedActivityIds.has(a.id)) : true,
          ai: hasAi ? sortedActivities.filter((a: any) => a.type === "aiChat").every((a: any) => completedActivityIds.has(a.id)) : true,
          continue: isTopicComplete,
        };

        const firstIncompleteIndex = stepsForCoach.findIndex((s) => !completedMap[s.id]);
        const computedIndex = firstIncompleteIndex === -1 ? stepsForCoach.length - 1 : firstIncompleteIndex;
        const activeIndex = coachIndex ?? computedIndex;

        if (hasOnboardingSeen(key) || stepsForCoach.length === 0) return null;

        return (
          <OnboardingCoach
            steps={stepsForCoach}
            activeIndex={activeIndex}
            onNext={() => {
              const currentStep = stepsForCoach[activeIndex];
              
              // Navigate to flashcards page when clicking "Siguiente" on quizlet step
              if (currentStep?.id === "quizlet") {
                setLocation(`/courses/${params?.courseId}/lessons/${params?.lessonId}/topics/${params?.topicId}/flashcards`);
                return;
              }
              
              // Navigate to next topic when clicking "Siguiente" on continue step
              if (currentStep?.id === "continue" && isTopicComplete && nextTopic) {
                setLocation(`/courses/${params?.courseId}/lessons/${params?.lessonId}/topics/${nextTopic.id}`);
                markOnboardingSeen(key);
                return;
              }
              
              // Otherwise advance to next coach step
              if (activeIndex >= stepsForCoach.length - 1) {
                markOnboardingSeen(key);
              } else {
                setCoachIndex((activeIndex + 1));
              }
            }}
            onSkip={() => {
              markOnboardingSeen(key);
            }}
          />
        );
      })()}
    </div>
  );
}
