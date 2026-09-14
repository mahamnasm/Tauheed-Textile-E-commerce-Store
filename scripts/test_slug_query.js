const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testQuery() {
  try {
    const slug = 'zarmisha-noir-gold-kalidar-3-piece-997';
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        variants: { orderBy: { priceAdjustment: 'asc' } },
        category: true,
        collection: true,
        reviews: {
          where: { isApproved: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    console.log('Product found:', Boolean(product));
    if (!product) return;

    const relatedProducts = await prisma.product.findMany({
      where: {
        ...(product.categoryId ? { categoryId: product.categoryId } : {}),
        id: { not: product.id },
      },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        variants: true,
      },
      take: 4,
    });
    console.log('Related products:', relatedProducts.length);
  } catch (err) {
    console.error('Error in query:', err);
  } finally {
    await prisma.$disconnect();
  }
}

testQuery();
