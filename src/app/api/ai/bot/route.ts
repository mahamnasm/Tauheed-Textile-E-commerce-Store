import { NextResponse } from "next/server";
import {
  getAiVideoBotState,
  saveAiVideoBotState,
  runAutonomousVideoBot,
  optimizeReelStreaming,
} from "@/lib/aiVideoBot";

export async function GET() {
  try {
    const state = await getAiVideoBotState();
    return NextResponse.json({ success: true, state });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // Action 1: Toggle auto-pilot
    if (action === "toggle_auto_pilot") {
      const updated = await saveAiVideoBotState({
        isAutoPilot: !!body.enabled,
      });
      return NextResponse.json({
        success: true,
        message: `Auto-pilot ${updated.isAutoPilot ? "enabled" : "disabled"}.`,
        state: updated,
      });
    }

    // Action 2: Optimize reels streaming
    if (action === "optimize_reels") {
      const result = await optimizeReelStreaming();
      const state = await getAiVideoBotState();
      return NextResponse.json({
        success: true,
        message: `Optimized ${result.count} video reels for fast buffer streaming.`,
        state,
      });
    }

    // Action 3: Run autonomous video bot
    await saveAiVideoBotState({ status: "RUNNING" });
    const runResult = await runAutonomousVideoBot(body.mode || "missing_only");
    const finalState = await getAiVideoBotState();

    return NextResponse.json({
      success: true,
      message: `Autonomous Video Bot executed successfully! Processed ${runResult.processedCount} outfits.`,
      result: runResult,
      state: finalState,
    });
  } catch (error: any) {
    await saveAiVideoBotState({ status: "IDLE" });
    console.error("AI Video Bot API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to execute AI Video Bot" },
      { status: 500 }
    );
  }
}
