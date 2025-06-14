// src/app/order-confirmation/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const transactionStatus = searchParams.get('transaction_status');

  return (
    <main className="container mx-auto flex flex-col items-center justify-center p-8 text-center" style={{ minHeight: '80vh' }}>
      <div className="max-w-md">
        {transactionStatus === 'capture' || transactionStatus === 'settlement' ? (
          <>
            <h1 className="text-4xl font-bold text-green-600">Payment Successful!</h1>
            <p className="mt-4 text-lg text-gray-700">
              Thank you for your order! We've received your payment and your order is now being processed.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-yellow-600">Order Pending</h1>
            <p className="mt-4 text-lg text-gray-700">
              Your order is currently pending payment. We will update you as soon as the transaction is complete.
            </p>
          </>
        )}
        <p className="mt-2 text-gray-500 text-sm">Your Order ID is: {orderId}</p>

        <div className="mt-8">
          <Link href="/" className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
