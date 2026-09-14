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
        paymentStatus: paymentMethod === "BANK_TRANSFER" ? "VERIFICATION_PENDING" : "PENDING",
        orderStatus: "PENDING",
        subtotal: parseFloat(subtotal),
        shippingFee: parseFloat(shippingFee || 0),
        discount: parseFloat(discount || 0),
        total: parseFloat(total),
        staffNotes: notes || null,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            variantDetails: `Size: ${item.size}, Color: ${item.color}, ${item.stitchedType}`,
            price: parseFloat(item.price),
            costPrice: parseFloat(item.costPrice || 0),
            quantity: parseInt(item.quantity, 10),
            total: parseFloat(item.price) * parseInt(item.quantity, 10),
          })),
        },
        ...(paymentMethod === "BANK_TRANSFER" && bankTransferDetails
          ? {
              bankTransferProof: {
                create: {
                  transactionRef: bankTransferDetails.transactionRef || "PENDING_PROOF",
                  proofImage: bankTransferDetails.proofImage || "/assets/1.png",
                  status: "PENDING",
                  adminNotes: `Bank: ${bankTransferDetails.bankName || "Direct Transfer"}`,
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
