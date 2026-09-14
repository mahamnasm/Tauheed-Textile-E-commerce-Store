import React from "react";
import { prisma } from "@/lib/prisma";
import AdminProductsClientView from "@/components/admin/AdminProductsClientView";

export const revalidate = 0;

export default async function AdminProductsPage() {
  const [products, categories, collections] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: true,
        collection: true,
        variants: true,
        images: { orderBy: { displayOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
    }),
    prisma.collection.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <AdminProductsClientView
      products={products}
      categories={categories}
      collections={collections}
    />
  );
}
