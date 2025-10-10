import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full p-1 bg-muted" data-testid="language-toggle">
      <button
        onClick={() => setLocale('en')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          locale === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover-elevate'
        }`}
        data-testid="button-locale-en"
      >
        EN
      </button>
      <button
        onClick={() => setLocale('es')}
        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
          locale === 'es'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover-elevate'
        }`}
        data-testid="button-locale-es"
      >
        ES
      </button>
    </div>
  );
}
