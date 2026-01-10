import { getAdminSupabaseClient } from './admin-supabase';

export interface SMSLogData {
  phone_number: string;
  message: string;
  message_type: 'otp' | 'order_confirmation' | 'delivery_update' | 'custom';
  textlk_uid?: string;
  status: 'sent' | 'failed' | 'pending';
  error_message?: string;
  related_order_code?: string;
  related_customer_id?: string;
  cost?: number;
  sent_at?: Date;
}

/**
 * Log SMS send to database
 */
export async function logSMS(data: SMSLogData): Promise<void> {
  try {
    const supabase = getAdminSupabaseClient();
    
    const logEntry = {
      phone_number: data.phone_number,
      message: data.message,
      message_type: data.message_type,
      textlk_uid: data.textlk_uid || null,
      status: data.status,
      error_message: data.error_message || null,
      related_order_code: data.related_order_code || null,
      related_customer_id: data.related_customer_id || null,
      cost: data.cost || null,
      sent_at: data.sent_at ? data.sent_at.toISOString() : new Date().toISOString(),
    };

    const { error } = await supabase
      .from('sms_logs')
      .insert(logEntry);

    if (error) {
      console.error('Error logging SMS:', error);
      // Don't throw - SMS logging failure shouldn't break the main flow
    }
  } catch (error) {
    console.error('Error in SMS logger:', error);
    // Don't throw - SMS logging failure shouldn't break the main flow
  }
}

/**
 * Update SMS log status
 */
export async function updateSMSLogStatus(
  textlkUid: string,
  status: 'sent' | 'failed',
  errorMessage?: string
): Promise<void> {
  try {
    const supabase = getAdminSupabaseClient();
    
    const { error } = await supabase
      .from('sms_logs')
      .update({
        status,
        error_message: errorMessage || null,
        sent_at: status === 'sent' ? new Date().toISOString() : null,
      })
      .eq('textlk_uid', textlkUid);

    if (error) {
      console.error('Error updating SMS log:', error);
    }
  } catch (error) {
    console.error('Error updating SMS log status:', error);
  }
}

