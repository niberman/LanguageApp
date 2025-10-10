import FeatureCard from '../FeatureCard';
import { BookOpen, LayoutDashboard, Sparkles } from 'lucide-react';

export default function FeatureCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 max-w-6xl">
      <FeatureCard
        icon={BookOpen}
        title="Practice"
        description="Access Quizlet vocabulary and YouTube lessons"
      />
      <FeatureCard
        icon={LayoutDashboard}
        title="Track Progress"
        description="Monitor your streak and completion status"
      />
      <FeatureCard
        icon={Sparkles}
        title="AI Chat"
        description="Practice conversations with AI"
        badge="Coming Soon"
      />
    </div>
  );
}
