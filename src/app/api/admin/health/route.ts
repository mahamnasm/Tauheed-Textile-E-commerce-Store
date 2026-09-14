import { NextRequest, NextResponse } from "next/server";
import { getLiveSystemHealth, executeSpeedOptimization } from "@/lib/performanceOptimizer";
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from "@/lib/adminSession";

async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  return await verifyAdminSessionToken(token);
}

export async function GET(request: NextRequest) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const report = await getLiveSystemHealth();
    return NextResponse.json({ success: true, report });
  } catch (error: any) {
    console.error("Health check error:", error);
    return NextResponse.json({ error: error.message || "Failed to run health check" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifyAuth(request);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const optimizationResult = await executeSpeedOptimization();
    const updatedReport = await getLiveSystemHealth();

    return NextResponse.json({
      success: true,
      optimization: optimizationResult,
      report: updatedReport,
    });
  } catch (error: any) {
    console.error("Speed optimization error:", error);
    return NextResponse.json({ error: error.message || "Failed to execute speed optimization" }, { status: 500 });
  }
}
