import { PaymentMethodHandler, CreatePaymentResult, SettlePaymentResult, CancelPaymentResult, RefundPaymentResult } from '@vendure/core';

/**
 * Cash on Delivery (COD) Payment Handler
 * Requires SMS OTP verification before order confirmation
 */
export const codPaymentHandler: PaymentMethodHandler = {
  code: 'cod-payment-handler',
  description: [{ languageCode: 'en', value: 'Cash on Delivery (COD)' }],
  args: {},

  createPayment: async (ctx, order, amount, args, metadata): Promise<CreatePaymentResult> => {
    try {
      // Check if phone is verified (from metadata or order custom fields)
      const phoneVerified = metadata?.phoneVerified === true || 
                           (order.customFields as any)?.phoneVerified === true;

      if (!phoneVerified) {
        return {
          amount: order.totalWithTax,
          state: 'Declined' as const,
          errorMessage: 'SMS OTP verification required for COD orders. Please verify your phone number first.',
        };
      }

      // Store COD metadata
      const paymentMetadata = {
        paymentMethod: 'COD',
        phoneNumber: metadata?.phoneNumber || (order.customFields as any)?.phoneNumber,
        phoneVerified: true,
        requiresVerification: true,
        verificationExpiry: metadata?.verificationExpiry,
      };

      return {
        amount: order.totalWithTax,
        state: 'Authorized' as const,
        transactionId: `cod-${order.code}-${Date.now()}`,
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
    // COD payments are settled when order is delivered
    // This will be called when order status changes to 'Delivered'
    return {
      success: true,
    };
  },

  cancelPayment: async (ctx, order, payment): Promise<CancelPaymentResult> => {
    // COD orders can be cancelled before dispatch
    return {
      success: true,
    };
  },

  refundPayment: async (ctx, order, payment, amount): Promise<RefundPaymentResult> => {
    // COD refunds are handled manually
    return {
      success: false,
      errorMessage: 'COD refunds must be processed manually',
    };
  },
};

