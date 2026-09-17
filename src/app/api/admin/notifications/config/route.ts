import { NextRequest, NextResponse } from "next/server";
import {
  getWhatsAppConfig,
  saveWhatsAppConfig,
  getBusinessEmailConfig,
  saveBusinessEmailConfig,
  formatOrderMessage,
  generateDirectWhatsAppUrl,
} from "@/lib/orderNotificationService";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError, jsonError } from "@/lib/http";

// GET current WhatsApp and Business Email configurations
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const [whatsappConfig, emailConfig] = await Promise.all([
      getWhatsAppConfig(),
      getBusinessEmailConfig(),
    ]);

    return NextResponse.json({
      success: true,
      whatsappConfig,
      emailConfig,
    });
  } catch (error: unknown) {
    return internalError("GET /api/admin/notifications/config error:", error);
  }
}

// POST: Save configurations
export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { whatsappConfig, emailConfig } = body;

    let updatedWa = null;
    let updatedEmail = null;

    if (whatsappConfig) {
      updatedWa = await saveWhatsAppConfig(whatsappConfig);
    }
    if (emailConfig) {
      updatedEmail = await saveBusinessEmailConfig(emailConfig);
    }

    return NextResponse.json({
      success: true,
      message: "Order confirmation settings saved successfully!",
      whatsappConfig: updatedWa,
      emailConfig: updatedEmail,
    });
  } catch (error: unknown) {
    return internalError("POST /api/admin/notifications/config error:", error);
  }
}

// PUT: Test sending
export async function PUT(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { type, testPhone, testEmail } = body;

    const sampleOrder = {
      orderNumber: "TT-TEST-2026",
      customerName: "Ayesha Bilal",
      guestPhone: testPhone || "0340 0262732",
      guestEmail: testEmail || "care@tauheedtextile.com",
      total: 8900,
      paymentMethod: "Cash on Delivery",
      city: "Lahore",
      address: "House 14-B, DHA Phase 5",
      items: [
        { title: "Royal Chiffon Festive 3-Piece", size: "Medium", color: "Ivory Gold", quantity: 1, price: 8900 },
      ],
    };

    if (type === "WHATSAPP") {
      const waConfig = await getWhatsAppConfig();
      const message = formatOrderMessage(waConfig.messageTemplate, sampleOrder);
      const directUrl = generateDirectWhatsAppUrl(sampleOrder.guestPhone, message);

      return NextResponse.json({
        success: true,
        message: "Test WhatsApp confirmation message generated successfully!",
        previewText: message,
        directUrl,
      });
    }

    if (type === "EMAIL") {
      const emailConfig = await getBusinessEmailConfig();
      return NextResponse.json({
        success: true,
        message: `Business Email test queued for ${testEmail || emailConfig.senderEmail}. Note: SMTP status is ${emailConfig.enabled ? "ACTIVE" : "PENDING_CREDENTIALS"}.`,
        emailConfig,
      });
    }

    return jsonError("Invalid test type", 400);
  } catch (error: unknown) {
    return internalError("PUT /api/admin/notifications/config error:", error);
  }
}
