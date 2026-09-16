import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: Save or update abandoned cart session
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      cartId,
      customerName,
      phone,
      email,
      cart,
      subtotal,
    } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json({ success: true, message: "Cart empty, skipped" });
    }

    const cartData = JSON.stringify(cart);
    const itemCount = cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
    const cleanSubtotal = parseFloat(subtotal) || 0;

    let savedRecord;
    if (cartId) {
      // Update existing session
      savedRecord = await prisma.abandonedCart.update({
        where: { id: cartId },
        data: {
          customerName: customerName || undefined,
          phone: phone || undefined,
          email: email || undefined,
          cartData,
          subtotal: cleanSubtotal,
          itemCount,
          lastActiveAt: new Date(),
        },
      });
    } else {
      // Create new session
      savedRecord = await prisma.abandonedCart.create({
        data: {
          customerName: customerName || null,
          phone: phone || null,
          email: email || null,
          cartData,
          subtotal: cleanSubtotal,
          itemCount,
          recovered: false,
          lastActiveAt: new Date(),
        },
      });
    }

    return NextResponse.json({ success: true, cartId: savedRecord.id });
  } catch (error: any) {
    console.error("POST /api/cart/abandoned error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to record abandoned cart" },
      { status: 500 }
    );
  }
}

// GET: List abandoned carts for admin recovery
export async function GET() {
  try {
    const abandonedCarts = await prisma.abandonedCart.findMany({
      where: { recovered: false },
      orderBy: { lastActiveAt: "desc" },
      take: 50,
    });

    const parsed = abandonedCarts.map((c) => {
      let items = [];
      try {
        items = JSON.parse(c.cartData);
      } catch {}
      return {
        ...c,
        items,
      };
    });

    return NextResponse.json({ success: true, carts: parsed });
  } catch (error: any) {
    console.error("GET /api/cart/abandoned error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch abandoned carts" },
      { status: 500 }
    );
  }
}

// PATCH: Mark recovered
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { cartId, recovered } = body;

    if (!cartId) {
      return NextResponse.json({ success: false, error: "Cart ID required" }, { status: 400 });
    }

    const updated = await prisma.abandonedCart.update({
      where: { id: cartId },
      data: { recovered: recovered ?? true },
    });

    return NextResponse.json({ success: true, cart: updated });
  } catch (error: any) {
    console.error("PATCH /api/cart/abandoned error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update abandoned cart" },
      { status: 500 }
    );
  }
}
