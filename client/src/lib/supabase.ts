import { createClient } from '@supabase/supabase-js';

// Fetch Supabase config from server
let supabaseClient: any = null;
let initPromise: Promise<void> | null = null;

async function initSupabase() {
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    try {
      // Use relative path that won't be intercepted by Vite
      const response = await fetch('/api/config', {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const { supabaseUrl, supabaseAnonKey } = await response.json();
      
      if (supabaseUrl && supabaseAnonKey) {
        supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
        console.log('✅ Supabase client initialized');
      } else {
        console.error('❌ Invalid Supabase configuration');
      }
    } catch (error) {
      console.error('❌ Error initializing Supabase:', error);
      // Create a dummy client to prevent crashes
      supabaseClient = {
        auth: {
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
          signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
          signOut: async () => ({ error: null }),
        }
      };
    }
  })();
  
  return initPromise;
}

// Export an object that provides access to supabase client
export const supabase = {
  get auth() {
    return supabaseClient?.auth || {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: null, error: new Error('Not initialized') }),
      signUp: async () => ({ data: null, error: new Error('Not initialized') }),
      signOut: async () => ({ error: null }),
    };
  },
  from(table: string) {
    return supabaseClient?.from(table) || {
      select: () => ({ data: [], error: new Error('Not initialized') }),
      insert: () => ({ data: null, error: new Error('Not initialized') }),
      update: () => ({ data: null, error: new Error('Not initialized') }),
      delete: () => ({ data: null, error: new Error('Not initialized') }),
    };
  }
};

// Initialize on load
if (typeof window !== 'undefined') {
  initSupabase();
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
