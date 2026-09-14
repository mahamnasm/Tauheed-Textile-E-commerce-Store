import { NextResponse } from "next/server";
import { generateNanoBananaFrontPic, setOutfitCoverImage } from "@/lib/nanoBananaEngine";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    // Action 1: Set cover image
    if (action === "set_cover") {
      const { productId, imageUrl } = body;
      if (!productId || !imageUrl) {
        return NextResponse.json(
          { error: "productId and imageUrl are required" },
          { status: 400 }
        );
      }
      const cover = await setOutfitCoverImage(productId, imageUrl);
      return NextResponse.json({
        success: true,
        message: "Front clickbait cover image set successfully!",
        cover,
      });
    }

    // Action 2: Batch generate front pics
    if (action === "batch_generate") {
      const { stylePreset } = body;
      const products = await prisma.product.findMany({
        take: 8,
        select: {
          id: true,
          title: true,
          fabric: true,
          workType: true,
        },
      });

      const results = await Promise.all(
        products.map(async (p) => {
          const generated = await generateNanoBananaFrontPic({
            productId: p.id,
            productTitle: p.title,
            fabric: p.fabric,
            workType: p.workType,
            stylePreset: stylePreset || "viral_clickbait",
          });
          return {
            productId: p.id,
            productTitle: p.title,
            ...generated,
          };
        })
      );

      return NextResponse.json({
        success: true,
        message: `Generated ${results.length} front clickbait pictures via Nano Banana!`,
        results,
      });
    }

    // Action 3: Single outfit generate
    const result = await generateNanoBananaFrontPic({
      productId: body.productId,
      productTitle: body.productTitle || "Luxury Pakistani Outfit",
      fabric: body.fabric || "Pure Fabric",
      workType: body.workType,
      category: body.category,
      stylePreset: body.stylePreset || "viral_clickbait",
      aspectRatio: body.aspectRatio || "3:4",
      customPrompt: body.customPrompt,
    });

    return NextResponse.json({
      success: true,
      message: "Nano Banana Clickbait Front Pic generated successfully!",
      result,
    });
  } catch (error: any) {
    console.error("Nano Banana API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate image via Nano Banana" },
      { status: 500 }
    );
  }
}
