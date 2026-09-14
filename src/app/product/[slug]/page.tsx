import React from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "@/components/shop/ProductDetailClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      variants: { orderBy: { priceAdjustment: "asc" } },
      category: true,
      collection: true,
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  // Related products
  const relatedProducts = await prisma.product.findMany({
    where: {
      ...(product.categoryId ? { categoryId: product.categoryId } : {}),
      id: { not: product.id },
    },
    include: {
      images: { orderBy: { displayOrder: "asc" } },
      variants: true,
    },
    take: 4,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <ProductDetailClient 
        product={product} 
        relatedProducts={relatedProducts} 
      />
    </div>
  );
}
