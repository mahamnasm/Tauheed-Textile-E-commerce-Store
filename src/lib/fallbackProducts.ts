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
  subcategories: { id: string; name: string; slug: string; image?: string }[];
}

export const FALLBACK_CATEGORIES: FallbackCategory[] = [
  {
    id: "cat-lawn-summer",
    name: "Lawn & Summer",
    slug: "lawn-summer",
    image: "/assets/subcategories/sub-lawn-3pc.jpg",
    displayOrder: 1,
    subcategories: [
      { id: "sub-lawn-3pc", name: "3 Piece Suits", slug: "lawn-3-piece", image: "/assets/subcategories/sub-lawn-3pc.jpg" },
      { id: "sub-lawn-2pc", name: "2 Piece Suits", slug: "lawn-2-piece", image: "/assets/subcategories/sub-lawn-2pc.jpg" },
      { id: "sub-lawn-emb", name: "Embroidered", slug: "lawn-embroidered", image: "/assets/subcategories/sub-lawn-emb.jpg" },
      { id: "sub-lawn-printed", name: "Printed Daily", slug: "lawn-printed", image: "/assets/products/prod-bano-printed.jpg" },
      { id: "sub-lawn-chiffon", name: "Chiffon Dupatta", slug: "lawn-chiffon-dupatta", image: "/assets/subcategories/sub-chiffon-formal.jpg" },
    ],
  },
  {
    id: "cat-lawn-formals",
    name: "Lawn Formals",
    slug: "lawn-formals",
    image: "/assets/subcategories/sub-lawn-emb.jpg",
    displayOrder: 2,
    subcategories: [
      { id: "sub-lf-emb", name: "Heavy Embroidered", slug: "lawn-formals-heavy-emb", image: "/assets/subcategories/sub-lawn-emb.jpg" },
      { id: "sub-lf-schiffli", name: "Schiffli & Adda", slug: "lawn-formals-schiffli", image: "/assets/subcategories/sub-lawn-3pc.jpg" },
      { id: "sub-lf-jacquard", name: "Jacquard Formals", slug: "lawn-formals-jacquard", image: "/assets/products/prod-bano-printed.jpg" },
      { id: "sub-lf-organza", name: "Organza Dupatta", slug: "lawn-formals-organza", image: "/assets/subcategories/sub-organza.jpg" },
    ],
  },
  {
    id: "cat-chiffon-formal",
    name: "Chiffon & Formal",
    slug: "chiffon-formal",
    image: "/assets/subcategories/sub-chiffon-formal.jpg",
    displayOrder: 3,
    subcategories: [
      { id: "sub-ch-3pc", name: "Festive 3-Piece", slug: "chiffon-festive-3pc", image: "/assets/subcategories/sub-chiffon-formal.jpg" },
      { id: "sub-ch-adda", name: "Adda & Handwork", slug: "chiffon-adda-handwork", image: "/assets/products/prod-zehra-chiffon.jpg" },
      { id: "sub-ch-maxi", name: "Chiffon Maxies", slug: "chiffon-maxies", image: "/assets/subcategories/sub-bridal.jpg" },
      { id: "sub-ch-party", name: "Party Wear", slug: "chiffon-party-wear", image: "/assets/banners/banner-chiffon.jpg" },
    ],
  },
  {
    id: "cat-silk",
    name: "Silk",
    slug: "silk",
    image: "/assets/subcategories/sub-silk.jpg",
    displayOrder: 4,
    subcategories: [
      { id: "sub-silk-suit", name: "Raw Silk Suits", slug: "silk-raw-silk", image: "/assets/subcategories/sub-silk.jpg" },
      { id: "sub-silk-satin", name: "Printed Satin", slug: "silk-printed-satin", image: "/assets/products/prod-meher-coord.jpg" },
      { id: "sub-silk-emb", name: "Embroidered 3pc", slug: "silk-embroidered-3pc", image: "/assets/banners/banner-festive.jpg" },
      { id: "sub-silk-tunic", name: "Tunics & Co-ords", slug: "silk-tunics-coords", image: "/assets/subcategories/sub-silk.jpg" },
    ],
  },
  {
    id: "cat-net-formals",
    name: "Net Formals",
    slug: "net-formals",
    image: "/assets/subcategories/sub-net.jpg",
    displayOrder: 5,
    subcategories: [
      { id: "sub-net-suit", name: "Embroidered Net", slug: "net-embroidered-suits", image: "/assets/subcategories/sub-net.jpg" },
      { id: "sub-net-maxi", name: "Maxies & Gowns", slug: "net-maxies-gowns", image: "/assets/products/prod-noor-bridal.jpg" },
      { id: "sub-net-zari", name: "Zari & Mirror", slug: "net-zari-mirror", image: "/assets/subcategories/sub-net.jpg" },
      { id: "sub-net-dupatta", name: "Net Dupattas", slug: "net-bridal-dupattas", image: "/assets/subcategories/sub-net.jpg" },
    ],
  },
  {
    id: "cat-organza-formals",
    name: "Organza Formals",
    slug: "organza-formals",
    image: "/assets/subcategories/sub-organza.jpg",
    displayOrder: 6,
    subcategories: [
      { id: "sub-org-laser", name: "Laser Cut Organza", slug: "organza-laser-cut", image: "/assets/subcategories/sub-organza.jpg" },
      { id: "sub-org-emb", name: "Embroidered 3pc", slug: "organza-embroidered", image: "/assets/products/prod-zehra-chiffon.jpg" },
      { id: "sub-org-suits", name: "Organza Suits", slug: "organza-suits-3pc", image: "/assets/subcategories/sub-organza.jpg" },
      { id: "sub-org-festive", name: "Festive Edit", slug: "organza-festive-edit", image: "/assets/subcategories/sub-organza.jpg" },
    ],
  },
  {
    id: "cat-bridal-maxies",
    name: "Bridal Maxies",
    slug: "bridal-maxies",
    image: "/assets/subcategories/sub-bridal.jpg",
    displayOrder: 7,
    subcategories: [
      { id: "sub-bm-barat", name: "Royal Barat Maxies", slug: "bridal-royal-barat", image: "/assets/subcategories/sub-bridal.jpg" },
      { id: "sub-bm-walima", name: "Pastel Walima Gowns", slug: "bridal-pastel-walima", image: "/assets/subcategories/sub-net.jpg" },
      { id: "sub-bm-mehndi", name: "Mehndi & Mayun", slug: "bridal-mehndi-mayun", image: "/assets/prod-bridal.jpg" },
      { id: "sub-bm-tilla", name: "Heavy Tilla & Dabka", slug: "bridal-tilla-dabka", image: "/assets/subcategories/sub-bridal.jpg" },
    ],
  },
  {
    id: "cat-saries",
    name: "Saries",
    slug: "saries",
    image: "/assets/subcategories/sub-saree.jpg",
    displayOrder: 8,
    subcategories: [
      { id: "sub-sari-chiffon", name: "Chiffon Saries", slug: "saries-chiffon", image: "/assets/subcategories/sub-saree.jpg" },
      { id: "sub-sari-silk", name: "Silk Saries", slug: "saries-silk", image: "/assets/subcategories/sub-silk.jpg" },
      { id: "sub-sari-organza", name: "Organza Saries", slug: "saries-organza", image: "/assets/subcategories/sub-saree.jpg" },
      { id: "sub-sari-banarsi", name: "Banarsi Saries", slug: "saries-banarsi", image: "/assets/prod-nafasat.jpg" },
    ],
  },
  {
    id: "cat-winter-collection",
    name: "Winter Collection",
    slug: "winter-collection",
    image: "/assets/subcategories/sub-winter.jpg",
    displayOrder: 9,
    subcategories: [
      { id: "sub-w-velvet", name: "Velvet Ensembles", slug: "winter-velvet-ensembles", image: "/assets/subcategories/sub-winter.jpg" },
      { id: "sub-w-marina", name: "Marina & Karandi", slug: "winter-marina-karandi", image: "/assets/products/prod-aira-velvet.jpg" },
      { id: "sub-w-shawl", name: "Pashmina Shawl 3pc", slug: "winter-pashmina-shawls", image: "/assets/subcategories/sub-winter.jpg" },
      { id: "sub-w-linen", name: "Linen Printed", slug: "winter-linen-printed", image: "/assets/products/prod-bano-printed.jpg" },
    ],
  },
  {
    id: "cat-sale",
    name: "Sale & Clearance",
    slug: "sale",
    image: "/assets/subcategories/sub-sale.jpg",
    displayOrder: 10,
    subcategories: [
      { id: "sub-sale-20", name: "Flat 20% Off", slug: "sale-flat-20", image: "/assets/subcategories/sub-sale.jpg" },
      { id: "sub-sale-30", name: "Flat 30% Off", slug: "sale-flat-30", image: "/assets/subcategories/sub-sale.jpg" },
      { id: "sub-sale-50", name: "Flat 50% Off", slug: "sale-flat-50", image: "/assets/subcategories/sub-sale.jpg" },
      { id: "sub-sale-under", name: "Under Rs. 2,999", slug: "sale-under-2999", image: "/assets/subcategories/sub-lawn-2pc.jpg" },
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
    category: { id: "cat-3", name: "Silk", slug: "silk" },
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
    category: { id: "cat-4", name: "Net Formals", slug: "net-formals" },
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
