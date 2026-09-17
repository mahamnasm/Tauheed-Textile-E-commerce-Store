import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp, checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { trackOrderSchema } from "@/lib/validation";

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);

  // Rate Limiting: Max 20 lookups per 15 minutes to prevent consignment brute-forcing
  const rate = checkRateLimit(`track_order_${ip}`, 20, 15 * 60 * 1000);
  if (!rate.success) {
    return rateLimitResponse(rate.resetTime, "Too many tracking lookups from your network. Please wait a few minutes.");
  }

  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get("orderNumber");
  const phone = searchParams.get("phone");

  const validation = trackOrderSchema.safeParse({ orderNumber, phone });
  if (!validation.success) {
    return NextResponse.json(
      { error: "Please provide both Order Number (e.g. TT-2026-1001) and registered mobile number." },
      { status: 400 }
    );
  }

  const cleanPhone = validation.data.phone.replace(/\D/g, "");

  try {
    const order = await prisma.order.findFirst({
      where: {
        orderNumber: { equals: validation.data.orderNumber },
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
        { error: "No matching order found. Please verify your order number and mobile number." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error("Order tracking error:", err);
    return NextResponse.json(
      { error: "Unable to retrieve order details. Please try again later." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const rate = checkRateLimit(`track_order_post_${ip}`, 20, 15 * 60 * 1000);
  if (!rate.success) {
    return rateLimitResponse(rate.resetTime, "Too many tracking lookups. Please wait a few minutes.");
  }

  try {
    const body = await req.json();
    const validation = trackOrderSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Please provide both Order Number and registered mobile number." },
        { status: 400 }
      );
    }

    const cleanPhone = validation.data.phone.replace(/\D/g, "");

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: { equals: validation.data.orderNumber },
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
        { error: "No matching order found. Please verify your order number and mobile number." },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (err) {
    console.error("Order tracking POST error:", err);
    return NextResponse.json(
      { error: "Unable to retrieve order details. Please try again later." },
      { status: 500 }
    );
  }
}
