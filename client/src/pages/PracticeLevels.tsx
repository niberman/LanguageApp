import { useLocation, useRoute } from 'wouter';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import LevelCard from '@/components/LevelCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useState } from 'react';

//todo: remove mock functionality
const mockLevels = {
  english: Array.from({ length: 17 }, (_, i) => ({
    number: i + 1,
    title: `Foundations ${i + 1}`,
    progress: i === 0 ? 65 : i === 1 ? 30 : 0,
    isCompleted: false,
  })),
  spanish: Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    title: `Fundamentos ${i + 1}`,
    progress: i === 0 ? 40 : 0,
    isCompleted: false,
  })),
};

export default function PracticeLevels() {
  const [, params] = useRoute('/practice/:track');
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  const [levels] = useState(mockLevels[params?.track as keyof typeof mockLevels] || []);

  const trackTitle = params?.track === 'english' ? t('practice.english') : t('practice.spanish');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation('/practice')}
              data-testid="button-back"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-8" data-testid="text-track-title">
            {trackTitle}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((level) => (
              <LevelCard
                key={level.number}
                {...level}
                track={params?.track as 'english' | 'spanish'}
                onClick={() => setLocation(`/practice/${params?.track}/${level.number}`)}
              />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
