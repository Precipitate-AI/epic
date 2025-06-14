// src/app/api/checkout/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import midtransClient from 'midtrans-client';
import { CartItem } from '@/hooks/use-cart-store';

const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

const checkoutSchema = z.object({
    cartItems: z.array(z.object({
        id: z.string(),
        productId: z.string(),
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        image: z.string(),
        selectedVariants: z.record(z.string())
    })),
    customerDetails: z.object({
        customerName: z.string(), customerEmail: z.string().email(), customerPhone: z.string(),
        shippingAddress: z.string(), city: z.string(), province: z.string(), postalCode: z.string(),
    })
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validation = checkoutSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid input', details: validation.error.errors }, { status: 400 });
        }

        const { cartItems, customerDetails } = validation.data;
        
        const productIds = cartItems.map(item => item.productId);
        const productsInDb = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        // --- START OF FIXES ---

        let calculatedTotalAmount = 0;
        const midtransItemDetails = cartItems.map(item => {
            const product = productsInDb.find(p => p.id === item.productId);
            if (!product || product.price !== item.price) {
                throw new Error(`Price verification failed for product: ${item.name}`);
            }
            calculatedTotalAmount += product.price * item.quantity;
            
            // FIX 1: Truncate the item name (Midtrans limit is 50 chars)
            const truncatedName = item.name.length > 50 ? item.name.substring(0, 47) + '...' : item.name;

            return {
                id: item.id,
                price: product.price,
                quantity: item.quantity,
                name: truncatedName,
            };
        });
        
        // --- END OF FIXES ---

        const orderId = `EPIC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const order = await prisma.order.create({
            data: {
                id: orderId,
                totalAmount: calculatedTotalAmount, // USE THE SECURELY CALCULATED TOTAL
                status: 'PENDING',
                ...customerDetails,
                orderItems: {
                    create: cartItems.map((item: CartItem) => ({
                        productId: item.productId, productName: item.name, price: item.price,
                        quantity: item.quantity, image: item.image, variants: item.selectedVariants,
                    })),
                },
            },
        });

        const parameter = {
            transaction_details: {
                order_id: order.id,
                gross_amount: calculatedTotalAmount, // USE THE SECURELY CALCULATED TOTAL
            },
            item_details: midtransItemDetails,
            customer_details: {
                first_name: customerDetails.customerName,
                email: customerDetails.customerEmail,
                phone: customerDetails.customerPhone,
                shipping_address: {
                    address: customerDetails.shippingAddress,
                    city: customerDetails.city,
                    postal_code: customerDetails.postalCode,
                }
            },
        };

        const transaction = await snap.createTransaction(parameter);
        return NextResponse.json(transaction);

    } catch (error) {
        console.error('[CHECKOUT_POST_ERROR]', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: 'Internal Server Error', details: errorMessage }, { status: 500 });
    }
}
