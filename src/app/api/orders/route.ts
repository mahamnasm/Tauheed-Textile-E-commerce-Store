import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerPhone,
      customerEmail,
      shippingAddress,
      city,
      province,
      postalCode,
      nearestLandmark,
      paymentMethod,
      items,
      subtotal,
      shippingFee,
      discount,
      total,
      notes,
      bankTransferDetails,
    } = body;

    // Validation
    if (!customerName || !customerPhone || !shippingAddress || !city || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required shipping or customer details" },
        { status: 400 }
      );
    }

    // Generate unique order number (e.g. TT-2026-XXXX)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TT-${new Date().getFullYear()}-${randomSuffix}`;

    const firstProd = await prisma.product.findFirst({ select: { id: true } });
    const defaultProductId = firstProd?.id || "";

    const orderItemsData = items.map((item: any) => ({
      productId: item.productId || item.id || defaultProductId,
      variantDetails: `Size: ${item.size || item.selectedSize || "Standard"}, Color: ${item.color || item.selectedColor || "Standard"}, ${item.stitchedType || "Unstitched"}`,
      price: parseFloat(item.price || 0),
      costPrice: parseFloat(item.costPrice || 0),
      quantity: parseInt(item.quantity || 1, 10),
      total: parseFloat(item.price || 0) * parseInt(item.quantity || 1, 10),
    }));

    // Create Order with Prisma
    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        guestPhone: customerPhone,
        guestEmail: customerEmail || null,
        address: shippingAddress,
        landmark: nearestLandmark || null,
        city,
        province: province || "Punjab",
        postalCode: postalCode || null,
        paymentMethod: paymentMethod || "COD",
        paymentStatus: ["BANK_TRANSFER", "JAZZCASH", "EASYPAISA"].includes(paymentMethod)
          ? "VERIFICATION_PENDING"
          : "PENDING",
        orderStatus: "PENDING",
        subtotal: parseFloat(subtotal),
        shippingFee: parseFloat(shippingFee || 0),
        discount: parseFloat(discount || 0),
        total: parseFloat(total),
        staffNotes: notes || null,
        items: {
          create: orderItemsData,
        },
        ...((["BANK_TRANSFER", "JAZZCASH", "EASYPAISA"].includes(paymentMethod) && bankTransferDetails)
          ? {
              bankTransferProof: {
                create: {
                  transactionRef: bankTransferDetails.transactionRef || "PENDING_PROOF",
                  proofImage: bankTransferDetails.proofImage || "",
                  status: "PENDING",
                  adminNotes: `Method: ${paymentMethod} | Channel: ${bankTransferDetails.bankName || paymentMethod}`,
                },
              },
            }
          : {}),
      },
    });

    // Update variant reserved/stock quantities
    for (const item of items) {
      if (item.variantId && !item.variantId.includes("-def")) {
        try {
          await prisma.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockQuantity: { decrement: parseInt(item.quantity, 10) },
            },
          });
        } catch (stockErr) {
          console.error("Stock update warning:", stockErr);
        }
      }
    }

    // Increment coupon usedCount if a valid coupon was applied
    if (body.couponCode) {
      try {
        await prisma.coupon.update({
          where: { code: body.couponCode.trim().toUpperCase() },
          data: { usedCount: { increment: 1 } },
        });
      } catch (couponErr) {
        console.warn("Coupon usage increment ignored:", couponErr);
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error: any) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please check inputs and try again.", details: error.message },
      { status: 500 }
    );
  }
}
