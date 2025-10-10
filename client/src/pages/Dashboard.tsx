import { Flame, Clock, TrendingUp, Target } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import StatCard from '@/components/StatCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

export default function Dashboard() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  //todo: remove mock functionality
  const stats = {
    streak: 7,
    lastActivity: t('dashboard.today'),
    progress: 45,
    nextLevel: 3,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-dashboard-title">
            {t('nav.dashboard')}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Flame}
              label={t('dashboard.streak')}
              value={`${stats.streak} ${t('dashboard.days')}`}
              accentColor="warning"
            />
            <StatCard
              icon={Clock}
              label={t('dashboard.lastActivity')}
              value={stats.lastActivity}
              accentColor="success"
            />
            <StatCard
              icon={TrendingUp}
              label={t('dashboard.progress')}
              value={`${stats.progress}%`}
              accentColor="primary"
            />
            <StatCard
              icon={Target}
              label={t('dashboard.nextAction')}
              value={`Level ${stats.nextLevel}`}
              accentColor="primary"
            />
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              {t('dashboard.continue')} {stats.nextLevel}
            </h2>
            <Button
              size="lg"
              onClick={() => setLocation('/practice/english/3')}
              data-testid="button-continue-level"
            >
              {t('practice.continue')}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
