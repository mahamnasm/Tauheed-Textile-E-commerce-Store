import { NextResponse } from "next/server";
import { getDynamicAiConfig, saveDynamicAiConfig } from "@/lib/dynamicAiConfig";

export async function GET() {
  try {
    const config = await getDynamicAiConfig();
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load AI config" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = await saveDynamicAiConfig(body);
    return NextResponse.json({
      success: true,
      message: "AI configuration and automation rules updated successfully without code changes!",
      config: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save AI config" }, { status: 500 });
  }
}
