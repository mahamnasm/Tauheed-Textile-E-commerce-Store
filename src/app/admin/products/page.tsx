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
          subcategory: true,
          collection: true,
          variants: true,
          images: { orderBy: { displayOrder: "asc" } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.category.findMany({
        include: {
          subcategories: { orderBy: { name: "asc" } },
        },
        orderBy: { displayOrder: "asc" },
      }),
      prisma.collection.findMany({
        include: {
          _count: { select: { products: true } },
          products: { select: { id: true, title: true, sku: true } },
        },
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
