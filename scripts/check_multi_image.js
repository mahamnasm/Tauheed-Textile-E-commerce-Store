const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const p = await prisma.product.findUnique({
    where: { sku: 'TT-ZAR-016' },
    include: { images: true, variants: true }
  });
  console.log('Product:', p.title, 'Slug:', p.slug);
  console.log('Total Images Count:', p.images.length);
  p.images.forEach((img, i) => {
    console.log(`  ${i + 1}. [Order: ${img.displayOrder}] ${img.url} (alt: ${img.alt})`);
  });
  console.log('Total Variants:', p.variants.length);
}

check().finally(() => prisma.$disconnect());
