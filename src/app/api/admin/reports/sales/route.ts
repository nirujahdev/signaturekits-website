import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const format = searchParams.get('format') || 'json'; // json, csv

    let query = supabase
      .from('customer_orders_summary')
      .select(`
        *,
        customer_order_items(*)
      `)
      .order('order_date', { ascending: false });

    if (startDate) {
      query = query.gte('order_date', startDate);
    }
    if (endDate) {
      query = query.lte('order_date', endDate);
    }

    const { data: orders, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate summary
    const totalRevenue = orders?.reduce((sum, order) => sum + Number(order.total_with_tax || 0), 0) || 0;
    const totalOrders = orders?.length || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Group by payment method
    const paymentMethodBreakdown: Record<string, { count: number; revenue: number }> = {};
    orders?.forEach((order) => {
      const method = order.payment_method || 'Unknown';
      if (!paymentMethodBreakdown[method]) {
        paymentMethodBreakdown[method] = { count: 0, revenue: 0 };
      }
      paymentMethodBreakdown[method].count += 1;
      paymentMethodBreakdown[method].revenue += Number(order.total_with_tax || 0);
    });

    // Group by status
    const statusBreakdown: Record<string, { count: number; revenue: number }> = {};
    orders?.forEach((order) => {
      const status = order.order_state || 'Unknown';
      if (!statusBreakdown[status]) {
        statusBreakdown[status] = { count: 0, revenue: 0 };
      }
      statusBreakdown[status].count += 1;
      statusBreakdown[status].revenue += Number(order.total_with_tax || 0);
    });

    const report = {
      period: {
        startDate: startDate || 'All time',
        endDate: endDate || 'All time',
      },
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
      },
      paymentMethodBreakdown: Object.entries(paymentMethodBreakdown).map(([method, data]) => ({
        method,
        count: data.count,
        revenue: data.revenue,
      })),
      statusBreakdown: Object.entries(statusBreakdown).map(([status, data]) => ({
        status,
        count: data.count,
        revenue: data.revenue,
      })),
      orders: orders?.map((order) => ({
        orderCode: order.order_code,
        orderDate: order.order_date,
        customerId: order.customer_id,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        orderState: order.order_state,
        subtotal: order.subtotal,
        taxTotal: order.tax_total,
        shippingTotal: order.shipping_total,
        totalWithTax: order.total_with_tax,
        itemCount: order.customer_order_items?.length || 0,
      })) || [],
    };

    if (format === 'csv') {
      // Generate CSV
      const csvRows = [
        ['Order Code', 'Date', 'Payment Method', 'Status', 'Total', 'Items'].join(','),
        ...(orders || []).map((order) =>
          [
            order.order_code,
            order.order_date,
            order.payment_method || 'N/A',
            order.order_state,
            order.total_with_tax,
            order.customer_order_items?.length || 0,
          ].join(',')
        ),
      ];

      return new NextResponse(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="sales-report-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json(report);
  } catch (error: any) {
    console.error('Sales report error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate report' }, { status: 500 });
  }
}

