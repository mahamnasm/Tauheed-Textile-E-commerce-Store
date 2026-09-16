const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding Tauheed Textile database...');

  const passwordHash = await bcrypt.hash('Tauheed@123', 10);

  const users = [
    { email: 'superadmin@tauheedtextile.com', name: 'Zeeshan Super Admin', role: 'SUPER_ADMIN', phone: '03001234567' },
    { email: 'storemanager@tauheedtextile.com', name: 'Fatima Store Manager', role: 'STORE_MANAGER', phone: '03011234567' },
    { email: 'productmanager@tauheedtextile.com', name: 'Hamza Product Manager', role: 'PRODUCT_MANAGER', phone: '03021234567' },
    { email: 'ordermanager@tauheedtextile.com', name: 'Ayesha Order Manager', role: 'ORDER_MANAGER', phone: '03031234567' },
    { email: 'support@tauheedtextile.com', name: 'Bilal Support Specialist', role: 'CUSTOMER_SUPPORT', phone: '03041234567' },
    { email: 'marketing@tauheedtextile.com', name: 'Mariam Marketing Lead', role: 'MARKETING_MANAGER', phone: '03051234567' },
    { email: 'accountant@tauheedtextile.com', name: 'Tariq Head Accountant', role: 'ACCOUNTANT', phone: '03061234567' },
    { email: 'warehouse@tauheedtextile.com', name: 'Usman Warehouse Supervisor', role: 'WAREHOUSE_STAFF', phone: '03071234567' },
    { email: 'customer@tauheedtextile.com', name: 'Sara Khan', role: 'CUSTOMER', phone: '03219876543', tags: 'VIP, REPEAT' },
    { email: 'fraud.test@example.com', name: 'Fake COD Orderer', role: 'CUSTOMER', phone: '03330000000', tags: 'COD_BLACKLIST, FRAUD_RISK' }
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, passwordHash, isPhoneVerified: true }
    });
  }
  console.log('Created admin and customer users');

  const categories = [
    { name: 'Lawn & Summer', slug: 'lawn-summer', description: 'Breathable luxury lawn with intricate threadwork and chiffon dupattas', image: '/assets/cat-lawn-summer.jpg', displayOrder: 1 },
    { name: 'Lawn Formals', slug: 'lawn-formals', description: 'Festive jacquard and heavy embroidered unstitched formal lawn ensembles', image: '/assets/cat-lawn-summer.jpg', displayOrder: 2 },
    { name: 'Chiffon & Formal', slug: 'chiffon-formal', description: 'Flowing sheer chiffon adorned with sequins, tilla and adda work', image: '/assets/cat-chiffon-formal.jpg', displayOrder: 3 },
    { name: 'Silk', slug: 'silk', description: 'Pure raw silk, shamooz, and medium silk unstitched ensembles and saries', image: '/assets/cat-pret-readytowear.jpg', displayOrder: 4 },
    { name: 'Net Formals', slug: 'net-formals', description: 'Intricately embroidered luxury net suits, maxies, and festive dupattas', image: '/assets/cat-wedding-luxury.jpg', displayOrder: 5 },
    { name: 'Organza Formals', slug: 'organza-formals', description: 'Crisp woven organza ensembles with handcrafted zardozi and floral embellishments', image: '/assets/cat-chiffon-formal.jpg', displayOrder: 6 },
    { name: 'Bridal Maxies', slug: 'bridal-maxies', description: 'Regal bridal maxies and heavily embellished kalidars for wedding festivities', image: '/assets/cat-wedding-luxury.jpg', displayOrder: 7 },
    { name: 'Saries', slug: 'saries', description: 'Graceful 6-yard unstitched and semi-stitched saries in chiffon, silk, and organza', image: '/assets/cat-chiffon-formal.jpg', displayOrder: 8 },
    { name: 'Winter Collection', slug: 'winter-collection', description: 'Warm velvet, marina, karandi, and wool pashmina shawl unstitched suits', image: '/assets/cat-lawn-summer.jpg', displayOrder: 9 },
    { name: 'Sale', slug: 'sale', description: 'Exclusive seasonal markdowns on authentic designer creations', image: '/assets/banners/banner-sale.jpg', displayOrder: 10 }
  ];

  const catMap = {};
  for (const c of categories) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c
    });
    catMap[c.slug] = cat.id;
  }
  console.log('Created categories');

  const collections = [
    { name: 'Summer Elegance 2026', slug: 'summer-elegance-2026', description: 'Lightweight pastel palettes crafted in Swiss voile and Egyptian lawn', isSeasonal: true },
    { name: 'Festive Zari Royale', slug: 'festive-zari-royale', description: 'Traditional gold zari embroidery on organza and raw silk', isSeasonal: true },
    { name: 'Everyday Pret Edit', slug: 'everyday-pret-edit', description: 'Refined solids, digital prints and easy-wear silhouettes for daily elegance', isSeasonal: false }
  ];

  const colMap = {};
  for (const col of collections) {
    const c = await prisma.collection.upsert({
      where: { slug: col.slug },
      update: {},
      create: col
    });
    colMap[col.slug] = c.id;
  }
  console.log('Created collections');

  const products = [
    {
      sku: 'TT-LWN-001',
      title: 'Gul-e-Noor Luxury Lawn 3-Piece',
      slug: 'gul-e-noor-luxury-lawn-3-piece',
      description: 'An ethereal pastel peach ensemble featuring delicate Kashmiri floral embroidery on superfine lawn, paired with an all-over printed pure silk dupatta and dyed cambric trousers.',
      fabric: 'Luxury Lawn & Pure Silk',
      workType: 'Resham & Tilla Embroidery',
      pieceCount: 3,
      basePrice: 8950,
      comparePrice: 10500,
      costPrice: 4200,
      categoryId: catMap['lawn-summer'],
      collectionId: colMap['summer-elegance-2026'],
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      isPreOrder: false,
      packageIncludes: 'Embroidered Lawn Front 1.15m, Plain Lawn Back 1.15m, Embroidered Sleeves 0.65m, Silk Dupatta 2.5m, Dyed Trouser 2.5m, Embroidered Neckline & Daman Borders',
      careInstructions: 'Dry clean recommended. Gentle hand wash in cold water. Iron on low heat. Do not bleach.',
      images: [
        { url: '/assets/1.png', alt: 'Gul-e-Noor Luxury Lawn Front View', displayOrder: 0 },
        { url: '/assets/2.png', alt: 'Gul-e-Noor Embroidery Detail', displayOrder: 1 }
      ],
      variants: [
        { sku: 'TT-LWN-001-UN', size: 'Unstitched', color: 'Peach Sorbet', stitchedType: 'Unstitched', priceAdjustment: 0, stockQuantity: 45, reservedStock: 2 },
        { sku: 'TT-LWN-001-SM', size: 'S', color: 'Peach Sorbet', stitchedType: 'Stitched', priceAdjustment: 3000, stockQuantity: 18, reservedStock: 1 },
        { sku: 'TT-LWN-001-MD', size: 'M', color: 'Peach Sorbet', stitchedType: 'Stitched', priceAdjustment: 3000, stockQuantity: 24, reservedStock: 3 },
        { sku: 'TT-LWN-001-LG', size: 'L', color: 'Peach Sorbet', stitchedType: 'Stitched', priceAdjustment: 3000, stockQuantity: 12, reservedStock: 0 }
      ]
    },
    {
      sku: 'TT-CHF-002',
      title: 'Zehra Pure Chiffon Embroidered Suit',
      slug: 'zehra-pure-chiffon-embroidered-suit',
      description: 'Midnight emerald sheer chiffon embellished with opulent cutwork borders, delicate micro-sequins, and a hand-crafted organza dupatta drape.',
      fabric: 'Pure Chiffon & Organza',
      workType: 'Sequin, Cutwork & Adda Handwork',
      pieceCount: 3,
      basePrice: 14500,
      comparePrice: 16900,
      costPrice: 6800,
      categoryId: catMap['chiffon-formal'],
      collectionId: colMap['festive-zari-royale'],
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: true,
      isPreOrder: false,
      packageIncludes: 'Hand-worked Chiffon Front 1.25m, Chiffon Back 1.25m, Embellished Sleeves 0.7m, Organza Embroidered Dupatta 2.5m, Raw Silk Trousers 2.5m, Slip Lining Included',
      careInstructions: 'Dry clean only. Store wrapped in muslin cloth. Avoid spraying perfume directly on zari work.',
      images: [
        { url: '/assets/2.png', alt: 'Zehra Chiffon Formal Gown View', displayOrder: 0 },
        { url: '/assets/1.png', alt: 'Zehra Organza Dupatta Detail', displayOrder: 1 }
      ],
      variants: [
        { sku: 'TT-CHF-002-UN', size: 'Unstitched', color: 'Emerald Noir', stitchedType: 'Unstitched', priceAdjustment: 0, stockQuantity: 22, reservedStock: 1 },
        { sku: 'TT-CHF-002-SM', size: 'S', color: 'Emerald Noir', stitchedType: 'Stitched', priceAdjustment: 4000, stockQuantity: 8, reservedStock: 0 },
        { sku: 'TT-CHF-002-MD', size: 'M', color: 'Emerald Noir', stitchedType: 'Stitched', priceAdjustment: 4000, stockQuantity: 12, reservedStock: 1 },
        { sku: 'TT-CHF-002-LG', size: 'L', color: 'Emerald Noir', stitchedType: 'Stitched', priceAdjustment: 4000, stockQuantity: 6, reservedStock: 0 }
      ]
    },
    {
      sku: 'TT-PRT-003',
      title: 'Meher Ivory Raw Silk Co-ord Set',
      slug: 'meher-ivory-raw-silk-co-ord-set',
      description: 'Sophisticated contemporary Pakistani pret. Luxurious ivory Korean raw silk boxy shirt accented with minimalist threadwork motifs, paired with sleek straight trousers.',
      fabric: 'Korean Raw Silk',
      workType: 'Minimalist Threadwork & Pearl Buttons',
      pieceCount: 2,
      basePrice: 7490,
      comparePrice: 8900,
      costPrice: 3100,
      categoryId: catMap['pret-ready-to-wear'],
      collectionId: colMap['everyday-pret-edit'],
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isPreOrder: false,
      packageIncludes: 'Stitched Raw Silk Tunic & Tailored Straight Pants',
      careInstructions: 'Machine wash delicate cycle in cold water. Low steam iron.',
      images: [
        { url: '/assets/1.png', alt: 'Meher Ivory Co-ord Front View', displayOrder: 0 },
        { url: '/assets/2.png', alt: 'Meher Pearl Detailing', displayOrder: 1 }
      ],
      variants: [
        { sku: 'TT-PRT-003-XS', size: 'XS', color: 'Soft Ivory', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 10, reservedStock: 0 },
        { sku: 'TT-PRT-003-SM', size: 'S', color: 'Soft Ivory', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 25, reservedStock: 2 },
        { sku: 'TT-PRT-003-MD', size: 'M', color: 'Soft Ivory', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 30, reservedStock: 4 },
        { sku: 'TT-PRT-003-LG', size: 'L', color: 'Soft Ivory', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 15, reservedStock: 1 },
        { sku: 'TT-PRT-003-XL', size: 'XL', color: 'Soft Ivory', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 8, reservedStock: 0 }
      ]
    },
    {
      sku: 'TT-WED-004',
      title: 'Noor-e-Jahan Bridal Barat Kalidar',
      slug: 'noor-e-jahan-bridal-barat-kalidar',
      description: 'A masterwork of Pakistani bridal couture. Crimson red velvet and net kalidar heavily encrusted with antique dabka, naqshi, real pearls, and Swarovski crystals.',
      fabric: 'Micro Velvet & French Net',
      workType: 'Heavy Zardozi, Dabka, Naqshi & Pearl Handcraft',
      pieceCount: 3,
      basePrice: 48500,
      comparePrice: 58000,
      costPrice: 22000,
      categoryId: catMap['wedding-luxury-pret'],
      collectionId: colMap['festive-zari-royale'],
      isFeatured: true,
      isBestSeller: false,
      isNewArrival: true,
      isPreOrder: true,
      preOrderDate: '2026-10-15',
      packageIncludes: 'Handcrafted Heavily Embellished Kalidar Gown, Organza Zardozi Dupatta with 4-side borders, Silk Churidar Pajama',
      careInstructions: 'Specialist bridal dry clean only. Preserve in padded luxury garment bag away from dampness.',
      images: [
        { url: '/assets/2.png', alt: 'Noor-e-Jahan Regal Bridal Kalidar', displayOrder: 0 },
        { url: '/assets/1.png', alt: 'Noor-e-Jahan Zardozi Hand Embroidery Detail', displayOrder: 1 }
      ],
      variants: [
        { sku: 'TT-WED-004-CUST', size: 'Custom', color: 'Royal Crimson', stitchedType: 'Custom Made', priceAdjustment: 0, stockQuantity: 5, reservedStock: 1 },
        { sku: 'TT-WED-004-SM', size: 'S', color: 'Royal Crimson', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 3, reservedStock: 0 },
        { sku: 'TT-WED-004-MD', size: 'M', color: 'Royal Crimson', stitchedType: 'Stitched', priceAdjustment: 0, stockQuantity: 4, reservedStock: 0 }
      ]
    },
    {
      sku: 'TT-UNS-005',
      title: 'Bano Printed Lawn with Chiffon Dupatta 3-Piece',
      slug: 'bano-printed-lawn-with-chiffon-dupatta-3-piece',
      description: 'Vintage floral motifs inspired by Mughal gardens rendered on breathable high-density lawn with an airy printed chiffon dupatta and solid dyed cambric bottom.',
      fabric: 'Superfine Lawn & Voile Chiffon',
      workType: 'Digital Print & Embroidered Motif Patch',
      pieceCount: 3,
      basePrice: 4950,
      comparePrice: 5950,
      costPrice: 2100,
      categoryId: catMap['unstitched'],
      collectionId: colMap['summer-elegance-2026'],
      isFeatured: false,
      isBestSeller: true,
      isNewArrival: false,
      isPreOrder: false,
      packageIncludes: 'Printed Lawn Shirt 3m, Printed Chiffon Dupatta 2.5m, Dyed Cotton Cambric Trouser 2.5m, Embroidered Neck Patch',
      careInstructions: 'Hand wash in cold water with mild detergent. Do not soak print in direct sunlight.',
      images: [
        { url: '/assets/1.png', alt: 'Bano Printed Lawn 3-Piece Flat Lay', displayOrder: 0 },
        { url: '/assets/2.png', alt: 'Bano Chiffon Dupatta Texture', displayOrder: 1 }
      ],
      variants: [
        { sku: 'TT-UNS-005-UN', size: 'Unstitched', color: 'Dusty Mint', stitchedType: 'Unstitched', priceAdjustment: 0, stockQuantity: 60, reservedStock: 5 }
      ]
    },
    {
      sku: 'TT-SAL-006',
      title: 'Aira Embroidered Velvet Shawl Suit (Festive Archive Sale)',
      slug: 'aira-embroidered-velvet-shawl-suit',
      description: 'Heavily discounted festive classic! Premium micro-velvet shawl with Kashmiri tilla borders accompanied by a pure marina wool embroidered kurta and trouser.',
      fabric: 'Micro Velvet & Marina Wool',
      workType: 'Kashmiri Tilla Embroidery',
      pieceCount: 3,
      basePrice: 11200,
      salePrice: 11200,
      comparePrice: 18500,
      costPrice: 6500,
      categoryId: catMap['sale'],
      collectionId: colMap['festive-zari-royale'],
      isFeatured: true,
      isBestSeller: true,
      isNewArrival: false,
      isSale: true,
      isPreOrder: false,
      packageIncludes: 'Embroidered Marina Shirt 3m, Embroidered Velvet Shawl 2.5m, Dyed Marina Trouser 2.5m',
      careInstructions: 'Dry clean only. Iron velvet from reverse side with steam.',
      images: [
        { url: '/assets/2.png', alt: 'Aira Velvet Shawl Ensemble', displayOrder: 0 },
        { url: '/assets/1.png', alt: 'Aira Tilla Embroidered Border Closeup', displayOrder: 1 }
      ],
      variants: [
        { sku: 'TT-SAL-006-UN', size: 'Unstitched', color: 'Deep Plum', stitchedType: 'Unstitched', priceAdjustment: 0, stockQuantity: 14, reservedStock: 0 },
        { sku: 'TT-SAL-006-MD', size: 'M', color: 'Deep Plum', stitchedType: 'Stitched', priceAdjustment: 3000, stockQuantity: 4, reservedStock: 1 }
      ]
    }
  ];

  for (const p of products) {
    const { images, variants, ...prodData } = p;
    const prod = await prisma.product.upsert({
      where: { sku: prodData.sku },
      update: {},
      create: prodData
    });

    for (const img of images) {
      await prisma.productImage.create({
        data: { ...img, productId: prod.id }
      });
    }

    for (const v of variants) {
      const createdVar = await prisma.productVariant.upsert({
        where: { sku: v.sku },
        update: {},
        create: { ...v, productId: prod.id }
      });

      await prisma.inventoryMovement.create({
        data: {
          variantId: createdVar.id,
          changeQty: v.stockQuantity,
          previousQty: 0,
          newQty: v.stockQuantity,
          type: 'PURCHASE_RECEIPT',
          reason: 'Initial warehouse inventory intake for launch',
          staffName: 'Usman Warehouse Supervisor'
        }
      });
    }

    await prisma.review.create({
      data: {
        productId: prod.id,
        customerName: 'Amina Tariq',
        rating: 5,
        title: 'Outstanding quality and pure fabric!',
        comment: 'I ordered Gul-e-Noor and the lawn is so soft and breathable. The silk dupatta colors are vibrant, exactly like the photos. Delivery was swift within 48 hours to DHA Phase 5.',
        isApproved: true,
        isFeatured: true
      }
    });

    await prisma.review.create({
      data: {
        productId: prod.id,
        customerName: 'Sadia Malik',
        rating: 5,
        title: 'Stitching was immaculate',
        comment: 'Very pleased with the custom sizing and finishing. The laces and cutwork matched the designer catalog perfectly. Highly recommended Tauheed Textile!',
        isApproved: true,
        isFeatured: false
      }
    });
  }
  console.log('Created products, variants, images, inventory movements and reviews');

  const heroBanners = [
    {
      title: 'Summer Luxury Lawn 2026',
      subtitle: 'Pure Egyptian Voile & Handwoven Silk Dupattas',
      ctaText: 'Explore Collection',
      ctaLink: '/shop?category=lawn-summer',
      mediaType: 'IMAGE',
      mediaUrl: '/assets/1.png',
      displayOrder: 1,
      isActive: true
    },
    {
      title: 'Festive Wedding Royale',
      subtitle: 'Opulent Dabka, Naqshi & Heritage Zardozi Creations',
      ctaText: 'View Wedding Edit',
      ctaLink: '/shop?category=wedding-luxury-pret',
      mediaType: 'IMAGE',
      mediaUrl: '/assets/2.png',
      displayOrder: 2,
      isActive: true
    }
  ];

  for (const b of heroBanners) {
    await prisma.heroBanner.create({ data: b });
  }
  console.log('Created hero banners');

  const firstProduct = await prisma.product.findFirst({ where: { sku: 'TT-LWN-001' } });
  const secondProduct = await prisma.product.findFirst({ where: { sku: 'TT-CHF-002' } });

  const videos = [
    {
      title: 'Gul-e-Noor Silk Drape in Motion',
      videoUrl: '/assets/runway-walk-1.mp4',
      productId: firstProduct.id,
      displayOrder: 1,
      isActive: true
    },
    {
      title: 'Zehra Emerald Cutwork Details',
      videoUrl: '/assets/runway-walk-2.mp4',
      productId: secondProduct.id,
      displayOrder: 2,
      isActive: true
    }
  ];

  for (const v of videos) {
    await prisma.watchBuyVideo.create({ data: v });
  }
  console.log('Created watch & buy video reels');

  const shippingZones = [
    { name: 'Lahore Same-Day / Next-Day', citiesJson: JSON.stringify(['Lahore']), standardRate: 199, expressRate: 350, freeShippingThreshold: 4999, estimatedDays: '1-2 Days', isCodAvailable: true },
    { name: 'Major Metropolitan Hubs', citiesJson: JSON.stringify(['Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Gujranwala', 'Peshawar', 'Sialkot']), standardRate: 250, expressRate: 450, freeShippingThreshold: 4999, estimatedDays: '2-4 Days', isCodAvailable: true },
    { name: 'Rest of Pakistan & Regional Hubs', citiesJson: JSON.stringify(['Hyderabad', 'Quetta', 'Sukkur', 'Bahawalpur', 'Sargodha', 'Abbottabad', 'Mardan', 'Gujrat', 'Kasur', 'Jhang', 'Rahim Yar Khan', 'Okara', 'Wah Cantt', 'Sahiwal', 'Mirpur']), standardRate: 299, expressRate: 499, freeShippingThreshold: 4999, estimatedDays: '3-5 Days', isCodAvailable: true }
  ];

  for (const sz of shippingZones) {
    await prisma.shippingZone.upsert({
      where: { name: sz.name },
      update: {},
      create: sz
    });
  }
  console.log('Created shipping zones');

  const coupons = [
    { code: 'TAUHEED10', discountType: 'PERCENTAGE', discountValue: 10, minOrderValue: 3000, maxDiscount: 2000, usageLimit: 500, isActive: true },
    { code: 'EIDGIFT500', discountType: 'FIXED_AMOUNT', discountValue: 500, minOrderValue: 5000, maxDiscount: 500, usageLimit: 300, isActive: true },
    { code: 'FREESHIP', discountType: 'FIXED_AMOUNT', discountValue: 250, minOrderValue: 2000, maxDiscount: 250, usageLimit: 1000, isActive: true }
  ];

  for (const cp of coupons) {
    await prisma.coupon.upsert({
      where: { code: cp.code },
      update: {},
      create: cp
    });
  }
  console.log('Created coupons');

  const customerUser = await prisma.user.findUnique({ where: { email: 'customer@tauheedtextile.com' } });
  const sampleVariant1 = await prisma.productVariant.findUnique({ where: { sku: 'TT-LWN-001-SM' } });
  const sampleVariant2 = await prisma.productVariant.findUnique({ where: { sku: 'TT-PRT-003-MD' } });

  const sampleOrder1 = await prisma.order.upsert({
    where: { orderNumber: 'TT-2026-1001' },
    update: {},
    create: {
      orderNumber: 'TT-2026-1001',
      customerId: customerUser.id,
      customerName: 'Sara Khan',
      guestPhone: '03219876543',
      guestEmail: 'customer@tauheedtextile.com',
      address: 'House 142, Street 8, Phase 5 DHA',
      city: 'Lahore',
      province: 'Punjab',
      postalCode: '54000',
      landmark: 'Opposite Jalal Sons',
      paymentMethod: 'COD',
      paymentStatus: 'PENDING',
      orderStatus: 'CONFIRMED',
      courierName: 'Trax',
      trackingNumber: 'TRX-94820194',
      courierUrl: 'https://sonic.pk/tracking?tracking_number=TRX-94820194',
      subtotal: 11950,
      shippingFee: 0,
      discount: 0,
      total: 11950,
      isCodConfirmed: true,
      staffNotes: 'Please call before delivery. Ring upper floor bell.',
      items: {
        create: [
          {
            productId: firstProduct.id,
            variantDetails: 'Size: S, Color: Peach Sorbet, Stitched',
            price: 11950,
            costPrice: 5800,
            quantity: 1,
            total: 11950
          }
        ]
      }
    }
  });

  const sampleOrder2 = await prisma.order.upsert({
    where: { orderNumber: 'TT-2026-1002' },
    update: {},
    create: {
      orderNumber: 'TT-2026-1002',
      customerId: customerUser.id,
      customerName: 'Sara Khan',
      guestPhone: '03219876543',
      guestEmail: 'customer@tauheedtextile.com',
      address: 'Flat 4B, Clifton Ocean View Apartments, Block 4',
      city: 'Karachi',
      province: 'Sindh',
      postalCode: '75600',
      landmark: 'Near BBQ Tonight',
      paymentMethod: 'BANK_TRANSFER',
      paymentStatus: 'PAID',
      orderStatus: 'PACKED',
      courierName: 'TCS',
      trackingNumber: 'TCS-771029381',
      courierUrl: 'https://www.tcsexpress.com/track/TCS-771029381',
      subtotal: 7490,
      shippingFee: 0,
      discount: 0,
      total: 7490,
      staffNotes: 'Proof uploaded. Verified by Accountant.',
      items: {
        create: [
          {
            productId: (await prisma.product.findFirst({ where: { sku: 'TT-PRT-003' } })).id,
            variantDetails: 'Size: M, Color: Soft Ivory, Stitched',
            price: 7490,
            costPrice: 3100,
            quantity: 1,
            total: 7490
          }
        ]
      },
      bankTransferProof: {
        create: {
          transactionRef: 'FT2609068892',
          proofImage: '/assets/1.png',
          status: 'VERIFIED',
          reviewedBy: 'Tariq Head Accountant',
          adminNotes: 'Meezan Bank transaction verified against online statement.'
        }
      }
    }
  });

  console.log('Created sample orders: ' + sampleOrder1.orderNumber + ' & ' + sampleOrder2.orderNumber);

  const defaultSettings = [
    { key: 'site_name', value: 'Tauheed Textile', description: 'Store brand title' },
    { key: 'site_tagline', value: 'Timeless Elegance & Premium Pakistani Fashion', description: 'Brand slogan' },
    { key: 'whatsapp_number', value: '+923001234567', description: 'Customer support hotline' },
    { key: 'support_email', value: 'care@tauheedtextile.com', description: 'Customer inquiry email' },
    { key: 'bank_name', value: 'Meezan Bank Limited', description: 'Bank transfer account name' },
    { key: 'bank_account_title', value: 'Tauheed Textile (Pvt) Ltd', description: 'Bank account title' },
    { key: 'bank_account_number', value: '02020108920192', description: 'Bank account number' },
    { key: 'bank_iban', value: 'PK45MEZN0002020108920192', description: 'IBAN number' },
    { key: 'free_shipping_threshold', value: '4999', description: 'Min PKR for free standard courier delivery' }
  ];

  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s
    });
  }
  console.log('Created store settings');

  console.log('Seeding completed successfully! ??');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
