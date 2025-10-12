import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Singleton Supabase client - survives HMR
let supabaseInstance: SupabaseClient | null = null;

async function getSupabaseConfig() {
  const response = await fetch('/api/config');
  return await response.json();
}

export async function getSupabase(): Promise<SupabaseClient> {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const { supabaseUrl, supabaseAnonKey } = await getSupabaseConfig();
  
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage,
      storageKey: 'sb-auth-token',
    }
  });

  return supabaseInstance;
}

// Synchronous export - will be initialized
export let supabase: SupabaseClient = null as any;

// Initialize immediately
if (typeof window !== 'undefined') {
  getSupabase().then(client => {
    supabase = client;
  });
}
