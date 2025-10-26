import { GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <div>
              <div className="font-bold">La Escuela de Idiomas</div>
              <div className="text-sm text-muted-foreground">{t('footer.tagline')}</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2025 La Escuela de Idiomas. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
