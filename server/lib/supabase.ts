import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Validate Supabase configuration
if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  console.error('❌ Invalid NEXT_PUBLIC_SUPABASE_URL. It should start with https://');
  console.error('   Current value starts with:', supabaseUrl.substring(0, 20));
  console.error('\n📝 Please check your Replit Secrets and ensure:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL = Your project URL (e.g., https://xxxxx.supabase.co)');
  console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY = Your anon/public key (starts with eyJ...)');
  console.error('   SUPABASE_SERVICE_ROLE_KEY = Your service role key (starts with eyJ...)');
  process.exit(1);
}

if (!supabaseAnonKey || !supabaseServiceKey) {
  console.error('❌ Missing Supabase keys. Please set all required secrets.');
  process.exit(1);
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export const getSupabaseClient = (accessToken?: string) => {
  if (accessToken) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  }
  return createClient(supabaseUrl, supabaseAnonKey);
};
