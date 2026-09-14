import React from "react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import AdminLayoutCustomizer from "@/components/admin/AdminLayoutCustomizer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayoutPage() {
  const [settings, videos, products] = await Promise.all([
    getSiteSettings(),
    prisma.watchBuyVideo.findMany({
      include: { product: true },
      orderBy: { displayOrder: "asc" },
    }),
    prisma.product.findMany({
      select: { id: true, title: true, sku: true, basePrice: true, videoUrl: true },
      orderBy: { title: "asc" },
    }),
  ]);

  return (
    <AdminLayoutCustomizer
      initialSettings={settings}
      initialVideos={videos}
      products={products}
    />
  );
}
