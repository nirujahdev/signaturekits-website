import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/analytics/sales-by-category
 * Get sales analytics by category
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

    // Get order items with product categories
    const { data: orderItems, error } = await supabase
      .from('customer_order_items')
      .select(`
        product_id,
        quantity,
        line_total_with_tax,
        customer_orders_summary!inner(
          order_date,
          order_state
        ),
        products!inner(
          categories
        )
      `)
      .eq('customer_orders_summary.order_state', 'Confirmed')
      .gte('customer_orders_summary.order_date', startDate.toISOString());

    if (error) {
      console.error('Error fetching sales by category:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sales data' },
        { status: 500 }
      );
    }

    // Aggregate by category
    const categorySales: Record<string, {
      category: string;
      total_quantity: number;
      total_revenue: number;
      order_count: number;
      product_count: number;
    }> = {};

    const categoryProductSet: Record<string, Set<string>> = {};

    orderItems?.forEach((item: any) => {
      const categories = item.products?.categories || [];
      const revenue = parseFloat(item.line_total_with_tax || 0);
      const quantity = item.quantity;

      categories.forEach((category: string) => {
        if (!categorySales[category]) {
          categorySales[category] = {
            category,
            total_quantity: 0,
            total_revenue: 0,
            order_count: 0,
            product_count: 0,
          };
          categoryProductSet[category] = new Set();
        }
        categorySales[category].total_quantity += quantity;
        categorySales[category].total_revenue += revenue;
        categorySales[category].order_count += 1;
        categoryProductSet[category].add(item.product_id);
      });
    });

    // Calculate product counts and sort
    const categories = Object.values(categorySales)
      .map(cat => ({
        ...cat,
        product_count: categoryProductSet[cat.category]?.size || 0,
      }))
      .sort((a, b) => b.total_revenue - a.total_revenue);

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Sales by category error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

