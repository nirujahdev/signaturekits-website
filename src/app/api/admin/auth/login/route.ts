import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient, verifyPassword } from '@/lib/admin-supabase';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    let supabase;
    try {
      supabase = getAdminSupabaseClient();
    } catch (supabaseError: any) {
      console.error('Supabase client error:', supabaseError);
      return NextResponse.json(
        { error: 'Database connection failed', details: supabaseError?.message },
        { status: 500 }
      );
    }

    // Get admin user from database - check if username matches email field
    // (since we're using email column to store username)
    const { data: adminUser, error: userError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', username.toLowerCase())
      .eq('is_active', true)
      .single();

    if (userError) {
      console.error('User query error:', userError);
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    if (!adminUser) {
      console.error('User not found:', username);
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    if (!adminUser.password_hash) {
      console.error('User has no password hash');
      return NextResponse.json(
        { error: 'User account error' },
        { status: 500 }
      );
    }

    // Verify password
    let isValid = false;
    try {
      isValid = await verifyPassword(password, adminUser.password_hash);
    } catch (verifyError: any) {
      console.error('Password verification error:', verifyError);
      return NextResponse.json(
        { error: 'Password verification failed', details: verifyError?.message },
        { status: 500 }
      );
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Update last login (non-blocking)
    try {
      await supabase
        .from('admin_users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', adminUser.id);
    } catch (updateError) {
      console.error('Failed to update last login:', updateError);
      // Don't fail the login if this update fails
    }

    // Create session token (simple JWT-like approach)
    // In production, use a proper JWT library
    let sessionToken: string;
    try {
      sessionToken = Buffer.from(
        JSON.stringify({
          id: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
          exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
        })
      ).toString('base64');
    } catch (tokenError: any) {
      console.error('Token creation error:', tokenError);
      return NextResponse.json(
        { error: 'Session creation failed', details: tokenError?.message },
        { status: 500 }
      );
    }

    // Set cookie
    try {
      const cookieStore = await cookies();
      cookieStore.set('admin_session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });
    } catch (cookieError: any) {
      console.error('Cookie setting error:', cookieError);
      return NextResponse.json(
        { error: 'Session cookie failed', details: cookieError?.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    );
  }
}

