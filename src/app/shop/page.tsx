import React from "react";
import { prisma } from "@/lib/prisma";
import ShopClientView from "@/components/shop/ShopClientView";

import { FALLBACK_PRODUCTS, FALLBACK_CATEGORIES } from "@/lib/fallbackProducts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ShopPageProps {
  searchParams: {
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    stitched?: string;
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category, search, sort, minPrice, maxPrice, stitched } = searchParams;

  const whereClause: any = {
    inStock: true,
  };

  if (category) {
    whereClause.category = { slug: category };
  }

  if (search) {
    whereClause.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { fabric: { contains: search } },
      { sku: { contains: search } },
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

  try {
    const [dbProducts, dbCategories] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          images: { orderBy: { displayOrder: "asc" } },
          variants: true,
          category: true,
        },
        orderBy,
      }),
      prisma.category.findMany({
        orderBy: { displayOrder: "asc" },
      }),
    ]);
    products = dbProducts;
    categories = dbCategories;
  } catch (err) {
    console.warn("Shop page database query fallback:", err);
  }

  if (!products || products.length === 0) {
    let filtered = [...FALLBACK_PRODUCTS];
    if (category) {
      filtered = filtered.filter(p => p.category?.slug === category || (category === "sale" && p.isSale));
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.fabric.toLowerCase().includes(s));
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
        currentSearch={search}
        currentSort={sort}
      />
    </div>
  );
}
