import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, orderStatus, paymentStatus, courierName, trackingNumber } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const updateData: any = {};
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
