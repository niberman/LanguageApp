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
    <div className={cn("fixed bottom-3 right-3 z-40 max-w-[280px] w-[85vw] sm:w-[280px]", className)} data-testid="onboarding-coach">
      <Card className="shadow-md border-primary/10">
        <CardHeader className="pb-1.5 pt-3 px-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm font-medium">{step.title}</CardTitle>
            <button
              aria-label="Cerrar"
              onClick={onSkip}
              className="p-0.5 rounded hover:bg-muted text-muted-foreground shrink-0"
              data-testid="onboarding-skip"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-3 px-3">
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{step.description}</p>
          <div className="flex items-center justify-between gap-2">
            <div className="text-[10px] text-muted-foreground">Paso {activeIndex + 1} de {steps.length}</div>
            <Button size="sm" onClick={onNext} data-testid="onboarding-next" className="h-7 text-xs px-2.5">
              {isLast ? "Listo" : "Siguiente"}
              <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


