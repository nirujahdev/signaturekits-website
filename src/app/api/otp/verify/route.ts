import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';
import { normalizePhoneForTextLK } from '@/lib/textlk-sms';

/**
 * POST /api/otp/verify
 * Verify SMS OTP
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
    const { phone, otp, sessionId } = body;

    if (!phone || !otp || !sessionId) {
      return NextResponse.json(
        { success: false, error: 'Phone number, OTP, and session ID are required' },
        { status: 400 }
      );
    }

    // Normalize phone number
    const normalizedPhone = normalizePhoneForTextLK(phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Find the latest non-expired, non-verified OTP for this session
    const { data: otpRecord, error: findError } = await supabase
      .from('otp_sessions')
      .select('*')
      .eq('phone', normalizedPhone)
      .eq('session_id', sessionId)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (findError || !otpRecord) {
      return NextResponse.json(
        { 
          success: false, 
          verified: false,
          error: 'OTP not found or expired. Please request a new OTP.',
          attemptsRemaining: 0
        },
        { status: 404 }
      );
    }

    // Check if max attempts exceeded
    if (otpRecord.attempts >= otpRecord.max_attempts) {
      return NextResponse.json(
        { 
          success: false, 
          verified: false,
          error: 'Maximum verification attempts exceeded. Please request a new OTP.',
          attemptsRemaining: 0
        },
        { status: 429 }
      );
    }

    // Verify OTP hash
    const isValid = await bcrypt.compare(otp, otpRecord.otp_hash);

    if (!isValid) {
      // Increment attempts
      await supabase
        .from('otp_sessions')
        .update({ attempts: otpRecord.attempts + 1 })
        .eq('id', otpRecord.id);

      const attemptsRemaining = otpRecord.max_attempts - otpRecord.attempts - 1;

      return NextResponse.json(
        { 
          success: false, 
          verified: false,
          error: 'Invalid OTP',
          attemptsRemaining: attemptsRemaining > 0 ? attemptsRemaining : 0
        },
        { status: 400 }
      );
    }

    // Mark as verified
    const { error: updateError } = await supabase
      .from('otp_sessions')
      .update({
        verified: true,
        verified_at: new Date().toISOString(),
      })
      .eq('id', otpRecord.id);

    if (updateError) {
      console.error('Error updating OTP verification:', updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to verify OTP' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Phone number verified successfully',
      phone: normalizedPhone,
      verifiedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/otp/verify:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

