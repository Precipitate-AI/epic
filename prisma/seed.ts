// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// The 'category' field is added to each product here
const epicProducts = [
    {
      name: 'Muslin Onesie',
      slug: 'muslin-onesie',
      category: 'Apparel',
      description: 'Soft and breathable 100% organic cotton muslin onesie. Perfect for sensitive skin, gets softer with every wash.',
      price: 320000,
      // Provide a real array, not a joined string
      images: ['/images/muslin-onesie.jpg', '/images/muslin-onesie-2.jpg'],
      variants: [
        { name: 'Color', value: 'Sand' },
        { name: 'Color', value: 'Clay' },
        { name: 'Size', value: '0-3M' },
        { name: 'Size', value: '3-6M' },
      ],
    },
    {
      name: 'Linen Romper',
      slug: 'linen-romper',
      category: 'Apparel',
      description: 'A beautiful and durable linen romper for all occasions. Features adjustable straps and snap closures for easy changes.',
      price: 450000,
      // Provide a real array
      images: ['/images/linen-romper.jpg', '/images/linen-romper-2.jpg'],
      variants: [
        { name: 'Color', value: 'Oatmeal' },
        { name: 'Color', value: 'Dusty Rose' },
        { name: 'Size', value: '6-12M' },
        { name: 'Size', 'value': '12-18M' },
      ],
    },
    {
      name: 'Waffle Blanket',
      slug: 'waffle-blanket',
      category: 'Home Goods',
      description: 'Cozy and stylish waffle-weave blanket made from GOTS certified organic cotton. Generously sized for swaddling or as a toddler blanket.',
      price: 550000,
      // Provide a real array
      images: ['/images/waffle-blanket.jpg', '/images/waffle-blanket-2.jpg'],
      variants: [{ name: 'Color', value: 'Sage Green' }],
    },
  ];
  

async function main() {
  console.log(`Start seeding ...`);

  // Clear existing data
  await prisma.variant.deleteMany(); // Corrected from 'productVariant'
  await prisma.product.deleteMany();
  console.log('Deleted existing data.');

  for (const p of epicProducts) {
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        price: p.price,
        images: p.images,
        category: p.category, // Added category here
        variants: {
          create: p.variants,
        },
      },
    });
    console.log(`Created product with id: ${product.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
