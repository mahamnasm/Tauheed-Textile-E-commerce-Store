import { NextRequest, NextResponse } from "next/server";
import { batchOptimizeCatalogWithAi } from "@/lib/aiSeo";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError } from "@/lib/http";

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const results = await batchOptimizeCatalogWithAi();
    return NextResponse.json({
      success: true,
      message: `Successfully optimized ${results.updatedCount} products for Google search.`,
      results,
    });
  } catch (error: unknown) {
    return internalError("POST /api/admin/seo/optimize-all error:", error);
  }
}
