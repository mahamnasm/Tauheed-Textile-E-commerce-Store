import React from "react";
import { prisma } from "@/lib/prisma";
import { getSeoSettings, runSeoAudit } from "@/lib/aiSeo";
import AdminSeoClientView from "@/components/admin/AdminSeoClientView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSeoPage() {
  let products: any[] = [];
  let settings: any = {};
  let audit: any = {};

  try {
    const [fetchedProds, fetchedSettings, fetchedAudit] = await Promise.all([
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
      getSeoSettings().catch(() => ({})),
      runSeoAudit().catch(() => ({})),
    ]);
    if (fetchedProds) products = fetchedProds;
    if (fetchedSettings) settings = fetchedSettings;
    if (fetchedAudit) audit = fetchedAudit;
  } catch (err: any) {
    console.warn("Admin SEO: DB cold start or offline:", err?.message || err);
  }

  return (
    <AdminSeoClientView
      initialProducts={products}
      initialSettings={settings}
      initialAudit={audit}
    />
  );
}
