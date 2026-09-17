import { NextResponse } from "next/server";
import { getDynamicAiConfig, saveDynamicAiConfig } from "@/lib/dynamicAiConfig";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError } from "@/lib/http";

function withoutSecret<T extends { apiKey?: string }>(config: T) {
  const { apiKey, ...rest } = config;
  return {
    ...rest,
    apiKeyConfigured: Boolean(apiKey || process.env.GEMINI_API_KEY),
    apiKey: apiKey ? "••••••••" : "",
  };
}

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const config = await getDynamicAiConfig();
    return NextResponse.json({ success: true, config: withoutSecret(config) });
  } catch (error: unknown) {
    return internalError("AI config load error:", error);
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const { apiKey: incomingKey, ...safeBody } = body || {};
    const patch = {
      ...safeBody,
      ...(typeof incomingKey === "string" && incomingKey && !incomingKey.includes("•")
        ? { apiKey: incomingKey }
        : {}),
    };
    const updated = await saveDynamicAiConfig(patch);
    return NextResponse.json({
      success: true,
      message: "AI configuration updated.",
      config: withoutSecret(updated),
    });
  } catch (error: unknown) {
    return internalError("AI config save error:", error);
  }
}
