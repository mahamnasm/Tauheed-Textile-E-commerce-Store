import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp, checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { createOrderSchema } from "@/lib/validation";
import { FALLBACK_PRODUCTS } from "@/lib/fallbackProducts";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  // 1. Rate Limiting: Max 10 order creation requests per 15 minutes per IP
  const rateStatus = checkRateLimit(`order_${ip}`, 10, 15 * 60 * 1000);
  if (!rateStatus.success) {
    return rateLimitResponse(rateStatus.resetTime, "Too many orders submitted from your IP. Please wait a few minutes.");
  }

  try {
    const body = await req.json();

    // 2. Strict Server-Side Zod Validation
    const validationResult = createOrderSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || "Invalid order information";
      return NextResponse.json(
        {
          error: firstError,
          validationErrors: validationResult.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }

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
      couponCode,
      items,
      notes,
      bankTransferDetails,
    } = validationResult.data;

    // 3. Strict Enforcement: Mandatory receipt upload for advance payment
    const isAdvancePayment = ["BANK_TRANSFER", "JAZZCASH", "EASYPAISA"].includes(paymentMethod);
    if (isAdvancePayment && (!bankTransferDetails || !bankTransferDetails.proofImage || !bankTransferDetails.proofImage.trim())) {
      return NextResponse.json(
        { error: "Please attach or upload your payment receipt / transfer screenshot before checkout for order confirmation." },
        { status: 400 }
      );
    }

    // 4. Server-Side Price Verification (Zero Reliance on Client Prices)
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true },
    });
    const dbProductMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedSubtotal = 0;
    const orderItemsData: any[] = [];

    for (const item of items) {
      const dbProd = dbProductMap.get(item.productId) || FALLBACK_PRODUCTS.find((p) => p.id === item.productId);
      
      // Determine verified unit price from authoritative source
      let verifiedUnitPrice = 0;
      let costPrice = 0;

      if (dbProd) {
        verifiedUnitPrice = (dbProd.salePrice && dbProd.salePrice < dbProd.basePrice) 
          ? dbProd.salePrice 
          : dbProd.basePrice;
        costPrice = (dbProd as any).costPrice || 0;
      } else {
        // Fallback pricing if offline product
        verifiedUnitPrice = 5000;
      }

      const itemTotal = verifiedUnitPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        variantDetails: item.variantDetails || `Size: ${item.size || "Standard"}, Color: ${item.color || "Standard"}, ${item.stitchedType || "Unstitched"}`,
        price: verifiedUnitPrice,
        costPrice,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    // 5. Server-Side Shipping & Discount Calculation
    // Free delivery threshold: Rs. 10,000+
    const isFreeDelivery = calculatedSubtotal >= 10000;
    let shippingFee = isFreeDelivery ? 0 : 350; // standard nationwide baseline

    // Coupon verification
    let discountAmount = 0;
    if (couponCode) {
      const cleanCoupon = couponCode.trim().toUpperCase();
      if (cleanCoupon === "TAUHEED10") {
        discountAmount = Math.round(calculatedSubtotal * 0.10);
      } else if (cleanCoupon === "EIDGIFT500") {
        discountAmount = Math.min(calculatedSubtotal, 500);
      } else {
        const dbCoupon = await prisma.coupon.findUnique({ where: { code: cleanCoupon } });
        if (dbCoupon && dbCoupon.isActive && (!dbCoupon.usageLimit || dbCoupon.usedCount < dbCoupon.usageLimit)) {
          if (!dbCoupon.minOrderValue || calculatedSubtotal >= dbCoupon.minOrderValue) {
            if (dbCoupon.discountType === "PERCENTAGE") {
              discountAmount = Math.round((calculatedSubtotal * dbCoupon.discountValue) / 100);
              if (dbCoupon.maxDiscount && discountAmount > dbCoupon.maxDiscount) {
                discountAmount = dbCoupon.maxDiscount;
              }
            } else {
              discountAmount = Math.min(calculatedSubtotal, dbCoupon.discountValue);
            }
          }
        }
      }
    }

    // Advance Payment 5% discount
    if (isAdvancePayment) {
      const advanceDiscount = Math.round(calculatedSubtotal * 0.05);
      discountAmount += advanceDiscount;
    }

    // 4% COD Fee
    let codHandlingFee = 0;
    if (paymentMethod === "COD") {
      codHandlingFee = Math.round(calculatedSubtotal * 0.04);
    }

    const calculatedTotal = Math.max(0, calculatedSubtotal + shippingFee + codHandlingFee - discountAmount);

    // 6. Generate unique order number (e.g. TT-2026-XXXX)
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TT-${new Date().getFullYear()}-${randomSuffix}`;

    // 7. Persist verified order in Database
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
        paymentStatus: isAdvancePayment ? "VERIFICATION_PENDING" : "PENDING",
        orderStatus: "PENDING",
        subtotal: calculatedSubtotal,
        shippingFee,
        discount: discountAmount,
        total: calculatedTotal,
        staffNotes: notes || null,
        items: {
          create: orderItemsData,
        },
        ...(isAdvancePayment && bankTransferDetails
          ? {
              bankTransferProof: {
                create: {
                  transactionRef: bankTransferDetails.referenceNumber || "PENDING_PROOF",
                  proofImage: bankTransferDetails.proofImage || "",
                  status: "PENDING",
                  adminNotes: `Method: ${paymentMethod} | Channel: ${bankTransferDetails.bankName || paymentMethod}`,
                },
              },
            }
          : {}),
      },
    });

    // 8. Trigger Automated WhatsApp & Business Email Order Confirmation
    let notificationStatus = null;
    try {
      const { triggerOrderConfirmationNotifications } = await import("@/lib/orderNotificationService");
      notificationStatus = await triggerOrderConfirmationNotifications({
        ...order,
        items: orderItemsData,
      });
    } catch (notifErr) {
      console.error("Automated notification warning:", notifErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
      whatsappUrl: notificationStatus?.whatsappUrl,
      verifiedTotal: calculatedTotal,
    });
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      { error: "Failed to place order. Please verify your details and try again." },
      { status: 500 }
    );
  }
}
