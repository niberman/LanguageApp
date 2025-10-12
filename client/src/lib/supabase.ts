import { createClient } from '@supabase/supabase-js';

// Get Supabase config from server at build time
// This creates a singleton client that persists sessions properly
let supabaseClient: any = null;

// Initialize client immediately with config fetch
const initializeSupabase = async () => {
  if (supabaseClient) return supabaseClient;

  try {
    const response = await fetch('/api/config');
    const { supabaseUrl, supabaseAnonKey } = await response.json();
    
    if (supabaseUrl && supabaseAnonKey) {
      // Create client with proper session persistence
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'language-school-auth',
        }
      });
      console.log('✅ Supabase client initialized with session persistence');
    }
  } catch (error) {
    console.error('Failed to initialize Supabase:', error);
  }
  
  return supabaseClient;
};

// Create initial client
const clientPromise = initializeSupabase();

// Export client getter that ensures initialization
export const supabase = new Proxy({} as any, {
  get(target, prop) {
    if (!supabaseClient) {
      // Return a promise-wrapped version if not initialized
      return (...args: any[]) => {
        return clientPromise.then(client => {
          if (client && typeof client[prop] === 'function') {
            return client[prop](...args);
          }
          return client?.[prop];
        });
      };
    }
    return supabaseClient[prop];
  }
});

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
