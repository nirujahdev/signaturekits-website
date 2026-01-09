'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface SMSOTPVerificationProps {
  onVerified: (phone: string, sessionId: string) => void;
  initialPhone?: string;
}

export function SMSOTPVerification({ onVerified, initialPhone = '' }: SMSOTPVerificationProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [ttl, setTtl] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // OTP TTL timer
  useEffect(() => {
    if (ttl > 0 && step === 'otp') {
      const timer = setTimeout(() => setTtl(ttl - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [ttl, step]);

  const handleSendOTP = async () => {
    if (!phone) {
      setError('Please enter your phone number');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setSessionId(data.sessionId);
      setTtl(data.ttl);
      setStep('otp');
      setSuccess(`OTP sent to ${data.phone}`);
      setCooldown(data.cooldownRemaining || 60);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
      if (err.message.includes('wait')) {
        const match = err.message.match(/(\d+)\s+seconds/);
        if (match) setCooldown(parseInt(match[1]));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    if (!sessionId) {
      setError('Session expired. Please request a new OTP.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, sessionId }),
      });

      const data = await response.json();

      if (!response.ok || !data.verified) {
        throw new Error(data.error || 'Invalid OTP');
      }

      setSuccess('Phone number verified successfully!');
      onVerified(data.phone, sessionId);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Verify Phone Number</h3>
        <p className="text-sm text-muted-foreground mb-4">
          We'll send you a verification code via SMS to confirm your phone number.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {step === 'phone' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="0771234567 or +94771234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter your Sri Lanka phone number
            </p>
          </div>
          <Button
            onClick={handleSendOTP}
            disabled={loading || !phone || cooldown > 0}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : cooldown > 0 ? (
              `Resend in ${cooldown}s`
            ) : (
              'Send OTP'
            )}
          </Button>
        </div>
      )}

      {step === 'otp' && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="otp">Enter Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              disabled={loading}
              maxLength={6}
              className="text-center text-2xl tracking-widest"
            />
            {ttl > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Code expires in {formatTime(ttl)}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length !== 6}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError(null);
                setSuccess(null);
              }}
              disabled={loading}
            >
              Change Number
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={handleSendOTP}
            disabled={loading || cooldown > 0}
            className="w-full text-sm"
          >
            {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend OTP'}
          </Button>
        </div>
      )}
    </div>
  );
}

