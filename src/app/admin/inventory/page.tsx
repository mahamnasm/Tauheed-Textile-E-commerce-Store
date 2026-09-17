import React from "react";
import { prisma } from "@/lib/prisma";
import AdminInventoryClientView from "@/components/admin/AdminInventoryClientView";

export const revalidate = 0;

export default async function AdminInventoryPage() {
  const [variants, movements] = await Promise.all([
    prisma.productVariant.findMany({
      include: {
        product: {
          select: {
            id: true,
            title: true,
            slug: true,
            sku: true,
            basePrice: true,
            salePrice: true,
          },
        },
      },
      orderBy: { stockQuantity: "asc" },
    }),
    prisma.inventoryMovement.findMany({
      include: {
        variant: {
          include: {
            product: {
              select: {
                title: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 25,
    }),
  ]);

  return (
    <AdminInventoryClientView
      initialVariants={variants as any}
      initialMovements={movements as any}
    />
  );
}
