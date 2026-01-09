import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const { order_id } = await req.json();

    if (!order_id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Get order
    const { data: order } = await supabase
      .from('customer_orders_summary')
      .select('vendure_order_id')
      .eq('id', order_id)
      .single();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Check if already assigned
    const { data: existing } = await supabase
      .from('order_batch_assignments')
      .select('id')
      .eq('vendure_order_id', order.vendure_order_id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Order already assigned to a batch' }, { status: 400 });
    }

    // Assign order to batch
    const { data, error } = await supabase
      .from('order_batch_assignments')
      .insert({
        batch_id: params.id,
        vendure_order_id: order.vendure_order_id,
        assigned_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Assign order error:', error);
      return NextResponse.json({ error: 'Failed to assign order' }, { status: 500 });
    }

    // Update batch order count
    await supabase.rpc('increment', {
      table_name: 'import_batches',
      id: params.id,
      column_name: 'order_count',
    });

    // Update order batch_id
    await supabase
      .from('customer_orders_summary')
      .update({ batch_id: params.id })
      .eq('id', order_id);

    return NextResponse.json({ assignment: data });
  } catch (error) {
    console.error('Assign order API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

