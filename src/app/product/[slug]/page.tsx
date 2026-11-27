import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "@/components/shop/ProductDetailClient";

import { FALLBACK_PRODUCTS } from "@/lib/fallbackProducts";
import { generateProductSeoAeo } from "@/lib/seoAeo";

export const revalidate = 120;

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

  const autoSeo = generateProductSeoAeo({
    title: product.title,
    fabric: product.fabric,
    categoryName: product.category?.name,
    pieceCount: product.pieceCount,
    basePrice: product.salePrice || product.basePrice,
  });

  const title = product.metaTitle || autoSeo.metaTitle || `${product.title} | Tauheed Textile`;
  const description = product.metaDesc || autoSeo.metaDesc;
  const imageUrl = product.images?.[0]?.url || "/logo-calligraphy.png";

  return {
    title,
    description,
    keywords: product.searchTags || autoSeo.searchTags,
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tauheedtextile.pk";
  const effectivePrice = product.salePrice || product.basePrice || 0;
  const productUrl = `${siteUrl}/product/${product.slug}`;
  const productImages = (product.images || []).map((img: any) =>
    img.url?.startsWith("http") ? img.url : `${siteUrl}${img.url}`
  );

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.metaDesc || product.description,
    sku: product.sku,
    image: productImages.length > 0 ? productImages : [`${siteUrl}/logo-calligraphy.png`],
    brand: {
      "@type": "Brand",
      name: "Tauheed Textile",
    },
    material: product.fabric,
    ...(effectivePrice > 0
      ? {
          offers: {
            "@type": "Offer",
            url: productUrl,
            priceCurrency: "PKR",
            price: effectivePrice,
            availability:
              product.inStock !== false
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
          },
        }
      : {}),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What fabric and piece count is ${product.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${product.title} by Tauheed Textile is crafted in ${product.fabric || "luxury Pakistani fabric"} as a ${product.pieceCount || 3}-Piece ensemble.`,
        },
      },
      {
        "@type": "Question",
        name: `Is Cash on Delivery available in Pakistan for ${product.title}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Yes, Tauheed Textile delivers nationwide across Pakistan (Karachi, Lahore, Islamabad, and all cities) with Cash on Delivery, Bank Transfer, and EasyPaisa/JazzCash.`,
        },
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ProductDetailClient 
        product={product} 
        relatedProducts={relatedProducts} 
      />
    </div>
  );
}
