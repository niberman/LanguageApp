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

  // Check for password recovery on mount and when hash/session changes
  useEffect(() => {
    const checkPasswordRecovery = () => {
      try {
        console.log('[Password Reset] Checking for recovery flow...');
        
        // Check if this is a password recovery flow
        // Supabase recovery links have #access_token=...&type=recovery in the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const hasRecoveryType = hashParams.get('type') === 'recovery';
        const hasAccessToken = !!hashParams.get('access_token');
        
        // Also check if we previously detected a recovery flow (persisted in localStorage)
        // This was set by the inline script in index.html or by a previous detection
        const wasRecoveryFlow = localStorage.getItem('password_reset_flow') === 'true';
        const detectedAt = localStorage.getItem('password_reset_detected_at');
        
        console.log('[Password Reset] Detection state:', {
          hasRecoveryType,
          hasAccessToken,
          wasRecoveryFlow,
          detectedAt,
          hasSession: !!session,
          currentHash: window.location.hash.substring(0, 50) + '...'
        });
        
        // If we detect recovery type in hash, save it to localStorage
        // This persists even after Supabase processes the token and clears the hash
        if (hasRecoveryType && hasAccessToken) {
          console.log('[Password Reset] ✓ Recovery flow detected in hash - showing password update form');
          localStorage.setItem('password_reset_flow', 'true');
          localStorage.setItem('password_reset_detected_at', Date.now().toString());
          setIsPasswordReset(true);
          return;
        } 
        
        // If we have the localStorage flag (set by inline script or previous detection)
        if (wasRecoveryFlow) {
          // Only honor the flag if:
          // 1. We have a session (Supabase has processed the recovery token)
          // OR
          // 2. The detection was recent (within last 30 seconds - prevents stale flags)
          const isRecent = detectedAt && (Date.now() - parseInt(detectedAt)) < 30000;
          
          if (session) {
            console.log('[Password Reset] ✓ Have session + recovery flag - showing password update form');
            setIsPasswordReset(true);
            return;
          } else if (isRecent) {
            console.log('[Password Reset] ✓ Recent recovery flag detected - showing password update form');
            setIsPasswordReset(true);
            return;
          } else {
            console.log('[Password Reset] ⚠ Stale recovery flag detected - clearing all flags');
            localStorage.removeItem('password_reset_flow');
            localStorage.removeItem('password_reset_detected_at');
            localStorage.removeItem('password_reset_hash');
          }
        }
        
        console.log('[Password Reset] No recovery flow detected');
      } catch (error) {
        console.error('[Password Reset] Error in detection:', error);
      }
    };
    
    // Run immediately
    checkPasswordRecovery();
    
    // Also listen for hash changes (in case user navigates with recovery link)
    window.addEventListener('hashchange', checkPasswordRecovery);
    
    return () => {
      window.removeEventListener('hashchange', checkPasswordRecovery);
    };
  }, [session]);

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
      
      // Fetch the first video lesson path for new users
      try {
        const response = await fetch('/api/dashboard/next-topic');
        if (response.ok) {
          const data = await response.json();
          if (data.navigationPath) {
            setTimeout(() => setLocation(data.navigationPath), 100);
            return;
          }
        }
      } catch (navError) {
        console.error('Failed to get first lesson path:', navError);
      }
      
      // Fallback to dashboard if navigation path fetch fails
      setTimeout(() => setLocation('/dashboard'), 100);
    } catch (error: any) {
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[Password Reset] Reset password requested');
    if (!resetEmail) {
      console.log('[Password Reset] ✗ No email provided');
      toast({ 
        title: t('common.error'), 
        description: t('auth.email'), 
        variant: 'destructive' 
      });
      return;
    }
    setIsResetLoading(true);
    try {
      console.log('[Password Reset] Sending reset email');
      await resetPassword(resetEmail);
      console.log('[Password Reset] ✓ Reset email sent successfully');
      toast({ 
        title: t('auth.resetEmailSent'), 
        description: t('auth.resetEmailSentDescription'),
      });
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error: any) {
      console.error('[Password Reset] ✗ Error sending reset email');
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
      console.log('[Password Reset] Updating password...');
      await updatePassword(newPasswordData.password);
      // Clear the password reset flow flags from localStorage
      console.log('[Password Reset] ✓ Password updated successfully - clearing flags');
      localStorage.removeItem('password_reset_flow');
      localStorage.removeItem('password_reset_detected_at');
      localStorage.removeItem('password_reset_hash');
      toast({ 
        title: t('auth.passwordUpdated'), 
        description: t('auth.passwordUpdatedDescription'),
      });
      setTimeout(() => setLocation('/dashboard'), 1000);
    } catch (error: any) {
      console.error('[Password Reset] ✗ Error updating password:', error);
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
