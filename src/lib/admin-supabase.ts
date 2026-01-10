import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Admin Supabase client with service role for admin operations (server-side only)
export function getAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createSupabaseClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Client-side Supabase client for admin authentication (uses anon key)
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createSupabaseClient(supabaseUrl, anonKey);
}

// Helper function to hash passwords (using bcrypt in API routes)
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcrypt');
  return bcrypt.default.hash(password, 10);
}

// Helper function to verify passwords
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const bcrypt = await import('bcrypt');
  return bcrypt.default.compare(password, hash);
}

