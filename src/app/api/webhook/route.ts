// src/app/api/webhook/route.ts

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 1. Get the signature key from the request header
    const signatureKey = request.headers.get('x-signature-key');

    // These are from the Midtrans notification body
    const orderId = body.order_id;
    const statusCode = body.status_code;
    const grossAmount = body.gross_amount;
    const transactionStatus = body.transaction_status;

    // 2. Create a hash from orderId, statusCode, grossAmount, and your server key
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const signature = crypto
      .createHash('sha512')
      .update(`${orderId}${statusCode}${grossAmount}${serverKey}`)
      .digest('hex');

    // 3. Verify the signature
    if (signature !== signatureKey) {
      console.error('Webhook Error: Invalid signature key.');
      return NextResponse.json({ error: 'Invalid signature key' }, { status: 403 });
    }

    console.log('Webhook received:', body);

    // 4. Find the order in your database
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      console.error(`Webhook Error: Order with ID ${orderId} not found.`);
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // 5. Update the order status based on the transaction status
    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'SUCCESS' },
      });
      console.log(`Order ${orderId} status updated to SUCCESS.`);
    } else if (transactionStatus === 'expire' || transactionStatus === 'cancel' || transactionStatus === 'deny') {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'FAILURE' },
      });
      console.log(`Order ${orderId} status updated to FAILURE.`);
    }

    return NextResponse.json({ message: 'Webhook received successfully' });

  } catch (error) {
    console.error('[WEBHOOK_POST_ERROR]', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
  }
}
