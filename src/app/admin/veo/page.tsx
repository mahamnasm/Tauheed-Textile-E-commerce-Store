import React from "react";
import { prisma } from "@/lib/prisma";
import AdminVeoClientView from "@/components/admin/AdminVeoClientView";

export const revalidate = 0;

export default async function AdminVeoPage() {
  const [products, existingReels] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        fabric: true,
        workType: true,
        basePrice: true,
        videoUrl: true,
        images: { take: 1, select: { url: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.watchBuyVideo.findMany({
      include: {
        product: {
          select: {
            title: true,
            slug: true,
            basePrice: true,
            images: { take: 1, select: { url: true } },
          },
        },
      },
      orderBy: { displayOrder: "asc" },
    }),
  ]);

  return (
    <AdminVeoClientView
      products={products}
      existingReels={existingReels}
    />
  );
}
