import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderCode, phoneNumber } = body;

    if (!orderCode || !phoneNumber) {
      return NextResponse.json(
        { error: 'Order code and phone number are required' },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabaseClient();

    // Normalize phone number (remove spaces, ensure 947 format)
    const normalizedPhone = phoneNumber.replace(/\s+/g, '').replace(/^\+94/, '94').replace(/^0/, '94');

    // First, verify the order exists and get customer info
    const { data: orderSummary, error: orderError } = await supabase
      .from('customer_orders_summary')
      .select(`
        order_code,
        customer_id,
        order_date,
        total_with_tax,
        currency_code,
        customers!inner(phone_number)
      `)
      .eq('order_code', orderCode.toUpperCase().trim())
      .single();

    if (orderError || !orderSummary) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get customer phone number from the joined data
    const customer = (orderSummary as any).customers;
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found for this order' },
        { status: 404 }
      );
    }

    // Verify phone number matches (normalize both for comparison)
    const customerPhoneNormalized = customer.phone_number?.replace(/\s+/g, '').replace(/^\+94/, '94').replace(/^0/, '94') || '';
    const inputPhoneNormalized = normalizedPhone.replace(/^\+94/, '94').replace(/^0/, '94');
    
    if (customerPhoneNormalized !== inputPhoneNormalized) {
      return NextResponse.json(
        { error: 'Phone number does not match this order' },
        { status: 403 }
      );
    }

    // Get delivery status
    const { data: deliveryStatus, error: statusError } = await supabase
      .from('order_delivery_status')
      .select('stage, tracking_number, note, updated_at')
      .eq('order_code', orderCode.toUpperCase())
      .single();

    // Get delivery status history
    const { data: statusHistory, error: historyError } = await supabase
      .from('order_delivery_status_events')
      .select('stage, tracking_number, note, updated_at')
      .eq('order_code', orderCode.toUpperCase())
      .order('updated_at', { ascending: true });

    // Get order items - need to get order_summary_id first
    const { data: orderSummaryFull, error: summaryError } = await supabase
      .from('customer_orders_summary')
      .select('id')
      .eq('order_code', orderCode.toUpperCase().trim())
      .single();

    let orderItems: any[] = [];
    if (!summaryError && orderSummaryFull) {
      const { data: items, error: itemsError } = await supabase
        .from('customer_order_items')
        .select('product_name, variant_name, quantity, unit_price_with_tax')
        .eq('order_summary_id', orderSummaryFull.id);
      
      if (!itemsError && items) {
        orderItems = items;
      }
    }

    return NextResponse.json({
      order: {
        code: orderSummary.order_code,
        date: orderSummary.order_date,
        total: orderSummary.total_with_tax,
        currency: orderSummary.currency_code,
      },
      deliveryStatus: deliveryStatus || {
        stage: 'ORDER_CONFIRMED',
        tracking_number: null,
        note: null,
        updated_at: orderSummary.order_date,
      },
      statusHistory: statusHistory || [],
      items: orderItems || [],
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json(
      { error: 'Failed to track order' },
      { status: 500 }
    );
  }
}

