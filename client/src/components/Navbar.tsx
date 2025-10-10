import { Link, useLocation } from 'wouter';
import { GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { t } = useLanguage();
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/practice', label: t('nav.practice') },
    { path: '/dashboard', label: t('nav.dashboard') },
    { path: '/pricing', label: t('nav.pricing') },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/90 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate rounded-md px-2 py-1">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">The Language School</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <Button
                  variant={location === item.path ? 'secondary' : 'ghost'}
                  data-testid={`link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
