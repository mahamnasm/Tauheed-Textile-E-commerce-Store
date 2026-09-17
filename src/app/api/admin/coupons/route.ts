import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all coupons
export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, coupons });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

// POST: Create a new coupon
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code,
      discountType = "PERCENTAGE",
      discountValue,
      minOrderValue = 0,
      maxDiscount,
      usageLimit = 100,
      expiresAt,
      isActive = true,
    } = body;

    if (!code || discountValue === undefined || discountValue === null) {
      return NextResponse.json(
        { success: false, error: "Coupon code and discount value are required." },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // Check existing
    const existing = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: `Coupon code '${cleanCode}' already exists.` },
        { status: 409 }
      );
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: cleanCode,
        discountType: discountType === "FIXED" ? "FIXED" : "PERCENTAGE",
        discountValue: Number(discountValue),
        minOrderValue: Number(minOrderValue) || 0,
        maxDiscount: maxDiscount ? Number(maxDiscount) : null,
        usageLimit: usageLimit !== null && usageLimit !== undefined ? Number(usageLimit) : 100,
        usedCount: 0,
        isActive: Boolean(isActive),
        expiresAt: expiresAt ? String(expiresAt) : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Coupon ${coupon.code} created successfully!`,
      coupon,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create coupon" },
      { status: 500 }
    );
  }
}

// PATCH / PUT: Update an existing coupon
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, code, discountType, discountValue, minOrderValue, maxDiscount, usageLimit, isActive, expiresAt } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Coupon ID is required." },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (code !== undefined) updateData.code = code.trim().toUpperCase();
    if (discountType !== undefined) updateData.discountType = discountType;
    if (discountValue !== undefined) updateData.discountValue = Number(discountValue);
    if (minOrderValue !== undefined) updateData.minOrderValue = Number(minOrderValue);
    if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount ? Number(maxDiscount) : null;
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit !== null ? Number(usageLimit) : null;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? String(expiresAt) : null;

    const updated = await prisma.coupon.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: `Coupon ${updated.code} updated successfully!`,
      coupon: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update coupon" },
      { status: 500 }
    );
  }
}

// DELETE: Remove coupon
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Coupon ID is required." },
        { status: 400 }
      );
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
