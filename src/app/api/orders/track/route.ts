import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber");
  const phone = searchParams.get("phone");

  if (!orderNumber || !phone) {
    return NextResponse.json(
      { error: "Please provide both Order Number and registered mobile number." },
      { status: 400 }
    );
  }

  const cleanPhone = phone.replace(/\D/g, "");

  const order = await prisma.order.findFirst({
    where: {
      orderNumber: { equals: orderNumber.trim() },
      guestPhone: { contains: cleanPhone.slice(-7) }, // match last 7 digits for tolerance
    },
    include: {
      items: {
        include: { product: true },
      },
      bankTransferProof: true,
    },
  });

  if (!order) {
    return NextResponse.json(
      { error: "No matching order found for this order number and mobile phone." },
      { status: 404 }
    );
  }

  return NextResponse.json({ order });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderNumber = body.orderNumber;
    const phone = body.phone;

    if (!orderNumber || !phone) {
      return NextResponse.json(
        { error: "Please provide both Order Number and registered mobile number." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "");

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: { equals: orderNumber.trim() },
        guestPhone: { contains: cleanPhone.slice(-7) },
      },
      include: {
        items: {
          include: { product: true },
        },
        bankTransferProof: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "No matching order found for this order number and mobile phone." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to track order" }, { status: 500 });
  }
}
