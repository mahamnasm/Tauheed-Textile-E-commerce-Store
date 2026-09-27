import React from "react";
import { prisma } from "@/lib/prisma";
import AdminShippingClientView from "@/components/admin/AdminShippingClientView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminShippingPage() {
  let zones: any[] = [];
  let recentOrders: any[] = [];

  try {
    const [fetchedZones, fetchedOrders] = await Promise.all([
      prisma.shippingZone.findMany({ orderBy: { standardRate: "asc" } }),
      prisma.order.findMany({
        take: 12,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderNumber: true,
          customerName: true,
          city: true,
          orderStatus: true,
          total: true,
          trackingNumber: true,
          courierName: true,
          staffNotes: true,
          createdAt: true,
        },
      }),
    ]);
    if (fetchedZones) zones = fetchedZones;
    if (fetchedOrders) recentOrders = fetchedOrders;
  } catch (err: any) {
    console.warn("Admin Shipping: DB cold start or offline:", err?.message || err);
  }

  const formattedOrders = recentOrders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    city: order.city,
    status: order.orderStatus,
    total: order.total,
    trackingNumber: order.trackingNumber,
    courier: order.courierName,
    notes: order.staffNotes,
    createdAt: order.createdAt,
  }));

  return (
    <AdminShippingClientView
      initialZones={zones as any}
      recentOrders={formattedOrders as any}
    />
  );
}
