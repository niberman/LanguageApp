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
    'auth.signin': 'Sign in',
    'auth.signup': 'Sign up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.displayName': 'Display Name',
    'auth.signInButton': 'Sign in',
    'auth.signUpButton': 'Create Account',
    'auth.signInWithGoogle': 'Continue with Google',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.signInLink': 'Sign in here',
    'auth.signUpLink': 'Sign up here',
    'auth.forgotPassword': 'Forgot your password?',
    'auth.resetPassword': 'Reset Password',
    'auth.resetPasswordButton': 'Send reset link',
    'auth.backToSignIn': 'Back to sign in',
    'auth.resetEmailSent': 'Email sent!',
    'auth.resetEmailSentDescription': 'Check your email for the password reset link.',
    'auth.enterEmailToReset': 'Enter your email address to receive a password reset link.',
    'auth.updatePassword': 'Update Password',
    'auth.updatePasswordTitle': 'Update Password',
    'auth.updatePasswordDescription': 'Enter your new password',
    'auth.newPassword': 'New Password',
    'auth.confirmNewPassword': 'Confirm New Password',
    'auth.updatePasswordButton': 'Update Password',
    'auth.updatingPassword': 'Updating...',
    'auth.passwordUpdated': 'Password updated!',
    'auth.passwordUpdatedDescription': 'Your password has been successfully updated',
    'auth.passwordMinLength': 'Password must be at least 6 characters',
    'auth.confirmPassword': 'Confirm Password',
    'auth.welcomeBack': 'Welcome back!',
    'auth.signedInSuccessfully': 'Signed in successfully',
    'auth.success': 'Success!',
    'auth.accountCreatedSuccessfully': 'Account created successfully!',
    'auth.passwordsDoNotMatch': 'Passwords do not match',
    'auth.signingIn': 'Signing in...',
    'auth.creatingAccount': 'Creating account...',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.notFound': 'Not Found',
    'common.backToHome': 'Back to Home',
    'footer.tagline': "Let's Start Talking!",
    'comingSoon.title': 'Coming Soon',
    'comingSoon.chat': 'Practice conversations with our AI partner',
    'comingSoon.events': 'Join language exchange meetups',
    'comingSoon.work': 'Unlock job opportunities',
  },
  es: {
    'nav.home': 'Inicio',
    'nav.practice': 'Cursos',
    'nav.courses': 'Cursos',
    'nav.dashboard': 'Panel',
    'nav.pricing': 'Precios',
    'nav.admin': 'Admin',
    'nav.settings': 'Ajustes',
    'nav.signin': 'Iniciar sesión',
    'nav.signout': 'Cerrar sesión',
    'nav.signup': 'Registrarse',
    'hero.title': '¡Empecemos a hablar!',
    'hero.subtitle': 'Practica cada día. Conecta con personas. Desbloquea oportunidades.',
    'hero.cta': 'Empezar a practicar',
    'courses.title': 'Cursos disponibles',
    'courses.browse': 'Explora nuestros cursos',
    'courses.lessons': 'lecciones',
    'courses.viewCourse': 'Ver curso',
    'course.lessons': 'Lecciones',
    'course.backToCourses': 'Volver a cursos',
    'lesson.topics': 'Temas',
    'lesson.backToLesson': 'Volver a lección',
    'lesson.backToCourse': 'Volver al curso',
    'topic.activities': 'Actividades',
    'topic.backToLesson': 'Volver a lección',
    'activity.video': 'Video lección',
    'activity.quizlet': 'Práctica de vocabulario',
    'activity.aiChat': 'Conversación IA',
    'activity.openQuizlet': 'Abrir Quizlet',
    'activity.watchVideo': 'Ver video',
    'activity.startChat': 'Iniciar conversación',
    'activity.completed': 'Completado',
    'activity.markComplete': 'Marcar como completado',
    'practice.title': 'Elige tu ruta',
    'practice.english': 'Fundamentos de Inglés',
    'practice.spanish': 'Fundamentos de Español',
    'practice.levels': 'niveles',
    'practice.continue': 'Continuar',
    'practice.start': 'Comenzar',
    'practice.completed': 'Completado',
    'dashboard.welcome': 'Bienvenido de vuelta',
    'dashboard.streak': 'Racha',
    'dashboard.lastActivity': 'Última actividad',
    'dashboard.progress': 'Progreso',
    'dashboard.activitiesCompleted': 'Actividades completadas',
    'dashboard.nextAction': 'Próxima acción',
    'dashboard.days': 'días',
    'dashboard.today': 'Hoy',
    'dashboard.continue': 'Continuar aprendiendo',
    'dashboard.exploreCourses': 'Explorar cursos',
    'settings.title': 'Ajustes',
    'settings.language': 'Idioma',
    'settings.profile': 'Nombre de perfil',
    'settings.save': 'Guardar cambios',
    'auth.signin': 'Iniciar sesión',
    'auth.signup': 'Registrarse',
    'auth.email': 'Correo electrónico',
    'auth.password': 'Contraseña',
    'auth.displayName': 'Nombre para mostrar',
    'auth.signInButton': 'Entrar',
    'auth.signUpButton': 'Crear cuenta',
    'auth.signInWithGoogle': 'Continuar con Google',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.hasAccount': '¿Ya tienes cuenta?',
    'auth.signInLink': 'Inicia sesión aquí',
    'auth.signUpLink': 'Regístrate aquí',
    'auth.forgotPassword': '¿Olvidaste tu contraseña?',
    'auth.resetPassword': 'Restablecer contraseña',
    'auth.resetPasswordButton': 'Enviar enlace de restablecimiento',
    'auth.backToSignIn': 'Volver a iniciar sesión',
    'auth.resetEmailSent': '¡Correo enviado!',
    'auth.resetEmailSentDescription': 'Revisa tu correo electrónico para el enlace de restablecimiento de contraseña.',
    'auth.updatePassword': 'Actualizar Contraseña',
    'auth.updatePasswordTitle': 'Actualizar Contraseña',
    'auth.updatePasswordDescription': 'Ingresa tu nueva contraseña',
    'auth.newPassword': 'Nueva Contraseña',
    'auth.confirmNewPassword': 'Confirmar Nueva Contraseña',
    'auth.updatePasswordButton': 'Actualizar Contraseña',
    'auth.updatingPassword': 'Actualizando...',
    'auth.passwordUpdated': '¡Contraseña actualizada!',
    'auth.passwordUpdatedDescription': 'Tu contraseña ha sido actualizada exitosamente',
    'auth.passwordMinLength': 'La contraseña debe tener al menos 6 caracteres',
    'auth.enterEmailToReset': 'Ingresa tu correo electrónico para recibir un enlace de restablecimiento de contraseña.',
    'auth.confirmPassword': 'Confirmar contraseña',
    'auth.welcomeBack': '¡Bienvenido de nuevo!',
    'auth.signedInSuccessfully': 'Sesión iniciada exitosamente',
    'auth.success': '¡Éxito!',
    'auth.accountCreatedSuccessfully': '¡Cuenta creada exitosamente!',
    'auth.passwordsDoNotMatch': 'Las contraseñas no coinciden',
    'auth.signingIn': 'Iniciando sesión...',
    'auth.creatingAccount': 'Creando cuenta...',
    'pricing.title': 'Elige tu plan',
    'pricing.free': 'Gratis',
    'pricing.pro': 'Pro',
    'pricing.perMonth': '/mes',
    'pricing.comingSoon': 'Próximamente',
    'pricing.joinFree': 'Únete gratis',
    'pricing.features.practice': 'Acceso a todos los cursos',
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
    'footer.about': 'Acerca de',
    'footer.contact': 'Contacto',
    'footer.privacy': 'Privacidad',
    'footer.terms': 'Términos',
    'comingSoon.title': 'Próximamente',
    'comingSoon.chat': 'Practica conversaciones con nuestro compañero IA',
    'comingSoon.events': 'Únete a encuentros de intercambio de idiomas',
    'comingSoon.work': 'Desbloquea oportunidades laborales',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.notFound': 'No encontrado',
    'common.backToHome': 'Volver al inicio',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale;
    if (saved && (saved === 'en' || saved === 'es')) {
      setLocaleState(saved);
    } else {
      setLocaleState('es');
      localStorage.setItem('locale', 'es');
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
