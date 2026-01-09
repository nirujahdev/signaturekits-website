import { Request, Response } from 'express';
import { RequestContext } from '@vendure/core';
import { verifyPayHereSignature } from '../plugins/payhere-payment-plugin';

/**
 * PayHere Webhook Handler
 * Handles payment notifications from PayHere
 */
export async function handlePayHereWebhook(
  req: Request,
  res: Response,
  ctx: RequestContext
) {
  try {
    const paymentData = req.body;
    const signature = req.headers['x-payhere-signature'] as string;

    // Verify signature
    if (!verifyPayHereSignature(paymentData, signature)) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const orderCode = paymentData.order_id;
    const paymentStatus = paymentData.status_code;
    const paymentId = paymentData.payment_id;

    // Find the order
    // const order = await ctx.connection.getRepository(Order).findOne({
    //   where: { code: orderCode },
    // });

    // if (!order) {
    //   return res.status(404).json({ error: 'Order not found' });
    // }

    // Handle payment status
    if (paymentStatus === '2') {
      // Payment successful
      // await ctx.connection.getRepository(Order).update(
      //   { id: order.id },
      //   { state: 'PaymentSettled' }
      // );

      // Create order tracking
      // await orderTrackingOperations.createTracking(orderCode, order.shippingAddress);

      return res.status(200).json({ status: 'success' });
    } else if (paymentStatus === '-1' || paymentStatus === '-2') {
      // Payment failed or cancelled
      return res.status(200).json({ status: 'failed' });
    }

    return res.status(200).json({ status: 'received' });
  } catch (error: any) {
    console.error('PayHere webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}

