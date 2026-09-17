import React from "react";
import { prisma } from "@/lib/prisma";
import AdminDashboardClientView from "@/components/admin/AdminDashboardClientView";
import { getLatestIntrusionAlert } from "@/lib/adminSecurityStore";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [orders, variants, bankProofs, latestSecurityAlert] = await Promise.all([
    prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.productVariant.findMany({
      select: { stockQuantity: true },
    }),
    prisma.bankTransferProof.findMany({
      where: { status: "PENDING" },
      select: { id: true },
    }),
    getLatestIntrusionAlert(),
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const codOrdersCount = orders.filter((o) => o.paymentMethod === "COD").length;
  const prepaidOrdersCount = orders.filter((o) => o.paymentMethod !== "COD").length;
  const lowStockCount = variants.filter((v) => v.stockQuantity <= 5).length;
  const pendingBankProofsCount = bankProofs.length;
  const recentOrders = orders.slice(0, 6);

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
    />
  );
}
