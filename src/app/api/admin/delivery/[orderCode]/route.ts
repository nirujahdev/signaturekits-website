import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function PUT(
  req: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();
    const body = await req.json();
    const { stage, tracking_number, note } = body;

    if (!stage) {
      return NextResponse.json({ error: 'Stage is required' }, { status: 400 });
    }

    // Update or insert delivery status
    const { data: existing } = await supabase
      .from('order_delivery_status')
      .select('id')
      .eq('order_code', params.orderCode)
      .single();

    let deliveryStatus;
    if (existing) {
      const { data, error } = await supabase
        .from('order_delivery_status')
        .update({
          stage,
          tracking_number: tracking_number || null,
          note: note || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      deliveryStatus = data;
    } else {
      const { data, error } = await supabase
        .from('order_delivery_status')
        .insert({
          order_code: params.orderCode,
          stage,
          tracking_number: tracking_number || null,
          note: note || null,
        })
        .select()
        .single();

      if (error) throw error;
      deliveryStatus = data;
    }

    // Add to history
    await supabase.from('order_delivery_status_events').insert({
      order_code: params.orderCode,
      stage,
      tracking_number: tracking_number || null,
      note: note || null,
    });

    // Update order summary if exists
    await supabase
      .from('customer_orders_summary')
      .update({
        delivery_stage: stage,
        tracking_number: tracking_number || null,
        updated_at: new Date().toISOString(),
      })
      .eq('order_code', params.orderCode);

    return NextResponse.json({ deliveryStatus });
  } catch (error) {
    console.error('Delivery update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { orderCode: string } }
) {
  try {
    const supabase = getAdminSupabaseClient();

    const { data: deliveryStatus } = await supabase
      .from('order_delivery_status')
      .select('*')
      .eq('order_code', params.orderCode)
      .single();

    const { data: history } = await supabase
      .from('order_delivery_status_events')
      .select('*')
      .eq('order_code', params.orderCode)
      .order('updated_at', { ascending: false });

    return NextResponse.json({
      deliveryStatus: deliveryStatus || null,
      history: history || [],
    });
  } catch (error) {
    console.error('Delivery detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

