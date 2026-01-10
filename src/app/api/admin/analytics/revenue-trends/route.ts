import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/analytics/revenue-trends
 * Get revenue trends over time
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get('period') || 'month';
    const granularity = searchParams.get('granularity') || 'day'; // day, week, month

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

    // Get orders
    const { data: orders, error } = await supabase
      .from('customer_orders_summary')
      .select('order_date, total_with_tax, order_state')
      .eq('order_state', 'Confirmed')
      .gte('order_date', startDate.toISOString())
      .order('order_date', { ascending: true });

    if (error) {
      console.error('Error fetching revenue trends:', error);
      return NextResponse.json(
        { error: 'Failed to fetch revenue data' },
        { status: 500 }
      );
    }

    // Group by time period
    const revenueByPeriod: Record<string, {
      period: string;
      revenue: number;
      order_count: number;
      average_order_value: number;
    }> = {};

    orders?.forEach((order) => {
      const orderDate = new Date(order.order_date);
      let periodKey: string;

      if (granularity === 'day') {
        periodKey = orderDate.toISOString().split('T')[0];
      } else if (granularity === 'week') {
        const weekStart = new Date(orderDate);
        weekStart.setDate(orderDate.getDate() - orderDate.getDay());
        periodKey = weekStart.toISOString().split('T')[0];
      } else {
        periodKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!revenueByPeriod[periodKey]) {
        revenueByPeriod[periodKey] = {
          period: periodKey,
          revenue: 0,
          order_count: 0,
          average_order_value: 0,
        };
      }

      revenueByPeriod[periodKey].revenue += parseFloat(order.total_with_tax || 0);
      revenueByPeriod[periodKey].order_count += 1;
    });

    // Calculate averages and sort
    const trends = Object.values(revenueByPeriod)
      .map(period => ({
        ...period,
        average_order_value: period.order_count > 0 
          ? period.revenue / period.order_count 
          : 0,
      }))
      .sort((a, b) => a.period.localeCompare(b.period));

    // Calculate growth
    const growth = trends.length > 1
      ? ((trends[trends.length - 1].revenue - trends[0].revenue) / trends[0].revenue) * 100
      : 0;

    return NextResponse.json({
      trends,
      growth,
      total_revenue: trends.reduce((sum, t) => sum + t.revenue, 0),
      total_orders: trends.reduce((sum, t) => sum + t.order_count, 0),
    });
  } catch (error: any) {
    console.error('Revenue trends error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

