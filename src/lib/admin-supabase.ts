/**
 * Admin Supabase Client (Server-side only)
 * This file should NEVER be imported in client components
 * Use createClient() for client-side operations
 */

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

// Helper function to hash passwords (using bcryptjs for serverless compatibility)
export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.default.hashSync(password, 10);
}

// Helper function to verify passwords (using bcryptjs for serverless compatibility)
// This function should ONLY be used in server-side code (API routes)
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    if (!password || !hash) {
      console.error('Missing password or hash');
      return false;
    }

    // Use bcryptjs (pure JS, works in serverless environments)
    const bcryptjs = await import('bcryptjs');
    return bcryptjs.default.compareSync(password, hash);
  } catch (error: any) {
    console.error('Password verification error:', error);
    throw error;
  }
}

