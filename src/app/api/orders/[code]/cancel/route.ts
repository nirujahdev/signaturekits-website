import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabaseClient } from '@/lib/admin-supabase';

export async function POST(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    const body = await req.json();
    const { phoneNumber, reason } = body;

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    const supabase = getAdminSupabaseClient();

    // Normalize phone number
    const normalizedPhone = phoneNumber.replace(/\s+/g, '').replace(/^\+94/, '94').replace(/^0/, '94');

    // Get order and verify phone number
    const { data: orderSummary, error: orderError } = await supabase
      .from('customer_orders_summary')
      .select('id, order_code, customer_id, order_date, order_state, delivery_stage')
      .eq('order_code', code.toUpperCase().trim())
      .single();

    if (orderError || !orderSummary) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get customer to verify phone number
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, phone_number')
      .eq('id', orderSummary.customer_id)
      .single();

    if (customerError || !customer) {
      return NextResponse.json(
        { error: 'Customer not found for this order' },
        { status: 404 }
      );
    }

    // Verify phone number matches
    const customerPhoneNormalized = customer.phone_number?.replace(/\s+/g, '').replace(/^\+94/, '94').replace(/^0/, '94') || '';
    const inputPhoneNormalized = normalizedPhone.replace(/^\+94/, '94').replace(/^0/, '94');
    
    if (customerPhoneNormalized !== inputPhoneNormalized) {
      return NextResponse.json(
        { error: 'Phone number does not match this order' },
        { status: 403 }
      );
    }

    // Check if order is already cancelled
    if (orderSummary.order_state === 'Cancelled' || orderSummary.order_state === 'cancelled') {
      return NextResponse.json(
        { error: 'Order is already cancelled' },
        { status: 400 }
      );
    }

    // Check if order was placed within 24 hours
    const orderDate = new Date(orderSummary.order_date);
    const now = new Date();
    const hoursSinceOrder = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);

    if (hoursSinceOrder > 24) {
      return NextResponse.json(
        { error: 'Order can only be cancelled within 24 hours of placement' },
        { status: 400 }
      );
    }

    // Check if order has been dispatched (cannot cancel after dispatch)
    if (orderSummary.delivery_stage === 'DISPATCHED' || orderSummary.delivery_stage === 'DELIVERED') {
      return NextResponse.json(
        { error: 'Order cannot be cancelled as it has already been dispatched' },
        { status: 400 }
      );
    }

    // Update order state to cancelled
    const { error: updateError } = await supabase
      .from('customer_orders_summary')
      .update({
        order_state: 'Cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderSummary.id);

    if (updateError) {
      console.error('Error cancelling order:', updateError);
      return NextResponse.json(
        { error: 'Failed to cancel order' },
        { status: 500 }
      );
    }

    // Update delivery status if exists
    await supabase
      .from('order_delivery_status')
      .update({
        stage: 'ORDER_CONFIRMED', // Keep at confirmed but order is cancelled
        note: reason ? `Cancelled by customer: ${reason}` : 'Cancelled by customer',
        updated_at: new Date().toISOString(),
      })
      .eq('order_code', code.toUpperCase().trim());

    // Add cancellation event to history
    await supabase
      .from('order_delivery_status_events')
      .insert({
        order_code: code.toUpperCase().trim(),
        stage: 'ORDER_CONFIRMED',
        note: reason ? `Order cancelled by customer: ${reason}` : 'Order cancelled by customer',
        updated_by: 'customer',
      });

    return NextResponse.json({
      success: true,
      message: 'Order has been cancelled successfully',
      orderCode: code.toUpperCase().trim(),
    });
  } catch (error: any) {
    console.error('Error cancelling order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to cancel order' },
      { status: 500 }
    );
  }
}

