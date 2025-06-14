// src/app/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma'; // <-- Standardizing on `prisma`
import type { Product } from '@prisma/client'; // <-- Best Practice: Import types from Prisma!

export default async function HomePage() {
  // Fetch products using our standard 'prisma' client
  const products: Product[] = await prisma.product.findMany({
    include: {
      variants: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main>
      {/* --- NEW SPLIT-SCREEN HERO SECTION --- */}
      <section className="bg-gray-50">
        <div className="container mx-auto grid md:grid-cols-2 items-center">
          {/* Image Column */}
          <div className="order-last md:order-first">
            <Image
              src="/hero-image.jpg"
              alt="A happy toddler wearing an EPIC.SUPPLY romper"
              width={800}
              height={1200}
              priority
              className="w-full h-auto"
            />
          </div>

          {/* Text Column */}
          <div className="text-center md:text-left p-8 md:p-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight">
              For the little moments that feel epic.
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-md mx-auto md:mx-0">
              Beautifully simple, incredibly soft basics for your child's everyday adventures. Designed for comfort, made for play.
            </p>
            <div className="mt-8">
              <Link href="#products" className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-colors">
                Shop The Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- YOUR EXISTING PRODUCT LIST SECTION --- */}
      <section id="products" className="py-12 md:py-20">
        <div className="container mx-auto px-4">
           <h2 className="text-3xl font-bold text-center mb-10">Our Collection</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                href={`/product/${product.slug}`}
                key={product.id}
                className="group"
              >
                <div className="border rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  {/* Using Next/Image here too for optimization, but `img` is also fine */}
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                    <p className="text-gray-600 mb-4 h-20 overflow-hidden text-ellipsis">
                      {product.description}
                    </p>
                    <div className="text-lg font-bold text-gray-800">
                      IDR {product.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
