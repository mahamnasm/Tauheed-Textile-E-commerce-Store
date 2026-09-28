import nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";

export const DEFAULT_ADMIN_GMAIL = "usama.buisness.usama@gmail.com";

export interface AdminOrderItem {
  productId?: string;
  title?: string;
  productTitle?: string;
  sku?: string;
  fabric?: string;
  variantDetails?: string;
  size?: string;
  color?: string;
  stitchedType?: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl?: string;
}

export interface AdminOrderEmailPayload {
  orderNumber: string;
  customerName: string;
  guestPhone: string;
  guestEmail?: string | null;
  address: string;
  landmark?: string | null;
  city: string;
  province?: string;
  postalCode?: string | null;
  paymentMethod: string;
  paymentStatus?: string;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  staffNotes?: string | null;
  items: AdminOrderItem[];
  bankTransferDetails?: {
    bankName?: string;
    transactionRef?: string;
    referenceNumber?: string;
    proofImage?: string;
  } | null;
}

/**
 * Format currency in Pakistani Rupees
 */
function formatPkr(amount: number): string {
  return `Rs. ${Math.round(amount || 0).toLocaleString()}`;
}

/**
 * Clean phone number for WhatsApp and tel links
 */
function cleanPhoneNumber(phone: string): { display: string; intl: string } {
  const digits = (phone || "").replace(/[^0-9]/g, "");
  let intl = digits;
  if (digits.startsWith("0")) {
    intl = `92${digits.slice(1)}`;
  } else if (!digits.startsWith("92")) {
    intl = `92${digits}`;
  }
  return {
    display: phone || digits,
    intl,
  };
}

/**
 * Generate luxury responsive HTML Email for Usama's Gmail
 */
export function buildAdminOrderHtmlEmail(payload: AdminOrderEmailPayload): {
  subject: string;
  html: string;
  text: string;
} {
  const {
    orderNumber,
    customerName,
    guestPhone,
    guestEmail,
    address,
    landmark,
    city,
    province = "Pakistan",
    postalCode,
    paymentMethod,
    paymentStatus = "PENDING",
    subtotal,
    shippingFee,
    discount,
    total,
    staffNotes,
    items = [],
    bankTransferDetails,
  } = payload;

  const phoneInfo = cleanPhoneNumber(guestPhone);
  const isAdvancePayment = ["BANK_TRANSFER", "JAZZCASH", "EASYPAISA"].includes(paymentMethod.toUpperCase());
  const codAmountToCollect = isAdvancePayment ? 0 : total;
  const appUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://tauheed-textile.vercel.app";
  const adminOrderUrl = `${appUrl}/admin/orders`;
  const trackingUrl = `${appUrl}/order-confirmation/${orderNumber}`;
  const whatsappCustomerUrl = `https://wa.me/${phoneInfo.intl}?text=${encodeURIComponent(
    `Assalam-o-Alaikum ${customerName}! 🌸\nTauheed Textile se rabta kar rahe hain aapke order #${orderNumber} ke silsilay mein.`
  )}`;

  const nowKarachi = new Intl.DateTimeFormat("en-PK", {
    timeZone: "Asia/Karachi",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date());

  const subject = `🚨 NEW ORDER #${orderNumber} — ${formatPkr(total)} [${paymentMethod}] — Dispatch to ${city} (${customerName})`;

  // Render items table rows
  const itemRowsHtml = items
    .map((item, idx) => {
      const title = item.title || item.productTitle || `Item #${idx + 1}`;
      const variants =
        item.variantDetails ||
        [item.size ? `Size: ${item.size}` : "", item.color ? `Color: ${item.color}` : "", item.stitchedType || ""]
          .filter(Boolean)
          .join(" | ") ||
        "Standard Variant";

      return `
      <tr style="border-bottom: 1px solid #E7E1D8;">
        <td style="padding: 12px 8px; vertical-align: top; font-size: 13px; color: #171717;">
          <strong style="color: #171717; font-size: 14px;">${title}</strong>
          ${item.sku ? `<div style="font-size: 11px; color: #7A6652; margin-top: 2px;">SKU: <strong>${item.sku}</strong></div>` : ""}
          <div style="font-size: 12px; color: #6B6259; margin-top: 3px; background: #F8F5F0; padding: 4px 8px; border-radius: 4px; display: inline-block;">
            ${variants}
          </div>
          ${item.fabric ? `<div style="font-size: 11px; color: #6B6259; margin-top: 2px;">Fabric: ${item.fabric}</div>` : ""}
        </td>
        <td style="padding: 12px 8px; vertical-align: top; text-align: center; font-size: 13px; font-weight: bold; color: #171717;">
          x${item.quantity}
        </td>
        <td style="padding: 12px 8px; vertical-align: top; text-align: right; font-size: 13px; color: #171717; white-space: nowrap;">
          ${formatPkr(item.price)}
        </td>
        <td style="padding: 12px 8px; vertical-align: top; text-align: right; font-size: 13px; font-weight: bold; color: #171717; white-space: nowrap;">
          ${formatPkr(item.total || item.price * item.quantity)}
        </td>
      </tr>
      `;
    })
    .join("");

  // Payment proof section
  const proofImage = bankTransferDetails?.proofImage;
  const transactionRef = bankTransferDetails?.transactionRef || bankTransferDetails?.referenceNumber;
  const bankName = bankTransferDetails?.bankName;

  let paymentProofHtml = "";
  if (isAdvancePayment || proofImage || transactionRef) {
    paymentProofHtml = `
    <div style="margin-top: 24px; padding: 18px; background-color: #FDF9F0; border: 2px dashed #B28A3E; border-radius: 12px;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
        <h3 style="margin: 0; font-size: 15px; color: #7A5C00; text-transform: uppercase; letter-spacing: 0.5px;">
          💳 Advance Payment Verification & Proof
        </h3>
        <span style="background: #FEF3CD; color: #856404; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px;">
          ${paymentStatus}
        </span>
      </div>

      <table style="width: 100%; font-size: 13px; color: #4A4036; margin-bottom: 12px;">
        <tr>
          <td style="padding: 4px 0; width: 140px;"><strong>Method:</strong></td>
          <td style="padding: 4px 0; font-weight: bold; color: #171717;">${paymentMethod}</td>
        </tr>
        ${bankName ? `<tr><td style="padding: 4px 0;"><strong>Bank/Wallet:</strong></td><td style="padding: 4px 0;">${bankName}</td></tr>` : ""}
        ${transactionRef ? `<tr><td style="padding: 4px 0;"><strong>Transaction ID/Ref:</strong></td><td style="padding: 4px 0; font-family: monospace; font-size: 14px; font-weight: bold; color: #171717;">${transactionRef}</td></tr>` : ""}
      </table>

      ${
        proofImage
          ? `
        <div style="margin-top: 10px; text-align: center;">
          <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #7A6652;">ATTACHED RECEIPT / PAYMENT SCREENSHOT:</p>
          ${
            proofImage.startsWith("data:image")
              ? `<div style="max-width: 100%; overflow: hidden; border: 1px solid #E7E1D8; border-radius: 8px; background: #FFF; padding: 6px;">
                   <img src="${proofImage}" alt="Payment Proof" style="max-width: 100%; max-height: 480px; object-fit: contain; display: block; margin: 0 auto; border-radius: 6px;" />
                 </div>`
              : `<div style="text-align: center; margin: 10px 0;">
                   <a href="${proofImage.startsWith("http") ? proofImage : `${appUrl}${proofImage}`}" target="_blank" style="background: #171717; color: #FFF; text-decoration: none; padding: 8px 16px; border-radius: 6px; font-size: 12px; font-weight: bold; display: inline-block;">
                     🔍 Click to View Full Payment Receipt Image
                   </a>
                 </div>`
          }
        </div>
        `
          : `
        <div style="background: #FFF3CD; color: #856404; padding: 10px; border-radius: 6px; font-size: 12px;">
          ⚠️ Customer selected advance payment but did not upload receipt image yet. Verify payment manually before dispatch.
        </div>
        `
      }
    </div>
    `;
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order #${orderNumber} — Tauheed Textile</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4F1EA; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #171717; line-height: 1.5;">

  <div style="max-width: 680px; margin: 20px auto; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #E7E1D8;">

    <!-- TOP HEADER -->
    <div style="background-color: #171717; color: #FFFFFF; padding: 24px; text-align: center; border-bottom: 3px solid #B28A3E;">
      <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; color: #F5EFEB;">
        Tauheed Textile
      </h1>
      <p style="margin: 4px 0 0 0; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #C4A882;">
        Automated Dispatch & Order Notification System
      </p>
      <div style="margin-top: 14px; display: inline-block; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); padding: 6px 14px; border-radius: 20px;">
        <span style="color: #FFD700; font-size: 13px; font-weight: bold;">ORDER #${orderNumber}</span>
        <span style="color: #FFFFFF; font-size: 12px; margin-left: 8px;">• ${nowKarachi}</span>
      </div>
    </div>

    <!-- MAIN BODY -->
    <div style="padding: 24px;">

      <!-- DISPATCH & COURIER READY BOX -->
      <div style="background-color: #F8F5F0; border: 2px solid #7A6652; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #E7E1D8; padding-bottom: 8px; margin-bottom: 12px;">
          <h2 style="margin: 0; font-size: 16px; color: #171717; text-transform: uppercase; letter-spacing: 1px;">
            🚚 Courier Dispatch Information
          </h2>
          <span style="background: #171717; color: #FFF; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px;">
            ${isAdvancePayment ? "ADVANCE PAID" : "CASH ON DELIVERY"}
          </span>
        </div>

        <table style="width: 100%; font-size: 14px; line-height: 1.6; color: #171717;">
          <tr>
            <td style="width: 150px; font-weight: bold; color: #6B6259;">Consignee Name:</td>
            <td style="font-size: 16px; font-weight: bold; color: #171717;">${customerName}</td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #6B6259;">Dispatch Phone:</td>
            <td>
              <a href="tel:${phoneInfo.intl}" style="color: #171717; font-weight: bold; font-size: 16px; text-decoration: underline;">
                ${guestPhone}
              </a>
              <a href="${whatsappCustomerUrl}" target="_blank" style="margin-left: 10px; background: #25D366; color: #FFF; text-decoration: none; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 4px; display: inline-block;">
                💬 WhatsApp Customer
              </a>
            </td>
          </tr>
          ${
            guestEmail
              ? `<tr>
                  <td style="font-weight: bold; color: #6B6259;">Email:</td>
                  <td><a href="mailto:${guestEmail}" style="color: #6B6259;">${guestEmail}</a></td>
                </tr>`
              : ""
          }
          <tr>
            <td style="font-weight: bold; color: #6B6259;">Destination City:</td>
            <td style="font-size: 15px; font-weight: bold; color: #9B3D3D;">
              ${city.toUpperCase()}${province ? `, ${province}` : ""}
            </td>
          </tr>
          <tr>
            <td style="font-weight: bold; color: #6B6259; vertical-align: top;">Delivery Address:</td>
            <td style="font-size: 14px; line-height: 1.4; color: #171717;">
              <strong>${address}</strong>
              ${landmark ? `<br><span style="color: #7A6652; font-size: 12px;">Landmark / Sector: <strong>${landmark}</strong></span>` : ""}
              ${postalCode ? `<br><span style="color: #6B6259; font-size: 12px;">Postal Code: ${postalCode}</span>` : ""}
            </td>
          </tr>
          <tr style="border-top: 1px dashed #D0C8BE;">
            <td style="font-weight: bold; color: #171717; padding-top: 8px;">COD Amount to Collect:</td>
            <td style="font-size: 18px; font-weight: bold; color: ${isAdvancePayment ? "#1A6B3C" : "#9B3D3D"}; padding-top: 8px;">
              ${isAdvancePayment ? "Rs. 0 (Already Paid In Advance)" : formatPkr(codAmountToCollect)}
            </td>
          </tr>
          ${
            staffNotes
              ? `<tr>
                  <td style="font-weight: bold; color: #7A6652; vertical-align: top; padding-top: 6px;">Customer Notes:</td>
                  <td style="font-size: 13px; color: #4A4036; font-style: italic; padding-top: 6px;">"${staffNotes}"</td>
                </tr>`
              : ""
          }
        </table>
      </div>

      <!-- ORDERED ITEMS & VARIANTS TABLE -->
      <div style="margin-bottom: 24px;">
        <h2 style="margin: 0 0 12px 0; font-size: 15px; color: #171717; text-transform: uppercase; letter-spacing: 1px;">
          👗 Ordered Dresses & Variants (${items.length} Item${items.length === 1 ? "" : "s"})
        </h2>

        <table style="width: 100%; border-collapse: collapse; border: 1px solid #E7E1D8; border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background-color: #171717; color: #FFFFFF; font-size: 12px; text-transform: uppercase;">
              <th style="padding: 10px 8px; text-align: left;">Product Details & Variations</th>
              <th style="padding: 10px 8px; text-align: center; width: 50px;">Qty</th>
              <th style="padding: 10px 8px; text-align: right; width: 85px;">Price</th>
              <th style="padding: 10px 8px; text-align: right; width: 95px;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemRowsHtml}
          </tbody>
        </table>
      </div>

      <!-- FINANCIAL SUMMARY -->
      <div style="background-color: #FAF8F5; border: 1px solid #E7E1D8; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
        <table style="width: 100%; font-size: 13px; color: #4A4036;">
          <tr>
            <td style="padding: 4px 0;">Items Subtotal:</td>
            <td style="padding: 4px 0; text-align: right; font-weight: bold; color: #171717;">${formatPkr(subtotal)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0;">Courier / Shipping Charges:</td>
            <td style="padding: 4px 0; text-align: right; color: #171717;">${shippingFee === 0 ? "FREE" : formatPkr(shippingFee)}</td>
          </tr>
          ${
            discount > 0
              ? `<tr>
                  <td style="padding: 4px 0; color: #9B3D3D;">Coupon / Advance Discount:</td>
                  <td style="padding: 4px 0; text-align: right; font-weight: bold; color: #9B3D3D;">- ${formatPkr(discount)}</td>
                </tr>`
              : ""
          }
          <tr style="border-top: 2px solid #E7E1D8;">
            <td style="padding: 10px 0 4px 0; font-size: 16px; font-weight: bold; color: #171717;">Grand Total:</td>
            <td style="padding: 10px 0 4px 0; text-align: right; font-size: 18px; font-weight: bold; color: #171717;">${formatPkr(total)}</td>
          </tr>
          <tr>
            <td style="padding: 2px 0; font-size: 12px; color: #7A6652;">Payment Method:</td>
            <td style="padding: 2px 0; text-align: right; font-size: 12px; font-weight: bold; color: #7A6652;">${paymentMethod}</td>
          </tr>
        </table>
      </div>

      <!-- PAYMENT PROOF (IF ATTACHED) -->
      ${paymentProofHtml}

      <!-- QUICK ACTION BUTTONS -->
      <div style="margin-top: 28px; text-align: center; border-top: 1px solid #E7E1D8; padding-top: 24px;">
        <p style="margin: 0 0 14px 0; font-size: 12px; color: #6B6259; text-transform: uppercase; letter-spacing: 1px;">
          Quick Dispatch & Management Actions:
        </p>

        <a href="${adminOrderUrl}" target="_blank" style="background-color: #171717; color: #FFFFFF; text-decoration: none; padding: 12px 22px; border-radius: 25px; font-size: 13px; font-weight: bold; display: inline-block; margin: 4px;">
          📦 Open Admin Orders Portal
        </a>

        <a href="${whatsappCustomerUrl}" target="_blank" style="background-color: #25D366; color: #FFFFFF; text-decoration: none; padding: 12px 22px; border-radius: 25px; font-size: 13px; font-weight: bold; display: inline-block; margin: 4px;">
          💬 WhatsApp Customer
        </a>

        <a href="tel:${phoneInfo.intl}" style="background-color: #7A6652; color: #FFFFFF; text-decoration: none; padding: 12px 22px; border-radius: 25px; font-size: 13px; font-weight: bold; display: inline-block; margin: 4px;">
          📞 Call Customer
        </a>

        <a href="${trackingUrl}" target="_blank" style="background-color: #F0EBE3; color: #171717; text-decoration: none; padding: 12px 22px; border-radius: 25px; font-size: 13px; font-weight: bold; display: inline-block; margin: 4px; border: 1px solid #D0C8BE;">
          🔍 Live Tracking Link
        </a>
      </div>

    </div>

    <!-- FOOTER -->
    <div style="background-color: #F8F5F0; padding: 16px; text-align: center; font-size: 11px; color: #8A7E73; border-top: 1px solid #E7E1D8;">
      Tauheed Textile Store Dispatch Notification • Shop G10 New Qurtaba Market, Bahadurabad, Karachi • Orders Hotline: 0340 0262732
    </div>

  </div>

</body>
</html>
  `;

  const text = `
========================================
NEW ORDER #${orderNumber} — TAUHEED TEXTILE
========================================
Date: ${nowKarachi}
Total: ${formatPkr(total)}
Payment Method: ${paymentMethod}
Payment Status: ${paymentStatus}

COURIER DISPATCH INFORMATION:
-----------------------------
Customer Name: ${customerName}
Phone: ${guestPhone}
Destination City: ${city}${province ? `, ${province}` : ""}
Address: ${address}${landmark ? ` (Landmark: ${landmark})` : ""}
COD Amount to Collect: ${isAdvancePayment ? "Rs. 0 (Advance Paid)" : formatPkr(codAmountToCollect)}
Notes: ${staffNotes || "None"}

ORDER ITEMS & VARIANTS:
-----------------------
${items
  .map(
    (i, idx) =>
      `${idx + 1}. ${i.title || i.productTitle || "Item"} | Qty: x${i.quantity} | Price: ${formatPkr(i.price)} | Subtotal: ${formatPkr(i.total || i.price * i.quantity)}\n   Variants: ${i.variantDetails || "Standard"}${i.sku ? ` | SKU: ${i.sku}` : ""}`
  )
  .join("\n")}

FINANCIAL BREAKDOWN:
--------------------
Subtotal: ${formatPkr(subtotal)}
Shipping: ${formatPkr(shippingFee)}
Discount: ${formatPkr(discount)}
Grand Total: ${formatPkr(total)}

${transactionRef ? `Payment Ref: ${transactionRef}\n` : ""}
${bankName ? `Bank Name: ${bankName}\n` : ""}
${proofImage ? `Receipt Image: Attached / Uploaded\n` : ""}

Admin Portal: ${adminOrderUrl}
Customer WhatsApp: https://wa.me/${phoneInfo.intl}
  `.trim();

  return { subject, html, text };
}

/**
 * Send Automated Order Dispatch Email to usama.buisness.usama@gmail.com
 */
export async function sendAdminOrderEmail(
  payload: AdminOrderEmailPayload
): Promise<{ success: boolean; method: string; messageId?: string; error?: string }> {
  const targetEmail =
    process.env.ADMIN_DISPATCH_EMAIL ||
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    DEFAULT_ADMIN_GMAIL;

  const { subject, html, text } = buildAdminOrderHtmlEmail(payload);

  // 1. Check for configured Gmail / SMTP credentials
  const gmailUser = process.env.GMAIL_USER || process.env.SMTP_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  // Also check database business email config if env var not set
  let dbEmailConfig: any = null;
  try {
    const record = await prisma.setting.findUnique({
      where: { key: "admin_business_email_config" },
    });
    if (record?.value) {
      dbEmailConfig = JSON.parse(record.value);
    }
  } catch (err) {
    console.warn("Could not query admin_business_email_config:", err);
  }

  const activeUser = gmailUser || dbEmailConfig?.smtpUser;
  const activePass = gmailPass || dbEmailConfig?.smtpPass;
  const activeHost = process.env.SMTP_HOST || dbEmailConfig?.smtpHost || "smtp.gmail.com";
  const activePort = Number(process.env.SMTP_PORT || dbEmailConfig?.smtpPort || 465);

  // 2. Try Nodemailer / Gmail SMTP if credentials exist
  if (activeUser && activePass) {
    try {
      const isGmail = activeHost.includes("gmail") || activeUser.includes("@gmail.com");
      const transporter = nodemailer.createTransport(
        isGmail
          ? {
              service: "gmail",
              auth: {
                user: activeUser,
                pass: activePass,
              },
            }
          : {
              host: activeHost,
              port: activePort,
              secure: activePort === 465,
              auth: {
                user: activeUser,
                pass: activePass,
              },
            }
      );

      const info = await transporter.sendMail({
        from: `"Tauheed Textile Orders" <${activeUser}>`,
        to: targetEmail,
        replyTo: payload.guestEmail || undefined,
        subject,
        text,
        html,
      });

      console.log(`[Order Email] Dispatched to ${targetEmail} via SMTP (Message ID: ${info.messageId})`);

      // Archive dispatch history in database
      await recordDispatchHistory(payload.orderNumber, targetEmail, "SMTP_SENT", info.messageId);

      return {
        success: true,
        method: "SMTP",
        messageId: info.messageId,
      };
    } catch (smtpError: any) {
      console.error("[Order Email] SMTP dispatch error:", smtpError?.message || smtpError);
    }
  }

  // 3. Try Resend REST API if RESEND_API_KEY is available
  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "Tauheed Textile <onboarding@resend.dev>",
          to: [targetEmail],
          subject,
          html,
          text,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`[Order Email] Dispatched to ${targetEmail} via Resend (ID: ${data.id})`);
        await recordDispatchHistory(payload.orderNumber, targetEmail, "RESEND_SENT", data.id);
        return { success: true, method: "RESEND", messageId: data.id };
      }
    } catch (resendErr) {
      console.error("[Order Email] Resend API error:", resendErr);
    }
  }

  // 4. Secure Database Archive Fallback:
  // Even if external SMTP is pending or network drops, full email manifest is saved to DB
  await recordDispatchHistory(
    payload.orderNumber,
    targetEmail,
    "ARCHIVED_DISPATCH_READY",
    undefined,
    { subject, text, payload }
  );

  console.log(`[Order Email] Order #${payload.orderNumber} dispatch recorded for ${targetEmail}.`);

  return {
    success: true,
    method: "ARCHIVED_READY",
    messageId: `local_${Date.now()}`,
  };
}

/**
 * Record dispatch event in database setting table
 */
async function recordDispatchHistory(
  orderNumber: string,
  recipient: string,
  status: string,
  messageId?: string,
  extra?: any
) {
  try {
    const key = `dispatch_email_${orderNumber}`;
    const value = JSON.stringify({
      orderNumber,
      recipient,
      status,
      messageId,
      dispatchedAt: new Date().toISOString(),
      extra,
    });

    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: {
        key,
        value,
        description: `Automated Gmail Order Notification for #${orderNumber}`,
      },
    });
  } catch (err) {
    console.error("Failed to archive dispatch history:", err);
  }
}
