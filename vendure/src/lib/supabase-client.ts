import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client for Vendure backend
 * Used to interact with custom tables (batches, OTP, tracking)
 */
export function createSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL and Service Role Key must be configured');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Batch Import Operations
 */
export const batchImportOperations = {
  async createBatch(targetOrderCount: number, notes?: string) {
    const supabase = createSupabaseClient();
    
    // Generate batch number using Supabase function
    const { data: batchNumber, error: batchNumberError } = await supabase.rpc('generate_batch_number');
    
    if (batchNumberError) throw batchNumberError;
    
    const { data, error } = await supabase
      .from('import_batches')
      .insert({
        batch_number: batchNumber,
        target_order_count: targetOrderCount,
        status: 'collecting',
        notes: notes || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getBatch(batchId: string) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('import_batches')
      .select('*')
      .eq('id', batchId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateBatchStatus(batchId: string, status: string) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('import_batches')
      .update({ status })
      .eq('id', batchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async assignOrderToBatch(orderId: string, batchId: string) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('order_batch_assignments')
      .insert({
        vendure_order_id: orderId,
        batch_id: batchId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getBatchStatistics(batchId: string) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.rpc('get_batch_statistics', {
      batch_uuid: batchId,
    });

    if (error) throw error;
    return data;
  },
};

/**
 * SMS OTP Operations (Text.lk)
 */
export const otpOperations = {
  async getOTPSession(sessionId: string, phone: string) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('otp_sessions')
      .select('*')
      .eq('session_id', sessionId)
      .eq('phone', phone)
      .eq('verified', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  },

  async markOrderAsVerified(orderId: string, phone: string) {
    const supabase = createSupabaseClient();
    // This would update the Vendure order via Admin API
    // For now, just return success
    return { success: true };
  },
};

/**
 * Order Tracking Operations
 */
export const orderTrackingOperations = {
  async createTracking(orderId: string, shippingAddress: any) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('order_tracking')
      .insert({
        vendure_order_id: orderId,
        status: 'pending',
        shipping_address: shippingAddress,
        carrier: 'Trans Express',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTrackingStatus(orderId: string, status: string, trackingNumber?: string) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('order_tracking')
      .update({
        status,
        tracking_number: trackingNumber,
        updated_at: new Date().toISOString(),
      })
      .eq('vendure_order_id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getTracking(orderId: string) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('order_tracking')
      .select('*')
      .eq('vendure_order_id', orderId)
      .single();

    if (error) throw error;
    return data;
  },
};

/**
 * Customer Operations
 */
export const customerOperations = {
  async syncCustomer(vendureCustomer: any) {
    const supabase = createSupabaseClient();
    
    const customerData = {
      vendure_customer_id: vendureCustomer.id.toString(),
      email: vendureCustomer.emailAddress,
      first_name: vendureCustomer.firstName || '',
      last_name: vendureCustomer.lastName || '',
      phone_number: vendureCustomer.customFields?.phoneNumber || vendureCustomer.phoneNumber || null,
      phone_verified: vendureCustomer.customFields?.phoneVerified || false,
      is_active: !vendureCustomer.deletedAt,
      is_verified: vendureCustomer.verified || false,
      marketing_consent: false, // Default, can be updated
      custom_fields: vendureCustomer.customFields || {},
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('customers')
      .upsert(customerData, {
        onConflict: 'vendure_customer_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async syncCustomerAddress(customerId: string, address: any) {
    const supabase = createSupabaseClient();
    
    // First get the Supabase customer ID
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('vendure_customer_id', customerId)
      .single();

    if (!customer) throw new Error('Customer not found in Supabase');

    const addressData = {
      customer_id: customer.id,
      vendure_address_id: address.id?.toString() || null,
      full_name: address.fullName || '',
      street_line1: address.streetLine1 || '',
      street_line2: address.streetLine2 || null,
      city: address.city || '',
      province: address.province || null,
      postal_code: address.postalCode || null,
      country_code: address.countryCode || 'LK',
      phone_number: address.phoneNumber || null,
      address_type: address.type || 'shipping',
      is_default: address.defaultShippingAddress || address.defaultBillingAddress || false,
    };

    const { data, error } = await supabase
      .from('customer_addresses')
      .upsert(addressData, {
        onConflict: 'vendure_address_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async syncOrder(customerId: string, order: any) {
    const supabase = createSupabaseClient();
    
    // Get Supabase customer ID
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('vendure_customer_id', customerId)
      .single();

    if (!customer) throw new Error('Customer not found in Supabase');

    // Get delivery status
    const { data: deliveryStatus } = await supabase
      .from('order_delivery_status')
      .select('stage, tracking_number')
      .eq('order_code', order.code)
      .single();

    // Get batch assignment if exists
    const { data: batchAssignment } = await supabase
      .from('order_batch_assignments')
      .select('batch_id, import_batches(batch_number)')
      .eq('vendure_order_id', order.id.toString())
      .single();

    const orderData = {
      customer_id: customer.id,
      vendure_order_id: order.id.toString(),
      order_code: order.code,
      order_date: order.orderPlacedAt || order.createdAt,
      order_state: order.state,
      delivery_stage: deliveryStatus?.stage || order.customFields?.deliveryStage || 'ORDER_CONFIRMED',
      payment_method: order.payments?.[0]?.method || null,
      payment_status: order.payments?.[0]?.state || null,
      subtotal: (order.subTotalWithTax || order.totalWithTax || 0) / 100,
      tax_total: (order.taxSummary?.[0]?.taxTotal || 0) / 100,
      shipping_total: (order.shippingWithTax || 0) / 100,
      total_with_tax: (order.totalWithTax || 0) / 100,
      currency_code: order.currencyCode || 'LKR',
      shipping_address: order.shippingAddress || null,
      tracking_number: deliveryStatus?.tracking_number || order.customFields?.trackingNumber || null,
      carrier: 'Trans Express',
      batch_id: batchAssignment?.batch_id || null,
      batch_number: batchAssignment?.import_batches?.batch_number || null,
    };

    const { data: orderSummary, error: orderError } = await supabase
      .from('customer_orders_summary')
      .upsert(orderData, {
        onConflict: 'vendure_order_id',
        ignoreDuplicates: false,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Sync order items
    if (order.lines && order.lines.length > 0) {
      for (const line of order.lines) {
        const itemData = {
          order_summary_id: orderSummary.id,
          vendure_order_line_id: line.id.toString(),
          product_id: line.productVariant?.product?.id?.toString() || '',
          product_name: line.productVariant?.product?.name || '',
          product_slug: line.productVariant?.product?.slug || null,
          variant_id: line.productVariant?.id?.toString() || '',
          variant_name: line.productVariant?.name || '',
          sku: line.productVariant?.sku || '',
          unit_price: (line.unitPrice || 0) / 100,
          unit_price_with_tax: (line.unitPriceWithTax || 0) / 100,
          quantity: line.quantity,
          line_total: (line.linePrice || 0) / 100,
          line_total_with_tax: (line.linePriceWithTax || 0) / 100,
          patch_enabled: line.customFields?.patchEnabled || false,
          patch_type: line.customFields?.patchType || null,
          print_name: line.customFields?.printName || null,
          print_number: line.customFields?.printNumber || null,
        };

        await supabase
          .from('customer_order_items')
          .upsert(itemData, {
            onConflict: 'vendure_order_line_id',
            ignoreDuplicates: false,
          });
      }
    }

    // Update customer statistics
    await supabase.rpc('update_customer_statistics', { p_customer_id: customer.id });

    return orderSummary;
  },

  async getCustomerByVendureId(vendureCustomerId: string) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('vendure_customer_id', vendureCustomerId)
      .single();

    if (error) throw error;
    return data;
  },

  async getCustomerOrders(customerId: string) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('customer_orders_summary')
      .select('*, customer_order_items(*)')
      .eq('customer_id', customerId)
      .order('order_date', { ascending: false });

    if (error) throw error;
    return data;
  },
};

/**
 * Delivery Status Operations (5-stage tracking)
 */
export const deliveryStatusOperations = {
  async updateDeliveryStatus(
    orderCode: string,
    stage: 'ORDER_CONFIRMED' | 'SOURCING' | 'ARRIVED' | 'DISPATCHED' | 'DELIVERED',
    trackingNumber?: string,
    note?: string,
    updatedBy?: string
  ) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.rpc('update_order_delivery_status', {
      p_order_code: orderCode,
      p_stage: stage,
      p_tracking_number: trackingNumber || null,
      p_note: note || null,
      p_updated_by: updatedBy || null,
    });

    if (error) throw error;
    return data;
  },

  async getDeliveryStatus(orderCode: string) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('order_delivery_status')
      .select('*')
      .eq('order_code', orderCode)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  },

  async getDeliveryStatusHistory(orderCode: string) {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from('order_delivery_status_events')
      .select('*')
      .eq('order_code', orderCode)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};

