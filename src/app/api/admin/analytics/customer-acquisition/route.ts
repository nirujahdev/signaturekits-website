import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/analytics/customer-acquisition
 * Get customer acquisition analytics (new vs returning)
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

    // Get all customers who placed orders in the period
    const { data: orders, error: ordersError } = await supabase
      .from('customer_orders_summary')
      .select('customer_id, order_date, total_with_tax')
      .eq('order_state', 'Confirmed')
      .gte('order_date', startDate.toISOString())
      .order('order_date', { ascending: true });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch customer data' },
        { status: 500 }
      );
    }

    // Get customer account creation dates
    const customerIds = [...new Set(orders?.map(o => o.customer_id) || [])];
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('id, account_created_at')
      .in('id', customerIds);

    if (customersError) {
      console.error('Error fetching customers:', customersError);
      return NextResponse.json(
        { error: 'Failed to fetch customer data' },
        { status: 500 }
      );
    }

    // Categorize customers
    const customerMap = new Map(customers?.map(c => [c.id, c]) || []);
    const dailyStats: Record<string, {
      date: string;
      new_customers: number;
      returning_customers: number;
      new_customer_revenue: number;
      returning_customer_revenue: number;
    }> = {};

    orders?.forEach((order) => {
      const customer = customerMap.get(order.customer_id);
      if (!customer) return;

      const orderDate = new Date(order.order_date).toISOString().split('T')[0];
      const accountCreatedDate = customer.account_created_at 
        ? new Date(customer.account_created_at).toISOString().split('T')[0]
        : null;

      const isNewCustomer = accountCreatedDate && accountCreatedDate >= startDate.toISOString().split('T')[0];
      const revenue = parseFloat(order.total_with_tax || 0);

      if (!dailyStats[orderDate]) {
        dailyStats[orderDate] = {
          date: orderDate,
          new_customers: 0,
          returning_customers: 0,
          new_customer_revenue: 0,
          returning_customer_revenue: 0,
        };
      }

      if (isNewCustomer) {
        dailyStats[orderDate].new_customers += 1;
        dailyStats[orderDate].new_customer_revenue += revenue;
      } else {
        dailyStats[orderDate].returning_customers += 1;
        dailyStats[orderDate].returning_customer_revenue += revenue;
      }
    });

    const timeline = Object.values(dailyStats).sort((a, b) => 
      a.date.localeCompare(b.date)
    );

    // Summary stats
    const totalNew = timeline.reduce((sum, day) => sum + day.new_customers, 0);
    const totalReturning = timeline.reduce((sum, day) => sum + day.returning_customers, 0);
    const totalNewRevenue = timeline.reduce((sum, day) => sum + day.new_customer_revenue, 0);
    const totalReturningRevenue = timeline.reduce((sum, day) => sum + day.returning_customer_revenue, 0);

    return NextResponse.json({
      timeline,
      summary: {
        total_new_customers: totalNew,
        total_returning_customers: totalReturning,
        new_customer_revenue: totalNewRevenue,
        returning_customer_revenue: totalReturningRevenue,
        new_customer_average_order_value: totalNew > 0 ? totalNewRevenue / totalNew : 0,
        returning_customer_average_order_value: totalReturning > 0 ? totalReturningRevenue / totalReturning : 0,
      },
    });
  } catch (error: any) {
    console.error('Customer acquisition error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

