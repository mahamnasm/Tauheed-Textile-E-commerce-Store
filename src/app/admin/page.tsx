import React from "react";
import { prisma } from "@/lib/prisma";
import AdminDashboardClientView from "@/components/admin/AdminDashboardClientView";
import { getLatestIntrusionAlert } from "@/lib/adminSecurityStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  let orders: any[] = [];
  let variants: any[] = [];
  let bankProofs: any[] = [];
  let latestSecurityAlert: any = null;
  let dbOffline = false;

  try {
    const [fetchedOrders, fetchedVariants, fetchedProofs, fetchedAlert] = await Promise.all([
      prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 50,
      }),
      prisma.productVariant.findMany({
        select: { stockQuantity: true },
        take: 1000,
      }),
      prisma.bankTransferProof.findMany({
        where: { status: "PENDING" },
        select: { id: true },
        take: 50,
      }),
      getLatestIntrusionAlert().catch(() => null),
    ]);

    if (fetchedOrders) orders = fetchedOrders;
    if (fetchedVariants) variants = fetchedVariants;
    if (fetchedProofs) bankProofs = fetchedProofs;
    if (fetchedAlert) latestSecurityAlert = fetchedAlert;
  } catch (err: any) {
    console.warn("Admin Dashboard: Database connection cold-start or offline:", err?.message || err);
    dbOffline = true;
  }

  const totalRevenue = (orders || []).reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = (orders || []).length;
  const codOrdersCount = (orders || []).filter((o) => o.paymentMethod === "COD").length;
  const prepaidOrdersCount = (orders || []).filter((o) => o.paymentMethod !== "COD").length;
  const lowStockCount = (variants || []).filter((v) => (v.stockQuantity ?? 0) <= 5).length;
  const pendingBankProofsCount = (bankProofs || []).length;
  const recentOrders = (orders || []).slice(0, 6);

  return (
    <AdminDashboardClientView
      totalRevenue={totalRevenue}
      totalOrders={totalOrders}
      codOrdersCount={codOrdersCount}
      prepaidOrdersCount={prepaidOrdersCount}
      lowStockCount={lowStockCount}
      pendingBankProofsCount={pendingBankProofsCount}
      recentOrders={recentOrders}
      latestSecurityAlert={latestSecurityAlert}
      dbOffline={dbOffline}
    />
  );
}
