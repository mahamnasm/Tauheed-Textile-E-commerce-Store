export interface FallbackProduct {
  id: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  fabric: string;
  workType: string;
  pieceCount: string;
  basePrice: number;
  salePrice: number | null;
  comparePrice: number | null;
  inStock: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isSale: boolean;
  isPreOrder: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  images: { id: string; url: string; displayOrder: number; alt?: string | null }[];
  variants: {
    id: string;
    size: string;
    color: string;
    stitchedType: string;
    sku: string;
    priceAdjustment: number;
    stockQuantity: number;
  }[];
  weight?: number;
  subcategoryId?: string;
  subcategory?: {
    id: string;
    name: string;
    slug: string;
  };
  reviews?: any[];
}

export interface FallbackCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  displayOrder: number;
  subcategories: { id: string; name: string; slug: string }[];
}

export const FALLBACK_CATEGORIES: FallbackCategory[] = [
  {
    id: "cat-lawn-summer",
    name: "Lawn & Summer",
    slug: "lawn-summer",
    image: "/assets/banners/banner-lawn.jpg",
    displayOrder: 1,
    subcategories: [
      { id: "sub-lawn-2pc", name: "2 Piece", slug: "2-piece" },
      { id: "sub-lawn-3pc", name: "3 Piece", slug: "3-piece" },
      { id: "sub-lawn-printed", name: "Printed", slug: "printed" },
      { id: "sub-lawn-emb", name: "Embroidered", slug: "embroidered" },
    ],
  },
  {
    id: "cat-lawn-formals",
    name: "Lawn Formals",
    slug: "lawn-formals",
    image: "/assets/products/prod-bano-printed.jpg",
    displayOrder: 2,
    subcategories: [
      { id: "sub-lf-2pc", name: "2 Piece", slug: "2-piece" },
      { id: "sub-lf-3pc", name: "3 Piece", slug: "3-piece" },
      { id: "sub-lf-emb", name: "Heavy Embroidered", slug: "heavy-embroidered" },
    ],
  },
  {
    id: "cat-chiffon-formal",
    name: "Chiffon & Formal",
    slug: "chiffon-formal",
    image: "/assets/banners/banner-chiffon.jpg",
    displayOrder: 3,
    subcategories: [
      { id: "sub-ch-suit", name: "Suit", slug: "suit" },
      { id: "sub-ch-maxi", name: "Maxi", slug: "maxi" },
      { id: "sub-ch-sari", name: "Sari", slug: "sari" },
    ],
  },
  {
    id: "cat-silk",
    name: "Silk",
    slug: "silk",
    image: "/assets/banners/banner-festive.jpg",
    displayOrder: 4,
    subcategories: [
      { id: "sub-silk-suit", name: "Suit", slug: "suit" },
      { id: "sub-silk-sari", name: "Sari", slug: "sari" },
      { id: "sub-silk-tunic", name: "Tunic & Co-ord", slug: "tunic" },
    ],
  },
  {
    id: "cat-net-formals",
    name: "Net Formals",
    slug: "net-formals",
    image: "/assets/products/prod-noor-bridal.jpg",
    displayOrder: 5,
    subcategories: [
      { id: "sub-net-suit", name: "Suit", slug: "suit" },
      { id: "sub-net-maxi", name: "Maxi", slug: "maxi" },
      { id: "sub-net-gown", name: "Gown", slug: "gown" },
    ],
  },
  {
    id: "cat-organza-formals",
    name: "Organza Formals",
    slug: "organza-formals",
    image: "/assets/banners/banner-lawn.jpg",
    displayOrder: 6,
    subcategories: [
      { id: "sub-org-suit", name: "Suit", slug: "suit" },
      { id: "sub-org-maxi", name: "Maxi", slug: "maxi" },
      { id: "sub-org-dupatta", name: "Dupatta Set", slug: "dupatta-set" },
    ],
  },
  {
    id: "cat-bridal-maxies",
    name: "Bridal Maxies",
    slug: "bridal-maxies",
    image: "/assets/products/prod-bridal.jpg",
    displayOrder: 7,
    subcategories: [
      { id: "sub-bm-barat", name: "Barat Maxi", slug: "barat-maxi" },
      { id: "sub-bm-walima", name: "Walima Maxi", slug: "walima-maxi" },
      { id: "sub-bm-nikkah", name: "Nikkah / Engagement", slug: "nikkah-maxi" },
    ],
  },
  {
    id: "cat-saries",
    name: "Saries",
    slug: "saries",
    image: "/assets/products/prod-zehra-chiffon.jpg",
    displayOrder: 8,
    subcategories: [
      { id: "sub-sari-chiffon", name: "Chiffon Sari", slug: "chiffon-sari" },
      { id: "sub-sari-silk", name: "Silk Sari", slug: "silk-sari" },
      { id: "sub-sari-organza", name: "Organza Sari", slug: "organza-sari" },
    ],
  },
  {
    id: "cat-winter-collection",
    name: "Winter Collection",
    slug: "winter-collection",
    image: "/assets/products/prod-aira-velvet.jpg",
    displayOrder: 9,
    subcategories: [
      { id: "sub-w-velvet", name: "Velvet", slug: "velvet" },
      { id: "sub-w-marina", name: "Marina", slug: "marina" },
      { id: "sub-w-shawl", name: "Pashmina Shawl Suits", slug: "shawl-suits" },
    ],
  },
  {
    id: "cat-sale",
    name: "Sale & Clearance",
    slug: "sale",
    image: "/assets/banners/banner-sale.jpg",
    displayOrder: 10,
    subcategories: [
      { id: "sub-sale-20", name: "Flat 20% Off", slug: "flat-20" },
      { id: "sub-sale-30", name: "Flat 30% Off", slug: "flat-30" },
      { id: "sub-sale-50", name: "Flat 50% Off", slug: "flat-50" },
    ],
  },
];

export const FALLBACK_PRODUCTS: FallbackProduct[] = [
  {
    id: "prod-1-gule-noor",
    title: "Gul-e-Noor Luxury Lawn 3-Piece",
    slug: "gul-e-noor-luxury-lawn-3-piece",
    sku: "TT-GN-01",
    description: "Breathable pure Egyptian cotton lawn with delicate floral embroidery, organza neckline patch, and digital printed silk dupatta.",
    fabric: "Pure Egyptian Cotton Lawn",
    workType: "Embroidered Neckline & Digital Print",
    pieceCount: "3 Piece",
    basePrice: 4950,
    salePrice: 4450,
    comparePrice: 5950,
    inStock: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isSale: true,
    isPreOrder: false,
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Lawn & Summer", slug: "lawn-summer" },
    images: [
      { id: "img-gn-1", url: "/assets/products/prod-gule-noor.jpg", displayOrder: 0, alt: "Gul-e-Noor Luxury Lawn" }
    ],
    variants: [
      { id: "var-gn-1", size: "Unstitched", color: "Pastel Blue", stitchedType: "Unstitched", sku: "TT-GN-01-UN", priceAdjustment: 0, stockQuantity: 25 },
      { id: "var-gn-2", size: "Small (Stitched)", color: "Pastel Blue", stitchedType: "Stitched", sku: "TT-GN-01-S", priceAdjustment: 1200, stockQuantity: 10 },
      { id: "var-gn-3", size: "Medium (Stitched)", color: "Pastel Blue", stitchedType: "Stitched", sku: "TT-GN-01-M", priceAdjustment: 1200, stockQuantity: 15 },
      { id: "var-gn-4", size: "Large (Stitched)", color: "Pastel Blue", stitchedType: "Stitched", sku: "TT-GN-01-L", priceAdjustment: 1200, stockQuantity: 8 }
    ],
    reviews: []
  },
  {
    id: "prod-2-zehra-chiffon",
    title: "Zehra Pure Chiffon Embroidered Suit",
    slug: "zehra-pure-chiffon-embroidered-suit",
    sku: "TT-ZC-02",
    description: "Regal peacock-teal pure chiffon shirt intricately adorned with tilla, sequins and zari embroidery, paired with embellished border dupatta.",
    fabric: "Pure Chiffon & Silk Trouser",
    workType: "Heavy Tilla, Zari & Threadwork",
    pieceCount: "3 Piece",
    basePrice: 8950,
    salePrice: 7950,
    comparePrice: 9950,
    inStock: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: true,
    isSale: true,
    isPreOrder: false,
    categoryId: "cat-2",
    category: { id: "cat-2", name: "Chiffon & Formal", slug: "chiffon-formal" },
    images: [
      { id: "img-zc-1", url: "/assets/products/prod-zehra-chiffon.jpg", displayOrder: 0, alt: "Zehra Pure Chiffon" }
    ],
    variants: [
      { id: "var-zc-1", size: "Unstitched", color: "Deep Teal", stitchedType: "Unstitched", sku: "TT-ZC-02-UN", priceAdjustment: 0, stockQuantity: 18 },
      { id: "var-zc-2", size: "Small (Stitched)", color: "Deep Teal", stitchedType: "Stitched", sku: "TT-ZC-02-S", priceAdjustment: 1500, stockQuantity: 6 },
      { id: "var-zc-3", size: "Medium (Stitched)", color: "Deep Teal", stitchedType: "Stitched", sku: "TT-ZC-02-M", priceAdjustment: 1500, stockQuantity: 12 },
      { id: "var-zc-4", size: "Large (Stitched)", color: "Deep Teal", stitchedType: "Stitched", sku: "TT-ZC-02-L", priceAdjustment: 1500, stockQuantity: 5 }
    ],
    reviews: []
  },
  {
    id: "prod-3-meher-coord",
    title: "Meher Ivory Raw Silk Co-ord Set",
    slug: "meher-ivory-raw-silk-co-ord-set",
    sku: "TT-MC-03",
    description: "Contemporary luxury ready-to-wear 2-piece co-ord tailored in luminous ivory raw silk with pearl buttons and minimal cuff embellishments.",
    fabric: "Pure Korean Raw Silk (80g)",
    workType: "Minimalist Cutwork & Pearl Accents",
    pieceCount: "2 Piece",
    basePrice: 7490,
    salePrice: null,
    comparePrice: 8490,
    inStock: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isSale: false,
    isPreOrder: false,
    categoryId: "cat-3",
    category: { id: "cat-3", name: "Pret / Ready to Wear", slug: "pret-ready-to-wear" },
    images: [
      { id: "img-mc-1", url: "/assets/products/prod-meher-coord.jpg", displayOrder: 0, alt: "Meher Raw Silk Co-ord" }
    ],
    variants: [
      { id: "var-mc-1", size: "Extra Small", color: "Warm Ivory", stitchedType: "Ready to Wear", sku: "TT-MC-03-XS", priceAdjustment: 0, stockQuantity: 8 },
      { id: "var-mc-2", size: "Small", color: "Warm Ivory", stitchedType: "Ready to Wear", sku: "TT-MC-03-S", priceAdjustment: 0, stockQuantity: 14 },
      { id: "var-mc-3", size: "Medium", color: "Warm Ivory", stitchedType: "Ready to Wear", sku: "TT-MC-03-M", priceAdjustment: 0, stockQuantity: 16 },
      { id: "var-mc-4", size: "Large", color: "Warm Ivory", stitchedType: "Ready to Wear", sku: "TT-MC-03-L", priceAdjustment: 0, stockQuantity: 9 }
    ],
    reviews: []
  },
  {
    id: "prod-4-noor-bridal",
    title: "Noor-e-Jahan Bridal Barat Kalidar",
    slug: "noor-e-jahan-bridal-barat-kalidar",
    sku: "TT-NB-04",
    description: "Grand heirloom bridal kalidar in crimson silk velvet and net, hand-worked with dabka, naqshi, kora and crystals. Paired with a heavily bordered dupatta.",
    fabric: "Silk Velvet, Net & Pure Jamawar",
    workType: "Master Handcrafted Zardozi, Dabka & Crystal",
    pieceCount: "3 Piece Bridal",
    basePrice: 38500,
    salePrice: 34990,
    comparePrice: 45000,
    inStock: true,
    isFeatured: true,
    isNewArrival: true,
    isBestSeller: false,
    isSale: true,
    isPreOrder: false,
    categoryId: "cat-4",
    category: { id: "cat-4", name: "Wedding & Luxury Pret", slug: "wedding-luxury-pret" },
    images: [
      { id: "img-nb-1", url: "/assets/products/prod-noor-bridal.jpg", displayOrder: 0, alt: "Noor-e-Jahan Bridal Kalidar" }
    ],
    variants: [
      { id: "var-nb-1", size: "Custom Made-to-Measure", color: "Deep Crimson", stitchedType: "Bridal Stitched", sku: "TT-NB-04-CUST", priceAdjustment: 0, stockQuantity: 5 },
      { id: "var-nb-2", size: "Standard Small", color: "Deep Crimson", stitchedType: "Bridal Stitched", sku: "TT-NB-04-S", priceAdjustment: 0, stockQuantity: 3 },
      { id: "var-nb-3", size: "Standard Medium", color: "Deep Crimson", stitchedType: "Bridal Stitched", sku: "TT-NB-04-M", priceAdjustment: 0, stockQuantity: 3 }
    ],
    reviews: []
  },
  {
    id: "prod-5-bano-printed",
    title: "Bano Printed Lawn with Chiffon Dupatta 3-Piece",
    slug: "bano-printed-lawn-with-chiffon-dupatta-3-piece",
    sku: "TT-BP-05",
    description: "Summer vibrant mustard-ochre lawn with Mughal garden motif prints and an ethereal crinkle chiffon dupatta for daily effortless style.",
    fabric: "Premium Lawn & Crinkle Chiffon",
    workType: "High-Definition Digital Print",
    pieceCount: "3 Piece",
    basePrice: 3450,
    salePrice: 2950,
    comparePrice: 3950,
    inStock: true,
    isFeatured: false,
    isNewArrival: true,
    isBestSeller: true,
    isSale: true,
    isPreOrder: false,
    categoryId: "cat-5",
    category: { id: "cat-5", name: "Unstitched", slug: "unstitched" },
    images: [
      { id: "img-bp-1", url: "/assets/products/prod-bano-printed.jpg", displayOrder: 0, alt: "Bano Printed Lawn" }
    ],
    variants: [
      { id: "var-bp-1", size: "Unstitched 3pc", color: "Mustard Ochre", stitchedType: "Unstitched", sku: "TT-BP-05-UN", priceAdjustment: 0, stockQuantity: 35 },
      { id: "var-bp-2", size: "Stitched Small", color: "Mustard Ochre", stitchedType: "Stitched", sku: "TT-BP-05-S", priceAdjustment: 1000, stockQuantity: 10 },
      { id: "var-bp-3", size: "Stitched Medium", color: "Mustard Ochre", stitchedType: "Stitched", sku: "TT-BP-05-M", priceAdjustment: 1000, stockQuantity: 15 }
    ],
    reviews: []
  },
  {
    id: "prod-6-aira-velvet",
    title: "Aira Embroidered Velvet Shawl Suit (Festive Archive Sale)",
    slug: "aira-embroidered-velvet-shawl-suit",
    sku: "TT-AV-06",
    description: "Plum royal velvet suit paired with an opulent 2.5m embroidered shawl featuring gold thread borders and scalloped edges.",
    fabric: "Micro Velvet 9000 & Embroidered Shawl",
    workType: "Tilla & Resham Embroidery with Scalloped Borders",
    pieceCount: "3 Piece",
    basePrice: 12500,
    salePrice: 9950,
    comparePrice: 14500,
    inStock: true,
    isFeatured: true,
    isNewArrival: false,
    isBestSeller: true,
    isSale: true,
    isPreOrder: false,
    categoryId: "cat-2",
    category: { id: "cat-2", name: "Chiffon & Formal", slug: "chiffon-formal" },
    images: [
      { id: "img-av-1", url: "/assets/products/prod-aira-velvet.jpg", displayOrder: 0, alt: "Aira Velvet Shawl Suit" }
    ],
    variants: [
      { id: "var-av-1", size: "Unstitched", color: "Royal Plum", stitchedType: "Unstitched", sku: "TT-AV-06-UN", priceAdjustment: 0, stockQuantity: 12 },
      { id: "var-av-2", size: "Stitched Medium", color: "Royal Plum", stitchedType: "Stitched", sku: "TT-AV-06-M", priceAdjustment: 1500, stockQuantity: 6 }
    ],
    reviews: []
  }
];
