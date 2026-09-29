import { describe, it, expect } from "vitest";
import {
  buildAdminOrderHtmlEmail,
  DEFAULT_ADMIN_GMAIL,
  AdminOrderEmailPayload,
} from "../src/lib/adminOrderEmailService";

describe("Admin Gmail Order Dispatch Service", () => {
  it("should default dispatch recipient to usama.buisness.usama@gmail.com", () => {
    expect(DEFAULT_ADMIN_GMAIL).toBe("usama.buisness.usama@gmail.com");
  });

  it("should build complete HTML email with dispatch phone, address, items, and variants", () => {
    const payload: AdminOrderEmailPayload = {
      orderNumber: "TT-2026-9041",
      customerName: "Zainab Farooq",
      guestPhone: "0321 8472910",
      guestEmail: "zainab@example.com",
      address: "House 42-A, Street 9, DHA Phase 6",
      landmark: "Near Raya Fairways Club",
      city: "Lahore",
      province: "Punjab",
      postalCode: "54000",
      paymentMethod: "COD",
      paymentStatus: "PENDING",
      subtotal: 12500,
      shippingFee: 0,
      discount: 1000,
      total: 11500,
      staffNotes: "Please ring the bell twice",
      items: [
        {
          title: "Royal Crimson Lawn 3-Piece",
          sku: "TT-LAWN-2026-01",
          fabric: "Pure Egyptian Cotton Lawn",
          variantDetails: "Size: Large | Color: Crimson Red | Stitched",
          quantity: 2,
          price: 5750,
          total: 11500,
        },
      ],
      bankTransferDetails: null,
    };

    const result = buildAdminOrderHtmlEmail(payload);

    // Verify Subject
    expect(result.subject).toContain("TT-2026-9041");
    expect(result.subject).toContain("Rs. 11,500");
    expect(result.subject).toContain("Lahore");
    expect(result.subject).toContain("Zainab Farooq");

    // Verify Courier Dispatch Fields
    expect(result.html).toContain("0321 8472910");
    expect(result.html).toContain("Zainab Farooq");
    expect(result.html).toContain("House 42-A, Street 9, DHA Phase 6");
    expect(result.html).toContain("LAHORE, Punjab");
    expect(result.html).toContain("Near Raya Fairways Club");
    expect(result.html).toContain("Rs. 11,500");
    expect(result.html).toContain("Please ring the bell twice");

    // Verify Dress Variations
    expect(result.html).toContain("Royal Crimson Lawn 3-Piece");
    expect(result.html).toContain("TT-LAWN-2026-01");
    expect(result.html).toContain("Size: Large | Color: Crimson Red | Stitched");
    expect(result.html).toContain("x2");

    // Verify WhatsApp direct customer link
    expect(result.html).toContain("https://wa.me/923218472910");
  });

  it("should embed payment proof and indicate zero COD collectible for advance payments", () => {
    const payload: AdminOrderEmailPayload = {
      orderNumber: "TT-2026-9042",
      customerName: "Hira Tariq",
      guestPhone: "0300 1234567",
      address: "Apartment 4B, Clifton Block 2",
      city: "Karachi",
      province: "Sindh",
      paymentMethod: "BANK_TRANSFER",
      paymentStatus: "VERIFICATION_PENDING",
      subtotal: 18000,
      shippingFee: 0,
      discount: 900,
      total: 17100,
      items: [
        {
          title: "Luxury Organza Festive Edition",
          sku: "TT-ORG-09",
          size: "Medium",
          color: "Antique Gold",
          stitchedType: "Stitched",
          quantity: 1,
          price: 17100,
          total: 17100,
        },
      ],
      bankTransferDetails: {
        bankName: "Meezan Bank Ltd",
        transactionRef: "MEEZAN-TRX-8829102",
        proofImage: "data:image/jpeg;base64,/9j/4AAQSkZJRg==",
      },
    };

    const result = buildAdminOrderHtmlEmail(payload);

    // Verify Advance Paid logic
    expect(result.html).toContain("Rs. 0 (Already Paid In Advance)");
    expect(result.html).toContain("Meezan Bank Ltd");
    expect(result.html).toContain("MEEZAN-TRX-8829102");
    expect(result.html).toContain("data:image/jpeg;base64,/9j/4AAQSkZJRg==");
  });

  it("should build customer confirmation receipt email with tracking link and items", async () => {
    const { buildCustomerOrderHtmlEmail } = await import("../src/lib/adminOrderEmailService");

    const payload: AdminOrderEmailPayload = {
      orderNumber: "TT-2026-7711",
      customerName: "Sana Mir",
      guestPhone: "0333 4567890",
      guestEmail: "sana.mir@example.com",
      address: "House 12, Gulberg III",
      city: "Lahore",
      paymentMethod: "COD",
      subtotal: 9500,
      shippingFee: 0,
      discount: 0,
      total: 9500,
      items: [
        {
          title: "Embroidered Velvet Shawl Suit",
          size: "Medium",
          color: "Deep Plum",
          stitchedType: "Stitched",
          quantity: 1,
          price: 9500,
          total: 9500,
        },
      ],
      bankTransferDetails: null,
    };

    const customerEmail = buildCustomerOrderHtmlEmail(payload);

    expect(customerEmail.subject).toContain("Order Confirmed #TT-2026-7711");
    expect(customerEmail.html).toContain("Shukriya, Sana Mir!");
    expect(customerEmail.html).toContain("Embroidered Velvet Shawl Suit");
    expect(customerEmail.html).toContain("Size: Medium | Color: Deep Plum | Stitched");
    expect(customerEmail.html).toContain("Rs. 9,500");
    expect(customerEmail.html).toContain("/order-confirmation/TT-2026-7711");
    expect(customerEmail.html).toContain("0340 0262732");
  });
});

