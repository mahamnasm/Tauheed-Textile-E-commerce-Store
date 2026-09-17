import React from "react";
import { prisma } from "@/lib/prisma";
import AdminShippingClientView from "@/components/admin/AdminShippingClientView";

export const revalidate = 0;

export default async function AdminShippingPage() {
  const [zones, recentOrders] = await Promise.all([
    prisma.shippingZone.findMany({ orderBy: { standardRate: "asc" } }),
    prisma.order.findMany({
      take: 12,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        customerName: true,
        city: true,
        status: true,
        total: true,
        trackingNumber: true,
        courier: true,
        notes: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <AdminShippingClientView
      initialZones={zones as any}
      recentOrders={recentOrders as any}
    />
  );
}
