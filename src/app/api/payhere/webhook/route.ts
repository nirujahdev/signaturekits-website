import { NextRequest, NextResponse } from 'next/server';
import { verifyPayHereSignature } from '@/lib/payhere';

/**
 * PayHere Webhook Handler (Next.js API Route)
 * Handles payment notifications from PayHere
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const signature = req.headers.get('x-payhere-signature') || '';

    // Verify signature
    if (!verifyPayHereSignature(body, signature)) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const orderCode = body.order_id;
    const paymentStatus = body.status_code;
    const paymentId = body.payment_id;

    // TODO: Update Vendure order status via Admin API
    // const response = await fetch(`${process.env.VENDURE_API_URL}/admin-api`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     query: `
    //       mutation SettlePayment($orderId: ID!) {
    //         settlePayment(id: $orderId) {
    //           success
    //         }
    //       }
    //     `,
    //     variables: { orderId: orderCode },
    //   }),
    // });

    if (paymentStatus === '2') {
      // Payment successful
      return NextResponse.json({ status: 'success' });
    } else if (paymentStatus === '-1' || paymentStatus === '-2') {
      // Payment failed or cancelled
      return NextResponse.json({ status: 'failed' });
    }

    return NextResponse.json({ status: 'received' });
  } catch (error: any) {
    console.error('PayHere webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

