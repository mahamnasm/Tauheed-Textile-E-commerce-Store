import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getClientIp, checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { createOrderSchema } from "@/lib/validation";
import { firstZodMessage, zodFieldErrors, internalError } from "@/lib/http";
import { randomInt } from "crypto";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  const rateStatus = checkRateLimit(`order_${ip}`, 10, 15 * 60 * 1000);
  if (!rateStatus.success) {
    return rateLimitResponse(
      rateStatus.resetTime,
      "Too many orders submitted from your IP. Please wait a few minutes."
    );
  }

  try {
    const body = await req.json();
    const validationResult = createOrderSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: firstZodMessage(validationResult.error),
          validationErrors: zodFieldErrors(validationResult.error),
        },
        { status: 400 }
      );
    }

    const {
      customerName,
      customerPhone,
      guestPhone,
      customerEmail,
      guestEmail,
      shippingAddress,
      address,
      city,
      province,
      postalCode,
      nearestLandmark,
      landmark,
      paymentMethod,
      couponCode,
      items,
      notes,
      bankTransferDetails,
    } = validationResult.data;

    const phone = customerPhone || guestPhone || "";
    const shipping = shippingAddress || address || "";

    const isAdvancePayment = ["BANK_TRANSFER", "JAZZCASH", "EASYPAISA"].includes(paymentMethod);
    if (
      isAdvancePayment &&
      (!bankTransferDetails || !bankTransferDetails.proofImage || !bankTransferDetails.proofImage.trim())
    ) {
      return NextResponse.json(
        {
          error:
            "Please attach or upload your payment receipt / transfer screenshot before checkout for order confirmation.",
        },
        { status: 400 }
      );
    }

    const uniqueProductIds = Array.from(new Set(items.map((i) => i.productId)));
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: uniqueProductIds } },
      select: {
        id: true,
        salePrice: true,
        basePrice: true,
        costPrice: true,
        inStock: true,
      },
    });
    const dbProductMap = new Map(dbProducts.map((p) => [p.id, p]));

    if (dbProducts.length !== uniqueProductIds.length) {
      return NextResponse.json(
        { error: "One or more items in your cart are no longer available." },
        { status: 400 }
      );
    }

    let calculatedSubtotal = 0;
    const orderItemsData = [];

    for (const item of items) {
      const dbProd = dbProductMap.get(item.productId);
      if (!dbProd) {
        return NextResponse.json({ error: "Invalid product in cart." }, { status: 400 });
      }

      const verifiedUnitPrice =
        dbProd.salePrice && dbProd.salePrice < dbProd.basePrice ? dbProd.salePrice : dbProd.basePrice;
      const itemTotal = verifiedUnitPrice * item.quantity;
      calculatedSubtotal += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        variantDetails:
          item.variantDetails ||
          `Size: ${item.size || "Standard"}, Color: ${item.color || "Standard"}, ${item.stitchedType || "Unstitched"}`,
        price: verifiedUnitPrice,
        costPrice: dbProd.costPrice || 0,
        quantity: item.quantity,
        total: itemTotal,
      });
    }

    const isFreeDelivery = calculatedSubtotal >= 10000;
    const shippingFee = isFreeDelivery ? 0 : 350;

    let discountAmount = 0;
    let couponIdToIncrement: string | null = null;

    if (couponCode) {
      const cleanCoupon = couponCode.trim().toUpperCase();
      if (cleanCoupon === "TAUHEED10") {
        discountAmount = Math.round(calculatedSubtotal * 0.1);
      } else if (cleanCoupon === "EIDGIFT500") {
        discountAmount = Math.min(calculatedSubtotal, 500);
      } else {
        const dbCoupon = await prisma.coupon.findUnique({ where: { code: cleanCoupon } });
        if (
          dbCoupon &&
          dbCoupon.isActive &&
          (!dbCoupon.usageLimit || dbCoupon.usedCount < dbCoupon.usageLimit) &&
          (!dbCoupon.minOrderValue || calculatedSubtotal >= dbCoupon.minOrderValue)
        ) {
          if (dbCoupon.discountType === "PERCENTAGE") {
            discountAmount = Math.round((calculatedSubtotal * dbCoupon.discountValue) / 100);
            if (dbCoupon.maxDiscount && discountAmount > dbCoupon.maxDiscount) {
              discountAmount = dbCoupon.maxDiscount;
            }
          } else {
            discountAmount = Math.min(calculatedSubtotal, dbCoupon.discountValue);
          }
          couponIdToIncrement = dbCoupon.id;
        }
      }
    }

    if (isAdvancePayment) {
      discountAmount += Math.round(calculatedSubtotal * 0.05);
    }

    const codHandlingFee = paymentMethod === "COD" ? Math.round(calculatedSubtotal * 0.04) : 0;
    const calculatedTotal = Math.max(0, calculatedSubtotal + shippingFee + codHandlingFee - discountAmount);

    const order = await prisma.$transaction(async (tx) => {
      if (couponIdToIncrement) {
        const fresh = await tx.coupon.findUnique({ where: { id: couponIdToIncrement } });
        if (!fresh || !fresh.isActive || (fresh.usageLimit && fresh.usedCount >= fresh.usageLimit)) {
          throw new Error("COUPON_EXHAUSTED");
        }
        await tx.coupon.update({
          where: { id: couponIdToIncrement },
          data: { usedCount: { increment: 1 } },
        });
      }

      let created = null;
      for (let attempt = 0; attempt < 5; attempt++) {
        const orderNumber = `TT-${new Date().getFullYear()}-${randomInt(100000, 1000000)}`;
        try {
          created = await tx.order.create({
            data: {
              orderNumber,
              customerName,
              guestPhone: phone,
              guestEmail: customerEmail || guestEmail || null,
              address: shipping,
              landmark: nearestLandmark || landmark || null,
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
              items: { create: orderItemsData },
              ...(isAdvancePayment && bankTransferDetails
                ? {
                    bankTransferProof: {
                      create: {
                        transactionRef: bankTransferDetails.referenceNumber || "PENDING_PROOF",
                        proofImage: bankTransferDetails.proofImage || "",
                        status: "PENDING",
                        adminNotes: `Method: ${paymentMethod}`,
                      },
                    },
                  }
                : {}),
            },
          });
          break;
        } catch (err: unknown) {
          const code = typeof err === "object" && err && "code" in err ? (err as { code?: string }).code : "";
          if (code === "P2002" && attempt < 4) continue;
          throw err;
        }
      }

      if (!created) {
        throw new Error("ORDER_NUMBER_FAILED");
      }
      return created;
    });

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
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message === "COUPON_EXHAUSTED") {
      return NextResponse.json(
        { error: "This coupon is no longer available. Please remove it and try again." },
        { status: 409 }
      );
    }
    return internalError("Order creation error:", error);
  }
}
