import React from "react";
import { prisma } from "@/lib/prisma";
import AdminNanoBananaClientView from "@/components/admin/AdminNanoBananaClientView";

export const revalidate = 0;

export default async function AdminNanoBananaPage() {
  const products = await prisma.product.findMany({
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

  return <AdminNanoBananaClientView products={products} />;
}
