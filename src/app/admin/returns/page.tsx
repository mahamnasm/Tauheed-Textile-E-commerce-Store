import React from "react";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;

export default async function AdminReturnsPage() {
  const returns = await prisma.returnRequest.findMany({
    include: { order: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-sand-300 pb-6">
        <span className="text-xs font-bold tracking-widest uppercase text-gold-700">Client Care</span>
        <h1 className="font-serif text-3xl font-bold text-brand-950 mt-1">Returns & Exchanges</h1>
        <p className="text-xs text-brand-600 mt-1">Manage 7-day return claims, fabric exchanges, and reverse pickups</p>
      </div>

      <div className="bg-white rounded-2xl border border-sand-200 shadow-sm p-6 space-y-4">
        <h3 className="font-serif font-bold text-base text-brand-950">Return Requests Queue</h3>
        {returns.length === 0 ? (
          <div className="p-8 text-center text-xs text-brand-500">
            No active returns currently requested.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-sand-50 text-brand-800 uppercase">
                <tr>
                  <th className="p-3">Order #</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Reason</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-100">
                {returns.map((r) => (
                  <tr key={r.id} className="hover:bg-sand-50/60">
                    <td className="p-3 font-bold text-brand-950">{r.orderNumber}</td>
                    <td className="p-3">
                      <p className="font-bold text-brand-900">{r.customerName}</p>
                      <p className="text-[11px] text-brand-500">{r.customerPhone}</p>
                    </td>
                    <td className="p-3 text-brand-700">{r.reason}</td>
                    <td className="p-3 font-medium">{r.returnType}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-800">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-3 text-brand-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
