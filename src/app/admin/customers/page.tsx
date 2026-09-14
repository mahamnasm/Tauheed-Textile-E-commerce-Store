import React from "react";
import { prisma } from "@/lib/prisma";
import { Users, AlertOctagon, Star } from "lucide-react";

export const revalidate = 0;

export default async function AdminCustomersPage() {
  const [users, orders] = await Promise.all([
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: { orders: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.findMany(),
  ]);

  return (
    <div className="space-y-6">
      <div className="border-b border-sand-300 pb-6">
        <span className="text-xs font-bold tracking-widest uppercase text-gold-700">Audience & Trust</span>
        <h1 className="font-serif text-3xl font-bold text-brand-950 mt-1">Customer Profiles & COD Fraud Protection</h1>
        <p className="text-xs text-brand-600 mt-1">Manage customer lifetime value (LTV), repeat buyers, and blacklisted COD profiles</p>
      </div>

      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="font-serif font-bold text-base text-brand-950">Customer Directory</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-sand-50 text-brand-800 uppercase">
              <tr>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Mobile Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3">Tags & Profile</th>
                <th className="p-3">Orders Count</th>
                <th className="p-3">COD Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-100">
              {users.map((u) => {
                const isBlacklisted = u.tags?.includes("COD_BLACKLIST");
                return (
                  <tr key={u.id} className="hover:bg-sand-50/60">
                    <td className="p-3 font-bold text-brand-950">{u.name}</td>
                    <td className="p-3 font-mono text-brand-800">{u.phone || "?"}</td>
                    <td className="p-3 text-brand-600">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        isBlacklisted ? "bg-maroon-100 text-maroon-800" : "bg-gold-100 text-gold-900"
                      }`}>
                        {u.tags || "STANDARD"}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-brand-900">{u.orders.length} orders</td>
                    <td className="p-3">
                      {isBlacklisted ? (
                        <span className="text-maroon-700 font-bold flex items-center gap-1">
                          <AlertOctagon className="w-3.5 h-3.5" /> COD Blocked (Fraud Risk)
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">Allowed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
