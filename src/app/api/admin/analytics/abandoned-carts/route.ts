import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/analytics/abandoned-carts
 * Get list of abandoned carts (OTP sessions not verified, no order created)
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get('period') || 'week';
    const limit = parseInt(searchParams.get('limit') || '50');

    // Calculate date range
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    // Get OTP sessions that weren't verified and don't have an associated order
    const { data: otpSessions, error } = await supabase
      .from('otp_sessions')
      .select('id, phone, created_at, verified, vendure_order_id, vendure_customer_id')
      .eq('verified', false)
      .is('vendure_order_id', null)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching abandoned carts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch abandoned cart data' },
        { status: 500 }
      );
    }

    // Get customer info if available
    const customerIds = otpSessions
      ?.filter(s => s.vendure_customer_id)
      .map(s => s.vendure_customer_id) || [];

    let customerMap = new Map();
    if (customerIds.length > 0) {
      const { data: customers } = await supabase
        .from('customers')
        .select('id, email, first_name, last_name, phone_number')
        .in('vendure_customer_id', customerIds);
      
      customers?.forEach(c => {
        customerMap.set(c.vendure_customer_id, c);
      });
    }

    const abandonedCarts = otpSessions?.map(session => {
      const customer = session.vendure_customer_id 
        ? customerMap.get(session.vendure_customer_id)
        : null;

      return {
        id: session.id,
        phone: session.phone,
        customer_email: customer?.email || null,
        customer_name: customer 
          ? `${customer.first_name || ''} ${customer.last_name || ''}`.trim() 
          : null,
        created_at: session.created_at,
        hours_since_abandoned: Math.floor(
          (new Date().getTime() - new Date(session.created_at).getTime()) / (1000 * 60 * 60)
        ),
      };
    }) || [];

    return NextResponse.json({
      abandoned_carts: abandonedCarts,
      total: abandonedCarts.length,
    });
  } catch (error: any) {
    console.error('Abandoned carts error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

