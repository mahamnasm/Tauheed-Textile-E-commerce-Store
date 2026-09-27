import React from "react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import AdminLayoutCustomizer from "@/components/admin/AdminLayoutCustomizer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayoutPage() {
  let settings: any = {};
  let videos: any[] = [];
  let products: any[] = [];
  let categories: any[] = [];

  try {
    const [fetchedSettings, fetchedVideos, fetchedProds, fetchedCats] = await Promise.all([
      getSiteSettings().catch(() => ({})),
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
    if (fetchedSettings) settings = fetchedSettings;
    if (fetchedVideos) videos = fetchedVideos;
    if (fetchedProds) products = fetchedProds;
    if (fetchedCats) categories = fetchedCats;
  } catch (err: any) {
    console.warn("Admin Layout: DB cold start or offline:", err?.message || err);
  }

  return (
    <AdminLayoutCustomizer
      initialSettings={settings}
      initialVideos={videos}
      products={products}
      categories={categories}
    />
  );
}
