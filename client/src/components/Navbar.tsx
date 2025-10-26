import { Link, useLocation } from 'wouter';
import { GraduationCap, LogOut } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { t } = useLanguage();
  const { user, signOut } = useAuth();
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/courses', label: t('nav.practice') },
    ...(user ? [{ path: '/dashboard', label: t('nav.dashboard') }] : []),
    { path: '/pricing', label: t('nav.pricing') },
  ];

  const handleSignOut = async () => {
    await signOut();
    setLocation('/');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/90 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate rounded-md px-2 py-1">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">La Escuela de Idiomas</span>
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
            <ThemeToggle />
            {user ? (
              <Button variant="ghost" size="icon" onClick={handleSignOut} data-testid="button-signout">
                <LogOut className="h-5 w-5" />
              </Button>
            ) : (
              <Link href="/auth">
                <Button variant="default" data-testid="button-auth">
                  {t('nav.signin')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
