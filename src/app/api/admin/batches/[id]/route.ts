import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();

    // Get batch
    const { data: batch, error: batchError } = await supabase
      .from('import_batches')
      .select('*')
      .eq('id', params.id)
      .single();

    if (batchError || !batch) {
      return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
    }

    // Get assigned orders
    const { data: assignments } = await supabase
      .from('order_batch_assignments')
      .select('*, customer_orders_summary(*)')
      .eq('batch_id', params.id);

    // Get supplier purchase list
    const { data: supplierList } = await supabase
      .from('supplier_purchase_lists')
      .select('*')
      .eq('batch_id', params.id);

    return NextResponse.json({
      batch,
      assignedOrders: assignments || [],
      supplierList: supplierList || [],
    });
  } catch (error) {
    console.error('Batch detail error:', error);
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
      .from('import_batches')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update batch' }, { status: 500 });
    }

    return NextResponse.json({ batch: data });
  } catch (error) {
    console.error('Batch update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

