import React from "react";
import { prisma } from "@/lib/prisma";
import AdminInventoryClientView from "@/components/admin/AdminInventoryClientView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminInventoryPage() {
  let variants: any[] = [];
  let movements: any[] = [];

  try {
    const [fetchedVariants, fetchedMovements] = await Promise.all([
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

    if (fetchedVariants) variants = fetchedVariants;
    if (fetchedMovements) movements = fetchedMovements;
  } catch (err: any) {
    console.warn("Admin Inventory: DB cold start or offline:", err?.message || err);
  }

  return (
    <AdminInventoryClientView
      initialVariants={variants as any}
      initialMovements={movements as any}
    />
  );
}
