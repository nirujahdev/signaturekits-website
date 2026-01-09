import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import { sendSMSViaTextLK, normalizePhoneForTextLK } from '@/lib/textlk-sms';
import crypto from 'crypto';

/**
 * POST /api/otp/send
 * Send SMS OTP via Text.lk
 */
export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase client at runtime (not build time)
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      return NextResponse.json(
        { success: false, error: 'Supabase configuration missing' },
        { status: 500 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const body = await req.json();
    const { phone, sessionId } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Normalize phone number
    const normalizedPhone = normalizePhoneForTextLK(phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format. Use Sri Lanka format (e.g., 0771234567 or +94771234567)' },
        { status: 400 }
      );
    }

    // Generate session ID if not provided
    const finalSessionId = sessionId || crypto.randomUUID();

    // Rate limiting: Check recent sends for this phone
    const otpTTL = parseInt(process.env.OTP_TTL_SECONDS || '600', 10);
    const resendCooldown = parseInt(process.env.OTP_RESEND_COOLDOWN_SECONDS || '60', 10);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // Check cooldown period
    const { data: recentSends } = await supabase
      .from('otp_sessions')
      .select('created_at')
      .eq('phone', normalizedPhone)
      .gte('created_at', new Date(Date.now() - resendCooldown * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (recentSends && recentSends.length > 0) {
      const lastSend = new Date(recentSends[0].created_at);
      const secondsSince = Math.floor((Date.now() - lastSend.getTime()) / 1000);
      const remaining = resendCooldown - secondsSince;
      
      if (remaining > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Please wait ${remaining} seconds before requesting a new OTP`,
            cooldownRemaining: remaining
          },
          { status: 429 }
        );
      }
    }

    // Check max sends per hour (3)
    const { count: hourlyCount } = await supabase
      .from('otp_sessions')
      .select('*', { count: 'exact', head: true })
      .eq('phone', normalizedPhone)
      .gte('created_at', oneHourAgo);

    if (hourlyCount && hourlyCount >= 3) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Maximum OTP requests reached. Please try again later.' 
        },
        { status: 429 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    // Calculate expiry
    const expiresAt = new Date(Date.now() + otpTTL * 1000);

    // Store in Supabase
    const { data: otpRecord, error: insertError } = await supabase
      .from('otp_sessions')
      .insert({
        phone: normalizedPhone,
        otp_hash: otpHash,
        session_id: finalSessionId,
        expires_at: expiresAt.toISOString(),
        attempts: 0,
        max_attempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10),
        verified: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing OTP:', insertError);
      return NextResponse.json(
        { success: false, error: 'Failed to create OTP session' },
        { status: 500 }
      );
    }

    // Send SMS via Text.lk
    const smsMessage = `Your Signature Kits verification code is: ${otp}. Valid for ${Math.floor(otpTTL / 60)} minutes.`;
    const smsResult = await sendSMSViaTextLK(normalizedPhone, smsMessage);

    if (!smsResult.success) {
      // Delete the OTP record if SMS failed
      await supabase.from('otp_sessions').delete().eq('id', otpRecord.id);
      
      return NextResponse.json(
        { 
          success: false, 
          error: smsResult.error || 'Failed to send SMS' 
        },
        { status: 500 }
      );
    }

    // Mask phone number for response
    const maskedPhone = normalizedPhone.slice(0, 5) + '****' + normalizedPhone.slice(-3);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      sessionId: finalSessionId,
      phone: maskedPhone,
      ttl: otpTTL,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/otp/send:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

