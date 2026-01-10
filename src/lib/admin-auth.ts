import { cookies } from 'next/headers';
import { getAdminSupabaseClient } from './admin-supabase';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Get the current admin user from session cookie
 * Returns null if not authenticated
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;

    if (!sessionToken) {
      return null;
    }

    // Decode session token
    const sessionData = JSON.parse(
      Buffer.from(sessionToken, 'base64').toString()
    );

    // Check expiration
    if (sessionData.exp < Date.now()) {
      cookieStore.delete('admin_session');
      return null;
    }

    // Verify user still exists and is active
    const supabase = getAdminSupabaseClient();
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id, email, role')
      .eq('id', sessionData.id)
      .eq('is_active', true)
      .single();

    return adminUser || null;
  } catch (error) {
    return null;
  }
}

/**
 * Require authentication for admin API routes
 * Returns the admin user or throws an error response
 */
export async function requireAdminAuth(): Promise<AdminUser> {
  const user = await getAdminUser();
  if (!user) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return user;
}

