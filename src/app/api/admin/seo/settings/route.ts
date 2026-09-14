import { NextResponse } from "next/server";
import { getSeoSettings, saveSeoSettings } from "@/lib/aiSeo";

export async function GET() {
  try {
    const settings = await getSeoSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load SEO settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = await saveSeoSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save SEO settings" }, { status: 500 });
  }
}
