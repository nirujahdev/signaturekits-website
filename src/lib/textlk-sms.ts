/**
 * Text.lk SMS Gateway Integration
 * Official API v3 for sending SMS OTP
 */

import { logSMS, updateSMSLogStatus } from './sms-logger';

interface TextLKSendSMSRequest {
  recipient: string; // Format: 947xxxxxxxx (Sri Lanka)
  sender_id: string;
  type: 'text' | 'unicode';
  message: string;
}

interface TextLKSendSMSResponse {
  success: boolean;
  uid?: string;
  message?: string;
  error?: string;
}

/**
 * Normalize phone number to Text.lk format (947xxxxxxxx)
 * Accepts: +94771234567, 0771234567, 94771234567
 */
export function normalizePhoneForTextLK(phone: string): string | null {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Handle different formats
  if (digits.startsWith('94')) {
    // Already in 947xxxxxxxx format
    return digits;
  } else if (digits.startsWith('0')) {
    // Sri Lanka local format: 0771234567 -> 94771234567
    return '94' + digits.substring(1);
  } else if (digits.length === 9) {
    // 9 digits without country code: 771234567 -> 94771234567
    return '94' + digits;
  }
  
  return null;
}

/**
 * Send SMS via Text.lk API v3 (OAuth 2.0 Bearer token)
 */
export async function sendSMSViaTextLK(
  recipient: string,
  message: string
): Promise<TextLKSendSMSResponse> {
  const apiToken = process.env.TEXTLK_API_TOKEN;
  const senderId = process.env.TEXTLK_SENDER_ID || 'SignatureKits';
  const baseUrl = process.env.TEXTLK_BASE_URL || 'https://app.text.lk';

  if (!apiToken) {
    return {
      success: false,
      error: 'Text.lk API token not configured',
    };
  }

  // Normalize phone number
  const normalizedPhone = normalizePhoneForTextLK(recipient);
  if (!normalizedPhone) {
    return {
      success: false,
      error: 'Invalid phone number format. Use Sri Lanka format (e.g., 0771234567 or +94771234567)',
    };
  }

  // Log SMS attempt
  await logSMS({
    phone_number: normalizedPhone,
    message,
    message_type: 'custom',
    status: 'pending',
  });

  try {
    const response = await fetch(`${baseUrl}/api/v3/sms/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        recipient: normalizedPhone,
        sender_id: senderId,
        type: 'text',
        message: message,
      } as TextLKSendSMSRequest),
    });

    const data = await response.json();

    if (!response.ok) {
      // Update log with failure
      if (data.uid) {
        await updateSMSLogStatus(data.uid, 'failed', data.error || data.message);
      }
      return {
        success: false,
        error: data.error || data.message || 'Failed to send SMS',
      };
    }

    // Update log with success
    if (data.uid) {
      await updateSMSLogStatus(data.uid, 'sent');
    }

    return {
      success: true,
      uid: data.uid,
      message: data.message || 'SMS sent successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error while sending SMS',
    };
  }
}

/**
 * Send SMS via Text.lk HTTP endpoint (fallback method)
 */
export async function sendSMSViaTextLKHTTP(
  recipient: string,
  message: string
): Promise<TextLKSendSMSResponse> {
  const apiToken = process.env.TEXTLK_API_TOKEN;
  const senderId = process.env.TEXTLK_SENDER_ID || 'SignatureKits';
  const baseUrl = process.env.TEXTLK_BASE_URL || 'https://app.text.lk';

  if (!apiToken) {
    return {
      success: false,
      error: 'Text.lk API token not configured',
    };
  }

  // Normalize phone number
  const normalizedPhone = normalizePhoneForTextLK(recipient);
  if (!normalizedPhone) {
    return {
      success: false,
      error: 'Invalid phone number format',
    };
  }

  try {
    const params = new URLSearchParams({
      recipient: normalizedPhone,
      sender_id: senderId,
      message: message,
      api_token: apiToken,
    });

    const response = await fetch(`${baseUrl}/api/http/sms/send?${params.toString()}`);

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'Failed to send SMS',
      };
    }

    return {
      success: true,
      uid: data.uid,
      message: data.message || 'SMS sent successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Network error while sending SMS',
    };
  }
}

/**
 * View SMS status by UID (for debugging)
 */
export async function viewSMSStatus(uid: string): Promise<any> {
  const apiToken = process.env.TEXTLK_API_TOKEN;
  const baseUrl = process.env.TEXTLK_BASE_URL || 'https://app.text.lk';

  if (!apiToken) {
    return { error: 'Text.lk API token not configured' };
  }

  try {
    const response = await fetch(`${baseUrl}/api/v3/sms/${uid}`, {
      headers: {
        Authorization: `Bearer ${apiToken}`,
      },
    });

    return await response.json();
  } catch (error: any) {
    return { error: error.message };
  }
}

