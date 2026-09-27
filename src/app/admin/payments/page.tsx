import React from "react";
import { prisma } from "@/lib/prisma";
import { getManualLedgerEntries } from "@/lib/ledgerStore";
import AdminPaymentsLedgerView from "@/components/admin/AdminPaymentsLedgerView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPaymentsPage() {
  let proofs: any[] = [];
  let orders: any[] = [];
  let manualEntries: any[] = [];

  try {
    const [fetchedProofs, fetchedOrders, fetchedEntries] = await Promise.all([
      prisma.bankTransferProof.findMany({
        include: { order: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.findMany({
        include: { items: true },
      }),
      getManualLedgerEntries().catch(() => []),
    ]);

    if (fetchedProofs) proofs = fetchedProofs;
    if (fetchedOrders) orders = fetchedOrders;
    if (fetchedEntries) manualEntries = fetchedEntries;
  } catch (err: any) {
    console.warn("Admin Payments: DB cold start or offline:", err?.message || err);
  }

  const grossSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalCostOfGoods = orders.reduce(
    (sum, o) => sum + (o.items || []).reduce((itemSum: number, item: any) => itemSum + (item.costPrice || 0) * (item.quantity || 1), 0),
    0
  );

  return (
    <AdminPaymentsLedgerView
      initialProofs={proofs as any}
      initialLedgerEntries={manualEntries}
      websiteSales={grossSales}
      websiteCogs={totalCostOfGoods}
    />
  );
}
