import { NextResponse } from "next/server";
import { generateVeoVideo, publishVeoVideoToStorefront } from "@/lib/veoEngine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // Action A: Publish generated video to product & storefront
    if (action === "publish") {
      const { productId, videoUrl, title, publishToReels } = body;
      if (!productId || !videoUrl) {
        return NextResponse.json(
          { error: "Product ID and Video URL are required to publish." },
          { status: 400 }
        );
      }
      const result = await publishVeoVideoToStorefront({
        productId,
        videoUrl,
        title,
        publishToReels: !!publishToReels,
      });
      return NextResponse.json({
        success: true,
        message: "Runway video successfully attached to product and published to storefront!",
        result,
      });
    }

    // Action B: Generate video using Google Veo 3
    const result = await generateVeoVideo({
      productId: body.productId,
      productTitle: body.productTitle,
      fabric: body.fabric,
      workType: body.workType,
      imageUrl: body.imageUrl,
      modelStyle: body.modelStyle || "pakistani_supermodel",
      walkDynamic: body.walkDynamic || "slow_motion_catwalk",
      backdropSetting: body.backdropSetting || "shalimar_bagh",
      aspectRatio: body.aspectRatio || "9:16",
      durationSeconds: body.durationSeconds || 5,
      customNotes: body.customNotes,
    });

    return NextResponse.json({
      success: true,
      message: "Google Veo 3 AI Runway Video generated successfully!",
      result,
    });
  } catch (error: any) {
    console.error("Veo 3 generation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate video with Google Veo 3" },
      { status: 500 }
    );
  }
}
