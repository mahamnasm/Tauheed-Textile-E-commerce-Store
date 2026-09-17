import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { variantId, sku, stockQuantity, syncProductSku } = body;

    if (!variantId) {
      return NextResponse.json(
        { success: false, error: "variantId is required" },
        { status: 400 }
      );
    }

    const cleanSku = sku ? sku.trim().toUpperCase() : undefined;

    // Check existing variant
    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant) {
      return NextResponse.json(
        { success: false, error: "Variant not found" },
        { status: 404 }
      );
    }

    // Check SKU duplicate if changing SKU
    if (cleanSku && cleanSku !== variant.sku) {
      const existing = await prisma.productVariant.findUnique({
        where: { sku: cleanSku },
      });
      if (existing && existing.id !== variantId) {
        return NextResponse.json(
          { success: false, error: `SKU '${cleanSku}' is already assigned to another variant.` },
          { status: 409 }
        );
      }
    }

    const updateData: any = {};
    if (cleanSku) updateData.sku = cleanSku;
    if (typeof stockQuantity === "number") updateData.stockQuantity = Math.max(0, stockQuantity);

    const oldQty = variant.stockQuantity;
    const newQty = typeof stockQuantity === "number" ? Math.max(0, stockQuantity) : oldQty;

    const updatedVariant = await prisma.productVariant.update({
      where: { id: variantId },
      data: updateData,
      include: { product: true },
    });

    // Optionally sync product main SKU if requested or if this is the default variant
    if (cleanSku && syncProductSku && variant.product) {
      try {
        await prisma.product.update({
          where: { id: variant.productId },
          data: { sku: cleanSku },
        });
      } catch (prodSkuErr) {
        console.warn("Product SKU sync skipped (already unique or unchanged):", prodSkuErr);
      }
    }

    // Record movement if quantity changed or SKU adjusted
    if (newQty !== oldQty || (cleanSku && cleanSku !== variant.sku)) {
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
  } catch (error: any) {
    console.error("Failed to update variant SKU:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update SKU" },
      { status: 500 }
    );
  }
}
