import React from "react";
import { prisma } from "@/lib/prisma";
import { Boxes, ArrowDownRight, ArrowUpRight } from "lucide-react";

export const revalidate = 0;

export default async function AdminInventoryPage() {
  const [variants, movements] = await Promise.all([
    prisma.productVariant.findMany({
      include: { product: true },
      orderBy: { stockQuantity: "asc" },
    }),
    prisma.inventoryMovement.findMany({
      include: { variant: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="border-b border-sand-300 pb-6">
        <span className="text-xs font-bold tracking-widest uppercase text-gold-700">Stock & Audit</span>
        <h1 className="font-serif text-3xl font-bold text-brand-950 mt-1">Inventory Ledger</h1>
        <p className="text-xs text-brand-600 mt-1">Real-time stock ledger, variant balances, and adjustment audit log</p>
      </div>

      {/* Stock Balances */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden space-y-4 p-6">
        <h3 className="font-serif font-bold text-base text-brand-950">Current Stock by SKU Variant</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-sand-50 text-brand-800 uppercase">
              <tr>
                <th className="p-3">Product Title</th>
                <th className="p-3">Variant SKU</th>
                <th className="p-3">Option</th>
                <th className="p-3">Color</th>
                <th className="p-3">Available Stock</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {variants.map((v) => (
                <tr key={v.id} className="hover:bg-sand-50/60">
                  <td className="p-3 font-bold text-brand-950">{v.product.title}</td>
                  <td className="p-3 font-mono text-brand-700">{v.sku}</td>
                  <td className="p-3 text-brand-800">{v.size} ({v.stitchedType})</td>
                  <td className="p-3 text-brand-600">{v.color}</td>
                  <td className="p-3 font-serif font-bold text-sm text-brand-950">
                    {v.stockQuantity} units
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      v.stockQuantity <= 5
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {v.stockQuantity <= 5 ? "LOW STOCK ALERT" : "HEALTHY"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Movements Log */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden space-y-4 p-6">
        <h3 className="font-serif font-bold text-base text-brand-950">Recent Inventory Movements Audit Trail</h3>
        <div className="divide-y divide-sand-100 text-xs">
          {movements.map((m) => (
            <div key={m.id} className="py-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-brand-950">
                  {m.variant?.product?.title} • {m.variant?.sku}
                </p>
                <p className="text-[11px] text-brand-500">
                  Reason: {m.reason} • Staff: {m.staffName}
                </p>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-700">
                  +{m.changeQty} units
                </span>
                <p className="text-[10px] text-brand-400">
                  {new Date(m.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
