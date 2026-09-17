import React from "react";
import { prisma } from "@/lib/prisma";
import { Megaphone, Tag, ShoppingBag } from "lucide-react";
import AdminAbandonedCartManager from "@/components/admin/AdminAbandonedCartManager";
import AdminCouponManager from "@/components/admin/AdminCouponManager";

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

      {/* Interactive Editable Coupons Manager with User Limits */}
      <AdminCouponManager initialCoupons={coupons as any} />
    </div>
  );
}
