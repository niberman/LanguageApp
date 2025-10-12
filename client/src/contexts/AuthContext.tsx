import { createContext, useContext, useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { User, Session, SupabaseClient } from '@supabase/supabase-js';

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
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;

    const checkAuth = async () => {
      try {
        const client = await getSupabase();
        
        if (mounted) {
          setSupabase(client);
          
          const { data: { session } } = await client.auth.getSession();
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
          
          // Set up auth state listener
          const { data: { subscription: sub } } = client.auth.onAuthStateChange(
            (_event: any, session: any) => {
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
    if (!supabase) throw new Error('Supabase not initialized');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    
    // Update state immediately
    if (data.session) {
      setSession(data.session);
      setUser(data.session.user);
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase not initialized');
    
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
    if (!supabase) throw new Error('Supabase not initialized');
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
