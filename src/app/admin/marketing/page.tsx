import React from "react";
import { prisma } from "@/lib/prisma";
import { Megaphone, Tag, ShoppingBag } from "lucide-react";
import AdminAbandonedCartManager from "@/components/admin/AdminAbandonedCartManager";

export const revalidate = 0;

export default async function AdminMarketingPage() {
  const [coupons, abandonedCarts] = await Promise.all([
    prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.abandonedCart.findMany({ orderBy: { lastActiveAt: "desc" }, take: 50 }),
  ]);

  return (
    <div className="space-y-8">
      <div className="border-b border-sand-300 pb-6">
        <span className="text-xs font-bold tracking-widest uppercase text-gold-700">Campaigns & Retention</span>
        <h1 className="font-serif text-3xl font-bold text-brand-950 mt-1">Marketing, Retention & Coupons</h1>
        <p className="text-xs text-brand-600 mt-1">
          Recover abandoned carts via WhatsApp and manage active promotional discount coupons
        </p>
      </div>

      {/* Cart Abandonment Recovery */}
      <AdminAbandonedCartManager initialCarts={abandonedCarts} />

      {/* Coupons */}
      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-6 space-y-4">
        <h3 className="font-serif font-bold text-base text-brand-950 flex items-center gap-2">
          <Tag className="w-4 h-4 text-gold-700" />
          Active Promo Coupons
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-sand-50 text-brand-800 uppercase">
              <tr>
                <th className="p-3">Coupon Code</th>
                <th className="p-3">Discount Type</th>
                <th className="p-3">Value</th>
                <th className="p-3">Min Order</th>
                <th className="p-3">Usage Limit</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-sand-50/60">
                  <td className="p-3 font-mono font-bold text-brand-950">{c.code}</td>
                  <td className="p-3 text-brand-700">{c.discountType}</td>
                  <td className="p-3 font-bold text-emerald-700">
                    {c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : `Rs. ${c.discountValue}`}
                  </td>
                  <td className="p-3 text-brand-700">Rs. {c.minOrderValue.toLocaleString()}</td>
                  <td className="p-3 text-brand-600">{c.usedCount} / {c.usageLimit || "Unlimited"}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      ACTIVE
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
