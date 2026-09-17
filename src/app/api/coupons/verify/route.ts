import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = await req.json();

    if (!code) {
      return NextResponse.json(
        { success: false, error: "Please enter a coupon code." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();
    const orderSubtotal = Number(subtotal) || 0;

    // Hardcoded fallback coupons for instant offline testing
    if (cleanCode === "TAUHEED10") {
      const discount = Math.round(orderSubtotal * 0.10);
      return NextResponse.json({
        success: true,
        code: "TAUHEED10",
        discountAmount: discount,
        discountType: "PERCENTAGE",
        discountValue: 10,
        message: "10% Promo discount applied successfully!",
      });
    }

    if (cleanCode === "EIDGIFT500") {
      return NextResponse.json({
        success: true,
        code: "EIDGIFT500",
        discountAmount: 500,
        discountType: "FIXED",
        discountValue: 500,
        message: "Rs. 500 Eid gift discount applied successfully!",
      });
    }

    // Lookup coupon in database
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, error: `Coupon code '${cleanCode}' is invalid.` },
        { status: 404 }
      );
    }

    if (!coupon.isActive) {
      return NextResponse.json(
        { success: false, error: `Coupon code '${cleanCode}' is no longer active.` },
        { status: 400 }
      );
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, error: `Coupon code '${cleanCode}' has reached its maximum user redemption limit (${coupon.usageLimit}).` },
        { status: 400 }
      );
    }

    if (coupon.minOrderValue && orderSubtotal < coupon.minOrderValue) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum order amount of Rs. ${coupon.minOrderValue.toLocaleString()} is required to use this coupon.`,
        },
        { status: 400 }
      );
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = Math.round((orderSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = Math.min(orderSubtotal, coupon.discountValue);
    }

    return NextResponse.json({
      success: true,
      code: coupon.code,
      discountAmount: discount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      message: `${coupon.code} applied! Saved Rs. ${discount.toLocaleString()}`,
    });
  } catch (error: any) {
    console.error("Coupon verification error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify coupon code. Please try again." },
      { status: 500 }
    );
  }
}
