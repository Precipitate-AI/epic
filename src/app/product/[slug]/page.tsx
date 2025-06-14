// src/app/page.tsx
import { db } from '@/lib/db';
import Link from 'next/link';

// We only need one interface, because the database shape now matches our component's needs.
interface Variant {
  id: string;
  name: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[]; // It's an array from the database!
  category: string;
  createdAt: Date;
  updatedAt: Date;
  variants: Variant[];
}

export default async function HomePage() {
  // Fetch the data. No transformation is needed afterwards.
  const products: Product[] = await db.product.findMany({
    include: {
      variants: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Our Collection</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Link
            href={`/product/${product.slug}`}
            key={product.id}
            className="group"
          >
            <div className="border rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300">
              <img
                src={product.images[0]} // This just works now.
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4 h-20 overflow-hidden">
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
    </main>
  );
}
