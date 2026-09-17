import { NextRequest, NextResponse } from "next/server";
import { runSeoAudit } from "@/lib/aiSeo";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError } from "@/lib/http";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const audit = await runSeoAudit();
    return NextResponse.json({ success: true, audit });
  } catch (error: unknown) {
    return internalError("GET /api/admin/seo/audit error:", error);
  }
}
