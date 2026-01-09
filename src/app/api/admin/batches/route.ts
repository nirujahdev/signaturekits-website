import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('import_batches')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Batches fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch batches' }, { status: 500 });
    }

    return NextResponse.json({ batches: data || [] });
  } catch (error) {
    console.error('Batches API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getAdminSupabaseClient();
    const body = await req.json();

    // Generate batch number
    const { data: lastBatch } = await supabase
      .from('import_batches')
      .select('batch_number')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let batchNumber = 'BATCH-001';
    if (lastBatch?.batch_number) {
      const num = parseInt(lastBatch.batch_number.split('-')[1]) + 1;
      batchNumber = `BATCH-${num.toString().padStart(3, '0')}`;
    }

    const { data, error } = await supabase
      .from('import_batches')
      .insert({
        batch_number: batchNumber,
        status: 'collecting',
        target_order_count: body.target_order_count || 20,
        ...body,
      })
      .select()
      .single();

    if (error) {
      console.error('Batch create error:', error);
      return NextResponse.json({ error: 'Failed to create batch' }, { status: 500 });
    }

    return NextResponse.json({ batch: data });
  } catch (error) {
    console.error('Batch create API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

