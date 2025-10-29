import { CheckCircle2, Circle, Video, BookOpenCheck, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
  type: 'video' | 'quizlet' | 'aiChat';
  isCompleted: boolean;
}

interface ActivityStepsProps {
  steps: Step[];
  currentStepIndex: number;
}

const getStepIcon = (type: string) => {
  switch (type) {
    case 'video':
      return Video;
    case 'quizlet':
      return BookOpenCheck;
    case 'aiChat':
      return MessageSquare;
    default:
      return Circle;
  }
};

const getStepLabel = (type: string, index: number) => {
  switch (type) {
    case 'video':
      return `Paso ${index + 1}: Ver el video`;
    case 'quizlet':
      return `Paso ${index + 1}: Practicar con tarjetas`;
    case 'aiChat':
      return `Paso ${index + 1}: Conversar con IA`;
    default:
      return `Paso ${index + 1}`;
  }
};

export default function ActivitySteps({ steps, currentStepIndex }: ActivityStepsProps) {
  if (steps.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
        {steps.map((step, index) => {
          const Icon = getStepIcon(step.type);
          const isActive = index === currentStepIndex;
          const isPast = index < currentStepIndex;
          const isFuture = index > currentStepIndex;

          return (
            <div key={step.id} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full p-3 transition-all",
                    step.isCompleted && "bg-primary text-primary-foreground",
                    !step.isCompleted && isActive && "bg-primary/20 text-primary ring-2 ring-primary ring-offset-2",
                    !step.isCompleted && isPast && "bg-muted text-muted-foreground",
                    !step.isCompleted && isFuture && "bg-muted text-muted-foreground"
                  )}
                  data-testid={`step-indicator-${index}`}
                >
                  {step.isCompleted ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <div className="text-center">
                  <p
                    className={cn(
                      "text-xs sm:text-sm font-medium whitespace-nowrap",
                      isActive && "text-primary font-semibold",
                      !isActive && "text-muted-foreground"
                    )}
                  >
                    {getStepLabel(step.type, index)}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-8 sm:w-12 mx-2 mt-[-2rem]",
                    step.isCompleted ? "bg-primary" : "bg-muted"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
