import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/sms-logs
 * List SMS logs with filters
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const searchParams = req.nextUrl.searchParams;
    
    const phone = searchParams.get('phone');
    const status = searchParams.get('status');
    const messageType = searchParams.get('message_type');
    const orderCode = searchParams.get('order_code');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('sms_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (phone) {
      query = query.ilike('phone_number', `%${phone}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (messageType) {
      query = query.eq('message_type', messageType);
    }

    if (orderCode) {
      query = query.eq('related_order_code', orderCode);
    }

    if (startDate) {
      query = query.gte('created_at', startDate);
    }

    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching SMS logs:', error);
      return NextResponse.json(
        { error: 'Failed to fetch SMS logs' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      logs: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('SMS logs API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

