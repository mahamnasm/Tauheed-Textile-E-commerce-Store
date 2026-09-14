const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding reference brand products into Tauheed Textile...');

  const catLawn = await prisma.category.findUnique({ where: { slug: 'lawn-summer' } });
  const catChiffon = await prisma.category.findUnique({ where: { slug: 'chiffon-formal' } });
  const catPret = await prisma.category.findUnique({ where: { slug: 'pret-ready-to-wear' } });
  const catWedding = await prisma.category.findUnique({ where: { slug: 'wedding-luxury-pret' } });
  const catUnstitched = await prisma.category.findUnique({ where: { slug: 'unstitched' } });
  const catSale = await prisma.category.findUnique({ where: { slug: 'sale' } });

  const colSummer = await prisma.collection.findUnique({ where: { slug: 'summer-elegance-2026' } });
  const colFestive = await prisma.collection.findUnique({ where: { slug: 'festive-zari-royale' } });
  const colPret = await prisma.collection.findUnique({ where: { slug: 'everyday-pret-edit' } });

  // Update TT-ZAR-008 category if null
  await prisma.product.updateMany({
    where: { sku: 'TT-ZAR-008', categoryId: null },
    data: { categoryId: catWedding.id, collectionId: colFestive.id }
  });

  const productsToAdd = [
    {
      sku: 'TT-NAF-009',
      title: 'Nafasat Royal Navy Pure Chiffon 3-Piece',
      slug: 'nafasat-royal-navy-pure-chiffon-3-piece',
      description: 'Inspired by Nafasat Clothing luxury formal wear. An opulent royal navy blue pure crinkle chiffon 3-piece featuring elaborate silver zari and tilla threadwork, floral hand-embroidery, delicate micro-sequin borders, paired with an ethereal sheer embroidered dupatta and tailored raw silk trousers.',
      fabric: 'Pure Crinkle Chiffon & Korean Raw Silk',
      workType: 'Silver Zari, Resham & Micro-Sequin Cutwork',
      pieceCount: 3,
      basePrice: 15850,
      salePrice: 14500,
      comparePrice: 18500,
      costPrice: 7200,
      categoryId: catChiffon.id,
      collectionId: colFestive.id,
      inStock: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      isSale: false,
      packageIncludes: 'Embroidered Chiffon Front & Back 2.5m, Embroidered Chiffon Sleeves 0.7m, Embroidered Organza Border Patches 3.5m, Pure Chiffon Embroidered Dupatta 2.5m, Dyed Raw Silk Trouser 2.5m, Slip Lining Included',
      careInstructions: 'Dry clean only. Store in breathable garment cover. Protect zari from direct heat and moisture.',
      images: [
        { url: '/assets/prod-nafasat.jpg', alt: 'Nafasat Royal Navy Pure Chiffon Model Shoot', displayOrder: 0 },
        { url: '/assets/reel-1.jpg', alt: 'Chiffon Detail Close-up', displayOrder: 1 }
      ],
      variants: [
        { sku: 'TT-NAF-009-UN', size: 'Unstitched', color: 'Royal Navy', stitchedType: 'Unstitched', priceAdjustment: 0, stockQuantity: 30, reservedStock: 1 },
        { sku: 'TT-NAF-009-SM', size: 'S', color: 'Royal Navy', stitchedType: 'Stitched', priceAdjustment: 3500, stockQuantity: 12, reservedStock: 0 },
        { sku: 'TT-NAF-009-MD', size: 'M', color: 'Royal Navy', stitchedType: 'Stitched', priceAdjustment: 3500, stockQuantity: 15, reservedStock: 2 },
        { sku: 'TT-NAF-009-LG', size: 'L', color: 'Royal Navy', stitchedType: 'Stitched', priceAdjustment: 3500, stockQuantity: 8, reservedStock: 0 }
      ]
    },
    {
      sku: 'TT-ARM-010',
      title: 'Armani Mustard Luxury Embroidered Lawn 3-Piece',
      slug: 'armani-mustard-luxury-embroidered-lawn-3-piece',
      description: 'Inspired by Armani Premium summer collection. Vibrant rich mustard yellow luxury Supima lawn with heavy schiffli neckline embroidery and delicate hem borders, styled with an all-over printed pure silk dupatta and contrast cambric trousers.',
      fabric: 'Luxury Supima Lawn & Pure Silk',
      workType: 'Schiffli Floral Cutwork & Resham Threadwork',
      pieceCount: 3,
      basePrice: 9450,
      salePrice: null,
      comparePrice: 11200,
      costPrice: 4600,
      categoryId: catLawn.id,
      collectionId: colSummer.id,
      inStock: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      isSale: false,
      packageIncludes: 'Schiffli Embroidered Lawn Front 1.25m, Digital Printed Lawn Back & Sleeves 1.75m, Digital Printed Silk Dupatta 2.5m, Dyed Cambric Trouser 2.5m, Embroidered Organza Ghera Lace',
      careInstructions: 'Gentle hand wash in cold water or dry clean. Do not wring or soak in bleaching agents. Iron inside out on medium heat.',
      images: [
        { url: '/assets/prod-armani.jpg', alt: 'Armani Mustard Silk Lawn Editorial Model Shoot', displayOrder: 0 },
        { url: '/assets/reel-2.jpg', alt: 'Lawn Texture and Embroidery', displayOrder: 1 }
      ],
      variants: [
        { sku: 'TT-ARM-010-UN', size: 'Unstitched', color: 'Mustard Gold', stitchedType: 'Unstitched', priceAdjustment: 0, stockQuantity: 40, reservedStock: 0 },
        { sku: 'TT-ARM-010-SM', size: 'S', color: 'Mustard Gold', stitchedType: 'Stitched', priceAdjustment: 2800, stockQuantity: 14, reservedStock: 1 },
        { sku: 'TT-ARM-010-MD', size: 'M', color: 'Mustard Gold', stitchedType: 'Stitched', priceAdjustment: 2800, stockQuantity: 20, reservedStock: 2 },
        { sku: 'TT-ARM-010-LG', size: 'L', color: 'Mustard Gold', stitchedType: 'Stitched', priceAdjustment: 2800, stockQuantity: 10, reservedStock: 0 }
      ]
    },
    {
      sku: 'TT-TRZ-011',
      title: 'Trendz Mauve Cutwork Luxury Pret Co-ord',
      slug: 'trendz-mauve-cutwork-luxury-pret-co-ord',
      description: 'Inspired by Trendz Collection pret aesthetics. Chic pastel mauve lilac 2-piece ready-to-wear kurta and tailored trouser set. Features laser-cut embroidered hemline, statement organza sleeve cuffs, and pearl loop button placket.',
      fabric: 'Premium Slub Linen & Sheer Organza',
      workType: 'Laser Cutwork, Organza Inserts & Pearl Detailing',
      pieceCount: 2,
      basePrice: 8250,
      salePrice: null,
      comparePrice: 9800,
      costPrice: 3800,
      categoryId: catPret.id,
      collectionId: colPret.id,
      inStock: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      isSale: false,
      packageIncludes: 'Pret Stitched Straight Kurta & Tailored Cigarette Trouser with Organza Inset',
      careInstructions: 'Machine wash gentle cold or hand wash. Iron on low-to-medium heat. Do not bleach.',
      images: [
        { url: '/assets/prod-trendz.jpg', alt: 'Trendz Mauve Cutwork Pret Shoot', displayOrder: 0 },
        { url: '/assets/prod-meher.jpg', alt: 'Pret Details & Silhouette', displayOrder: 1 }
      ],
      variants: [
        { sku: 'TT-TRZ-011-XS', size: 'XS', color: 'Mauve Lilac', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 10, reservedStock: 0 },
        { sku: 'TT-TRZ-011-SM', size: 'S', color: 'Mauve Lilac', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 18, reservedStock: 1 },
        { sku: 'TT-TRZ-011-MD', size: 'M', color: 'Mauve Lilac', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 25, reservedStock: 2 },
        { sku: 'TT-TRZ-011-LG', size: 'L', color: 'Mauve Lilac', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 12, reservedStock: 0 },
        { sku: 'TT-TRZ-011-XL', size: 'XL', color: 'Mauve Lilac', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 6, reservedStock: 0 }
      ]
    },
    {
      sku: 'TT-SHR-012',
      title: 'Shrenz Ice Blue Zardozi Reception Kalidar',
      slug: 'shrenz-ice-blue-zardozi-reception-kalidar',
      description: 'Inspired by Shrenz couture wedding collections. A majestic 16-kali flared floor-length kalidar in soft frosty ice blue organza net. Adorned with authentic hand-stitched zardozi, kora, dabka, and pearl florets. Accompanied by a scalloped dupatta and silk churidar.',
      fabric: 'Organza Net, Shimmer Silk & Handloom Tissue',
      workType: 'Authentic Zardozi, Kora, Dabka, Sequins & Pearls',
      pieceCount: 3,
      basePrice: 24500,
      salePrice: null,
      comparePrice: 28000,
      costPrice: 12000,
      categoryId: catWedding.id,
      collectionId: colFestive.id,
      inStock: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      isSale: false,
      packageIncludes: 'Flared 16-Kali Embellished Kalidar Gown 5.5m Flare, Hand-worked Scalloped Dupatta 2.75m, Shimmer Silk Churidar/Trouser 3.0m, Inner Grip Lining Included',
      careInstructions: 'Professional dry clean only. Wrap in unbleached cotton muslin cloth. Keep away from perfumes.',
      images: [
        { url: '/assets/prod-shrenz.jpg', alt: 'Shrenz Ice Blue Zardozi Kalidar Model Shoot', displayOrder: 0 },
        { url: '/assets/prod-bridal.jpg', alt: 'Bridal Zardozi Embellishment Detail', displayOrder: 1 }
      ],
      variants: [
        { sku: 'TT-SHR-012-UN', size: 'Unstitched', color: 'Ice Blue', stitchedType: 'Unstitched', priceAdjustment: 0, stockQuantity: 15, reservedStock: 0 },
        { sku: 'TT-SHR-012-SM', size: 'S', color: 'Ice Blue', stitchedType: 'Stitched', priceAdjustment: 4500, stockQuantity: 8, reservedStock: 1 },
        { sku: 'TT-SHR-012-MD', size: 'M', color: 'Ice Blue', stitchedType: 'Stitched', priceAdjustment: 4500, stockQuantity: 10, reservedStock: 1 },
        { sku: 'TT-SHR-012-LG', size: 'L', color: 'Ice Blue', stitchedType: 'Stitched', priceAdjustment: 4500, stockQuantity: 5, reservedStock: 0 }
      ]
    },
    {
      sku: 'TT-ALH-013',
      title: 'Al-Hassan Vintage Noir Gold Organza 3-Piece',
      slug: 'al-hassan-vintage-noir-gold-organza-3-piece',
      description: 'Inspired by Al-Hassan signature heritage formal lines. An exquisite midnight noir pure organza three-piece featuring heritage antique gold tilla and Marori embroidery. Sheer sleeves with scalloped cuffs, paired with a lavish tilla embroidered dupatta and pure raw silk trousers.',
      fabric: 'Pure Organza & Pure Raw Silk',
      workType: 'Vintage Antique Gold Tilla, Marori & Panni Work',
      pieceCount: 3,
      basePrice: 16900,
      salePrice: null,
      comparePrice: 19500,
      costPrice: 8100,
      categoryId: catChiffon.id,
      collectionId: colFestive.id,
      inStock: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      isSale: false,
      packageIncludes: 'Heavy Embroidered Organza Front 1.25m, Plain Organza Back 1.25m, Embroidered Sleeves 0.7m, Organza Gold Tilla Dupatta 2.5m, Raw Silk Trousers 2.5m, Slip Lining Included',
      careInstructions: 'Dry clean only. Store flat in clean dry closet. Do not iron directly on metallic tilla.',
      images: [
        { url: '/assets/prod-alhassan.jpg', alt: 'Al-Hassan Vintage Noir Gold Organza Model Shoot', displayOrder: 0 },
        { url: '/assets/prod-velvet.jpg', alt: 'Tilla Embroidery Detail', displayOrder: 1 }
      ],
      variants: [
        { sku: 'TT-ALH-013-UN', size: 'Unstitched', color: 'Obsidian Noir & Gold', stitchedType: 'Unstitched', priceAdjustment: 0, stockQuantity: 25, reservedStock: 1 },
        { sku: 'TT-ALH-013-SM', size: 'S', color: 'Obsidian Noir & Gold', stitchedType: 'Stitched', priceAdjustment: 3800, stockQuantity: 10, reservedStock: 0 },
        { sku: 'TT-ALH-013-MD', size: 'M', color: 'Obsidian Noir & Gold', stitchedType: 'Stitched', priceAdjustment: 3800, stockQuantity: 14, reservedStock: 1 },
        { sku: 'TT-ALH-013-LG', size: 'L', color: 'Obsidian Noir & Gold', stitchedType: 'Stitched', priceAdjustment: 3800, stockQuantity: 7, reservedStock: 0 }
      ]
    },
    {
      sku: 'TT-DSN-014',
      title: 'DesignsNow Olive Jacquard Luxury Pret Co-ord',
      slug: 'designsnow-olive-jacquard-luxury-pret-co-ord',
      description: 'Inspired by DesignsNow contemporary Pakistani pret aesthetics. A sharp architectural jacket-cut kurta in textured olive-gold jacquard, paired with crisp cigarette trousers and an ethereal fluid chiffon stole. Accented with custom golden filigree buttons.',
      fabric: 'Textured Olive Jacquard & Sheer Chiffon',
      workType: 'Woven Jacquard Geometry, Custom Metallic Buttons & Tailored Piping',
      pieceCount: 3,
      basePrice: 8750,
      salePrice: null,
      comparePrice: 10200,
      costPrice: 4100,
      categoryId: catPret.id,
      collectionId: colPret.id,
      inStock: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      isSale: false,
      packageIncludes: 'Tailored Jacquard Tunic with Gold Filigree Buttons, Jacquard Cigarette Trousers, Draped Chiffon Stole with Zari Border',
      careInstructions: 'Delicate dry clean or cold gentle cycle. Steam iron with protective press cloth.',
      images: [
        { url: '/assets/prod-designsnow.jpg', alt: 'DesignsNow Olive Jacquard Luxury Pret Model Shoot', displayOrder: 0 },
        { url: '/assets/hero-model.jpg', alt: 'Jacquard Fabric & Silhouette Detail', displayOrder: 1 }
      ],
      variants: [
        { sku: 'TT-DSN-014-XS', size: 'XS', color: 'Muted Olive & Gold', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 8, reservedStock: 0 },
        { sku: 'TT-DSN-014-SM', size: 'S', color: 'Muted Olive & Gold', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 15, reservedStock: 1 },
        { sku: 'TT-DSN-014-MD', size: 'M', color: 'Muted Olive & Gold', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 20, reservedStock: 1 },
        { sku: 'TT-DSN-014-LG', size: 'L', color: 'Muted Olive & Gold', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 12, reservedStock: 0 }
      ]
    },
    {
      sku: 'TT-TAU-015',
      title: 'Tauheed Signature Royal Noir Velvet Shawl 3-Piece',
      slug: 'tauheed-signature-royal-noir-velvet-shawl-3-piece',
      description: 'The crowning jewel of Tauheed Textile signature winter festive collection. Luxurious 9000 micro-velvet tunic in deep noir black, accompanied by a lavishly embroidered Kashmiri tilla shawl featuring intricate mughalesque motifs, paired with pure raw silk pants.',
      fabric: 'Micro Velvet 9000 & Pure Raw Silk',
      workType: 'Kashmiri Antique Tilla, Zari Border Work & Resham Embroidery',
      pieceCount: 3,
      basePrice: 13950,
      salePrice: 12500,
      comparePrice: 16500,
      costPrice: 6500,
      categoryId: catUnstitched.id,
      collectionId: colFestive.id,
      inStock: true,
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      isSale: false,
      packageIncludes: 'Embroidered Velvet Front & Back 2.5m, Embroidered Velvet Sleeves 0.7m, Heavy Embroidered Velvet Shawl 2.5m, Dyed Raw Silk Trouser 2.5m, Neckline & Ghera Embroidered Patches',
      careInstructions: 'Dry clean only. Hang on padded hangers. Steam iron lightly on reverse side only.',
      images: [
        { url: '/assets/prod-velvet.jpg', alt: 'Tauheed Signature Royal Noir Velvet Shawl', displayOrder: 0 },
        { url: '/assets/prod-alhassan.jpg', alt: 'Noir Gold Velvet Craftsmanship', displayOrder: 1 }
      ],
      variants: [
        { sku: 'TT-TAU-015-UN', size: 'Unstitched', color: 'Imperial Noir', stitchedType: 'Unstitched', priceAdjustment: 0, stockQuantity: 35, reservedStock: 2 },
        { sku: 'TT-TAU-015-SM', size: 'S', color: 'Imperial Noir', stitchedType: 'Stitched', priceAdjustment: 4000, stockQuantity: 10, reservedStock: 1 },
        { sku: 'TT-TAU-015-MD', size: 'M', color: 'Imperial Noir', stitchedType: 'Stitched', priceAdjustment: 4000, stockQuantity: 16, reservedStock: 2 },
        { sku: 'TT-TAU-015-LG', size: 'L', color: 'Imperial Noir', stitchedType: 'Stitched', priceAdjustment: 4000, stockQuantity: 8, reservedStock: 0 }
      ]
    }
  ];

  for (const item of productsToAdd) {
    const { images, variants, ...prodData } = item;

    // Check if product exists
    const existing = await prisma.product.findUnique({ where: { sku: prodData.sku } });

    let product;
    if (existing) {
      console.log(`Updating existing product: ${prodData.sku} (${prodData.title})`);
      product = await prisma.product.update({
        where: { sku: prodData.sku },
        data: prodData
      });
      // Clear old images & variants to re-insert cleanly
      await prisma.productImage.deleteMany({ where: { productId: product.id } });
      await prisma.productVariant.deleteMany({ where: { productId: product.id } });
    } else {
      console.log(`Creating new product: ${prodData.sku} (${prodData.title})`);
      product = await prisma.product.create({
        data: prodData
      });
    }

    // Insert images
    for (const img of images) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: img.url,
          alt: img.alt,
          displayOrder: img.displayOrder
        }
      });
    }

    // Insert variants
    for (const v of variants) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: v.sku,
          size: v.size,
          color: v.color,
          stitchedType: v.stitchedType,
          priceAdjustment: v.priceAdjustment,
          stockQuantity: v.stockQuantity,
          reservedStock: v.reservedStock
        }
      });

      // Insert initial inventory movement
      await prisma.inventoryMovement.create({
        data: {
          variantId: variant.id,
          changeQty: v.stockQuantity,
          previousQty: 0,
          newQty: v.stockQuantity,
          type: 'STOCK_IN',
          reason: 'Initial reference brand catalogue inventory addition',
          staffName: 'Admin System'
        }
      });
    }
  }

  console.log('Reference brand products successfully added!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
