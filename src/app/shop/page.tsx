import React from "react";
import { prisma } from "@/lib/prisma";
import ShopClientView from "@/components/shop/ShopClientView";

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

  const [products, categories] = await Promise.all([
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
