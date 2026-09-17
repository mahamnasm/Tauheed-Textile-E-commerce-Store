import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "@/components/shop/ProductDetailClient";

import { FALLBACK_PRODUCTS } from "@/lib/fallbackProducts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = params;
  let product: any = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug },
      include: { images: true, category: true },
    });
  } catch {
    product = FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
  if (!product) {
    product = FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
  }
  if (!product) {
    return { title: "Ensemble | Tauheed Textile" };
  }

  const title = `${product.title} | Tauheed Textile`;
  const description = product.description
    ? product.description.slice(0, 160)
    : `Shop ${product.title}. Premium Pakistani luxury fabric with nationwide Cash on Delivery.`;
  const imageUrl = product.images?.[0]?.url || "/logo-calligraphy.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imageUrl, alt: product.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = params;

  let product: any = null;
  let relatedProducts: any[] = [];

  try {
    product = await prisma.product.findUnique({
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

    if (product) {
      relatedProducts = await prisma.product.findMany({
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
    }
  } catch (err) {
    console.warn("Product page database query fallback:", err);
  }

  // Graceful fallback if database is offline or not yet seeded on host
  if (!product) {
    product = FALLBACK_PRODUCTS.find((p) => p.slug === slug) || null;
    if (product) {
      relatedProducts = FALLBACK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);
    }
  }

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <ProductDetailClient 
        product={product} 
        relatedProducts={relatedProducts} 
      />
    </div>
  );
}
