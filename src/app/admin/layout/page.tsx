import React from "react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import AdminLayoutCustomizer from "@/components/admin/AdminLayoutCustomizer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayoutPage() {
  const [settings, videos, products, categories] = await Promise.all([
    getSiteSettings(),
    prisma.watchBuyVideo.findMany({
      include: { product: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.product.findMany({
      select: { id: true, title: true, slug: true, sku: true, basePrice: true, videoUrl: true },
      orderBy: { title: "asc" },
    }),
    prisma.category.findMany({
      include: {
        subcategories: {
          orderBy: { displayOrder: "asc" },
        },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <AdminLayoutCustomizer
      initialSettings={settings}
      initialVideos={videos}
      products={products}
      categories={categories}
    />
  );
}
