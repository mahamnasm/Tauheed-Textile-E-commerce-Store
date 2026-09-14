const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

async function audit() {
  console.log('====================================================');
  console.log('    TAUHEED TEXTILE - FULL SYSTEM & CONTENT AUDIT   ');
  console.log('====================================================\n');

  // 1. Check Database Counts
  const [
    productsCount,
    categoriesCount,
    collectionsCount,
    imagesCount,
    variantsCount,
    ordersCount,
    reviewsCount,
    videosCount,
    couponsCount,
    zonesCount,
    settingsCount
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.collection.count(),
    prisma.productImage.count(),
    prisma.productVariant.count(),
    prisma.order.count(),
    prisma.review.count(),
    prisma.watchBuyVideo.count(),
    prisma.coupon.count(),
    prisma.shippingZone.count(),
    prisma.setting.count()
  ]);

  console.log('--- DATABASE STATUS ---');
  console.log(`Products: ${productsCount}`);
  console.log(`Categories: ${categoriesCount}`);
  console.log(`Collections: ${collectionsCount}`);
  console.log(`Product Images: ${imagesCount}`);
  console.log(`Variants: ${variantsCount}`);
  console.log(`Orders: ${ordersCount}`);
  console.log(`Reviews: ${reviewsCount}`);
  console.log(`Watch & Buy Videos: ${videosCount}`);
  console.log(`Coupons: ${couponsCount}`);
  console.log(`Shipping Zones: ${zonesCount}`);
  console.log(`Settings: ${settingsCount}`);

  // 2. Check for empty categories (categories with 0 products)
  console.log('\n--- CATEGORY AUDIT ---');
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } }
  });
  categories.forEach(c => {
    console.log(`Category "${c.name}" (${c.slug}): ${c._count.products} products ${c._count.products === 0 ? '[EMPTY WARNING]' : '[OK]'}`);
  });

  // 3. Check for empty collections
  console.log('\n--- COLLECTION AUDIT ---');
  const collections = await prisma.collection.findMany({
    include: { _count: { select: { products: true } } }
  });
  collections.forEach(c => {
    console.log(`Collection "${c.name}": ${c._count.products} products ${c._count.products === 0 ? '[EMPTY WARNING]' : '[OK]'}`);
  });

  // 4. Check for products with 0 images or 0 variants
  console.log('\n--- PRODUCT INTEGRITY AUDIT ---');
  const products = await prisma.product.findMany({
    include: { images: true, variants: true, category: true }
  });
  let productIssues = 0;
  products.forEach(p => {
    const issues = [];
    if (p.images.length === 0) issues.push('NO IMAGES');
    if (p.variants.length === 0) issues.push('NO VARIANTS');
    if (!p.category) issues.push('NO CATEGORY');
    if (p.basePrice <= 0) issues.push('INVALID PRICE');
    if (issues.length > 0) {
      console.log(`[ISSUE] [${p.sku}] ${p.title}: ${issues.join(', ')}`);
      productIssues++;
    }
  });
  if (productIssues === 0) {
    console.log(`All ${products.length} products have complete images, variants, categories, and prices!`);
  }

  // 5. Check for "AI" mentions in database text
  console.log('\n--- "AI" ROBOTIC TERMINOLOGY AUDIT ---');
  let aiMentions = 0;
  products.forEach(p => {
    const textToCheck = `${p.title} ${p.description} ${p.fabric} ${p.workType} ${p.packageIncludes || ''}`;
    if (/\bAI\b/i.test(textToCheck) || textToCheck.toLowerCase().includes('ai model')) {
      console.log(`[AI MENTION in Product] [${p.sku}] ${p.title}`);
      aiMentions++;
    }
    p.images.forEach(img => {
      if (img.alt && (/\bAI\b/i.test(img.alt) || img.alt.toLowerCase().includes('ai model'))) {
        console.log(`[AI MENTION in Image Alt] [${p.sku}] ${img.alt} (${img.url})`);
        aiMentions++;
      }
    });
  });

  const reviews = await prisma.review.findMany();
  reviews.forEach(r => {
    if (r.comment.toLowerCase().includes('ai')) {
      console.log(`[AI MENTION in Review] "${r.comment}"`);
      aiMentions++;
    }
  });

  if (aiMentions === 0) {
    console.log('No "AI" robotic buzzwords found in DB records!');
  }

  // 6. Test Storefront & Admin Endpoints Live
  console.log('\n--- LIVE HTTP ROUTE HEALTH CHECK ---');
  const routesToTest = [
    '/',
    '/shop',
    '/shop?category=lawn-summer',
    '/shop?category=chiffon-formal',
    '/shop?category=pret-ready-to-wear',
    '/shop?category=wedding-luxury-pret',
    '/shop?category=unstitched',
    '/shop?category=sale',
    '/cart',
    '/checkout',
    '/track-order',
    '/account',
    '/policies/shipping',
    '/policies/returns',
    '/policies/size-guide',
    '/admin',
    '/admin/products',
    '/admin/orders',
    '/admin/inventory',
    '/admin/payments',
    '/admin/returns',
    '/admin/customers',
    '/admin/marketing',
    '/admin/shipping',
    '/admin/layout'
  ];

  for (const route of routesToTest) {
    try {
      const res = await fetch(`http://localhost:3000${route}`);
      const html = await res.text();
      const hasBrokenQuestionMarks = (html.match(/\s\?\s/g) || []).length;
      console.log(`[${res.status}] ${route} (${html.length} bytes) ${hasBrokenQuestionMarks > 0 ? `[WARN: ${hasBrokenQuestionMarks} broken ?]` : '[OK]'}`);
    } catch (e) {
      console.error(`[FAIL] ${route}: ${e.message}`);
    }
  }

  console.log('\n====================================================');
  console.log('                AUDIT COMPLETE                      ');
  console.log('====================================================');
}

audit().finally(() => prisma.$disconnect());
