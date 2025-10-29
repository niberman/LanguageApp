import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { User, Session, SupabaseClient } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabaseRef = useRef<SupabaseClient | null>(null);

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;

    const checkAuth = async () => {
      try {
        // Get singleton client
        const client = await getSupabase();
        supabaseRef.current = client;
        
        if (mounted) {
          const { data: { session } } = await client.auth.getSession();
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          // Set up auth state listener
          const { data: { subscription: sub } } = client.auth.onAuthStateChange(
            (event: any, session: any) => {
              if (mounted) {
                setSession(session);
                setUser(session?.user ?? null);
                
                // Handle password recovery flow
                if (event === 'PASSWORD_RECOVERY') {
                  // Session will be available for password update
                  console.log('Password recovery session established');
                }
              }
            }
          );
          subscription = sub;
        }
      } catch (error: any) {
        // Ignore refresh_token_not_found errors during password recovery flow
        // These are expected when Supabase is processing a recovery token
        if (error?.message?.includes('refresh_token_not_found')) {
          console.log('Recovery flow in progress...');
        } else {
          console.error('Auth check error:', error);
        }
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
    const client = supabaseRef.current || await getSupabase();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    // Update state immediately
    if (data.session) {
      setSession(data.session);
      setUser(data.session.user);
    }
  };

  const signUp = async (email: string, password: string) => {
    const client = supabaseRef.current || await getSupabase();
    
    const { data, error } = await client.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          display_name: email.split('@')[0],
        }
      }
    });
    if (error) throw error;
    
    // Update state immediately
    if (data.session) {
      setSession(data.session);
      setUser(data.session.user);
    }
    
    // Create profile
    if (data.user && data.session) {
      try {
        await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.session.access_token}`
          },
          body: JSON.stringify({
            id: data.user.id,
            displayName: email.split('@')[0],
            locale: 'en',
          })
        });
      } catch (err) {
        console.error('Profile creation error:', err);
      }
    }
  };

  const signOut = async () => {
    try {
      const client = supabaseRef.current || await getSupabase();
      await client.auth.signOut();
    } catch (error) {
      // Ignore session errors during signout - still clear local state
      console.log('SignOut: clearing local session');
    } finally {
      // Always clear local state
      setSession(null);
      setUser(null);
    }
  };

  const resetPassword = async (email: string) => {
    const client = supabaseRef.current || await getSupabase();
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    if (error) throw error;
  };

  const updatePassword = async (newPassword: string) => {
    const client = supabaseRef.current || await getSupabase();
    const { error } = await client.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPassword, updatePassword }}>
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
