const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateProductImages() {
  const mapping = [
    { sku: 'TT-LWN-001', img1: '/assets/reel-2.jpg', img2: '/assets/hero-model.jpg' },
    { sku: 'TT-CHF-002', img1: '/assets/reel-1.jpg', img2: '/assets/hero-model.jpg' },
    { sku: 'TT-PRT-003', img1: '/assets/prod-meher.jpg', img2: '/assets/reel-2.jpg' },
    { sku: 'TT-WED-004', img1: '/assets/prod-bridal.jpg', img2: '/assets/hero-model.jpg' },
    { sku: 'TT-UNS-005', img1: '/assets/prod-bano.jpg', img2: '/assets/reel-1.jpg' },
    { sku: 'TT-SAL-006', img1: '/assets/prod-velvet.jpg', img2: '/assets/prod-bridal.jpg' }
  ];

  for (const item of mapping) {
    const prod = await prisma.product.findUnique({ where: { sku: item.sku } });
    if (prod) {
      await prisma.productImage.deleteMany({ where: { productId: prod.id } });
      await prisma.productImage.create({ data: { productId: prod.id, url: item.img1, displayOrder: 0 } });
      await prisma.productImage.create({ data: { productId: prod.id, url: item.img2, displayOrder: 1 } });
      console.log('Updated images for ' + prod.title);
    }
  }

  const catMapping = [
    { slug: 'lawn-summer', img: '/assets/reel-2.jpg' },
    { slug: 'chiffon-formal', img: '/assets/reel-1.jpg' },
    { slug: 'pret-ready-to-wear', img: '/assets/prod-meher.jpg' },
    { slug: 'wedding-luxury-pret', img: '/assets/prod-bridal.jpg' },
    { slug: 'unstitched', img: '/assets/prod-bano.jpg' },
    { slug: 'sale', img: '/assets/prod-velvet.jpg' }
  ];

  for (const cat of catMapping) {
    await prisma.category.update({ where: { slug: cat.slug }, data: { image: cat.img } });
  }
  console.log('Updated category photos with AI models successfully');
}

updateProductImages().catch(console.error).finally(async () => {
  await prisma.$disconnect();
});
