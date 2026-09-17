import { NextRequest, NextResponse } from "next/server";
import { getLiveSystemHealth, executeSpeedOptimization } from "@/lib/performanceOptimizer";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError } from "@/lib/http";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const report = await getLiveSystemHealth();
    return NextResponse.json({ success: true, report });
  } catch (error: unknown) {
    return internalError("Health check error:", error);
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.ok) return auth.response;

  try {
    const optimizationResult = await executeSpeedOptimization();
    const updatedReport = await getLiveSystemHealth();

    return NextResponse.json({
      success: true,
      optimization: optimizationResult,
      report: updatedReport,
    });
  } catch (error: unknown) {
    return internalError("Speed optimization error:", error);
  }
}
