import { NextRequest, NextResponse } from "next/server";
import { getSeoSettings, saveSeoSettings } from "@/lib/aiSeo";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError } from "@/lib/http";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const settings = await getSeoSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    return internalError("GET /api/admin/seo/settings error:", error);
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const updated = await saveSeoSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: unknown) {
    return internalError("POST /api/admin/seo/settings error:", error);
  }
}
