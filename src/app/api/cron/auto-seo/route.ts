import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateProductSeoAeo } from "@/lib/seoAeo";
import { triggerAutoSeoAndIndexing } from "@/lib/autoIndexing";
import { saveSeoSettings } from "@/lib/aiSeo";

export const dynamic = "force-dynamic";

/**
 * Automated Cron Endpoint (runs daily via vercel.json)
 * Automatically optimizes any products missing SEO/AEO metadata,
 * refreshes PostgreSQL planner statistics, and revalidates sitemap/storefront.
 */
export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        category: { select: { name: true } },
        subcategory: { select: { name: true } },
      },
    });

    let updatedCount = 0;

    for (const p of products) {
      if (!p.metaTitle || !p.metaDesc || !p.searchTags || !p.description) {
        const autoSeo = generateProductSeoAeo({
          title: p.title,
          fabric: p.fabric,
          categoryName: p.category?.name,
          subcategoryName: p.subcategory?.name,
          pieceCount: p.pieceCount,
          basePrice: p.salePrice || p.basePrice,
        });

        await prisma.product.update({
          where: { id: p.id },
          data: {
            metaTitle: p.metaTitle || autoSeo.metaTitle,
            metaDesc: p.metaDesc || autoSeo.metaDesc,
            searchTags: p.searchTags || autoSeo.searchTags,
            description: p.description || autoSeo.description,
          },
        });
        updatedCount++;
      }
    }

    // Refresh PostgreSQL query planner statistics
    await prisma.$executeRawUnsafe('ANALYZE "Product";').catch(() => {});
    await prisma.$executeRawUnsafe('ANALYZE "Category";').catch(() => {});

    await saveSeoSettings({
      lastOptimizedAt: new Date().toISOString(),
      autoOptimizeOnSave: true,
      healthScore: 100,
    }).catch(() => {});

    await triggerAutoSeoAndIndexing({
      paths: products.slice(0, 20).map((p) => `/product/${p.slug}`),
    });

    return NextResponse.json({
      success: true,
      optimizedProducts: updatedCount,
      totalScanned: products.length,
      ranAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Cron auto-seo error:", err);
    return NextResponse.json({ success: false, error: err?.message || "Cron failed" }, { status: 500 });
  }
}
