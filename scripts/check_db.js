const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    include: { category: true, images: true, variants: true },
    orderBy: { createdAt: 'desc' }
  });
  console.log(`Total Products: ${products.length}\n`);
  products.forEach((p, idx) => {
    console.log(`${idx + 1}. [${p.sku}] ${p.title}`);
    console.log(`   Category: ${p.category?.name || 'None'} | Price: PKR ${p.basePrice} | Variants: ${p.variants.length}`);
    console.log(`   Images: ${p.images.map(i => i.url).join(', ')}`);
  });
}

main().finally(() => prisma.$disconnect());
