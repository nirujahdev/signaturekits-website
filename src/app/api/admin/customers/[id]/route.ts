import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get customer addresses
    const { data: addresses } = await supabase
      .from('customer_addresses')
      .select('*')
      .eq('customer_id', params.id)
      .order('is_default', { ascending: false });

    // Get customer orders
    const { data: orders } = await supabase
      .from('customer_orders_summary')
      .select('*')
      .eq('customer_id', params.id)
      .order('order_date', { ascending: false })
      .limit(10);

    return NextResponse.json({
      customer: data,
      addresses: addresses || [],
      recentOrders: orders || [],
    });
  } catch (error) {
    console.error('Customer detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const body = await req.json();

    const { data, error } = await supabase
      .from('customers')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
    }

    return NextResponse.json({ customer: data });
  } catch (error) {
    console.error('Customer update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

