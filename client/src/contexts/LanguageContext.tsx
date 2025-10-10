import { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'en' | 'es';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    'nav.home': 'Home',
    'nav.practice': 'Practice',
    'nav.dashboard': 'Dashboard',
    'nav.pricing': 'Pricing',
    'nav.admin': 'Admin',
    'nav.settings': 'Settings',
    'hero.title': "Let's Start Talking!",
    'hero.subtitle': 'Practice every day. Connect with people. Unlock opportunities.',
    'hero.cta': 'Start Practicing',
    'practice.title': 'Choose Your Track',
    'practice.english': 'English Foundations',
    'practice.spanish': 'Spanish Foundations',
    'practice.levels': 'levels',
    'practice.continue': 'Continue',
    'practice.start': 'Start',
    'practice.completed': 'Completed',
    'dashboard.streak': 'Streak',
    'dashboard.lastActivity': 'Last Activity',
    'dashboard.progress': 'Level Progress',
    'dashboard.nextAction': 'Next Action',
    'dashboard.days': 'days',
    'dashboard.today': 'Today',
    'dashboard.continue': 'Continue Level',
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.profile': 'Profile Name',
    'settings.save': 'Save Changes',
    'pricing.title': 'Choose Your Plan',
    'pricing.free': 'Free',
    'pricing.pro': 'Pro',
    'pricing.comingSoon': 'Coming Soon',
    'pricing.joinFree': 'Join Free',
    'pricing.features.practice': 'Access to all practice levels',
    'pricing.features.quizlet': 'Quizlet vocabulary sets',
    'pricing.features.youtube': 'YouTube lessons',
    'pricing.features.ai': 'AI Conversation Partner',
    'pricing.features.events': 'Community Events',
    'pricing.features.work': 'Work Opportunities',
    'admin.title': 'Admin Panel',
    'admin.levels': 'Manage Levels',
    'admin.users': 'View Users',
    'level.openQuizlet': 'Open Quizlet',
    'level.watchVideo': 'Watch Lesson',
    'level.completed': 'Completed',
    'footer.tagline': "Let's Start Talking!",
    'comingSoon.title': 'Coming Soon',
    'comingSoon.chat': 'Practice conversations with our AI partner',
    'comingSoon.events': 'Join language exchange meetups',
    'comingSoon.work': 'Unlock job opportunities',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.practice': 'Práctica',
    'nav.dashboard': 'Panel',
    'nav.pricing': 'Precios',
    'nav.admin': 'Admin',
    'nav.settings': 'Ajustes',
    'hero.title': '¡Empecemos a hablar!',
    'hero.subtitle': 'Practica cada día. Conecta con personas. Desbloquea oportunidades.',
    'hero.cta': 'Empezar a practicar',
    'practice.title': 'Elige tu ruta',
    'practice.english': 'Fundamentos de Inglés',
    'practice.spanish': 'Fundamentos de Español',
    'practice.levels': 'niveles',
    'practice.continue': 'Continuar',
    'practice.start': 'Comenzar',
    'practice.completed': 'Completado',
    'dashboard.streak': 'Racha',
    'dashboard.lastActivity': 'Última actividad',
    'dashboard.progress': 'Progreso de nivel',
    'dashboard.nextAction': 'Próxima acción',
    'dashboard.days': 'días',
    'dashboard.today': 'Hoy',
    'dashboard.continue': 'Continuar nivel',
    'settings.title': 'Ajustes',
    'settings.language': 'Idioma',
    'settings.profile': 'Nombre de perfil',
    'settings.save': 'Guardar cambios',
    'pricing.title': 'Elige tu plan',
    'pricing.free': 'Gratis',
    'pricing.pro': 'Pro',
    'pricing.comingSoon': 'Próximamente',
    'pricing.joinFree': 'Únete gratis',
    'pricing.features.practice': 'Acceso a todos los niveles de práctica',
    'pricing.features.quizlet': 'Conjuntos de vocabulario Quizlet',
    'pricing.features.youtube': 'Lecciones de YouTube',
    'pricing.features.ai': 'Compañero de conversación IA',
    'pricing.features.events': 'Eventos comunitarios',
    'pricing.features.work': 'Oportunidades de trabajo',
    'admin.title': 'Panel de administración',
    'admin.levels': 'Gestionar niveles',
    'admin.users': 'Ver usuarios',
    'level.openQuizlet': 'Abrir Quizlet',
    'level.watchVideo': 'Ver lección',
    'level.completed': 'Completado',
    'footer.tagline': '¡Empecemos a hablar!',
    'comingSoon.title': 'Próximamente',
    'comingSoon.chat': 'Practica conversaciones con nuestro compañero IA',
    'comingSoon.events': 'Únete a encuentros de intercambio de idiomas',
    'comingSoon.work': 'Desbloquea oportunidades laborales',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && (saved === 'en' || saved === 'es')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string): string => {
    return translations[locale][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
