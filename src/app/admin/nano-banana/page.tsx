import React from "react";
import { prisma } from "@/lib/prisma";
import AdminNanoBananaClientView from "@/components/admin/AdminNanoBananaClientView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminNanoBananaPage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        fabric: true,
        workType: true,
        basePrice: true,
        images: {
          orderBy: { displayOrder: "asc" },
          select: { url: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err: any) {
    console.warn("Admin Nano-Banana: DB cold start or offline:", err?.message || err);
  }

  return <AdminNanoBananaClientView products={products} />;
}
