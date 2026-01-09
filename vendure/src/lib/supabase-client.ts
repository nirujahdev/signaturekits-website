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

