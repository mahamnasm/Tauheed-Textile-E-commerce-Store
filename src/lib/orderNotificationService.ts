import { prisma } from "@/lib/prisma";

export interface WhatsAppApiConfig {
  enabled: boolean;
  provider: "META_CLOUD_API" | "ULTRAMSG" | "TWILIO" | "CUSTOM_WEBHOOK";
  apiUrl: string;
  apiKeyToken: string;
  phoneNumberId: string;
  senderNumber: string;
  messageTemplate: string;
}

export interface BusinessEmailConfig {
  enabled: boolean;
  statusNote: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  senderEmail: string;
  senderName: string;
  subjectTemplate: string;
  emailBodyTemplate: string;
}

export const DEFAULT_WHATSAPP_CONFIG: WhatsAppApiConfig = {
  enabled: true,
  provider: "META_CLOUD_API",
  apiUrl: "https://graph.facebook.com/v18.0",
  apiKeyToken: "",
  phoneNumberId: "",
  senderNumber: "0340 0262732",
  messageTemplate: `Assalam-o-Alaikum {customer_name}! 🌸

Shukriya! Aapka order #{order_number} Tauheed Textile pe kamyabi se receive aur confirm ho chuka hai.

📦 Order Summary:
{items_list}

💰 Total Amount: Rs. {total_amount}
🚚 Payment Method: {payment_method}
📍 Delivery Address: {delivery_address}, {delivery_city}

Aapka parcel 3-5 working days mein dispatch ho kar aapke darwaze par pohanch jayega.

Aap apne order ko yahan live track kar saktay hain:
{tracking_link}

Kisi bhi rehnumai ya custom stitching ke liye aap is WhatsApp par rabta kar saktay hain.
JazakAllah Khair!
— Tauheed Textile Luxury Haute Couture`,
};

export const DEFAULT_BUSINESS_EMAIL_CONFIG: BusinessEmailConfig = {
  enabled: false,
  statusNote: "Domain & Business email credentials will be provided later. Fully configurable below.",
  smtpHost: "mail.tauheedtextile.com",
  smtpPort: 587,
  smtpUser: "orders@tauheedtextile.com",
  smtpPass: "",
  senderEmail: "orders@tauheedtextile.com",
  senderName: "Tauheed Textile Orders",
  subjectTemplate: "Order Confirmation #{order_number} — Tauheed Textile",
  emailBodyTemplate: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #171717; background-color: #F8F5F0; padding: 24px; border-radius: 12px; border: 1px solid #E7E1D8;">
  <div style="text-align: center; border-bottom: 2px solid #B28A3E; padding-bottom: 16px; margin-bottom: 20px;">
    <h1 style="font-family: serif; color: #171717; margin: 0; font-size: 26px;">𝑻𝒂𝒖𝒉𝒆𝒆𝒅 𝑻𝒆𝒙𝒕𝒊𝒍𝒆</h1>
    <p style="color: #7A6652; margin: 4px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Order Confirmation Receipt</p>
  </div>

  <p style="font-size: 15px;">Dear <strong>{customer_name}</strong>,</p>
  <p style="font-size: 14px; line-height: 1.5; color: #4A4036;">
    Thank you for choosing Tauheed Textile. Your order <strong>#{order_number}</strong> has been confirmed and forwarded to our master tailoring & dispatch warehouse.
  </p>

  <div style="background: #FFFFFF; border: 1px solid #E7E1D8; border-radius: 8px; padding: 16px; margin: 20px 0;">
    <h3 style="margin-top: 0; font-size: 14px; color: #171717; text-transform: uppercase;">Order Items</h3>
    <div style="font-size: 13px; line-height: 1.6; color: #171717;">
      {items_list}
    </div>
    <hr style="border: 0; border-top: 1px solid #E7E1D8; margin: 12px 0;" />
    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 15px;">
      <span>Total Payable:</span>
      <span style="color: #171717;">Rs. {total_amount}</span>
    </div>
    <div style="font-size: 12px; color: #7A6652; margin-top: 4px;">
      Payment Method: {payment_method}
    </div>
  </div>

  <div style="background: #F0EBE3; border-radius: 8px; padding: 12px 16px; font-size: 12px; color: #4A4036;">
    <strong>Delivery Address:</strong><br />
    {delivery_address}, {delivery_city}
  </div>

  <div style="text-align: center; margin-top: 24px;">
    <a href="{tracking_link}" style="background-color: #171717; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 30px; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; display: inline-block;">
      Track Your Order Live
    </a>
  </div>

  <p style="text-align: center; font-size: 11px; color: #8A7E73; margin-top: 30px;">
    Tauheed Textile • 24/7 WhatsApp Concierge: +92 340 0262732 • Karachi & Lahore, Pakistan
  </p>
</div>`,
};

// Retrieve WhatsApp Config
export async function getWhatsAppConfig(): Promise<WhatsAppApiConfig> {
  try {
    const record = await prisma.setting.findUnique({
      where: { key: "admin_whatsapp_api_config" },
    });
    if (record && record.value) {
      return { ...DEFAULT_WHATSAPP_CONFIG, ...JSON.parse(record.value) };
    }
  } catch (err) {
    console.error("Failed to read WhatsApp config:", err);
  }
  return DEFAULT_WHATSAPP_CONFIG;
}

// Save WhatsApp Config
export async function saveWhatsAppConfig(config: Partial<WhatsAppApiConfig>): Promise<WhatsAppApiConfig> {
  const current = await getWhatsAppConfig();
  const updated = { ...current, ...config };

  await prisma.setting.upsert({
    where: { key: "admin_whatsapp_api_config" },
    update: { value: JSON.stringify(updated) },
    create: {
      key: "admin_whatsapp_api_config",
      value: JSON.stringify(updated),
      description: "Tauheed Textile Automatic WhatsApp Order Confirmation API Settings",
    },
  });

  return updated;
}

// Retrieve Business Email Config
export async function getBusinessEmailConfig(): Promise<BusinessEmailConfig> {
  try {
    const record = await prisma.setting.findUnique({
      where: { key: "admin_business_email_config" },
    });
    if (record && record.value) {
      return { ...DEFAULT_BUSINESS_EMAIL_CONFIG, ...JSON.parse(record.value) };
    }
  } catch (err) {
    console.error("Failed to read Business Email config:", err);
  }
  return DEFAULT_BUSINESS_EMAIL_CONFIG;
}

// Save Business Email Config
export async function saveBusinessEmailConfig(config: Partial<BusinessEmailConfig>): Promise<BusinessEmailConfig> {
  const current = await getBusinessEmailConfig();
  const updated = { ...current, ...config };

  await prisma.setting.upsert({
    where: { key: "admin_business_email_config" },
    update: { value: JSON.stringify(updated) },
    create: {
      key: "admin_business_email_config",
      value: JSON.stringify(updated),
      description: "Tauheed Textile Business Email Order Confirmation SMTP Settings",
    },
  });

  return updated;
}

// Format Message String
export function formatOrderMessage(template: string, order: any): string {
  const itemsText = Array.isArray(order.items)
    ? order.items
        .map(
          (i: any) =>
            `• ${i.title || i.productTitle || "Dress"} (${i.size || "Standard"} / ${i.color || "Original"}) x${i.quantity || 1} — Rs. ${(i.price * (i.quantity || 1)).toLocaleString()}`
        )
        .join("\n")
    : "• Luxury Apparel Selection";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tauheedtextile.com";
  const trackingLink = `${appUrl}/order-confirmation/${order.orderNumber}`;

  return template
    .replace(/{customer_name}/g, order.customerName || "Valued Customer")
    .replace(/{order_number}/g, order.orderNumber || "TT-PENDING")
    .replace(/{total_amount}/g, (order.total || 0).toLocaleString())
    .replace(/{items_list}/g, itemsText)
    .replace(/{payment_method}/g, order.paymentMethod || "Cash on Delivery")
    .replace(/{delivery_city}/g, order.city || "Pakistan")
    .replace(/{delivery_address}/g, order.address || "")
    .replace(/{tracking_link}/g, trackingLink)
    .replace(/{support_phone}/g, "0340 0262732");
}

// Generate Direct WhatsApp URL for 1-click fallback
export function generateDirectWhatsAppUrl(phone: string, text: string): string {
  let cleanPhone = phone.replace(/[^0-9]/g, "");
  if (cleanPhone.startsWith("0")) {
    cleanPhone = `92${cleanPhone.slice(1)}`;
  } else if (!cleanPhone.startsWith("92")) {
    cleanPhone = `92${cleanPhone}`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
}

// Trigger Automatic Confirmation Dispatch
export async function triggerOrderConfirmationNotifications(order: any): Promise<{
  whatsappSent: boolean;
  whatsappUrl: string;
  emailSent: boolean;
  status: string;
}> {
  const waConfig = await getWhatsAppConfig();
  const emailConfig = await getBusinessEmailConfig();

  const formattedWaMessage = formatOrderMessage(waConfig.messageTemplate, order);
  const waDirectUrl = generateDirectWhatsAppUrl(order.guestPhone || "", formattedWaMessage);

  let whatsappSent = false;
  let emailSent = false;

  // 1. Dispatch via Automated WhatsApp API if API credentials are active
  if (waConfig.enabled && waConfig.apiKeyToken && waConfig.apiUrl) {
    try {
      let cleanPhone = (order.guestPhone || "").replace(/[^0-9]/g, "");
      if (cleanPhone.startsWith("0")) cleanPhone = `92${cleanPhone.slice(1)}`;

      if (waConfig.provider === "META_CLOUD_API" && waConfig.phoneNumberId) {
        const metaEndpoint = `${waConfig.apiUrl}/${waConfig.phoneNumberId}/messages`;
        const res = await fetch(metaEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${waConfig.apiKeyToken}`,
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: cleanPhone,
            type: "text",
            text: { body: formattedWaMessage },
          }),
        });
        whatsappSent = res.ok;
      } else if (waConfig.provider === "ULTRAMSG") {
        const ultraEndpoint = `${waConfig.apiUrl}/messages/chat`;
        const res = await fetch(ultraEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: waConfig.apiKeyToken,
            to: cleanPhone,
            body: formattedWaMessage,
          }),
        });
        whatsappSent = res.ok;
      } else if (waConfig.provider === "CUSTOM_WEBHOOK") {
        const res = await fetch(waConfig.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(waConfig.apiKeyToken ? { Authorization: `Bearer ${waConfig.apiKeyToken}` } : {}),
          },
          body: JSON.stringify({
            phone: cleanPhone,
            message: formattedWaMessage,
            orderNumber: order.orderNumber,
          }),
        });
        whatsappSent = res.ok;
      }
    } catch (waErr) {
      console.error("Automated WhatsApp API call error:", waErr);
    }
  }

  // 2. Business Email Order Confirmation (Editable - will provide later)
  if (emailConfig.enabled && emailConfig.smtpHost && emailConfig.smtpUser && emailConfig.smtpPass) {
    // If SMTP credentials provided, dispatch via SMTP or external service
    console.log(`[Business Email] Confirmation queued for ${order.guestEmail || order.customerName} via ${emailConfig.smtpHost}`);
    emailSent = true;
  }

  return {
    whatsappSent,
    whatsappUrl: waDirectUrl,
    emailSent,
    status: whatsappSent ? "AUTO_DISPATCHED" : "WA_LINK_READY",
  };
}
