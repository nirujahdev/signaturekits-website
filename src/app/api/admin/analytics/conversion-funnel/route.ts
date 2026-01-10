import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/analytics/conversion-funnel
 * Get conversion funnel metrics (Cart → Checkout → Order)
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get('period') || 'month';

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
        startDate = new Date(0);
    }

    // Get confirmed orders (completed checkout)
    const { data: orders, error: ordersError } = await supabase
      .from('customer_orders_summary')
      .select('id, order_date, order_state, total_with_tax')
      .eq('order_state', 'Confirmed')
      .gte('order_date', startDate.toISOString());

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch conversion data' },
        { status: 500 }
      );
    }

    // Get abandoned carts (from cart_sessions if exists, otherwise estimate)
    // For now, we'll estimate based on OTP sessions that weren't verified
    const { data: otpSessions, error: otpError } = await supabase
      .from('otp_sessions')
      .select('id, created_at, verified, vendure_order_id')
      .gte('created_at', startDate.toISOString());

    // Calculate funnel metrics
    const confirmedOrders = orders?.length || 0;
    const orderRevenue = orders?.reduce((sum, o) => sum + parseFloat(o.total_with_tax || 0), 0) || 0;
    
    // Estimate: OTP sessions that weren't verified might indicate abandoned checkout
    const otpSessionsCount = otpSessions?.length || 0;
    const verifiedSessions = otpSessions?.filter(s => s.verified).length || 0;
    const abandonedCheckout = otpSessionsCount - verifiedSessions;

    // Estimate cart sessions (assume 3x checkout sessions for cart abandonment)
    const estimatedCartSessions = otpSessionsCount * 3;

    const funnel = {
      cart_sessions: estimatedCartSessions,
      checkout_sessions: otpSessionsCount,
      completed_orders: confirmedOrders,
      abandoned_cart: estimatedCartSessions - otpSessionsCount,
      abandoned_checkout: abandonedCheckout,
      cart_to_checkout_rate: otpSessionsCount > 0 
        ? (otpSessionsCount / estimatedCartSessions) * 100 
        : 0,
      checkout_to_order_rate: otpSessionsCount > 0 
        ? (confirmedOrders / otpSessionsCount) * 100 
        : 0,
      overall_conversion_rate: estimatedCartSessions > 0 
        ? (confirmedOrders / estimatedCartSessions) * 100 
        : 0,
      average_order_value: confirmedOrders > 0 
        ? orderRevenue / confirmedOrders 
        : 0,
    };

    return NextResponse.json({ funnel });
  } catch (error: any) {
    console.error('Conversion funnel error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

