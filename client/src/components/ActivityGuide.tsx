import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface ActivityGuideProps {
  currentActivityIndex: number;
  totalActivities: number;
  currentActivityType: 'video' | 'quizlet' | 'aiChat';
  isCurrentComplete: boolean;
  onNext: () => void;
}

const getActivityTitle = (type: string, index: number) => {
  switch (type) {
    case 'video':
      return `${index + 1}) Mira el video`;
    case 'quizlet':
      return `${index + 1}) Practica con las tarjetas`;
    case 'aiChat':
      return `${index + 1}) Conversa con la IA`;
    default:
      return `${index + 1}) Actividad`;
  }
};

const getActivityDescription = (type: string) => {
  switch (type) {
    case 'video':
      return 'Empieza reproduciendo el video para entender el tema.';
    case 'quizlet':
      return 'Practica con las tarjetas de vocabulario para memorizar mejor.';
    case 'aiChat':
      return 'Conversa con el asistente para practicar lo aprendido.';
    default:
      return 'Completa esta actividad para continuar.';
  }
};

export default function ActivityGuide({ 
  currentActivityIndex, 
  totalActivities, 
  currentActivityType,
  isCurrentComplete,
  onNext 
}: ActivityGuideProps) {
  const hasNext = currentActivityIndex < totalActivities - 1;
  
  return (
    <Card className="mb-6 bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{getActivityTitle(currentActivityType, currentActivityIndex)}</span>
          <span className="text-sm font-normal text-muted-foreground">
            Paso {currentActivityIndex + 1} de {totalActivities}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {getActivityDescription(currentActivityType)}
        </p>
        {hasNext && isCurrentComplete && (
          <Button 
            onClick={onNext} 
            className="w-full sm:w-auto"
            data-testid="button-next-activity"
          >
            Siguiente
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
        {!isCurrentComplete && (
          <p className="text-xs text-muted-foreground">
            Completa esta actividad para continuar con la siguiente
          </p>
        )}
      </CardContent>
    </Card>
  );
}
