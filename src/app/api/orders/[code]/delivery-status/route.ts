import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { vendureQuery } from '@/lib/vendure-client';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const GET_ORDER_BY_CODE = `
  query GetOrderByCode($code: String!) {
    orderByCode(code: $code) {
      id
      code
      customFields {
        phoneNumber
        phoneVerified
        deliveryStage
        trackingNumber
      }
      shippingAddress {
        phoneNumber
      }
    }
  }
`;

/**
 * GET /api/orders/[code]/delivery-status
 * Get delivery status for an order with phone validation
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    const phone = req.nextUrl.searchParams.get('phone');

    if (!code) {
      return NextResponse.json({ error: 'Order code required' }, { status: 400 });
    }

    // Initialize Supabase client at runtime (not build time)
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get order from Vendure to validate phone
    const orderResult = await vendureQuery(GET_ORDER_BY_CODE, { code });
    const order = orderResult?.orderByCode;

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Validate phone number if provided
    if (phone) {
      const orderPhone = order.customFields?.phoneNumber || order.shippingAddress?.phoneNumber;
      const normalizedPhone = phone.replace(/^\+94|^0/, '947');
      const normalizedOrderPhone = orderPhone?.replace(/^\+94|^0/, '947');

      if (normalizedPhone !== normalizedOrderPhone) {
        return NextResponse.json(
          { error: 'Phone number does not match this order' },
          { status: 403 }
        );
      }
    }

    // Get delivery status from Supabase
    const { data: deliveryStatus, error } = await supabase
      .from('order_delivery_status')
      .select('*')
      .eq('order_code', code)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found
      throw error;
    }

    // If no delivery status exists, create one from Vendure custom fields
    if (!deliveryStatus && order.customFields?.deliveryStage) {
      const { data: newStatus } = await supabase.rpc('update_order_delivery_status', {
        p_order_code: code,
        p_stage: order.customFields.deliveryStage,
        p_tracking_number: order.customFields.trackingNumber || null,
        p_note: null,
        p_updated_by: 'system',
      });

      return NextResponse.json({
        orderCode: code,
        stage: newStatus?.stage || order.customFields.deliveryStage || 'ORDER_CONFIRMED',
        trackingNumber: newStatus?.tracking_number || order.customFields.trackingNumber || null,
        note: newStatus?.note || null,
        updatedAt: newStatus?.updated_at || new Date().toISOString(),
      });
    }

    return NextResponse.json({
      orderCode: code,
      stage: deliveryStatus?.stage || order.customFields?.deliveryStage || 'ORDER_CONFIRMED',
      trackingNumber: deliveryStatus?.tracking_number || order.customFields?.trackingNumber || null,
      note: deliveryStatus?.note || null,
      updatedAt: deliveryStatus?.updated_at || new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Delivery status error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get delivery status' },
      { status: 500 }
    );
  }
}

