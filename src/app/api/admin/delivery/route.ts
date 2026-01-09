import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const stage = searchParams.get('stage');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('order_delivery_status')
      .select('*, customer_orders_summary(*)', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (stage) {
      query = query.eq('stage', stage);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Delivery status fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch delivery statuses' }, { status: 500 });
    }

    return NextResponse.json({
      deliveries: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Delivery API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

