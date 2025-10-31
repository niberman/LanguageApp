import { useLocation, useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import EmbedFrame from "@/components/EmbedFrame";
import ActivitySteps from "@/components/ActivitySteps";
import { queryClient } from "@/lib/queryClient";
import OnboardingCoach from "@/components/OnboardingCoach";
import { hasOnboardingSeen, markOnboardingSeen } from "@/lib/onboarding";
import ConversationPartner from "@/components/ConversationPartner";
import { useState, useEffect } from "react";

export default function TopicFlashcards() {
  const [, params] = useRoute(
    "/courses/:courseId/lessons/:lessonId/topics/:topicId/flashcards",
  );
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();

  // Onboarding coach local navigation state so "Siguiente" advances
  const [coachIndex, setCoachIndex] = useState<number | null>(null);

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
      if (globalThis.__supabaseInitPromise) {
        await globalThis.__supabaseInitPromise;
      }
      const client = globalThis.__supabaseClient;
      const token = client ? (await client.auth.getSession()).data.session?.access_token : "";
      const res = await fetch("/api/completions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.json();
    },
    enabled: !!user,
  });

  const completeActivity = useMutation({
    mutationFn: async (activityId: string) => {
      if (globalThis.__supabaseInitPromise) {
        await globalThis.__supabaseInitPromise;
      }
      const client = globalThis.__supabaseClient;
      const token = client ? (await client.auth.getSession()).data.session?.access_token : "";
      const res = await fetch(`/api/activities/${activityId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/completions"] });
    },
  });

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

  const activityList = topic.activities as any[];
  const completedIds = new Set((Array.isArray(completions) ? completions : []).map((c: any) => c.activityId));
  const videoActivity = activityList.find((a) => a.type === "video");
  const quizletActivities = activityList.filter((a) => a.type === "quizlet");

  // Gate: require video completed (using useEffect to avoid setState during render)
  useEffect(() => {
    if (videoActivity && !completedIds.has(videoActivity.id)) {
      toast({
        title: "Mira el video primero",
        description: "Debes completar el video antes de practicar con tarjetas",
      });
      setLocation(
        `/courses/${params?.courseId}/lessons/${params?.lessonId}/topics/${params?.topicId}`,
      );
    }
  }, [videoActivity, completedIds, params, toast, setLocation]);

  const steps = activityList.map((a, idx) => ({
    id: a.id,
    label: a.title || "",
    type: a.type,
    isCompleted: completedIds.has(a.id),
  }));
  const currentIndex = Math.max(steps.findIndex((s) => !s.isCompleted), 1);

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
                  `/courses/${params?.courseId}/lessons/${params?.lessonId}/topics/${params?.topicId}`,
                )
              }
              data-testid="button-back-to-topic"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t("topic.backToLesson")}
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{topic.title}</h1>
            <p className="text-muted-foreground">Tarjetas de vocabulario</p>
          </div>

          <ActivitySteps steps={steps} currentStepIndex={currentIndex} />

          <div className="space-y-6">
            {quizletActivities.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Sin tarjetas</CardTitle>
                  <CardDescription>Este tema no tiene tarjetas disponibles.</CardDescription>
                </CardHeader>
              </Card>
            )}
            {quizletActivities.map((activity: any) => (
              <EmbedFrame
                key={activity.id}
                type="quizlet"
                embedUrl={activity.embedUrl}
                externalUrl={activity.embedUrl.replace('/embed', '').split('?')[0]}
                title="Practicar con Quizlet"
                onInteraction={() => {}}
                isCompleted={completedIds.has(activity.id)}
                onComplete={() => {
                  if (!user) {
                    toast({
                      title: "Por favor inicia sesión",
                      description: "Inicia sesión para seguir tu progreso",
                    });
                    setLocation("/auth");
                    return;
                  }
                  completeActivity.mutate(activity.id);
                  toast({
                    title: "¡Progreso guardado!",
                    description: "Actividad marcada como completada",
                  });
                  setLocation(
                    `/courses/${params?.courseId}/lessons/${params?.lessonId}/topics/${params?.topicId}`,
                  );
                }}
                onNavigateNext={() =>
                  setLocation(
                    `/courses/${params?.courseId}/lessons/${params?.lessonId}/topics/${params?.topicId}`,
                  )
                }
                nextButtonText="Volver al tema"
              />
            ))}
            {(() => {
              const ai = activityList.find((a: any) => a.type === "aiChat");
              if (!ai) return null;
              return (
                <Card key={ai.id}>
                  <CardHeader>
                    <CardTitle>Practica conversación (opcional)</CardTitle>
                    <CardDescription>Refuerza lo aprendido conversando con IA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ConversationPartner
                      courseTitle={course.title}
                      lessonTitle={lesson.title}
                      topicTitle={topic.title}
                      activityType="aiChat"
                      promptSet={ai.promptSet}
                      collapsedByDefault
                      onComplete={() => completeActivity.mutate(ai.id)}
                    />
                  </CardContent>
                </Card>
              );
            })()}
          </div>
        </div>
      </main>
      <Footer />
      {(() => {
        const key = `topic.flashcards.${params?.topicId}`;
        const stepsForCoach = [
          { id: "quizlet", title: "1) Practica con tarjetas", description: "Recorre las tarjetas y practica el vocabulario del tema." },
          { id: "continue", title: "2) Continúa al siguiente paso", description: "Cuando termines aquí, vuelve al tema para continuar." },
        ];

        const allQuizletCompleted = quizletActivities.every((a: any) => completedIds.has(a.id));
        const completedMap: Record<string, boolean> = {
          quizlet: allQuizletCompleted,
          continue: allQuizletCompleted,
        };
        const firstIncompleteIndex = stepsForCoach.findIndex((s) => !completedMap[s.id]);
        const computedIndex = firstIncompleteIndex === -1 ? stepsForCoach.length - 1 : firstIncompleteIndex;
        const activeIndex = coachIndex ?? computedIndex;

        if (hasOnboardingSeen(key)) return null;

        return (
          <OnboardingCoach
            steps={stepsForCoach}
            activeIndex={activeIndex}
            onNext={() => {
              const currentStep = stepsForCoach[activeIndex];
              
              // When clicking "Listo" on the "continue" step, navigate back to topic
              if (currentStep?.id === "continue") {
                // Navigate back to the main topic page to continue with AI chat or next topic
                setLocation(`/courses/${params?.courseId}/lessons/${params?.lessonId}/topics/${params?.topicId}`);
                markOnboardingSeen(key);
                return;
              }
              
              // Otherwise advance coach step
              if (activeIndex >= stepsForCoach.length - 1) {
                markOnboardingSeen(key);
              } else {
                setCoachIndex(activeIndex + 1);
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


