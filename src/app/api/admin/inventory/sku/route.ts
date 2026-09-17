import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError, jsonError } from "@/lib/http";

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { variantId, sku, stockQuantity, syncProductSku } = body;

    if (!variantId) {
      return jsonError("variantId is required", 400);
    }

    const cleanSku = sku ? sku.trim().toUpperCase() : undefined;

    // Check existing variant
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      return jsonError("Variant not found", 404);
    }

    // Check SKU duplicate if changing SKU
    if (cleanSku && cleanSku !== variant.sku) {
      const existing = await prisma.productVariant.findUnique({
        where: { sku: cleanSku },
      });
      if (existing && existing.id !== variantId) {
        return jsonError(`SKU '${cleanSku}' is already assigned to another variant.`, 409);
      }
    }

    const updateData: Record<string, unknown> = {};
    if (cleanSku) updateData.sku = cleanSku;
    if (stockQuantity !== undefined && stockQuantity !== null) {
      updateData.stockQuantity = Math.max(0, parseInt(stockQuantity, 10));
    }

    // Update variant
    const updatedVariant = await prisma.productVariant.update({
      where: { id: variantId },
      data: updateData,
    });

    // Optionally sync master product SKU
    if (syncProductSku && cleanSku && variant.productId) {
      try {
        await prisma.product.update({
          where: { id: variant.productId },
          data: { sku: cleanSku },
        });
      } catch (prodSkuErr) {
        console.warn("Product SKU sync skipped (already unique or unchanged):", prodSkuErr);
      }
    }

    // Log inventory movement if stock changed
    if (stockQuantity !== undefined && stockQuantity !== null) {
      const oldQty = variant.stockQuantity;
      const newQty = Math.max(0, parseInt(stockQuantity, 10));
      try {
        await prisma.inventoryMovement.create({
          data: {
            variantId: variant.id,
            changeQty: newQty - oldQty,
            previousQty: oldQty,
            newQty: newQty,
            type: "SKU_OR_STOCK_EDIT",
            reason: cleanSku && cleanSku !== variant.sku 
              ? `SKU updated from '${variant.sku}' to '${cleanSku}'` 
              : "Manual stock adjustment in ledger",
            staffName: "Admin Executive",
          },
        });
      } catch (movementErr) {
        console.warn("Inventory movement logging skipped:", movementErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Variant SKU updated to '${updatedVariant.sku}' successfully!`,
      variant: updatedVariant,
    });
  } catch (error: unknown) {
    return internalError("PATCH /api/admin/inventory/sku error:", error);
  }
}
