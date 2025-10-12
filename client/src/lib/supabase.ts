import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Global singleton - must survive HMR
declare global {
  var __supabaseClient: SupabaseClient | undefined;
  var __supabaseInitPromise: Promise<SupabaseClient> | undefined;
}

// Export function to get Supabase client
export async function getSupabase(): Promise<SupabaseClient> {
  // Return existing client if already initialized
  if (globalThis.__supabaseClient) {
    return globalThis.__supabaseClient;
  }

  // If initialization in progress, wait for it (prevents duplicate clients)
  if (globalThis.__supabaseInitPromise) {
    return globalThis.__supabaseInitPromise;
  }

  // Start initialization - set promise immediately to prevent race conditions
  globalThis.__supabaseInitPromise = (async () => {
    try {
      const response = await fetch('/api/config');
      const { supabaseUrl, supabaseAnonKey } = await response.json();

      const client = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storage: window.localStorage,
        }
      });

      // Store globally
      globalThis.__supabaseClient = client;
      return client;
    } catch (error) {
      // Clear promise on error so it can be retried
      globalThis.__supabaseInitPromise = undefined;
      throw error;
    }
  })();

  return globalThis.__supabaseInitPromise;
}

// Synchronous proxy for backwards compatibility
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = globalThis.__supabaseClient;
    if (client) {
      return client[prop as keyof SupabaseClient];
    }
    return undefined;
  }
});
