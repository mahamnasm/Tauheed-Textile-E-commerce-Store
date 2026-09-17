import React from "react";
import { prisma } from "@/lib/prisma";
import { getManualLedgerEntries } from "@/lib/ledgerStore";
import AdminPaymentsLedgerView from "@/components/admin/AdminPaymentsLedgerView";

export const revalidate = 0;

export default async function AdminPaymentsPage() {
  const [proofs, orders, manualEntries] = await Promise.all([
    prisma.bankTransferProof.findMany({
      include: { order: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      include: { items: true },
    }),
    getManualLedgerEntries(),
  ]);

  const grossSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalCostOfGoods = orders.reduce(
    (sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + item.costPrice * item.quantity, 0),
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
