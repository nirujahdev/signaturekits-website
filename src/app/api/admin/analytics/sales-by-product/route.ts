import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/analytics/sales-by-product
 * Get sales analytics by product
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const searchParams = req.nextUrl.searchParams;
    const period = searchParams.get('period') || 'month';
    const limit = parseInt(searchParams.get('limit') || '20');

    // Calculate date range based on period
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
        startDate = new Date(0); // All time
    }

    // Get order items with product details
    const { data: orderItems, error } = await supabase
      .from('customer_order_items')
      .select(`
        product_id,
        product_name,
        quantity,
        unit_price_with_tax,
        line_total_with_tax,
        customer_orders_summary!inner(
          order_date,
          order_state
        )
      `)
      .eq('customer_orders_summary.order_state', 'Confirmed')
      .gte('customer_orders_summary.order_date', startDate.toISOString())
      .order('customer_orders_summary.order_date', { ascending: false });

    if (error) {
      console.error('Error fetching sales by product:', error);
      return NextResponse.json(
        { error: 'Failed to fetch sales data' },
        { status: 500 }
      );
    }

    // Aggregate by product
    const productSales: Record<string, {
      product_id: string;
      product_name: string;
      total_quantity: number;
      total_revenue: number;
      order_count: number;
      average_order_value: number;
    }> = {};

    orderItems?.forEach((item: any) => {
      const productId = item.product_id;
      if (!productSales[productId]) {
        productSales[productId] = {
          product_id: productId,
          product_name: item.product_name,
          total_quantity: 0,
          total_revenue: 0,
          order_count: 0,
          average_order_value: 0,
        };
      }
      productSales[productId].total_quantity += item.quantity;
      productSales[productId].total_revenue += parseFloat(item.line_total_with_tax || 0);
      productSales[productId].order_count += 1;
    });

    // Calculate averages and sort
    const products = Object.values(productSales)
      .map(product => ({
        ...product,
        average_order_value: product.total_revenue / product.order_count,
      }))
      .sort((a, b) => b.total_revenue - a.total_revenue)
      .slice(0, limit);

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error('Sales by product error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

