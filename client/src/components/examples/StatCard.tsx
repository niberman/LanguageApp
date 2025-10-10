import StatCard from '../StatCard';
import { Flame, Clock, TrendingUp, Target } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-8">
      <StatCard icon={Flame} label="Streak" value="7 days" accentColor="warning" />
      <StatCard icon={Clock} label="Last Activity" value="Today" accentColor="success" />
      <StatCard icon={TrendingUp} label="Progress" value="45%" accentColor="primary" />
      <StatCard icon={Target} label="Next Action" value="Level 3" accentColor="primary" />
    </div>
  );
}
