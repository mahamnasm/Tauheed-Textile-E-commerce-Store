import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp, checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { trackOrderSchema } from "@/lib/validation";
import { internalError } from "@/lib/http";
import { normalizePkPhone, toPublicOrder } from "@/lib/publicOrder";

async function lookupOrder(orderNumber: string, phone: string) {
  const last10 = normalizePkPhone(phone);
  if (last10.length < 10) {
    return null;
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber: { equals: orderNumber.trim() },
      guestPhone: { contains: last10 },
    },
    include: {
      items: {
        include: {
          product: {
            select: { title: true, slug: true },
          },
        },
      },
    },
  });

  return order;
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`track_order_${ip}`, 10, 15 * 60 * 1000);
  if (!rate.success) {
    return rateLimitResponse(
      rate.resetTime,
      "Too many tracking lookups from your network. Please wait a few minutes."
    );
  }

  const { searchParams } = new URL(req.url);
  const validation = trackOrderSchema.safeParse({
    orderNumber: searchParams.get("orderNumber"),
    phone: searchParams.get("phone"),
  });
  if (!validation.success) {
    return NextResponse.json(
      { error: "Please provide both order number and registered mobile number." },
      { status: 400 }
    );
  }

  try {
    const order = await lookupOrder(validation.data.orderNumber, validation.data.phone);
    if (!order) {
      return NextResponse.json(
        { error: "No matching order found. Please verify your order number and mobile number." },
        { status: 404 }
      );
    }
    return NextResponse.json({ order: toPublicOrder(order) });
  } catch (err) {
    return internalError("Order tracking error:", err);
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`track_order_post_${ip}`, 10, 15 * 60 * 1000);
  if (!rate.success) {
    return rateLimitResponse(rate.resetTime, "Too many tracking lookups. Please wait a few minutes.");
  }

  try {
    const body = await req.json();
    const validation = trackOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Please provide both order number and registered mobile number." },
        { status: 400 }
      );
    }

    const order = await lookupOrder(validation.data.orderNumber, validation.data.phone);
    if (!order) {
      return NextResponse.json(
        { error: "No matching order found. Please verify your order number and mobile number." },
        { status: 404 }
      );
    }
    return NextResponse.json({ order: toPublicOrder(order) });
  } catch (err) {
    return internalError("Order tracking POST error:", err);
  }
}
