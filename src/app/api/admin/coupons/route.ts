import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError, jsonError } from "@/lib/http";

// GET all coupons
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, coupons });
  } catch (error: unknown) {
    return internalError("GET /api/admin/coupons error:", error);
  }
}

// POST: Create a new coupon
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

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
      return jsonError("Coupon code and discount value are required.", 400);
    }

    const cleanCode = code.trim().toUpperCase();

    // Check existing
    const existing = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return jsonError(`Coupon code '${cleanCode}' already exists.`, 409);
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
  } catch (error: unknown) {
    return internalError("POST /api/admin/coupons error:", error);
  }
}

// PATCH / PUT: Update an existing coupon
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { id, code, discountType, discountValue, minOrderValue, maxDiscount, usageLimit, isActive, expiresAt } = body;

    if (!id || typeof id !== "string") {
      return jsonError("Coupon ID is required.", 400);
    }

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return jsonError("Coupon not found.", 404);
    }

    const updateData: Record<string, unknown> = {};
    if (code !== undefined) updateData.code = String(code).trim().toUpperCase();
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
  } catch (error: unknown) {
    return internalError("PATCH /api/admin/coupons error:", error);
  }
}

// DELETE: Remove coupon
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return jsonError("Coupon ID is required.", 400);
    }

    const existing = await prisma.coupon.findUnique({ where: { id } });
    if (!existing) {
      return jsonError("Coupon not found.", 404);
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error: unknown) {
    return internalError("DELETE /api/admin/coupons error:", error);
  }
}
