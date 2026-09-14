import { NextResponse } from "next/server";
import { runSeoAudit } from "@/lib/aiSeo";

export async function GET() {
  try {
    const audit = await runSeoAudit();
    return NextResponse.json({ success: true, audit });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to run audit" }, { status: 500 });
  }
}
