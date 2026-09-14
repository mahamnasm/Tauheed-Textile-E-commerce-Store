import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getDynamicAiConfig } from "@/lib/dynamicAiConfig";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, fabric, price, occasion } = body;

    const config = await getDynamicAiConfig();
    const apiKey = config.apiKey || process.env.GEMINI_API_KEY;

    let caption = `✨ ${title || "Tauheed Luxury Haute Couture"} in pure ${fabric || "luxury fabric"}. Handcrafted embroidery meets timeless Pakistani grandeur. Rs. ${price ? price.toLocaleString() : "Best Price"} with nationwide Cash on Delivery. Order via bio link or WhatsApp 0340 0262732. #TauheedTextile #PakistaniFashion #Lawn2026 #LuxuryPret #LahoreFashion`;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Write an engaging Instagram/TikTok reel caption for Pakistani clothing brand Tauheed Textile:
Product: "${title}"
Fabric: "${fabric}"
Price: PKR ${price}
Occasion: "${occasion || "Festive & Wedding"}"
Include emojis, Pakistani couture aesthetic, CTA to order with Cash on Delivery, and 8-10 trending hashtags.`;

        const res = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        if (res && res.text) {
          caption = res.text.trim();
        }
      } catch (e) {
        console.warn("Caption generation API fallback:", e);
      }
    }

    return NextResponse.json({ success: true, caption });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to generate caption" }, { status: 500 });
  }
}
