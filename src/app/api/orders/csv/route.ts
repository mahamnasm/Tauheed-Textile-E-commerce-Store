import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCsv } from "@/lib/csv";

export async function GET(req: NextRequest) {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        bankTransferProof: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const rows = orders.map((o) => ({
      OrderNumber: o.orderNumber,
      CustomerName: o.customerName,
      Phone: o.guestPhone,
      Email: o.guestEmail || "",
      City: o.city,
      Province: o.province,
      Address: o.address,
      PaymentMethod: o.paymentMethod,
      PaymentStatus: o.paymentStatus,
      OrderStatus: o.orderStatus,
      Courier: o.courierName || "",
      TrackingNumber: o.trackingNumber || "",
      SubtotalPKR: o.subtotal,
      ShippingFeePKR: o.shippingFee,
      DiscountPKR: o.discount,
      TotalPKR: o.total,
      ItemCount: o.items.length,
      CreatedAt: o.createdAt.toISOString(),
    }));

    const csvContent = generateCsv(rows);

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="tauheed_orders_export_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
