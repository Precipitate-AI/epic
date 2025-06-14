// src/app/api/product/[slug]/route.ts
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const product = await db.product.findUnique({
            where: {
                slug: params.slug,
            },
            include: {
                variants: true, // We need the variants too!
            },
        });

        if (!product) {
            return new NextResponse('Product not found', { status: 404 });
        }

        return NextResponse.json(product);

    } catch (error) {
        console.error('[PRODUCT_GET]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
