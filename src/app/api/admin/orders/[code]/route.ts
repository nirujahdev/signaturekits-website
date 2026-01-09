import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();

    // Get order summary
    const { data: order, error: orderError } = await supabase
      .from('customer_orders_summary')
      .select('*')
      .eq('order_code', params.code)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get order items
    const { data: items } = await supabase
      .from('customer_order_items')
      .select('*')
      .eq('order_summary_id', order.id)
      .order('created_at', { ascending: true });

    // Get delivery status
    const { data: deliveryStatus } = await supabase
      .from('order_delivery_status')
      .select('*')
      .eq('order_code', params.code)
      .single();

    // Get delivery history
    const { data: deliveryHistory } = await supabase
      .from('order_delivery_status_events')
      .select('*')
      .eq('order_code', params.code)
      .order('updated_at', { ascending: false });

    // Get batch assignment
    const { data: batchAssignment } = await supabase
      .from('order_batch_assignments')
      .select('*, import_batches(*)')
      .eq('vendure_order_id', order.vendure_order_id)
      .single();

    return NextResponse.json({
      order,
      items: items || [],
      deliveryStatus: deliveryStatus || null,
      deliveryHistory: deliveryHistory || [],
      batchAssignment: batchAssignment || null,
    });
  } catch (error) {
    console.error('Order detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const body = await req.json();

    const { data, error } = await supabase
      .from('customer_orders_summary')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('order_code', params.code)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

