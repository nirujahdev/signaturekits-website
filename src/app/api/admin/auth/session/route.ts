import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('admin_session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Decode session token
    try {
      const sessionData = JSON.parse(
        Buffer.from(sessionToken, 'base64').toString()
      );

      // Check expiration
      if (sessionData.exp < Date.now()) {
        cookieStore.delete('admin_session');
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }

      // Verify user still exists and is active
      const supabase = getAdminSupabaseClient();
      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('id, email, role')
        .eq('id', sessionData.id)
        .eq('is_active', true)
        .single();

      if (!adminUser) {
        cookieStore.delete('admin_session');
        return NextResponse.json({ authenticated: false }, { status: 401 });
      }

      return NextResponse.json({
        authenticated: true,
        user: adminUser,
      });
    } catch (error) {
      cookieStore.delete('admin_session');
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}

