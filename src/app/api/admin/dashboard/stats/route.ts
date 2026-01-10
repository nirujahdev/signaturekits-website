import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';
import { subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { format as formatDate } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'all'; // today, week, month, all

    const now = new Date();
    let startDate: Date | null = null;

    switch (period) {
      case 'today':
        startDate = startOfDay(now);
        break;
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(now);
        break;
      default:
        startDate = null; // All time
    }

    // Build queries with optional date filter
    const customerQuery = supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });
    
    const orderQuery = supabase
      .from('customer_orders_summary')
      .select('*', { count: 'exact', head: true });

    if (startDate) {
      customerQuery.gte('account_created_at', formatDate(startDate, "yyyy-MM-dd'T'HH:mm:ss"));
      orderQuery.gte('order_date', formatDate(startDate, "yyyy-MM-dd'T'HH:mm:ss"));
    }

    // Get total customers
    const { count: totalCustomers } = await customerQuery;

    // Get total orders
    const { count: totalOrders } = await orderQuery;

    // Get total revenue
    const revenueQuery = supabase
      .from('customer_orders_summary')
      .select('total_with_tax');

    if (startDate) {
      revenueQuery.gte('order_date', formatDate(startDate, "yyyy-MM-dd'T'HH:mm:ss"));
    }

    const { data: revenueData } = await revenueQuery;

    const totalRevenue = revenueData?.reduce(
      (sum, order) => sum + Number(order.total_with_tax || 0),
      0
    ) || 0;

    // Get pending orders (orders not in DISPATCHED or DELIVERED stage)
    const { count: pendingOrders } = await supabase
      .from('order_delivery_status')
      .select('*', { count: 'exact', head: true })
      .not('stage', 'in', '(DISPATCHED,DELIVERED)');

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get today's metrics for comparison
    const todayStart = startOfDay(now);
    const { count: todayOrders } = await supabase
      .from('customer_orders_summary')
      .select('*', { count: 'exact', head: true })
      .gte('order_date', formatDate(todayStart, "yyyy-MM-dd'T'HH:mm:ss"));

    const { data: todayRevenueData } = await supabase
      .from('customer_orders_summary')
      .select('total_with_tax')
      .gte('order_date', formatDate(todayStart, "yyyy-MM-dd'T'HH:mm:ss"));

    const todayRevenue = todayRevenueData?.reduce(
      (sum, order) => sum + Number(order.total_with_tax || 0),
      0
    ) || 0;

    // Get order status breakdown
    const { data: statusData } = await supabase
      .from('customer_orders_summary')
      .select('order_state');

    const statusCounts: Record<string, number> = {};
    statusData?.forEach((order) => {
      const state = order.order_state || 'Unknown';
      statusCounts[state] = (statusCounts[state] || 0) + 1;
    });

    return NextResponse.json({
      totalCustomers: totalCustomers || 0,
      totalOrders: totalOrders || 0,
      totalRevenue,
      pendingOrders: pendingOrders || 0,
      averageOrderValue,
      todayOrders: todayOrders || 0,
      todayRevenue,
      statusBreakdown: statusCounts,
      period,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      {
        totalCustomers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        averageOrderValue: 0,
        todayOrders: 0,
        todayRevenue: 0,
        statusBreakdown: {},
        period: 'all',
      },
      { status: 500 }
    );
  }
}

