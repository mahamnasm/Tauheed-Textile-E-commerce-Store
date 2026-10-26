import React from "react";
import { prisma } from "@/lib/prisma";
import ShopClientView from "@/components/shop/ShopClientView";

import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from "@/lib/fallbackProducts";

export const revalidate = 60;

interface ShopPageProps {
  searchParams: {
    category?: string;
    subcategory?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    stitched?: string;
    isNewArrival?: string;
    isBestSeller?: string;
    isSale?: string;
    isFeatured?: string;
    pieces?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const {
    category,
    subcategory,
    search,
    sort,
    minPrice,
    maxPrice,
    stitched,
    isNewArrival,
    isBestSeller,
    isSale,
    isFeatured,
    pieces,
  } = searchParams;

  const whereClause: any = {
    inStock: true,
  };

  if (isNewArrival === "true") {
    whereClause.isNewArrival = true;
  }

  if (isBestSeller === "true") {
    whereClause.isBestSeller = true;
  }

  if (isSale === "true") {
    whereClause.isSale = true;
  }

  if (isFeatured === "true") {
    whereClause.isFeatured = true;
  }

  if (pieces) {
    const pc = parseInt(pieces, 10);
    if (!isNaN(pc) && pc > 0) {
      whereClause.pieceCount = pc;
    }
  }

  if (stitched) {
    const isStitched = stitched.toLowerCase().includes("stitch") && !stitched.toLowerCase().includes("un");
    whereClause.variants = {
      some: {
        stitchedType: isStitched
          ? { in: ["Stitched", "Standard Edition", "Custom Made"] }
          : { in: ["Unstitched"] },
      },
    };
  }

  if (category) {
    if (category === "pret-ready-to-wear" || category === "ready-to-wear") {
      whereClause.variants = {
        some: {
          stitchedType: { in: ["Stitched", "Standard Edition", "Custom Made"] },
        },
      };
    } else if (category === "unstitched") {
      whereClause.variants = {
        some: {
          stitchedType: "Unstitched",
        },
      };
    } else if (category === "wedding-luxury-pret") {
      whereClause.category = {
        slug: { in: ["net-formals", "organza-formals", "bridal-maxies", "chiffon-formal"] },
      };
    } else {
      whereClause.category = { slug: category };
    }
  }

  if (subcategory) {
    whereClause.subcategory = {
      OR: [
        { slug: subcategory },
        { id: subcategory },
      ],
    };
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { fabric: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
    ];
  }

  if (minPrice || maxPrice) {
    whereClause.basePrice = {};
    if (minPrice) whereClause.basePrice.gte = parseFloat(minPrice);
    if (maxPrice) whereClause.basePrice.lte = parseFloat(maxPrice);
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "price-low") orderBy = { basePrice: "asc" };
  if (sort === "price-high") orderBy = { basePrice: "desc" };
  if (sort === "bestseller") orderBy = { isBestSeller: "desc" };

  let products: any[] = [];
  let categories: any[] = [];
  let dbConnected = false;

  try {
    const [dbProducts, dbCategories] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          images: { orderBy: { displayOrder: "asc" } },
          variants: true,
          category: true,
          subcategory: true,
        },
        orderBy,
      }),
      prisma.category.findMany({
        orderBy: { displayOrder: "asc" },
        include: {
          subcategories: {
            orderBy: { displayOrder: "asc" },
          },
        },
      }),
    ]);
    products = dbProducts;
    categories = dbCategories;
    dbConnected = true;
  } catch (err) {
    console.warn("Shop page database query fallback:", err);
  }

  // Strictly preserve empty state when database succeeds with 0 matching products
  if (!dbConnected) {
    let filtered = [...FALLBACK_PRODUCTS];
    if (isNewArrival === "true") {
      filtered = filtered.filter((p) => p.isNewArrival);
    }
    if (isBestSeller === "true") {
      filtered = filtered.filter((p) => p.isBestSeller);
    }
    if (isSale === "true") {
      filtered = filtered.filter((p) => p.isSale);
    }
    if (category) {
      if (category === "pret-ready-to-wear" || category === "ready-to-wear") {
        filtered = filtered.filter((p) => p.variants?.some((v: any) => v.stitchedType === "Stitched"));
      } else if (category === "unstitched") {
        filtered = filtered.filter((p) => p.variants?.some((v: any) => v.stitchedType === "Unstitched") || p.fabric?.toLowerCase().includes("unstitched"));
      } else {
        filtered = filtered.filter((p) => p.category?.slug === category || (category === "sale" && p.isSale));
      }
    }
    if (subcategory) {
      filtered = filtered.filter((p) => p.subcategoryId === subcategory || p.subcategory?.slug === subcategory);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter((p) => p.title.toLowerCase().includes(s) || p.fabric.toLowerCase().includes(s));
    }
    products = filtered;
  }

  if (!categories || categories.length === 0) {
    categories = FALLBACK_CATEGORIES;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <ShopClientView 
        initialProducts={products}
        categories={categories}
        currentCategory={category}
        currentSubcategory={subcategory}
        currentSearch={search}
        currentSort={sort}
      />
    </div>
  );
}
