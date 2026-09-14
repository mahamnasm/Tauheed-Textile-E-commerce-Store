import confetti from "canvas-confetti";
import QRCode from "qrcode";
import JsBarcode from "jsbarcode";
import { addBusinessDays, format } from "date-fns";
import toast from "react-hot-toast";

/**
 * Confetti celebration burst for Order Placed or Promo Code unlocked
 */
export function triggerOrderCelebration() {
  if (typeof window === "undefined") return;

  // Champagne Gold & Emerald Green luxury celebratory confetti
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#C5A059", "#E5C378", "#1B4332", "#FFFFFF", "#D4AF37"],
  });

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#C5A059", "#FFFFFF"],
    });
  }, 250);

  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#C5A059", "#FFFFFF"],
    });
  }, 400);
}

/**
 * Generate Raast / JazzCash / Easypaisa Payment QR Code
 */
export async function generatePaymentQR(details: {
  accountTitle: string;
  accountNumber: string;
  bankOrWallet: string;
  amount?: number;
  orderNumber?: string;
}): Promise<string> {
  const payload = `PAY:${details.bankOrWallet}|TITLE:${details.accountTitle}|ACC:${details.accountNumber}|AMT:${details.amount || ""}|REF:${details.orderNumber || ""}`;
  
  try {
    const dataUrl = await QRCode.toDataURL(payload, {
      width: 240,
      margin: 1,
      color: {
        dark: "#12110F",
        light: "#FFFFFF",
      },
    });
    return dataUrl;
  } catch (err) {
    console.error("QR code generation error:", err);
    return "";
  }
}

/**
 * Generate Retail Barcode for Courier Dispatch & Warehousing
 */
export function generateBarcodeDataUrl(code: string): string {
  if (typeof window === "undefined") return "";

  try {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, code, {
      format: "CODE128",
      lineColor: "#12110F",
      width: 2,
      height: 50,
      displayValue: true,
      fontSize: 12,
      font: "monospace",
    });
    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("Barcode generation error:", err);
    return "";
  }
}

/**
 * Calculate expected delivery date using date-fns
 */
export function calculateDeliveryEstimate(city: string = "Lahore"): {
  minDate: string;
  maxDate: string;
  formattedRange: string;
} {
  const today = new Date();
  const isLahore = city.toLowerCase() === "lahore";
  
  const minDays = isLahore ? 1 : 2;
  const maxDays = isLahore ? 2 : 4;

  const minArrival = addBusinessDays(today, minDays);
  const maxArrival = addBusinessDays(today, maxDays);

  return {
    minDate: format(minArrival, "dd MMM yyyy"),
    maxDate: format(maxArrival, "dd MMM yyyy"),
    formattedRange: `${format(minArrival, "EEE, dd MMM")} - ${format(maxArrival, "EEE, dd MMM")}`,
  };
}

/**
 * Luxury Feedback Toast Notification
 */
export function showLuxuryToast(message: string, type: "success" | "error" | "info" = "success") {
  if (type === "success") {
    toast.success(message);
  } else if (type === "error") {
    toast.error(message);
  } else {
    toast(message);
  }
}

/**
 * Pre-formatted WhatsApp Direct Product Share Link
 */
export function getWhatsAppProductShareUrl(product: {
  title: string;
  sku: string;
  price: number;
  slug: string;
}): string {
  const shareText = `Look at this exquisite piece from Tauheed Textile: "${product.title}" (SKU: ${product.sku}) for Rs. ${product.price.toLocaleString()}! \nCheck it out: https://tauheedtextile.com/product/${product.slug}`;
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
}
