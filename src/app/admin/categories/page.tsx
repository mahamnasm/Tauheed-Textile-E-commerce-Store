import React from "react";
import { prisma } from "@/lib/prisma";
import CategoriesClientView from "@/components/admin/CategoriesClientView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Categories & Subcategories | Tauheed Textile Operations",
  description: "Manage product collections, categories, and subcategories dynamically",
};

export default async function AdminCategoriesPage() {
  let categories: any[] = [];
  try {
    categories = await prisma.category.findMany({
      include: {
        subcategories: {
          orderBy: { name: "asc" },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });
  } catch (err) {
    console.error("Failed to load categories from DB:", err);
  }

  return <CategoriesClientView initialCategories={categories} />;
}
