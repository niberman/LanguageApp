import { X, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
}

interface OnboardingCoachProps {
  steps: OnboardingStep[];
  activeIndex: number;
  onNext: () => void;
  onSkip: () => void;
  className?: string;
}

export default function OnboardingCoach({ steps, activeIndex, onNext, onSkip, className }: OnboardingCoachProps) {
  if (steps.length === 0 || activeIndex < 0 || activeIndex >= steps.length) return null;

  const step = steps[activeIndex];
  const isLast = activeIndex === steps.length - 1;

  return (
    <div className={cn("fixed bottom-4 right-4 z-40 max-w-sm w-[92vw] sm:w-[420px]", className)} data-testid="onboarding-coach">
      <Card className="shadow-xl border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base">{step.title}</CardTitle>
            <button
              aria-label="Cerrar"
              onClick={onSkip}
              className="p-1 rounded hover:bg-muted text-muted-foreground"
              data-testid="onboarding-skip"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground">Paso {activeIndex + 1} de {steps.length}</div>
            <Button size="sm" onClick={onNext} data-testid="onboarding-next">
              {isLast ? "Listo" : "Siguiente"}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


