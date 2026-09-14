import React from "react";
import { prisma } from "@/lib/prisma";
import { getSeoSettings, runSeoAudit } from "@/lib/aiSeo";
import AdminSeoClientView from "@/components/admin/AdminSeoClientView";

export const revalidate = 0;

export default async function AdminSeoPage() {
  const [products, settings, audit] = await Promise.all([
    prisma.product.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        sku: true,
        fabric: true,
        basePrice: true,
        metaTitle: true,
        metaDesc: true,
        images: { take: 1, select: { url: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    getSeoSettings(),
    runSeoAudit(),
  ]);

  return (
    <AdminSeoClientView
      initialProducts={products}
      initialSettings={settings}
      initialAudit={audit}
    />
  );
}
