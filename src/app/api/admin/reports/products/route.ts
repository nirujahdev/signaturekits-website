import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const format = searchParams.get('format') || 'json';

    // Get order items within date range
    let orderQuery = supabase
      .from('customer_orders_summary')
      .select('id, order_date')
      .order('order_date', { ascending: false });

    if (startDate) {
      orderQuery = orderQuery.gte('order_date', startDate);
    }
    if (endDate) {
      orderQuery = orderQuery.lte('order_date', endDate);
    }

    const { data: orders } = await orderQuery;

    const orderIds = orders?.map((o) => o.id) || [];

    if (orderIds.length === 0) {
      return NextResponse.json({
        period: {
          startDate: startDate || 'All time',
          endDate: endDate || 'All time',
        },
        products: [],
        summary: {
          totalProducts: 0,
          totalQuantity: 0,
          totalRevenue: 0,
        },
      });
    }

    // Get order items for these orders
    const { data: orderItems, error } = await supabase
      .from('customer_order_items')
      .select('*')
      .in('order_summary_id', orderIds);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Aggregate by product
    const productStats: Record<
      string,
      {
        name: string;
        sku: string;
        quantity: number;
        revenue: number;
        orderCount: number;
        avgPrice: number;
      }
    > = {};

    orderItems?.forEach((item) => {
      const key = item.product_id || item.product_name;
      if (!productStats[key]) {
        productStats[key] = {
          name: item.product_name || 'Unknown',
          sku: item.sku || 'N/A',
          quantity: 0,
          revenue: 0,
          orderCount: 0,
          avgPrice: 0,
        };
      }
      productStats[key].quantity += item.quantity || 0;
      productStats[key].revenue += Number(item.line_total_with_tax || 0);
      productStats[key].orderCount += 1;
    });

    // Calculate average price
    Object.values(productStats).forEach((stat) => {
      stat.avgPrice = stat.quantity > 0 ? stat.revenue / stat.quantity : 0;
    });

    const products = Object.values(productStats)
      .sort((a, b) => b.revenue - a.revenue)
      .map((stat, index) => ({
        rank: index + 1,
        ...stat,
      }));

    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);

    const report = {
      period: {
        startDate: startDate || 'All time',
        endDate: endDate || 'All time',
      },
      summary: {
        totalProducts: products.length,
        totalQuantity,
        totalRevenue,
      },
      products,
      bestSellers: products.slice(0, 10),
      worstSellers: products.slice(-10).reverse(),
    };

    if (format === 'csv') {
      const csvRows = [
        ['Rank', 'Product Name', 'SKU', 'Quantity Sold', 'Revenue', 'Orders', 'Avg Price'].join(','),
        ...products.map((product) =>
          [
            product.rank,
            product.name,
            product.sku,
            product.quantity,
            product.revenue,
            product.orderCount,
            product.avgPrice,
          ].join(',')
        ),
      ];

      return new NextResponse(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="products-report-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json(report);
  } catch (error: any) {
    console.error('Products report error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate report' }, { status: 500 });
  }
}

