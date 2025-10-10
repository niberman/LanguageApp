import { createClient } from '@supabase/supabase-js';

// Auto-detect and fix swapped URL and anon key (same logic as server)
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (supabaseUrl.startsWith('eyJ') && supabaseAnonKey.startsWith('http')) {
  [supabaseUrl, supabaseAnonKey] = [supabaseAnonKey, supabaseUrl];
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
