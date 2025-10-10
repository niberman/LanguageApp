import { useLocation } from 'wouter';
import { useLanguage } from '@/contexts/LanguageContext';
import TrackSelector from '@/components/TrackSelector';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Practice() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-practice-title">
            {t('practice.title')}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TrackSelector
              title={t('practice.english')}
              description="Master English from the basics"
              levelCount={17}
              flag="🇺🇸"
              onClick={() => setLocation('/practice/english')}
            />
            <TrackSelector
              title={t('practice.spanish')}
              description="Aprende los fundamentos del español"
              levelCount={12}
              flag="🇪🇸"
              onClick={() => setLocation('/practice/spanish')}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
