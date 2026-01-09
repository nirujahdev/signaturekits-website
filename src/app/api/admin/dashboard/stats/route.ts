import { NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function GET() {
  try {
    const supabase = getAdminSupabaseClient();

    // Get total customers
    const { count: totalCustomers } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });

    // Get total orders
    const { count: totalOrders } = await supabase
      .from('customer_orders_summary')
      .select('*', { count: 'exact', head: true });

    // Get total revenue (sum of all order totals)
    const { data: revenueData } = await supabase
      .from('customer_orders_summary')
      .select('total_with_tax');

    const totalRevenue = revenueData?.reduce(
      (sum, order) => sum + Number(order.total_with_tax || 0),
      0
    ) || 0;

    // Get pending orders (orders not in DISPATCHED or DELIVERED stage)
    const { count: pendingOrders } = await supabase
      .from('order_delivery_status')
      .select('*', { count: 'exact', head: true })
      .not('stage', 'in', '(DISPATCHED,DELIVERED)');

    return NextResponse.json({
      totalCustomers: totalCustomers || 0,
      totalOrders: totalOrders || 0,
      totalRevenue,
      pendingOrders: pendingOrders || 0,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      {
        totalCustomers: 0,
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
      },
      { status: 500 }
    );
  }
}

