import { NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function GET() {
  try {
    // Check environment variables
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    // Try to create Supabase client
    let supabase;
    try {
      supabase = getAdminSupabaseClient();
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create Supabase client',
        details: error?.message,
        env: {
          hasUrl,
          hasServiceKey,
          url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + '...',
        },
      }, { status: 500 });
    }

    // Try to query admin_users table
    const { data, error } = await supabase
      .from('admin_users')
      .select('id, email, role')
      .limit(1);

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'Database query failed',
        details: error.message,
        code: error.code,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'All checks passed',
      env: {
        hasUrl,
        hasServiceKey,
      },
      data: data || [],
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error?.message,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
    }, { status: 500 });
  }
}

