import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Auth() {
  const [, setLocation] = useLocation();
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ email: '', password: '', confirmPassword: '' });

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(signInData.email, signInData.password);
      toast({ title: '¡Bienvenido de nuevo!', description: 'Sesión iniciada exitosamente' });
      // Small delay to ensure state updates before navigation
      setTimeout(() => setLocation('/dashboard'), 100);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({ title: 'Error', description: 'Las contraseñas no coinciden', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      await signUp(signUpData.email, signUpData.password);
      toast({ title: '¡Éxito!', description: '¡Cuenta creada exitosamente!' });
      // Small delay to ensure state updates before navigation
      setTimeout(() => setLocation('/dashboard'), 100);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <GraduationCap className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">La Escuela de Idiomas</h1>
        </div>

        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signin" data-testid="tab-signin">{t('auth.signin')}</TabsTrigger>
            <TabsTrigger value="signup" data-testid="tab-signup">{t('auth.signup')}</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <Label htmlFor="signin-email">{t('auth.email')}</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                  required
                  data-testid="input-signin-email"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="signin-password">{t('auth.password')}</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                  required
                  data-testid="input-signin-password"
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-signin">
                {isLoading ? 'Iniciando sesión...' : t('auth.signInButton')}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="signup-email">{t('auth.email')}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                  required
                  data-testid="input-signup-email"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="signup-password">{t('auth.password')}</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                  required
                  data-testid="input-signup-password"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="signup-confirm-password">Confirmar contraseña</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                  required
                  data-testid="input-signup-confirm-password"
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-signup">
                {isLoading ? 'Creando cuenta...' : t('auth.signUpButton')}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
