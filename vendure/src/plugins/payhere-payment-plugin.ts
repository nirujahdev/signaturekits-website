import { PaymentMethodHandler, CreatePaymentResult, SettlePaymentResult, CancelPaymentResult, RefundPaymentResult } from '@vendure/core';
import crypto from 'crypto';

/**
 * PayHere Payment Handler
 * Handles full payment via PayHere gateway
 */
export const payherePaymentHandler: PaymentMethodHandler = {
  code: 'payhere-payment-handler',
  description: [{ languageCode: 'en', value: 'PayHere Payment Gateway' }],
  args: {},

  createPayment: async (ctx, order, amount, args, metadata): Promise<CreatePaymentResult> => {
    try {
      const merchantId = process.env.PAYHERE_MERCHANT_ID;
      const secret = process.env.PAYHERE_SECRET;
      const sandbox = process.env.PAYHERE_SANDBOX === 'true';

      if (!merchantId || !secret) {
        return {
          amount: order.totalWithTax,
          state: 'Declined' as const,
          errorMessage: 'PayHere credentials not configured',
        };
      }

      // Generate payment hash for PayHere
      const hashString = `${merchantId}${order.code}${amount}LKR${order.code}${order.code}`;
      const hash = crypto
        .createHash('md5')
        .update(hashString)
        .digest('hex')
        .toUpperCase();

      // Store payment metadata
      const paymentMetadata = {
        merchantId,
        amount,
        currency: 'LKR',
        orderCode: order.code,
        hash,
        sandbox,
        returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/payhere-return`,
        cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/cancel`,
        notifyUrl: `${process.env.VENDURE_API_URL || 'http://localhost:3000'}/payhere/notify`,
      };

      return {
        amount: order.totalWithTax,
        state: 'Authorized' as const,
        transactionId: `payhere-${order.code}-${Date.now()}`,
        metadata: paymentMetadata,
      };
    } catch (error: any) {
      return {
        amount: order.totalWithTax,
        state: 'Declined' as const,
        errorMessage: error.message,
      };
    }
  },

  settlePayment: async (ctx, order, payment, args): Promise<SettlePaymentResult> => {
    // Payment is settled when PayHere webhook confirms payment
    return {
      success: true,
    };
  },

  cancelPayment: async (ctx, order, payment): Promise<CancelPaymentResult> => {
    return {
      success: true,
    };
  },

  refundPayment: async (ctx, order, payment, amount): Promise<RefundPaymentResult> => {
    // PayHere refund logic would go here
    return {
      success: false,
      errorMessage: 'Refunds must be processed through PayHere dashboard',
    };
  },
};

/**
 * Verify PayHere payment signature
 */
export function verifyPayHereSignature(data: any, signature: string): boolean {
  const secret = process.env.PAYHERE_SECRET;
  if (!secret) return false;

  // PayHere signature verification
  const hashString = Object.keys(data)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join('&');
  
  const hash = crypto
    .createHash('md5')
    .update(hashString + secret)
    .digest('hex')
    .toUpperCase();

  return hash === signature;
}

