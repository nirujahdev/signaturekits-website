import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';
import { format as formatDate, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'month'; // today, week, month, year, all
    const now = new Date();

    // Calculate date range based on period
    let startDate: Date;
    let endDate: Date = now;

    switch (period) {
      case 'today':
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case 'week':
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case 'month':
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      case 'year':
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      default:
        startDate = new Date(0); // All time
    }

    // Revenue trends (daily for last 30 days)
    const revenueTrendsQuery = supabase
      .from('customer_orders_summary')
      .select('order_date, total_with_tax')
      .gte('order_date', formatDate(subDays(now, 30), "yyyy-MM-dd'T'HH:mm:ss"))
      .order('order_date', { ascending: true });

    const { data: revenueData } = await revenueTrendsQuery;

    // Group by day
    const revenueByDay: Record<string, { revenue: number; orders: number }> = {};
    revenueData?.forEach((order) => {
      const day = formatDate(new Date(order.order_date), 'yyyy-MM-dd');
      if (!revenueByDay[day]) {
        revenueByDay[day] = { revenue: 0, orders: 0 };
      }
      revenueByDay[day].revenue += Number(order.total_with_tax || 0);
      revenueByDay[day].orders += 1;
    });

    const revenueTrends = Object.entries(revenueByDay).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders,
    }));

    // Order status breakdown
    const { data: statusData } = await supabase
      .from('customer_orders_summary')
      .select('order_state, total_with_tax');

    const statusBreakdown: Record<string, { count: number; revenue: number }> = {};
    statusData?.forEach((order) => {
      const state = order.order_state || 'Unknown';
      if (!statusBreakdown[state]) {
        statusBreakdown[state] = { count: 0, revenue: 0 };
      }
      statusBreakdown[state].count += 1;
      statusBreakdown[state].revenue += Number(order.total_with_tax || 0);
    });

    // Customer growth (last 90 days)
    const customerGrowthQuery = supabase
      .from('customers')
      .select('account_created_at')
      .gte('account_created_at', format(subDays(now, 90), "yyyy-MM-dd'T'HH:mm:ss"))
      .order('account_created_at', { ascending: true });

    const { data: customerData } = await customerGrowthQuery;

    const customersByDay: Record<string, number> = {};
    customerData?.forEach((customer) => {
      const day = formatDate(new Date(customer.account_created_at), 'yyyy-MM-dd');
      customersByDay[day] = (customersByDay[day] || 0) + 1;
    });

    const customerGrowth = Object.entries(customersByDay).map(([date, count]) => ({
      date,
      newCustomers: count,
    }));

    // Top products
    const { data: productData } = await supabase
      .from('customer_order_items')
      .select('product_name, quantity, line_total_with_tax')
      .limit(1000);

    const productStats: Record<string, { quantity: number; revenue: number }> = {};
    productData?.forEach((item) => {
      const name = item.product_name || 'Unknown';
      if (!productStats[name]) {
        productStats[name] = { quantity: 0, revenue: 0 };
      }
      productStats[name].quantity += item.quantity || 0;
      productStats[name].revenue += Number(item.line_total_with_tax || 0);
    });

    const topProducts = Object.entries(productStats)
      .map(([name, stats]) => ({
        name,
        quantity: stats.quantity,
        revenue: stats.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Period-specific metrics
    const periodQuery = supabase
      .from('customer_orders_summary')
      .select('total_with_tax, order_date')
      .gte('order_date', format(startDate, "yyyy-MM-dd'T'HH:mm:ss"))
      .lte('order_date', format(endDate, "yyyy-MM-dd'T'HH:mm:ss"));

    const { data: periodOrders, count: periodOrderCount } = await periodQuery.select('*', { count: 'exact', head: false });

    const periodRevenue = periodOrders?.reduce((sum, order) => sum + Number(order.total_with_tax || 0), 0) || 0;
    const periodOrderCountValue = periodOrderCount || 0;
    const averageOrderValue = periodOrderCountValue > 0 ? periodRevenue / periodOrderCountValue : 0;

    // Customer metrics for period
    const { count: periodCustomerCount } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .gte('account_created_at', format(startDate, "yyyy-MM-dd'T'HH:mm:ss"))
      .lte('account_created_at', format(endDate, "yyyy-MM-dd'T'HH:mm:ss"));

    return NextResponse.json({
      period,
      startDate: formatDate(startDate, 'yyyy-MM-dd'),
      endDate: formatDate(endDate, 'yyyy-MM-dd'),
      metrics: {
        revenue: periodRevenue,
        orders: periodOrderCountValue,
        customers: periodCustomerCount || 0,
        averageOrderValue,
      },
      revenueTrends,
      statusBreakdown: Object.entries(statusBreakdown).map(([state, data]) => ({
        state,
        count: data.count,
        revenue: data.revenue,
      })),
      customerGrowth,
      topProducts,
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      {
        period: 'month',
        metrics: {
          revenue: 0,
          orders: 0,
          customers: 0,
          averageOrderValue: 0,
        },
        revenueTrends: [],
        statusBreakdown: [],
        customerGrowth: [],
        topProducts: [],
      },
      { status: 500 }
    );
  }
}

