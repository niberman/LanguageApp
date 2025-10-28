import { useState, useEffect } from 'react';
import { useLocation, useSearch } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Auth() {
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const { signIn, signUp, resetPassword, updatePassword, user, session } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [newPasswordData, setNewPasswordData] = useState({ password: '', confirmPassword: '' });

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ email: '', password: '', confirmPassword: '' });

  useEffect(() => {
    const params = new URLSearchParams(searchString);
    if (params.get('reset') === 'true' && session) {
      setIsPasswordReset(true);
    }
  }, [searchString, session]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(signInData.email, signInData.password);
      toast({ title: t('auth.welcomeBack'), description: t('auth.signedInSuccessfully') });
      // Small delay to ensure state updates before navigation
      setTimeout(() => setLocation('/dashboard'), 100);
    } catch (error: any) {
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({ title: t('common.error'), description: t('auth.passwordsDoNotMatch'), variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      await signUp(signUpData.email, signUpData.password);
      toast({ title: t('auth.success'), description: t('auth.accountCreatedSuccessfully') });
      // Small delay to ensure state updates before navigation
      setTimeout(() => setLocation('/dashboard'), 100);
    } catch (error: any) {
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({ 
        title: t('common.error'), 
        description: t('auth.email'), 
        variant: 'destructive' 
      });
      return;
    }
    setIsResetLoading(true);
    try {
      await resetPassword(resetEmail);
      toast({ 
        title: t('auth.resetEmailSent'), 
        description: t('auth.resetEmailSentDescription'),
      });
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
    } finally {
      setIsResetLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordData.password !== newPasswordData.confirmPassword) {
      toast({ title: t('common.error'), description: t('auth.passwordsDoNotMatch'), variant: 'destructive' });
      return;
    }
    if (newPasswordData.password.length < 6) {
      toast({ title: t('common.error'), description: t('auth.passwordMinLength'), variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      await updatePassword(newPasswordData.password);
      toast({ 
        title: t('auth.passwordUpdated'), 
        description: t('auth.passwordUpdatedDescription'),
      });
      setTimeout(() => setLocation('/dashboard'), 1000);
    } catch (error: any) {
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
      setIsLoading(false);
    }
  };

  if (isPasswordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-background p-4">
        <Card className="w-full max-w-md p-8">
          <div className="flex items-center justify-center gap-2 mb-8">
            <GraduationCap className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">La Escuela de Idiomas</h1>
          </div>

          <div className="space-y-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold mb-2">{t('auth.updatePasswordTitle')}</h2>
              <p className="text-sm text-muted-foreground">
                {t('auth.updatePasswordDescription')}
              </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <Label htmlFor="new-password">{t('auth.newPassword')}</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPasswordData.password}
                  onChange={(e) => setNewPasswordData({ ...newPasswordData, password: e.target.value })}
                  required
                  data-testid="input-new-password"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="confirm-new-password">{t('auth.confirmNewPassword')}</Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  value={newPasswordData.confirmPassword}
                  onChange={(e) => setNewPasswordData({ ...newPasswordData, confirmPassword: e.target.value })}
                  required
                  data-testid="input-confirm-new-password"
                  className="mt-2"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-update-password">
                {isLoading ? t('auth.updatingPassword') : t('auth.updatePasswordButton')}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    );
  }

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
              <div className="flex justify-end">
                <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-sm text-muted-foreground hover:text-primary p-0 h-auto"
                      data-testid="button-forgot-password"
                    >
                      {t('auth.forgotPassword')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent data-testid="dialog-reset-password">
                    <DialogHeader>
                      <DialogTitle>{t('auth.resetPassword')}</DialogTitle>
                      <DialogDescription>
                        {t('auth.enterEmailToReset')}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleResetPassword}>
                      <div className="space-y-4 py-4">
                        <div>
                          <Label htmlFor="reset-email">{t('auth.email')}</Label>
                          <Input
                            id="reset-email"
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                            data-testid="input-reset-email"
                            className="mt-2"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isResetLoading} data-testid="button-send-reset-email">
                          {isResetLoading ? t('common.loading') : t('auth.resetPasswordButton')}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-signin">
                {isLoading ? t('auth.signingIn') : t('auth.signInButton')}
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
                <Label htmlFor="signup-confirm-password">{t('auth.confirmPassword')}</Label>
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
                {isLoading ? t('auth.creatingAccount') : t('auth.signUpButton')}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
