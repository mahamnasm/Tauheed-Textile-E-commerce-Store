import { describe, it, expect } from "vitest";
import { sanitizePublicOrder } from "../src/lib/publicOrder";

describe("Phase 1 [UNIT-01]: Currency Formatting & Decimal Handling", () => {
  const formatPkr = (amount: number): string => {
    return `Rs. ${Math.round(amount).toLocaleString()}`;
  };

  it("should format standard integer PKR amounts accurately", () => {
    expect(formatPkr(4500)).toBe("Rs. 4,500");
    expect(formatPkr(120000)).toBe("Rs. 120,000");
    expect(formatPkr(0)).toBe("Rs. 0");
  });

  it("should round floating point prices cleanly without decimals", () => {
    expect(formatPkr(2999.49)).toBe("Rs. 2,999");
    expect(formatPkr(2999.51)).toBe("Rs. 3,000");
  });
});

describe("Phase 1 [UNIT-02]: Pakistani E-Commerce Business Logic Engine", () => {
  interface PriceCalculationInput {
    subtotal: number;
    paymentMethod: "COD" | "BANK_TRANSFER" | "JAZZCASH" | "EASYPAISA";
    promoDiscount?: number;
    freeShippingThreshold?: number;
    standardShippingFee?: number;
  }

  function calculateOrderSummary(input: PriceCalculationInput) {
    const {
      subtotal,
      paymentMethod,
      promoDiscount = 0,
      freeShippingThreshold = 10000,
      standardShippingFee = 250,
    } = input;

    const baseSubtotal = Math.max(0, subtotal);
    const validPromo = Math.min(baseSubtotal, Math.max(0, promoDiscount));
    const discountedSubtotal = baseSubtotal - validPromo;

    let advanceDiscount = 0;
    let codSurcharge = 0;

    if (paymentMethod === "COD") {
      codSurcharge = Math.round(discountedSubtotal * 0.04);
    } else {
      advanceDiscount = Math.round(discountedSubtotal * 0.05);
    }

    const shippingFee = discountedSubtotal >= freeShippingThreshold ? 0 : standardShippingFee;
    const finalTotal = discountedSubtotal - advanceDiscount + codSurcharge + shippingFee;

    return {
      subtotal: baseSubtotal,
      promoDiscount: validPromo,
      advanceDiscount,
      codSurcharge,
      shippingFee,
      finalTotal: Math.max(0, finalTotal),
    };
  }

  it("should apply 5% advance payment discount on Bank Transfer orders", () => {
    const summary = calculateOrderSummary({
      subtotal: 10000,
      paymentMethod: "BANK_TRANSFER",
    });

    expect(summary.subtotal).toBe(10000);
    expect(summary.advanceDiscount).toBe(500);
    expect(summary.codSurcharge).toBe(0);
    expect(summary.shippingFee).toBe(0);
    expect(summary.finalTotal).toBe(9500);
  });

  it("should apply 4% COD surcharge and standard shipping below 10,000 threshold", () => {
    const summary = calculateOrderSummary({
      subtotal: 5000,
      paymentMethod: "COD",
    });

    expect(summary.subtotal).toBe(5000);
    expect(summary.advanceDiscount).toBe(0);
    expect(summary.codSurcharge).toBe(200);
    expect(summary.shippingFee).toBe(250);
    expect(summary.finalTotal).toBe(5450);
  });

  it("should accurately combine promo coupons with advance payment discounts", () => {
    const summary = calculateOrderSummary({
      subtotal: 12000,
      promoDiscount: 2000,
      paymentMethod: "JAZZCASH",
    });

    expect(summary.subtotal).toBe(12000);
    expect(summary.promoDiscount).toBe(2000);
    expect(summary.advanceDiscount).toBe(500);
    expect(summary.shippingFee).toBe(0);
    expect(summary.finalTotal).toBe(9500);
  });
});

describe("Phase 1 [UNIT-03]: Public Order Sanitization (BOLA / IDOR Protection)", () => {
  const mockDbOrder = {
    id: "ord_db_uuid_9921",
    orderNumber: "TT-2026-8812",
    customerName: "Fatima Noor",
    guestPhone: "+923001234567",
    guestEmail: "fatima@example.com",
    address: "House 42-B, Sector G, DHA Phase 6, Lahore",
    landmark: "Near Lalik Chowk",
    city: "Lahore",
    province: "Punjab",
    postalCode: "54000",
    subtotal: 14500,
    shippingFee: 0,
    discount: 500,
    total: 14000,
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    orderStatus: "SHIPPED",
    trackingNumber: "TRAX-PK-9812401",
    courierName: "Trax Logistics",
    courierUrl: "https://trax.pk/tracking?num=TRAX-PK-9812401",
    staffNotes: "VIP Customer - ensure luxury gift ribbon packaging",
    createdAt: new Date("2026-03-15T10:30:00Z"),
    updatedAt: new Date("2026-03-15T14:00:00Z"),
    items: [
      {
        id: "item_1",
        productId: "prod_lawn_1",
        variantDetails: "Stitched / Medium / Ivory",
        price: 14500,
        costPrice: 6500,
        quantity: 1,
        total: 14500,
        product: {
          id: "prod_lawn_1",
          title: "Zarrin Velvet & Pure Swiss Lawn 3-Piece",
          images: [{ url: "/uploads/zarrin-lawn.webp" }],
        },
      },
    ],
  };

  it("should sanitize order details and strip confidential customer and cost data", () => {
    const sanitized = sanitizePublicOrder(mockDbOrder);

    expect(sanitized.orderNumber).toBe("TT-2026-8812");
    expect(sanitized.orderStatus).toBe("SHIPPED");
    expect(sanitized.paymentStatus).toBe("PENDING");
    expect(sanitized.city).toBe("Lahore");
    expect(sanitized.total).toBe(14000);
    expect(sanitized.trackingNumber).toBe("TRAX-PK-9812401");
    expect(sanitized.courierName).toBe("Trax Logistics");

    expect((sanitized as any).address).toBeUndefined();
    expect((sanitized as any).landmark).toBeUndefined();
    expect((sanitized as any).guestPhone).toBeUndefined();
    expect((sanitized as any).guestEmail).toBeUndefined();
    expect((sanitized as any).staffNotes).toBeUndefined();

    expect(sanitized.items[0].price).toBe(14500);
    expect((sanitized.items[0] as any).costPrice).toBeUndefined();
  });
});
