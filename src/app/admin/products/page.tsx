import React from "react";
import { prisma } from "@/lib/prisma";
import AdminProductsClientView from "@/components/admin/AdminProductsClientView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminProductsPage() {
  let products: any[] = [];
  let categories: any[] = [];
  let collections: any[] = [];

  try {
    const [fetchedProds, fetchedCats, fetchedCols] = await Promise.all([
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

    if (fetchedProds) products = fetchedProds;
    if (fetchedCats) categories = fetchedCats;
    if (fetchedCols) collections = fetchedCols;
  } catch (err: any) {
    console.warn("Admin Products: DB cold start or offline:", err?.message || err);
  }

  return (
    <AdminProductsClientView
      products={products}
      categories={categories}
      collections={collections}
    />
  );
}
