import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Flame, Clock, TrendingUp, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardApi } from '@/lib/api';
import StatCard from '@/components/StatCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Only redirect if loading is complete and user is not authenticated
    if (!loading && !user) {
      setLocation('/auth');
    }
  }, [user, loading, setLocation]);

  const { data: stats, isLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: () => dashboardApi.getStats(),
    enabled: !!user,
  });

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const formatDate = (date: string | null) => {
    if (!date) return 'Never';
    const d = new Date(date);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return t('dashboard.today');
    return d.toLocaleDateString();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-dashboard-title">
            {t('nav.dashboard')}
          </h1>

          {isLoading ? (
            <div className="text-center py-12">Loading dashboard...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                  icon={Flame}
                  label={t('dashboard.streak')}
                  value={`${stats?.streak || 0} ${t('dashboard.days')}`}
                  accentColor="warning"
                />
                <StatCard
                  icon={Clock}
                  label={t('dashboard.lastActivity')}
                  value={formatDate(stats?.lastActivity)}
                  accentColor="success"
                />
                <StatCard
                  icon={TrendingUp}
                  label={t('dashboard.progress')}
                  value={`${stats?.progressPercentage || 0}%`}
                  accentColor="primary"
                />
                <StatCard
                  icon={Target}
                  label="Completed Activities"
                  value={`${stats?.completedActivities || 0}/${stats?.totalActivities || 0}`}
                  accentColor="primary"
                />
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">
                  {t('dashboard.nextAction')}
                </h2>
                <Button
                  size="lg"
                  onClick={() => setLocation('/courses')}
                  data-testid="button-continue-level"
                >
                  {t('practice.continue')}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
