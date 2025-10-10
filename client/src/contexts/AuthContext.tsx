import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;

    const checkAuth = async () => {
      try {
        // Wait a bit for Supabase to initialize
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          // Set up auth state listener
          const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
              if (mounted) {
                setSession(session);
                setUser(session?.user ?? null);
              }
            }
          );
          subscription = sub;
        }
      } catch (error) {
        console.error('Auth check error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    // Use client-side signup which creates both auth user and profile
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          display_name: email.split('@')[0],
        }
      }
    });
    if (error) throw error;
    
    // Create profile in database
    if (data.user) {
      try {
        const response = await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.session?.access_token}`
          },
          body: JSON.stringify({
            id: data.user.id,
            displayName: email.split('@')[0],
            locale: 'en',
          })
        });
        
        if (!response.ok) {
          console.error('Failed to create profile');
        }
      } catch (err) {
        console.error('Profile creation error:', err);
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
