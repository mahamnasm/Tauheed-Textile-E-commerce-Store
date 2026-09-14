import { NextResponse } from "next/server";
import { batchOptimizeCatalogWithAi } from "@/lib/aiSeo";

export async function POST() {
  try {
    const results = await batchOptimizeCatalogWithAi();
    return NextResponse.json({
      success: true,
      message: `Successfully optimized ${results.updatedCount} products for Google search.`,
      results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to run AI catalog optimization" },
      { status: 500 }
    );
  }
}
