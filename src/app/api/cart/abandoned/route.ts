import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { getClientIp, checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { internalError, jsonError } from "@/lib/http";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`abandoned_cart_${ip}`, 30, 15 * 60 * 1000);
  if (!rate.success) {
    return rateLimitResponse(rate.resetTime);
  }

  try {
    const body = await req.json();
    const { cartId, customerName, phone, email, cart, subtotal } = body;

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ success: true, message: "Cart empty, skipped" });
    }

    if (cart.length > 50) {
      return jsonError("Cart is too large", 400);
    }

    const cartData = JSON.stringify(cart);
    if (cartData.length > 50_000) {
      return jsonError("Cart payload is too large", 400);
    }

    const itemCount = cart.reduce(
      (sum: number, item: { quantity?: number }) => sum + (item.quantity || 1),
      0
    );
    const cleanSubtotal = Number(subtotal) || 0;
    const safeName = typeof customerName === "string" ? customerName.slice(0, 100) : null;
    const safePhone = typeof phone === "string" ? phone.slice(0, 20) : null;
    const safeEmail = typeof email === "string" ? email.slice(0, 120) : null;

    let savedRecord = null;
    if (typeof cartId === "string" && cartId.length <= 80) {
      try {
        savedRecord = await prisma.abandonedCart.update({
          where: { id: cartId },
          data: {
            customerName: safeName || undefined,
            phone: safePhone || undefined,
            email: safeEmail || undefined,
            cartData,
            subtotal: cleanSubtotal,
            itemCount,
            lastActiveAt: new Date(),
          },
        });
      } catch {
        savedRecord = null;
      }
    }

    if (!savedRecord) {
      savedRecord = await prisma.abandonedCart.create({
        data: {
          customerName: safeName,
          phone: safePhone,
          email: safeEmail,
          cartData,
          subtotal: cleanSubtotal,
          itemCount,
          recovered: false,
          lastActiveAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, cartId: savedRecord.id });
  } catch (error: unknown) {
    return internalError("POST /api/cart/abandoned error:", error);
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const abandonedCarts = await prisma.abandonedCart.findMany({
      where: { recovered: false },
      orderBy: { lastActiveAt: "desc" },
      take: 50,
    });

    const parsed = abandonedCarts.map((c) => {
      let items: unknown[] = [];
      try {
        items = JSON.parse(c.cartData);
      } catch {
        items = [];
      }
      return { ...c, items };
    });

    return NextResponse.json({ success: true, carts: parsed });
  } catch (error: unknown) {
    return internalError("GET /api/cart/abandoned error:", error);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { cartId, recovered } = body;

    if (!cartId || typeof cartId !== "string") {
      return jsonError("Cart ID required", 400);
    }

    const updated = await prisma.abandonedCart.update({
      where: { id: cartId },
      data: { recovered: recovered ?? true },
    });

    return NextResponse.json({ success: true, cart: updated });
  } catch (error: unknown) {
    return internalError("PATCH /api/cart/abandoned error:", error);
  }
}
