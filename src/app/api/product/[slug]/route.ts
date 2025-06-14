// src/app/api/product/[slug]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // <-- USE THE SHARED CLIENT

export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const slug = params.slug;

        const product = await prisma.product.findUnique({
            where: { slug: slug },
            include: {
                variants: true, // Include the variants in the response
            },
        });

        if (!product) {
            return new NextResponse('Product not found', { status: 404 });
        }

        return NextResponse.json(product);

    } catch (error) {
        console.error('[PRODUCT_GET_ERROR]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
