import React from "react";
import { prisma } from "@/lib/prisma";
import AdminReelsClientView from "@/components/admin/AdminReelsClientView";

export const metadata = {
  title: "Runway Reels & Videos | Tauheed Textile Admin",
};

export const revalidate = 0;

export default async function AdminReelsPage() {
  const [reels, products] = await Promise.all([
    prisma.watchBuyVideo.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            fabric: true,
            basePrice: true,
            images: { take: 1, select: { url: true } },
          },
        },
      },
    }),
    prisma.product.findMany({
      orderBy: { title: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        fabric: true,
        basePrice: true,
        videoUrl: true,
        images: { take: 1, select: { url: true } },
      },
    }),
  ]);

  return <AdminReelsClientView initialReels={reels as any} products={products as any} />;
}
