import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError, jsonError, firstZodMessage } from "@/lib/http";
import { z } from "zod";

const updateOrderStatusSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  orderStatus: z.enum(["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"]).optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED", "VERIFICATION_PENDING"]).optional(),
  courierName: z.string().max(100).optional(),
  trackingNumber: z.string().max(100).optional(),
});

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const validation = updateOrderStatusSchema.safeParse(body);
    if (!validation.success) {
      return jsonError(firstZodMessage(validation.error) || "Invalid status payload", 400);
    }

    const { orderId, orderStatus, paymentStatus, courierName, trackingNumber } = validation.data;

    const existing = await prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true },
    });

    if (!existing) {
      return jsonError("Order not found.", 404);
    }

    const updateData: Record<string, unknown> = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;
    if (courierName) updateData.courierName = courierName;
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
      if (courierName?.toLowerCase().includes("trax")) {
        updateData.courierUrl = `https://sonic.pk/tracking?tracking_number=${trackingNumber}`;
      } else if (courierName?.toLowerCase().includes("tcs")) {
        updateData.courierUrl = `https://www.tcsexpress.com/track/${trackingNumber}`;
      } else if (courierName?.toLowerCase().includes("leopard")) {
        updateData.courierUrl = `https://www.leopardscourier.com/leopard-tracking/?track_no=${trackingNumber}`;
      }
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err: unknown) {
    return internalError("PATCH /api/admin/orders/status error:", err);
  }
}
