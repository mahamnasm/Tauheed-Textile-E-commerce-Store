import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateCsv } from "@/lib/csv";
import { requireAdmin } from "@/lib/requireAdmin";
import { internalError } from "@/lib/http";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return auth.response;

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        collection: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const rows = products.map((p) => ({
      ID: p.id,
      SKU: p.sku,
      Title: p.title,
      Fabric: p.fabric,
      WorkType: p.workType,
      PieceCount: p.pieceCount,
      BasePricePKR: p.basePrice,
      ComparePricePKR: p.comparePrice || "",
      CostPricePKR: p.costPrice || "",
      Category: p.category?.name || "",
      Collection: p.collection?.name || "",
      InStock: p.inStock ? "YES" : "NO",
      VariantsCount: p.variants.length,
      TotalStock: p.variants.reduce((acc, v) => acc + v.stockQuantity, 0),
    }));

    const csvContent = generateCsv(rows);

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="tauheed_products_catalog_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err: unknown) {
    return internalError("GET /api/products/csv error:", err);
  }
}
