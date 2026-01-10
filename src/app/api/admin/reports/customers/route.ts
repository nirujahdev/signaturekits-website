import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const format = searchParams.get('format') || 'json';

    let query = supabase
      .from('customers')
      .select(`
        *,
        customer_orders_summary(*)
      `)
      .order('account_created_at', { ascending: false });

    if (startDate) {
      query = query.gte('account_created_at', startDate);
    }
    if (endDate) {
      query = query.lte('account_created_at', endDate);
    }

    const { data: customers, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate metrics
    const totalCustomers = customers?.length || 0;
    const verifiedCustomers = customers?.filter((c) => c.phone_verified).length || 0;
    const activeCustomers = customers?.filter((c) => c.is_active).length || 0;

    // Customer lifetime value
    const customersWithLTV = customers?.map((customer) => {
      const orders = customer.customer_orders_summary || [];
      const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_with_tax || 0), 0);
      const orderCount = orders.length;
      const averageOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;

      return {
        customerId: customer.id,
        email: customer.email,
        name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
        phoneNumber: customer.phone_number,
        phoneVerified: customer.phone_verified,
        accountCreatedAt: customer.account_created_at,
        totalOrders: orderCount,
        totalSpent,
        averageOrderValue,
        lastOrderDate: orders.length > 0 ? orders[0].order_date : null,
      };
    }) || [];

    // Segment customers
    const segments = {
      highValue: customersWithLTV.filter((c) => c.totalSpent >= 10000).length,
      mediumValue: customersWithLTV.filter((c) => c.totalSpent >= 5000 && c.totalSpent < 10000).length,
      lowValue: customersWithLTV.filter((c) => c.totalSpent < 5000).length,
      new: customersWithLTV.filter((c) => c.totalOrders === 0).length,
    };

    const report = {
      period: {
        startDate: startDate || 'All time',
        endDate: endDate || 'All time',
      },
      summary: {
        totalCustomers,
        verifiedCustomers,
        activeCustomers,
        verificationRate: totalCustomers > 0 ? (verifiedCustomers / totalCustomers) * 100 : 0,
      },
      segments,
      customers: customersWithLTV.sort((a, b) => b.totalSpent - a.totalSpent),
    };

    if (format === 'csv') {
      const csvRows = [
        [
          'Email',
          'Name',
          'Phone',
          'Verified',
          'Account Created',
          'Total Orders',
          'Total Spent',
          'Average Order Value',
          'Last Order',
        ].join(','),
        ...customersWithLTV.map((customer) =>
          [
            customer.email,
            customer.name,
            customer.phoneNumber || 'N/A',
            customer.phoneVerified ? 'Yes' : 'No',
            customer.accountCreatedAt,
            customer.totalOrders,
            customer.totalSpent,
            customer.averageOrderValue,
            customer.lastOrderDate || 'N/A',
          ].join(',')
        ),
      ];

      return new NextResponse(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="customers-report-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json(report);
  } catch (error: any) {
    console.error('Customers report error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate report' }, { status: 500 });
  }
}

