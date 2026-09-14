import React from "react";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, XCircle, DollarSign } from "lucide-react";

export const revalidate = 0;

export default async function AdminPaymentsPage() {
  const [proofs, orders] = await Promise.all([
    prisma.bankTransferProof.findMany({
      include: { order: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany({
      include: { items: true },
    }),
  ]);

  const grossSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalCostOfGoods = orders.reduce(
    (sum, o) => sum + o.items.reduce((itemSum, item) => itemSum + item.costPrice * item.quantity, 0),
    0
  );
  const netEstimatedProfit = grossSales - totalCostOfGoods;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="border-b border-sand-300 pb-5 sm:pb-6">
        <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-gold-700">Financial Ledger</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-950 mt-1">Payments & Profit Analytics</h1>
        <p className="text-xs text-brand-600 mt-1">Bank transfer slip verification queue and gross profit margins</p>
      </div>

      {/* Financial P&L Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-sand-200 shadow-sm space-y-1">
          <span className="text-xs text-brand-600">Total Billed Gross Revenue</span>
          <p className="font-serif font-bold text-xl sm:text-2xl text-brand-950">
            Rs. {grossSales.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold">COD & Bank Receipts</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-sand-200 shadow-sm space-y-1">
          <span className="text-xs text-brand-600">Cost of Goods Sold (COGS)</span>
          <p className="font-serif font-bold text-xl sm:text-2xl text-maroon-700">
            Rs. {totalCostOfGoods.toLocaleString()}
          </p>
          <span className="text-[10px] text-brand-500">Fabric intake & production base cost</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-sand-200 shadow-sm space-y-1">
          <span className="text-xs text-brand-600">Net Estimated Product Margin</span>
          <p className="font-serif font-bold text-xl sm:text-2xl text-emerald-700">
            Rs. {netEstimatedProfit.toLocaleString()}
          </p>
          <span className="text-[10px] text-emerald-700 font-semibold">
            {grossSales > 0 ? Math.round((netEstimatedProfit / grossSales) * 100) : 0}% Gross Margin
          </span>
        </div>
      </div>

      {/* Bank Proofs Verification Queue */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden space-y-4 p-4 sm:p-6">
        <h3 className="font-serif font-bold text-base text-brand-950">
          Bank Transfer Verification Queue ({proofs.length})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-sand-50 text-brand-800 uppercase">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Reference / Bank</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Proof Image</th>
                <th className="p-3">Status</th>
                <th className="p-3">Reviewed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {proofs.map((p) => (
                <tr key={p.id} className="hover:bg-sand-50/60">
                  <td className="p-3 font-bold text-brand-950">{p.order.orderNumber}</td>
                  <td className="p-3">
                    <p className="font-bold text-brand-900">{p.order.customerName}</p>
                    <p className="text-[11px] text-brand-500">{p.order.guestPhone}</p>
                  </td>
                  <td className="p-3 text-brand-700 font-mono">
                    {p.transactionRef || "N/A"}
                  </td>
                  <td className="p-3 font-serif font-bold text-brand-950">
                    Rs. {p.order.total.toLocaleString()}
                  </td>
                  <td className="p-3">
                    <a
                      href={p.proofImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-700 underline font-bold"
                    >
                      View Receipt &rarr;
                    </a>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      p.status === "VERIFIED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3 text-brand-600">{p.reviewedBy || "Pending Review"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
